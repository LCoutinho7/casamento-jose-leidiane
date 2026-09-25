import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, Check, Copy } from 'lucide-react';
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
  const [guestEmail, setGuestEmail] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [released, setReleased] = useState(false);
  const [error, setError] = useState('');

  // Cada cota abre limpa, com o próprio valor sugerido.
  useEffect(() => {
    if (gift) {
      setAmount(gift.price);
      setReleased(false);
      setError('');
    }
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

  const release = async (event: FormEvent) => {
    event.preventDefault();
    if (!gift || !validAmount) return;
    setSending(true);
    setError('');
    try {
      await createPledge({
        gift_id: gift.id,
        gift_name: gift.name,
        amount,
        guest_name: guestName.trim(),
        guest_email: guestEmail.trim(),
        message: note.trim() || undefined,
      });
      setReleased(true);
    } catch (e) {
      const detalhe = e instanceof Error ? e.message : '';
      setError(
        detalhe.includes('limite')
          ? 'Muitos presentes registrados hoje neste dispositivo. Tente amanhã.'
          : `Não conseguimos registrar agora. Tente de novo. (${detalhe || 'erro desconhecido'})`,
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal open={gift !== null} onClose={onClose} title="Presentear os noivos">
      {gift && (
        <>
          <p className="eyebrow">Presentear os noivos</p>
          <h3 className="mt-2 text-3xl leading-tight text-ink">{gift.name}</h3>
          {!gift.customAmount && <p className="mt-1 font-mono text-xl text-clay">{formatCurrency(gift.price)}</p>}
          <p className="mt-4 text-sm leading-relaxed text-muted">{gift.description}</p>

          {!COUPLE.pixKey ? (
            <p className="mt-8 rounded-xl bg-sand/60 p-4 text-sm text-muted">
              A chave PIX dos noivos será divulgada em breve.
            </p>
          ) : released && payload ? (
            <div className="mt-8 space-y-5 border-t border-clay/15 pt-6">
              <CopyRow label="PIX copia e cola (valor já preenchido)" value={payload} />
              <CopyRow label="Ou use a chave PIX" value={COUPLE.pixKey} />
              <p className="text-xs leading-relaxed text-muted">
                Cole no app do seu banco. Favorecidos: {COUPLE.groom} e {COUPLE.bride}.
              </p>
              <p className="flex items-start gap-2 rounded-xl bg-sand/60 p-4 text-sm text-ink">
                <Check className="mt-0.5 size-4 shrink-0 text-clay" />
                Assim que os noivos confirmarem o recebimento, você recebe a confirmação em{' '}
                <strong className="font-semibold">{guestEmail}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={release} className="mt-8 space-y-4 border-t border-clay/15 pt-6">
              <p className="text-sm leading-relaxed text-muted">
                Preencha seus dados para gerar o PIX. Usamos o e-mail só para confirmar o recebimento com você.
              </p>

              {gift.customAmount && (
                <Input
                  label="Valor do presente (R$)"
                  name="amount"
                  type="number"
                  inputMode="decimal"
                  min={MIN_AMOUNT}
                  step={10}
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  hint={`mínimo ${formatCurrency(MIN_AMOUNT)}`}
                />
              )}

              <Input
                label="Seu nome ou família"
                name="guest_name"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Ex.: Família Coutinho"
              />

              <Input
                label="Seu e-mail"
                name="guest_email"
                type="email"
                required
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="para receber a confirmação"
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

              <Button type="submit" size="lg" disabled={sending || !validAmount} className="w-full">
                {sending ? 'Gerando' : 'Gerar PIX'} <ArrowRight className="size-4" />
              </Button>
            </form>
          )}
        </>
      )}
    </Modal>
  );
}
