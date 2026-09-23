import { useEffect, useState } from 'react';
import { cn } from '../lib/cn';
import { pad } from '../lib/format';

interface CountdownCardProps {
  label: string;
  value: number;
  /** Já entrou na viewport: dispara a animação de folhas do calendário. */
  revealed: boolean;
  /** Atraso da folha deste card, em milissegundos. */
  delay: number;
}

/** Folhas decorativas que voam ao revelar o card. */
const SHEETS = [0, 1, 2];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Cartão de contagem no formato de folhinha de calendário. Na primeira vez que
 * entra na tela, algumas folhas se soltam e o número sobe até o valor real.
 */
export function CountdownCard({ label, value, revealed, delay }: CountdownCardProps) {
  const [display, setDisplay] = useState(revealed ? value : 0);
  const [counted, setCounted] = useState(false);

  useEffect(() => {
    if (!revealed) return;

    if (counted || prefersReducedMotion()) {
      setDisplay(value);
      setCounted(true);
      return;
    }

    const duration = 900;
    const start = performance.now() + delay;
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed < 0) {
        frame = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      // easing de saída: rápido no início, assentando no fim
      setDisplay(Math.round(value * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setCounted(true);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [revealed, value, delay, counted]);

  // Depois da animação inicial, o número passa a acompanhar o relógio.
  useEffect(() => {
    if (counted) setDisplay(value);
  }, [counted, value]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-clay/15 bg-paper px-2 pt-7 pb-6 text-center sm:pt-9 sm:pb-8">
      {/* picote da folhinha */}
      <span className="absolute inset-x-0 top-4 border-t border-dashed border-clay/20" aria-hidden />
      <span className="absolute top-2 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-clay/30" aria-hidden />

      {revealed &&
        SHEETS.map((index) => (
          <span
            key={index}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-4 bottom-0 origin-top bg-paper animate-sheet-fly motion-reduce:hidden"
            style={{ animationDelay: `${delay + index * 160}ms` }}
          />
        ))}

      <span
        className={cn(
          'relative block font-mono text-4xl font-medium tracking-tight text-clay tabular-nums sm:text-6xl',
          revealed && 'animate-rise-in motion-reduce:animate-none',
        )}
        style={revealed ? { animationDelay: `${delay}ms` } : undefined}
      >
        {pad(display)}
      </span>
      <span className="relative mt-2 block text-[0.6875rem] font-semibold tracking-[0.2em] text-clay uppercase">
        {label}
      </span>
    </div>
  );
}
