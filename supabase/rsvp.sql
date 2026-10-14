-- RSVP: convidados, vínculos de acompanhantes e as funções de confirmação.
-- Rodar depois de schema.sql (usa is_admin() e client_ip_hash()).
--
-- Regras:
--   * A confirmação vive na pessoa, nunca no grupo. Um acompanhante ligado a
--     dois convidados é uma linha só, com dois vínculos: não há como duplicar.
--   * O público nunca lê nem escreve nas tabelas. Tudo passa por rsvp_lookup e
--     rsvp_respond, que só alteram presença e só dentro do grupo encontrado.
--   * Criar, editar e excluir convidados é exclusivo dos noivos (is_admin()).
--   * Depois do prazo o banco recusa respostas; os noivos continuam podendo editar.

create extension if not exists unaccent with schema extensions;

-- ------------------------------------------------------------------ pessoas
create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  code text unique,                        -- G001/A001 da planilha; vazio para quem os noivos criarem
  full_name text not null check (char_length(btrim(full_name)) between 3 and 120),
  name_key text not null,                  -- nome normalizado para a busca
  kind text not null check (kind in ('principal', 'companion')),
  is_child boolean not null default false, -- criança não conta no total nem no buffet
  phone text,
  email text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'declined')),
  responded_by uuid references public.guests (id) on delete set null,
  responded_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists guests_name_key_idx on public.guests (name_key);

-- Vínculo convidado principal -> acompanhante. Muitos-para-muitos: é assim que
-- o mesmo acompanhante pertence a um casal sem virar duas pessoas.
create table if not exists public.guest_links (
  principal_id uuid not null references public.guests (id) on delete cascade,
  companion_id uuid not null references public.guests (id) on delete cascade,
  primary key (principal_id, companion_id),
  check (principal_id <> companion_id)
);

create index if not exists guest_links_companion_idx on public.guest_links (companion_id);

