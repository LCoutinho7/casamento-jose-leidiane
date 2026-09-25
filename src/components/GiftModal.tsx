import { useEffect, useState, type FormEvent } from 'react';
import { Check, Copy, Send } from 'lucide-react';
import { COUPLE } from '../data/wedding';
import { createPledge } from '../lib/api';
import { formatCurrency } from '../lib/format';
import { buildPixPayload } from '../lib/pix';
import type { GiftQuota } from '../types';
import { Button } from './ui/Button';
import { Input, Textarea } from './ui/Field';
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
  const [guestName, setGuestName] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // Cada cota abre com o próprio valor sugerido.
  useEffect(() => {
    if (gift) {
      setAmount(gift.price);
      setSent(false);
      setError('');
    }
  }, [gift]);

  const announce = async (event: FormEvent) => {
    event.preventDefault();
    if (!gift || !guestName.trim()) return;
    setSending(true);
    setError('');
    try {
      await createPledge({
        gift_id: gift.id,
        gift_name: gift.name,
        amount,
        guest_name: guestName.trim(),
        message: note.trim() || undefined,
      });
      setSent(true);
      setGuestName('');
      setNote('');
    } catch (e) {
      setError(e instanceof Error && e.message.includes('limite') ? 'Muitos avisos enviados hoje deste dispositivo.' : 'Não conseguimos avisar os noivos. Tente de novo.');
    } finally {
      setSending(false);
    }
  };

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
                    Cole no app do seu banco. Favorecidos: {COUPLE.groom} e {COUPLE.bride}.
                  </p>

                  {sent ? (
                    <p className="flex items-center gap-2 rounded-xl bg-sand/60 p-4 text-sm text-ink">
                      <Check className="size-4 shrink-0 text-clay" />
                      Avisamos os noivos. Obrigado pelo carinho!
                    </p>
                  ) : (
                    <form onSubmit={announce} className="space-y-4 border-t border-clay/15 pt-5">
                      <p className="text-xs leading-relaxed text-muted">
                        Já enviou? Avise os noivos para que eles saibam de quem veio.
                      </p>
                      <Input
                        label="Seu nome ou família"
                        name="guest_name"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Ex.: Família Coutinho"
                      />
                      <Textarea
                        label="Recado (opcional)"
                        name="pledge_message"
                        rows={2}
                        maxLength={300}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Uma palavrinha para acompanhar o presente..."
                      />
                      {error && <p className="text-sm text-clay-dark">{error}</p>}
                      <Button type="submit" size="lg" disabled={!guestName.trim() || sending} className="w-full">
                        <Send className="size-4" /> {sending ? 'Enviando' : 'Avisar os noivos'}
                      </Button>
                    </form>
                  )}
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
