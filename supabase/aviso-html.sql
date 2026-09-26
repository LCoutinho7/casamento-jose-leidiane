-- Corpo dos avisos que chegam para os noivos (bilhete novo e presente anunciado).
-- Mesma linguagem visual do comprovante: estilo inline, sem imagem externa.

create or replace function public.notice_html(
  eyebrow text,
  title text,
  quote text,
  rows jsonb default '[]'::jsonb
) returns text language sql immutable as $$
  select format($html$
<div style="margin:0;padding:32px 16px;background:#f5f5f0;font-family:Helvetica,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%%" style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid rgba(202,96,50,.18);border-radius:16px;">
    <tr>
      <td style="padding:36px 32px 24px;text-align:center;border-bottom:1px solid rgba(202,96,50,.18);">
        <div style="font-family:Georgia,serif;font-size:30px;letter-spacing:.18em;color:#ca6032;">J&amp;L</div>
        <div style="margin-top:10px;font-size:11px;letter-spacing:.25em;text-transform:uppercase;color:#ca6032;font-weight:600;">%1$s</div>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <p style="margin:0;font-family:Georgia,serif;font-size:24px;line-height:1.3;color:#1a1a1a;">%2$s</p>
        %3$s
        %4$s
        <a href="https://casamentoleidize.com.br/admin.html" style="display:block;margin-top:28px;padding:14px 24px;background:#ca6032;color:#ffffff;border-radius:999px;text-align:center;text-decoration:none;font-size:12px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;">
          Abrir a moderação
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding:18px 32px;background:#eae7df;border-radius:0 0 16px 16px;text-align:center;">
        <div style="font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#7d3b1f;">
          Site do casamento &middot; 16 de janeiro de 2027
        </div>
      </td>
    </tr>
  </table>
</div>
$html$,
    eyebrow,
    title,
    case when quote is null or quote = '' then ''
         else format('<blockquote style="margin:20px 0 0;padding:16px 20px;background:#faf9f5;border-left:3px solid #ca6032;border-radius:0 12px 12px 0;font-family:Georgia,serif;font-style:italic;font-size:17px;line-height:1.5;color:#1a1a1a;">%s</blockquote>', quote)
    end,
    coalesce(
      (select string_agg(
        format($row$<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%%" style="margin-top:16px;border:1px solid rgba(202,96,50,.18);border-radius:12px;"><tr><td style="padding:14px 18px;"><div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#ca6032;font-weight:600;">%s</div><div style="margin-top:5px;font-size:16px;color:#1a1a1a;">%s</div></td></tr></table>$row$,
          item ->> 'label', item ->> 'value'), '')
       from jsonb_array_elements(rows) as item),
      ''
    )
  );
$$;
