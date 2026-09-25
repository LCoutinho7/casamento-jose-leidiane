# Backend (Supabase)

Projeto `nxxfvtzdvvnvrlyevfzk`. O site usa a chave publicável e só enxerga o que o RLS deixa.

## Instalação

1. **SQL Editor → `schema.sql`.** Cria `notes` e `pledges`, o limite diário por IP e as políticas de acesso.
2. **Authentication → Users → Add user.** Criar a conta dos noivos (`leidieze@gmail.com`) com senha. Marcar e-mail como confirmado.
3. **Authentication → Providers → Email.** Desligar *Enable sign-ups*: só quem está na allowlist de `is_admin()` modera, e ninguém deve conseguir se cadastrar sozinho.
4. **Notificação por e-mail (opcional).** Guardar a chave do Resend e o destinatário no Vault, depois rodar `notificacao-email.sql`:

   ```sql
   select vault.create_secret('re_sua_chave', 'resend_api_key');
   select vault.create_secret('destinatario@exemplo.com', 'notify_email');
   ```

   O domínio `casamentoleidize.com.br` está verificado no Resend (região São Paulo), então os e-mails saem de `noivos@casamentoleidize.com.br` para qualquer destinatário.

## Regras que valem

- Bilhete entra sempre como `pending`; o site público só lê `status = 'approved'`.
- Aviso de presente (`pledges`) nunca é lido pelo site público — só pelos noivos.
- `status` é forçado pelo gatilho na inserção: ninguém se autoaprova mandando JSON.
- Limite por dispositivo (hash do IP, 24h): 5 bilhetes e 10 avisos de presente.
- Quem modera está na função `is_admin()`. Mudar de moderador é editar essa função.

## Painel

`admin.html`, publicado junto com o site: <https://casamentoleidize.com.br/admin.html>. Sem link no site, com `noindex` — o que protege é o login, não o segredo do endereço.
