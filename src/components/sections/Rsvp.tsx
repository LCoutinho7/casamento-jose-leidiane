import { CalendarClock, Heart } from 'lucide-react';
import { RSVP_DEADLINE, RSVP_DEADLINE_LABEL } from '../../data/wedding';
import { SectionHeading } from '../ui/SectionHeading';

const DAY = 24 * 60 * 60 * 1000;

export function Rsvp() {
  const remaining = Math.ceil((RSVP_DEADLINE.getTime() - Date.now()) / DAY);
  const expired = remaining <= 0;

  return (
    <section id="rsvp" className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-3xl rounded-3xl border border-clay/15 bg-paper p-10 text-center shadow-card md:p-16">
        <Heart className="mx-auto size-8 fill-current text-clay" />
        <SectionHeading
          className="mt-6"
          eyebrow="Sua presença"
          title="Confirmação de presença"
          description={
            expired ? (
              <>
                O prazo de confirmação encerrou em{' '}
                <strong className="font-semibold text-ink">{RSVP_DEADLINE_LABEL}</strong>. Se ainda não respondeu, fale
                direto com os noivos.
              </>
            ) : (
              <>
                A confirmação online será liberada em breve, junto com o convite. O prazo final é{' '}
                <strong className="font-semibold text-ink">{RSVP_DEADLINE_LABEL}</strong> — depois dessa data fechamos
                os números com o buffet.
              </>
            )
          }
        />

        <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-clay/30 px-5 py-2 font-mono text-xs tracking-[0.2em] text-clay uppercase">
          <CalendarClock className="size-3.5" />
          {expired ? 'Prazo encerrado' : `Faltam ${remaining} dias para confirmar`}
        </p>
      </div>
    </section>
  );
}