-- Tentativas de busca por dispositivo, para frear quem tenta adivinhar nomes.
create table if not exists public.rsvp_attempts (
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists rsvp_attempts_idx on public.rsvp_attempts (ip_hash, created_at);

-- --------------------------------------------------------- normalização
-- "  Célia  Mayumi YOKOGAWA " -> "celia mayumi yokogawa"
create or replace function public.normalize_name(raw text) returns text
language sql stable set search_path = public, extensions as $$
  select btrim(regexp_replace(lower(extensions.unaccent(coalesce(raw, ''))), '\s+', ' ', 'g'));
$$;

create or replace function public.guests_set_name_key() returns trigger
language plpgsql as $$
begin
  new.full_name := btrim(regexp_replace(new.full_name, '\s+', ' ', 'g'));
  new.name_key := public.normalize_name(new.full_name);
  return new;
end;
$$;

drop trigger if exists guests_name_key on public.guests;
create trigger guests_name_key before insert or update of full_name on public.guests
  for each row execute function public.guests_set_name_key();

-- ------------------------------------------------------------------ acesso
alter table public.guests enable row level security;
alter table public.guest_links enable row level security;
alter table public.rsvp_attempts enable row level security;

-- Nenhuma política para anon: a chave pública não lê nem grava nada aqui.
drop policy if exists guests_admin on public.guests;
create policy guests_admin on public.guests
  for all to authenticated using (is_admin()) with check (is_admin());

drop policy if exists guest_links_admin on public.guest_links;
create policy guest_links_admin on public.guest_links
  for all to authenticated using (is_admin()) with check (is_admin());

-- --------------------------------------------------------- busca pública
-- Os caminhos esperados (nome não encontrado, homônimo, prazo) devolvem um motivo
-- em vez de lançar exceção: uma exceção desfaria também o registro da tentativa,
-- e são justamente as buscas que falham que o limite precisa contar.

-- Conta a tentativa e diz se o dispositivo passou do limite.
-- ponytail: 20 por hora por hash de IP; quem tenta adivinhar nomes esbarra aqui.
create or replace function public.rsvp_throttled() returns boolean
language plpgsql security definer set search_path = public as $$
declare
  ip text := client_ip_hash();
begin
  insert into rsvp_attempts (ip_hash) values (ip);
  return (select count(*) from rsvp_attempts a where a.ip_hash = ip and a.created_at > now() - interval '1 hour') > 20;
end;
$$;

-- Encontra a pessoa pelo nome. Exige nome e sobrenome, e o primeiro termo digitado
-- tem de ser o primeiro nome: "Silva" sozinho não lista ninguém, "Celia Yokogawa"
-- encontra "Célia Mayumi Yokogawa".
create or replace function public.rsvp_resolve(raw_name text, out person uuid, out reason text)
language plpgsql stable security definer set search_path = public as $$
declare
  typed text[] := string_to_array(public.normalize_name(raw_name), ' ');
  found uuid[];
begin
  if coalesce(array_length(typed, 1), 0) < 2 then
    reason := 'short';
    return;
  end if;

  -- Nome idêntico ao digitado vence: sem isso, "Ana Astolfi" bateria também com
  -- "Ana Claudia Astolfi" e nunca conseguiria se encontrar.
  select array_agg(g.id) into found
  from guests g
  where g.name_key = array_to_string(typed, ' ');

  if found is null then
    select array_agg(g.id) into found
    from guests g
    where string_to_array(g.name_key, ' ') @> typed
      and split_part(g.name_key, ' ', 1) = typed[1];
  end if;

  if found is null then
    reason := 'not_found';
  elsif array_length(found, 1) > 1 then
    reason := 'ambiguous';
  else
    person := found[1];
    reason := 'ok';
  end if;
end;
$$;

-- Grupo da pessoa: ela mesma e quem está ligado a ela diretamente, nos dois sentidos.
create or replace function public.rsvp_group(person uuid) returns setof uuid
language sql stable security definer set search_path = public as $$
  select person
  union select companion_id from guest_links where principal_id = person
  union select principal_id from guest_links where companion_id = person;
$$;

-- Devolve {"reason": "ok", "group": [...]} ou {"reason": "<motivo>"}.
-- Só nome, presença e quem respondeu: telefone e e-mail nunca saem daqui.
create or replace function public.rsvp_lookup(raw_name text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  found record;
begin
  if rsvp_throttled() then
    return jsonb_build_object('reason', 'throttled');
  end if;

  select * into found from rsvp_resolve(raw_name);
  if found.reason <> 'ok' then
    return jsonb_build_object('reason', found.reason);
  end if;

  return jsonb_build_object(
    'reason', 'ok',
    'group', (
      select jsonb_agg(
        jsonb_build_object(
          'id', g.id,
          'full_name', g.full_name,
          'kind', g.kind,
          'is_self', g.id = found.person,
          'status', g.status,
          'responded_by', r.full_name,
          'responded_at', g.responded_at
        )
        order by g.id <> found.person, g.kind desc, g.full_name
      )
      from guests g
      left join guests r on r.id = g.responded_by
      where g.id in (select rsvp_group(found.person))
    )
  );
end;
$$;

-- --------------------------------------------------------- resposta pública
-- answers: [{"id": "<uuid>", "status": "confirmed" | "declined"}, ...]
-- O nome é a credencial: a função localiza a pessoa de novo em vez de confiar num
-- id vindo do navegador. Valida todas as respostas antes de gravar qualquer uma.
create or replace function public.rsvp_respond(raw_name text, answers jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  found record;
  answer jsonb;
begin
  if now() >= timestamptz '2026-12-01 00:00:00-03' then
    return jsonb_build_object('reason', 'closed');
  end if;
  if rsvp_throttled() then
    return jsonb_build_object('reason', 'throttled');
  end if;

  select * into found from rsvp_resolve(raw_name);
  if found.reason <> 'ok' then
    return jsonb_build_object('reason', found.reason);
  end if;

  if jsonb_typeof(answers) <> 'array' or jsonb_array_length(answers) = 0 then
    return jsonb_build_object('reason', 'invalid');
  end if;

  for answer in select * from jsonb_array_elements(answers) loop
    if coalesce(answer ->> 'status', '') not in ('confirmed', 'declined')
       or coalesce(answer ->> 'id', '') !~ '^[0-9a-f-]{36}$'
       or (answer ->> 'id')::uuid not in (select rsvp_group(found.person)) then
      return jsonb_build_object('reason', 'invalid');
    end if;
  end loop;

  update guests g
  set status = a.status, responded_by = found.person, responded_at = now()
  from jsonb_to_recordset(answers) as a(id uuid, status text)
  where g.id = a.id;

  return jsonb_build_object('reason', 'ok');
end;
$$;

-- ---------------------------------------------------------- painel: criar
-- Cria o convidado e os acompanhantes numa transação só: ou entra tudo, ou nada.
-- companions: [{"full_name": "...", "is_child": false}, ...]
create or replace function public.admin_add_guest(
  full_name text,
  phone text,
  email text,
  is_child boolean,
  companions jsonb default '[]'::jsonb
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  principal uuid;
  companion jsonb;
  companion_id uuid;
begin
  if not is_admin() then
    raise exception 'acesso negado' using errcode = '42501';
  end if;

  insert into guests (full_name, kind, phone, email, is_child)
  values (full_name, 'principal', nullif(btrim(phone), ''), nullif(btrim(email), ''), coalesce(is_child, false))
  returning id into principal;

  for companion in select * from jsonb_array_elements(companions) loop
    insert into guests (full_name, kind, is_child)
    values (companion ->> 'full_name', 'companion', coalesce((companion ->> 'is_child')::boolean, false))
    returning id into companion_id;

    insert into guest_links (principal_id, companion_id) values (principal, companion_id);
  end loop;

  return principal;
end;
$$;

-- As funções security definer são a única porta. Tira o acesso padrão de todo mundo
-- e libera só o que cada papel precisa: o público não chama as funções internas.
revoke all on function public.rsvp_throttled() from public, anon, authenticated;
revoke all on function public.rsvp_resolve(text) from public, anon, authenticated;
revoke all on function public.rsvp_group(uuid) from public, anon, authenticated;
revoke all on function public.rsvp_lookup(text) from public;
revoke all on function public.rsvp_respond(text, jsonb) from public;
revoke all on function public.admin_add_guest(text, text, text, boolean, jsonb) from public, anon;

grant execute on function public.rsvp_lookup(text) to anon, authenticated;
grant execute on function public.rsvp_respond(text, jsonb) to anon, authenticated;
grant execute on function public.admin_add_guest(text, text, text, boolean, jsonb) to authenticated;
