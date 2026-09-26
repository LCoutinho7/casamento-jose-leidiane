-- Notificação por e-mail via Resend, disparada no banco (sem Edge Function).
-- Rodar DEPOIS de schema.sql e aviso-html.sql, e de guardar a chave do Resend:
--
--   select vault.create_secret('re_sua_chave_aqui', 'resend_api_key');
--   select vault.create_secret('destinatario@exemplo.com', 'notify_email');
--
-- Trocar a chave depois: select vault.update_secret(id, 'nova') usando o id de vault.secrets.

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_couple() returns trigger
language plpgsql security definer set search_path = public, extensions, vault as $$
declare
  api_key text;
  destino text;
  assunto text;
  corpo text;
begin
  select decrypted_secret into api_key from vault.decrypted_secrets where name = 'resend_api_key';
  select decrypted_secret into destino from vault.decrypted_secrets where name = 'notify_email';
  if api_key is null or destino is null then
    return new; -- sem chave configurada, o gatilho não atrapalha o cadastro
  end if;

  if tg_table_name = 'notes' then
    assunto := 'Novo bilhetinho de ' || new.author;
    corpo := public.notice_html(
      'Bilhete aguardando aprovação',
      new.author || ' deixou um recado',
      new.message,
      jsonb_build_array(jsonb_build_object('label', 'Papel escolhido', 'value', initcap(new.paper)))
    );
  else
    assunto := 'Presente anunciado por ' || new.guest_name;
    corpo := public.notice_html(
      'Presente anunciado',
      new.guest_name || ' avisou o envio de um presente',
      new.message,
      jsonb_build_array(
        jsonb_build_object('label', 'Presente', 'value', new.gift_name),
        jsonb_build_object('label', 'Valor', 'value', 'R$ ' || to_char(new.amount, 'FM999G999D00')),
        jsonb_build_object('label', 'E-mail do convidado', 'value', new.guest_email)
      )
    );
  end if;

  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object('Authorization', 'Bearer ' || api_key, 'Content-Type', 'application/json'),
    body := jsonb_build_object(
      'from', 'Casamento J&L <noivos@casamentoleidize.com.br>',
      'to', array[destino],
      'subject', assunto,
      'html', corpo
    )
  );

  return new;
end;
$$;

drop trigger if exists notes_notify on public.notes;
create trigger notes_notify after insert on public.notes
  for each row execute function public.notify_couple();

drop trigger if exists pledges_notify on public.pledges;
create trigger pledges_notify after insert on public.pledges
  for each row execute function public.notify_couple();
