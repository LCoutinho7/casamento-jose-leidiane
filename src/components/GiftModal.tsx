import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { COUPLE } from '../data/wedding';
import { formatCurrency } from '../lib/format';
import { buildPixPayload } from '../lib/pix';
import type { GiftQuota } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Field';
import { Modal } from './ui/Modal';

interface GiftModalProps {
  gift: GiftQuota | null;
  onClose: () => void;
}

const MIN_AMOUNT = 10;

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold tracking-wider text-muted uppercase">{label}</p>
      <div className="flex items-center gap-2 rounded-xl border border-clay/20 bg-white p-2 pl-4">
        <code className="min-w-0 flex-1 truncate font-mono text-xs text-ink">{value}</code>
        <Button size="sm" onClick={copy} className="shrink-0">
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? 'Copiado' : 'Copiar'}
        </Button>
      </div>
    </div>
  );
}

export function GiftModal({ gift, onClose }: GiftModalProps) {
  const [amount, setAmount] = useState(gift?.price ?? 0);

  // Cada cota abre com o próprio valor sugerido.
  useEffect(() => {
    if (gift) setAmount(gift.price);
  }, [gift]);

  const validAmount = amount >= MIN_AMOUNT;

  const payload =
    gift &&
    COUPLE.pixKey &&
    validAmount &&
    buildPixPayload({
      key: COUPLE.pixKey,
      name: `${COUPLE.groom} e ${COUPLE.bride}`,
      city: COUPLE.city.split(',')[0],
      amount,
      txid: gift.id,
    });

  return (
    <Modal open={gift !== null} onClose={onClose} title="Presentear os noivos">
      {gift && (
        <>
          <p className="eyebrow">Presentear os noivos</p>
          <h3 className="mt-2 text-3xl leading-tight text-ink">{gift.name}</h3>
          {!gift.customAmount && <p className="mt-1 font-mono text-xl text-clay">{formatCurrency(gift.price)}</p>}
          <p className="mt-4 text-sm leading-relaxed text-muted">{gift.description}</p>

          {gift.customAmount && (
            <div className="mt-6">
              <Input
                label="Valor do presente (R$)"
                name="amount"
                type="number"
                inputMode="decimal"
                min={MIN_AMOUNT}
                step={10}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                hint={`mínimo ${formatCurrency(MIN_AMOUNT)}`}
              />
            </div>
          )}

          <div className="mt-8 space-y-5 border-t border-clay/15 pt-6">
            {COUPLE.pixKey ? (
              payload ? (
                <>
                  <CopyRow label="PIX copia e cola (valor já preenchido)" value={payload} />
                  <CopyRow label="Ou use a chave PIX" value={COUPLE.pixKey} />
                  <p className="text-xs leading-relaxed text-muted">
                    Cole no app do seu banco e, se quiser, mande uma mensagem para os noivos dizendo qual cota
                    escolheu. Favorecidos: {COUPLE.groom} e {COUPLE.bride}.
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted">Informe um valor a partir de {formatCurrency(MIN_AMOUNT)} para gerar o PIX.</p>
              )
            ) : (
              <p className="rounded-xl bg-sand/60 p-4 text-sm text-muted">
                A chave PIX dos noivos será divulgada em breve. Enquanto isso, a lista de presentes já está disponível.
              </p>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
