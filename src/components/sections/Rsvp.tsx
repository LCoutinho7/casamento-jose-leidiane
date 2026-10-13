import { useState, type FormEvent } from 'react';
import { CalendarClock, Check, Heart, Search, X } from 'lucide-react';
import { RSVP_DEADLINE, RSVP_DEADLINE_LABEL } from '../../data/wedding';
import { rsvpLookup, rsvpRespond, type RsvpPerson, type RsvpReason } from '../../lib/api';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';
import { Input } from '../ui/Field';
import { SectionHeading } from '../ui/SectionHeading';

const DAY = 24 * 60 * 60 * 1000;

type Choice = 'confirmed' | 'declined';

const MESSAGES: Partial<Record<RsvpReason, string>> = {
  short: 'Digite seu nome e sobrenome.',
  not_found: 'Não encontramos esse nome na lista. Confira a grafia ou fale com os noivos.',
  ambiguous: 'Há mais de um convidado com esse nome. Digite o nome completo, como está no convite.',
  throttled: 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.',
  closed: 'O prazo de confirmação já encerrou. Fale direto com os noivos.',
  invalid: 'Algo não bateu na sua resposta. Busque seu nome de novo.',
};

const formatDay = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

/** Mostra a resposta atual de cada pessoa e quem a deu, para ninguém responder duas vezes sem saber. */
function currentAnswer(person: RsvpPerson) {
  if (person.status === 'pending') return 'Ainda sem resposta';
  const label = person.status === 'confirmed' ? 'Confirmado' : 'Não vai';
  const by = person.is_self || !person.responded_by ? '' : ` por ${person.responded_by.split(' ')[0]}`;
  const when = person.responded_at ? ` em ${formatDay(person.responded_at)}` : '';
  return `${label}${by}${when}`;
}

export function Rsvp() {
  const remaining = Math.ceil((RSVP_DEADLINE.getTime() - Date.now()) / DAY);
  const expired = remaining <= 0;

  const [name, setName] = useState('');
  const [group, setGroup] = useState<RsvpPerson[] | null>(null);
  const [choices, setChoices] = useState<Record<string, Choice>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [saved, setSaved] = useState(false);

  const search = async (event?: FormEvent) => {
    event?.preventDefault();
    setBusy(true);
    setMessage('');
    setSaved(false);
    try {
      const result = await rsvpLookup(name);
      if (result.reason === 'ok' && result.group) {
        setGroup(result.group);
        // Começa pelas respostas já dadas: quem abre de novo vê o que está valendo.
        setChoices(
          Object.fromEntries(
            result.group.filter((p) => p.status !== 'pending').map((p) => [p.id, p.status as Choice]),
          ),
        );
      } else {
        setGroup(null);
        setMessage(MESSAGES[result.reason] ?? 'Não foi possível buscar agora.');
      }
    } catch {
      setMessage('Não foi possível buscar agora. Tente de novo.');
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!group) return;
    const answers = Object.entries(choices).map(([id, status]) => ({ id, status }));
    setBusy(true);
    setMessage('');
    try {
      const result = await rsvpRespond(name, answers);
      if (result.reason === 'ok') {
        setSaved(true);
        const refreshed = await rsvpLookup(name);
        if (refreshed.group) setGroup(refreshed.group);
      } else {
        setMessage(MESSAGES[result.reason] ?? 'Não foi possível salvar agora.');
      }
    } catch {
      setMessage('Não foi possível salvar agora. Tente de novo.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="rsvp" className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-3xl rounded-3xl border border-clay/15 bg-paper p-8 shadow-card md:p-16">
        <div className="text-center">
          <Heart className="mx-auto size-8 fill-current text-clay" />
          <SectionHeading
            className="mt-6"
            eyebrow="Sua presença"
            title="Confirmação de presença"
            description={
              expired ? (
                <>
                  O prazo de confirmação encerrou em{' '}
                  <strong className="font-semibold text-ink">{RSVP_DEADLINE_LABEL}</strong>. Se ainda não respondeu,
                  fale direto com os noivos.
                </>
              ) : (
                <>
                  Busque seu nome para responder por você e por quem está no seu convite. O prazo é{' '}
                  <strong className="font-semibold text-ink">{RSVP_DEADLINE_LABEL}</strong>.
                </>
              )
            }
          />
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-clay/30 px-5 py-2 font-mono text-xs tracking-[0.2em] text-clay uppercase">
            <CalendarClock className="size-3.5" />
            {expired ? 'Prazo encerrado' : `Faltam ${remaining} dias para confirmar`}
          </p>
        </div>

        {!expired && (
          <form onSubmit={search} className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Input
                label="Seu nome e sobrenome"
                name="rsvp_name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Elaine Utiyke"
              />
            </div>
            <Button type="submit" size="lg" disabled={busy || !name.trim()} className="shrink-0">
              <Search className="size-4" /> Buscar
            </Button>
          </form>
        )}

        {message && <p className="mx-auto mt-6 max-w-md text-center text-sm text-clay-dark">{message}</p>}

        {group && !expired && (
          <div className="mx-auto mt-10 max-w-xl">
            <ul className="divide-y divide-clay/10 rounded-2xl border border-clay/15 bg-white">
              {group.map((person) => (
                <li key={person.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-ink">
                      {person.full_name}
                      {person.is_self && <span className="ml-2 text-xs text-clay">(você)</span>}
                    </p>
                    <p className="mt-0.5 font-mono text-xs text-muted">{currentAnswer(person)}</p>
                  </div>

                  <div className="flex gap-2" role="group" aria-label={`Resposta de ${person.full_name}`}>
                    {(['confirmed', 'declined'] as const).map((choice) => (
                      <button
                        key={choice}
                        type="button"
                        aria-pressed={choices[person.id] === choice}
                        onClick={() => setChoices((prev) => ({ ...prev, [person.id]: choice }))}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold tracking-wider uppercase transition-colors duration-150',
                          choices[person.id] === choice
                            ? 'border-clay bg-clay text-paper'
                            : 'border-clay/30 text-clay hover:border-clay',
                        )}
                      >
                        {choice === 'confirmed' ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                        {choice === 'confirmed' ? 'Vou' : 'Não vou'}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              onClick={submit}
              disabled={busy || Object.keys(choices).length === 0}
              className="mt-6 w-full"
            >
              {busy ? 'Salvando' : 'Enviar resposta'}
            </Button>

            {saved && (
              <p className="mt-4 flex items-center justify-center gap-2 text-sm text-ink">
                <Check className="size-4 text-clay" /> Resposta registrada. Você pode voltar e mudar até o prazo.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
