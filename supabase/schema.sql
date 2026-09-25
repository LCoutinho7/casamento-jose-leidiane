-- Casamento José & Leidiane — schema completo.
-- Rodar uma vez no SQL Editor do Supabase (projeto nxxfvtzdvvnvrlyevfzk).

-- ---------------------------------------------------------------- bilhetinhos
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  author text not null check (char_length(author) between 2 and 60),
  message text not null check (char_length(message) between 2 and 300),
  paper text not null default 'cream' check (paper in ('cream', 'peach', 'terracotta', 'sage')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists notes_approved_idx on public.notes (created_at desc) where status = 'approved';

-- --------------------------------------------------------- avisos de presente
-- O convidado avisa que mandou o PIX; os noivos confirmam o recebimento.
create table if not exists public.pledges (
  id uuid primary key default gen_random_uuid(),
  gift_id text not null,
  gift_name text not null,
  amount numeric(10, 2) not null check (amount >= 10),
  guest_name text not null check (char_length(guest_name) between 2 and 60),
  message text check (char_length(message) <= 300),
  status text not null default 'announced' check (status in ('announced', 'received')),
  ip_hash text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------- quem modera
-- ponytail: allowlist fixa em vez de tabela de papéis; vira tabela se um dia
-- precisar de mais de um nível de acesso.
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select coalesce(auth.jwt() ->> 'email', '') in (
    'leidieze@gmail.com',
    'lucascoutinho672@gmail.com'
  );
$$;

-- ------------------------------------------------- limite por convidado (IP)
-- O IP chega pelo header que o PostgREST expõe; guardamos só o hash.
create or replace function public.client_ip_hash() returns text
language sql stable as $$
  select md5(
    split_part(coalesce(current_setting('request.headers', true)::json ->> 'x-forwarded-for', 'sem-ip'), ',', 1)
  );
$$;

create or replace function public.enforce_note_limit() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  recent int;
begin
  new.ip_hash := client_ip_hash();
  new.status := 'pending';

  select count(*) into recent
  from notes
  where ip_hash = new.ip_hash and created_at > now() - interval '24 hours';

  if recent >= 5 then
    raise exception 'limite diario de bilhetes atingido' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

create or replace function public.enforce_pledge_limit() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  recent int;
begin
  new.ip_hash := client_ip_hash();
  new.status := 'announced';

  select count(*) into recent
  from pledges
  where ip_hash = new.ip_hash and created_at > now() - interval '24 hours';

  if recent >= 10 then
    raise exception 'limite diario de avisos de presente atingido' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists notes_limit on public.notes;
create trigger notes_limit before insert on public.notes
  for each row execute function public.enforce_note_limit();

drop trigger if exists pledges_limit on public.pledges;
create trigger pledges_limit before insert on public.pledges
  for each row execute function public.enforce_pledge_limit();

-- ------------------------------------------------------------------ políticas
alter table public.notes enable row level security;
alter table public.pledges enable row level security;

drop policy if exists notes_read_approved on public.notes;
create policy notes_read_approved on public.notes
  for select to anon, authenticated using (status = 'approved' or is_admin());

drop policy if exists notes_insert on public.notes;
create policy notes_insert on public.notes
  for insert to anon, authenticated with check (true);

drop policy if exists notes_admin_update on public.notes;
create policy notes_admin_update on public.notes
  for update to authenticated using (is_admin()) with check (is_admin());

drop policy if exists notes_admin_delete on public.notes;
create policy notes_admin_delete on public.notes
  for delete to authenticated using (is_admin());

-- Aviso de presente é privado: só os noivos leem.
drop policy if exists pledges_admin_read on public.pledges;
create policy pledges_admin_read on public.pledges
  for select to authenticated using (is_admin());

drop policy if exists pledges_insert on public.pledges;
create policy pledges_insert on public.pledges
  for insert to anon, authenticated with check (true);

drop policy if exists pledges_admin_update on public.pledges;
create policy pledges_admin_update on public.pledges
  for update to authenticated using (is_admin()) with check (is_admin());
