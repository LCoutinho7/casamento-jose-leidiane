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

5. **Lista de convidados.** Rodar `rsvp.sql`. Depois gerar a carga a partir da planilha e colar o resultado no SQL Editor:

   ```bash
   python scripts/importar-convidados.py assets/convidados.xlsx > assets/convidados.sql
   ```

   O SQL gerado tem nomes, telefones e e-mails da família, por isso fica em `assets/`, fora do git. Ele é idempotente: rodar de novo atualiza pelo código da planilha sem duplicar ninguém nem apagar respostas.

## Regras que valem

- Bilhete entra sempre como `pending`; o site público só lê `status = 'approved'`.
- Aviso de presente (`pledges`) nunca é lido pelo site público — só pelos noivos.
- `status` é forçado pelo gatilho na inserção: ninguém se autoaprova mandando JSON.
- Limite por dispositivo (hash do IP, 24h): 5 bilhetes e 10 avisos de presente.
- Quem modera está na função `is_admin()`. Mudar de moderador é editar essa função.
- RSVP: a confirmação é da pessoa, não do grupo. Um acompanhante de casal é uma linha com dois vínculos, então não há como confirmá-lo duas vezes.
- O público não lê nem grava `guests`. Só passa por `rsvp_lookup` e `rsvp_respond`, que exigem nome e sobrenome, só alteram presença e só dentro do grupo encontrado. Criar convidado é exclusivo do painel.
- Depois de 30/11/2026 o banco recusa respostas; o painel continua editando.
- Criança (`is_child`) não entra no total nem no buffet.

## Painel

`admin.html`, publicado junto com o site: <https://casamentoleidize.com.br/admin.html>. Sem link no site, com `noindex` — o que protege é o login, não o segredo do endereço.
