import { Heart } from 'lucide-react';
import { RSVP_DEADLINE_LABEL } from '../../data/wedding';
import { SectionHeading } from '../ui/SectionHeading';

export function Rsvp() {
  return (
    <section id="rsvp" className="px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-3xl rounded-3xl border border-olive/15 bg-paper p-10 text-center shadow-card md:p-16">
        <Heart className="mx-auto size-8 fill-current text-olive" />
        <SectionHeading
          className="mt-6"
          eyebrow="Sua presença"
          title="Confirmação de presença"
          description={
            <>
              A confirmação online será liberada em breve, junto com o convite. Pedimos que todos respondam até{' '}
              <strong className="font-semibold text-ink">{RSVP_DEADLINE_LABEL}</strong>.
            </>
          }
        />
        <p className="mt-8 inline-block rounded-full border border-olive/30 px-5 py-2 font-mono text-xs tracking-[0.25em] text-olive uppercase">
          Em breve
        </p>
      </div>
    </section>
  );
}
