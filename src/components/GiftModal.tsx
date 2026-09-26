import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, Check, Copy, MailCheck } from 'lucide-react';
import { COUPLE } from '../data/wedding';
import { createPledge } from '../lib/api';
import { formatCurrency } from '../lib/format';
import { buildPixPayload } from '../lib/pix';
import type { GiftQuota } from '../types';
import { Button } from './ui/Button';
import { Confetti } from './ui/Confetti';
import { Input, Textarea } from './ui/Field';
import { Modal } from './ui/Modal';

interface GiftModalProps {
  gift: GiftQuota | null;
  onClose: () => void;
}

const MIN_AMOUNT = 10;

/** dados → pix (copia e cola) → obrigado (aguardando confirmação dos noivos) */
type Step = 'form' | 'pix' | 'done';

function CopyRow({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    onCopy();
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
  const [step, setStep] = useState<Step>('form');
  const [amount, setAmount] = useState(gift?.price ?? 0);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  // Cada cota abre limpa, com o próprio valor sugerido.
  useEffect(() => {
    if (gift) {
      setAmount(gift.price);
      setStep('form');
      setCopied(false);
      setCelebrating(false);
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
      name: COUPLE.pixHolder,
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
      setStep('pix');
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

  // Comemora antes de trocar de passo, para o confete acontecer sobre o cartão.
  const confirmPaid = () => {
    setCelebrating(true);
    window.setTimeout(() => setStep('done'), 900);
  };

  return (
    <Modal open={gift !== null} onClose={onClose} title="Presentear os noivos" pressing={celebrating}>
      {celebrating && <Confetti />}

      {gift && step !== 'done' && (
        <>
          <p className="eyebrow">Presentear os noivos</p>
          <h3 className="mt-2 text-3xl leading-tight text-ink">{gift.name}</h3>
          {!gift.customAmount && <p className="mt-1 font-mono text-xl text-clay">{formatCurrency(gift.price)}</p>}
          <p className="mt-4 text-sm leading-relaxed text-muted">{gift.description}</p>
        </>
      )}

      {gift && !COUPLE.pixKey && (
        <p className="mt-8 rounded-xl bg-sand/60 p-4 text-sm text-muted">
          A chave PIX dos noivos será divulgada em breve.
        </p>
      )}

      {gift && COUPLE.pixKey && step === 'form' && (
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

      {gift && payload && step === 'pix' && (
        <div className="mt-8 space-y-5 border-t border-clay/15 pt-6">
          <CopyRow label="PIX copia e cola (valor já preenchido)" value={payload} onCopy={() => setCopied(true)} />
          <CopyRow label="Ou use a chave PIX" value={COUPLE.pixKey} onCopy={() => setCopied(true)} />
          <p className="text-xs leading-relaxed text-muted">
            Cole no app do seu banco. Favorecido: <strong className="font-semibold text-ink">{COUPLE.pixHolder}</strong>.
          </p>

          {/* o botão só aparece depois de copiar: antes disso não há o que confirmar */}
          {copied && (
            <Button size="lg" onClick={confirmPaid} disabled={celebrating} className="w-full animate-reveal-up">
              {celebrating ? <Check className="size-4" /> : 'Já paguei'}
            </Button>
          )}
        </div>
      )}

      {gift && step === 'done' && (
        <div className="py-4 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-clay text-paper">
            <MailCheck className="size-7" />
          </span>
          <p className="eyebrow mt-6">Obrigado!</p>
          <h3 className="mt-2 text-3xl leading-tight text-ink">Recebemos o seu aviso</h3>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Assim que os noivos confirmarem o recebimento, você recebe a confirmação em{' '}
            <strong className="font-semibold text-ink">{guestEmail}</strong>.
          </p>
          <Button size="lg" variant="secondary" onClick={onClose} className="mt-8 w-full">
            Fechar
          </Button>
        </div>
      )}
    </Modal>
  );
}
