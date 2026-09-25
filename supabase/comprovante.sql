-- E-mail do convidado no aviso de presente + comprovante quando os noivos confirmam.
-- Rodar depois de schema.sql e notificacao-email.sql.

alter table public.pledges
  add column if not exists guest_email text;

-- Avisos anteriores à mudança não têm e-mail; sem isso o NOT NULL abaixo falha.
delete from public.pledges where guest_email is null;

alter table public.pledges
  drop constraint if exists pledges_guest_email_check;

alter table public.pledges
  add constraint pledges_guest_email_check
  check (guest_email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$');

alter table public.pledges alter column guest_email set not null;

-- ------------------------------------------------------------- comprovante
create or replace function public.notify_guest_receipt() returns trigger
language plpgsql security definer set search_path = public, extensions, vault as $$
declare
  api_key text;
begin
  if new.status <> 'received' or old.status = 'received' then
    return new;
  end if;

  select decrypted_secret into api_key from vault.decrypted_secrets where name = 'resend_api_key';
  if api_key is null then
    return new;
  end if;

  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object('Authorization', 'Bearer ' || api_key, 'Content-Type', 'application/json'),
    body := jsonb_build_object(
      'from', 'José & Leidiane <noivos@casamentoleidize.com.br>',
      'to', array[new.guest_email],
      'subject', 'Recebemos o seu presente, ' || new.guest_name || '!',
      'html', public.receipt_html(new.guest_name, new.gift_name, new.amount)
    )
  );

  return new;
end;
$$;

drop trigger if exists pledges_receipt on public.pledges;
create trigger pledges_receipt after update on public.pledges
  for each row execute function public.notify_guest_receipt();
