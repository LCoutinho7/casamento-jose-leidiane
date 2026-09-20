import { ArrowUp } from 'lucide-react';
import { COUPLE, WEDDING_DATE_LABEL } from '../../data/wedding';

export function Footer() {
  return (
    <footer className="bg-ink px-6 pt-20 pb-12 text-paper md:px-10">
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-serif text-6xl font-semibold tracking-widest text-sand">{COUPLE.monogram}</p>
        <p className="mt-4 font-serif text-3xl">
          {COUPLE.groom} &amp; {COUPLE.bride}
        </p>
        <p className="mt-3 font-mono text-xs tracking-[0.25em] text-olive-light uppercase">
          {WEDDING_DATE_LABEL} · {COUPLE.city}
        </p>

        <blockquote className="mx-auto mt-10 max-w-md font-serif text-lg text-sand-dark italic">
          "O amor tudo sofre, tudo crê, tudo espera, tudo suporta. O amor jamais acaba."
          <cite className="mt-2 block font-sans text-[0.6875rem] tracking-[0.2em] text-olive-light uppercase not-italic">
            1 Coríntios 13
          </cite>
        </blockquote>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-paper/10 pt-6 text-xs text-olive-light sm:flex-row">
          <p>Feito com carinho para os nossos convidados.</p>
          <a href="#inicio" className="inline-flex items-center gap-1.5 transition-colors hover:text-paper">
            Voltar ao topo <ArrowUp className="size-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
