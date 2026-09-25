-- Notificação por e-mail via Resend, disparada no banco (sem Edge Function).
-- Rodar DEPOIS de schema.sql e de guardar a chave do Resend:
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
    corpo := '<p><strong>' || new.author || '</strong> escreveu:</p><blockquote>' || new.message || '</blockquote>';
  else
    assunto := 'Presente anunciado por ' || new.guest_name;
    corpo := '<p><strong>' || new.guest_name || '</strong> avisou o envio de ' || new.gift_name ||
             ' (R$ ' || new.amount || ').</p>' || coalesce('<blockquote>' || new.message || '</blockquote>', '');
  end if;

  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object('Authorization', 'Bearer ' || api_key, 'Content-Type', 'application/json'),
    body := jsonb_build_object(
      'from', 'Casamento J&L <onboarding@resend.dev>',
      'to', array[destino],
      'subject', assunto,
      'html', corpo || '<p><a href="https://casamentoleidize.com.br/admin.html">Abrir a moderação</a></p>'
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
