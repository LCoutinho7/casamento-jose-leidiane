import { ChevronDown } from 'lucide-react';
import { COUPLE, WEDDING_DATE_LABEL } from '../../data/wedding';
import { LinkButton } from '../ui/Button';

export function Hero() {
  return (
    <section id="inicio" className="relative flex min-h-svh items-end overflow-hidden bg-ink text-paper">
      <img
        src="images/hero.webp"
        alt="José e Leidiane sentados na grama de um vinhedo, no ensaio pré-wedding"
        className="absolute inset-0 size-full object-cover object-[50%_30%] md:object-[35%_center]"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/10" />

      <div className="relative mx-auto w-full max-w-6xl px-6 pt-40 pb-20 md:px-10 md:pb-28">
        <p className="eyebrow mb-5 flex items-center gap-3 text-sand">
          <span className="h-px w-8 bg-sand/60" />
          Vamos nos casar
        </p>

        <h1 className="max-w-4xl font-serif text-6xl leading-[0.95] tracking-tight text-balance italic sm:text-7xl md:text-8xl lg:text-[7.5rem]">
          {COUPLE.groom} <span className="font-normal not-italic">&amp;</span> {COUPLE.bride}
        </h1>

        <p className="mt-6 font-mono text-sm tracking-[0.3em] text-sand uppercase md:text-base">{WEDDING_DATE_LABEL}</p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <LinkButton href="#rsvp" size="lg" variant="light">
            Confirmar presença
          </LinkButton>
          <LinkButton href="#nossa-historia" size="lg" variant="outline-light">
            Nossa história
          </LinkButton>
        </div>
      </div>

      <a
        href="#boas-vindas"
        aria-label="Rolar para baixo"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-sand/70 transition-colors hover:text-paper md:block"
      >
        <ChevronDown className="size-6 animate-bounce" />
      </a>
    </section>
  );
}
