-- Corpo do comprovante. Separado para trocar o visual sem mexer no gatilho.
-- Tudo com estilo inline e sem imagem externa: nenhum bloqueio do Gmail.

create or replace function public.receipt_html(guest_name text, gift_name text, amount numeric)
returns text language sql immutable as $$
  select format($html$
<div style="margin:0;padding:32px 16px;background:#f5f5f0;font-family:Helvetica,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%%" style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid rgba(202,96,50,.18);border-radius:16px;">
    <tr>
      <td style="padding:40px 32px 28px;text-align:center;border-bottom:1px solid rgba(202,96,50,.18);">
        <div style="font-family:Georgia,serif;font-size:34px;letter-spacing:.18em;color:#ca6032;">J&amp;L</div>
        <div style="margin-top:10px;font-size:11px;letter-spacing:.25em;text-transform:uppercase;color:#ca6032;font-weight:600;">Presente recebido</div>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <p style="margin:0;font-family:Georgia,serif;font-size:26px;line-height:1.25;color:#1a1a1a;">Obrigado, %1$s!</p>
        <p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:#4a4a4a;">
          Confirmamos o recebimento do seu presente. Ficamos muito felizes em ter você com a gente nessa história.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%%" style="margin-top:28px;border:1px solid rgba(202,96,50,.18);border-radius:12px;">
          <tr>
            <td style="padding:18px 20px;border-bottom:1px solid rgba(202,96,50,.12);">
              <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#ca6032;font-weight:600;">Presente</div>
              <div style="margin-top:6px;font-size:16px;color:#1a1a1a;">%2$s</div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 20px;">
              <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#ca6032;font-weight:600;">Valor</div>
              <div style="margin-top:6px;font-family:'Courier New',monospace;font-size:20px;color:#ca6032;">R$ %3$s</div>
            </td>
          </tr>
        </table>

        <p style="margin:28px 0 0;font-family:Georgia,serif;font-style:italic;font-size:17px;line-height:1.5;color:#ca6032;">
          Nos vemos em 16 de janeiro de 2027.
        </p>
        <p style="margin:6px 0 0;font-size:13px;color:#4a4a4a;">Com carinho, Zé &amp; Leidi</p>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 32px;background:#eae7df;border-radius:0 0 16px 16px;text-align:center;">
        <div style="font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#7d3b1f;">
          Paróquia Espírito Santo &middot; 16h30 &middot; Osasco, SP
        </div>
      </td>
    </tr>
  </table>
</div>
$html$, guest_name, gift_name, to_char(amount, 'FM999G999D00'));
$$;
