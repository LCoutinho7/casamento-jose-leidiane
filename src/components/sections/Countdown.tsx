import { useState } from 'react';
import { Calendar, Check, Download } from 'lucide-react';
import { COUPLE, WEDDING_DATE, WEDDING_DATE_LABEL } from '../../data/wedding';
import { useCountdown } from '../../hooks/useCountdown';
import { useRevealOnce } from '../../hooks/useRevealOnce';
import { cn } from '../../lib/cn';
import { pad } from '../../lib/format';
import { Button, LinkButton } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';

const title = `Casamento de ${COUPLE.groom} & ${COUPLE.bride}`;
const toIcsDate = (d: Date) =>
  d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
const start = toIcsDate(WEDDING_DATE);
const end = toIcsDate(new Date(WEDDING_DATE.getTime() + 8 * 60 * 60 * 1000));

const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}`;

const icsFile = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Casamento Jose e Leidiane//PT',
  'BEGIN:VEVENT',
  `SUMMARY:${title}`,
  `DTSTART:${start}`,
  `DTEND:${end}`,
  'END:VEVENT',
  'END:VCALENDAR',
].join('\r\n');

/** Folhas por cima do painel. Ordem do DOM = pilha: a última (mais dias) fica em cima e voa primeiro. */
const LEAVES = [1, 2, 3, 4, 5];
const LEAF_STAGGER = 220;

/** Número que entra de baixo a cada mudança: a `key` remonta o span e reinicia a animação. */
function Ticker({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center px-1 py-6 sm:py-10">
      <span className="block overflow-hidden">
        <span
          key={value}
          className="block animate-tick font-mono text-4xl font-medium tracking-tight text-clay tabular-nums motion-reduce:animate-none sm:text-7xl"
        >
          {pad(value)}
        </span>
      </span>
      <span className="mt-2 text-[0.6875rem] font-semibold tracking-[0.2em] text-clay-dark uppercase">{label}</span>
    </div>
  );
}

/** Picote e argolas no topo, como uma folhinha de parede. */
function Binding() {
  return (
    <>
      <span className="absolute inset-x-0 top-8 border-t border-dashed border-clay/20" aria-hidden />
      <span className="absolute top-3 left-1/4 size-2.5 rounded-full bg-clay/30" aria-hidden />
      <span className="absolute top-3 right-1/4 size-2.5 rounded-full bg-clay/30" aria-hidden />
    </>
  );
}

export function Countdown() {
  const time = useCountdown(WEDDING_DATE);
  const [saved, setSaved] = useState(false);
  const { ref, revealed } = useRevealOnce<HTMLDivElement>(0.6);

  const units = [
    { label: 'dias', value: time.days },
    { label: 'horas', value: time.hours },
    { label: 'min', value: time.minutes },
    { label: 'seg', value: time.seconds },
  ];

  const downloadIcs = () => {
    const url = URL.createObjectURL(new Blob([icsFile], { type: 'text/calendar;charset=utf-8' }));
    const link = Object.assign(document.createElement('a'), { href: url, download: 'casamento-jose-e-leidiane.ics' });
    link.click();
    URL.revokeObjectURL(url);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-sand/50 px-6 pt-24 pb-10 md:px-10 md:pt-28">
      <div className="flex flex-1 flex-col items-center justify-center">
        <SectionHeading
          eyebrow="Contagem regressiva"
          title={time.finished ? 'O grande dia chegou' : 'Contando os dias para o nosso sim'}
          description={`${WEDDING_DATE_LABEL}, em ${COUPLE.city}.`}
        />

        <div ref={ref} className="relative mt-12 w-full max-w-3xl perspective-distant">
          <p className="sr-only">
            Faltam {time.days} dias, {time.hours} horas e {time.minutes} minutos.
          </p>

          <div
            aria-hidden
            className="relative grid grid-cols-4 divide-x divide-clay/10 rounded-3xl border border-clay/15 bg-paper px-2 pt-10 shadow-card sm:px-6"
          >
            <Binding />
            {units.map((unit) => (
              <Ticker key={unit.label} value={unit.value} label={unit.label} />
            ))}
          </div>

          {!time.finished &&
            LEAVES.map((extra, index) => (
              <div
                key={extra}
                aria-hidden
                className={cn(
                  'pointer-events-none absolute inset-0 flex origin-left flex-col items-center justify-center rounded-3xl border border-clay/15 bg-paper pt-10 motion-reduce:hidden',
                  revealed && 'animate-leaf-off',
                )}
                style={revealed ? { animationDelay: `${(LEAVES.length - 1 - index) * LEAF_STAGGER}ms` } : undefined}
              >
                <Binding />
                <span className="font-mono text-6xl font-medium tracking-tight text-clay/80 tabular-nums sm:text-8xl">
                  {time.days + extra}
                </span>
                <span className="mt-2 text-[0.6875rem] font-semibold tracking-[0.2em] text-clay-dark uppercase">
                  dias
                </span>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center gap-3">
        <p className="eyebrow">Salve a data</p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <LinkButton href={googleCalendarUrl} target="_blank" rel="noopener noreferrer" variant="secondary">
            <Calendar className="size-4" /> Google Agenda
          </LinkButton>
          <Button variant="secondary" onClick={downloadIcs}>
            {saved ? <Check className="size-4" /> : <Download className="size-4" />}
            {saved ? 'Salvo' : 'Apple / Outlook (.ics)'}
          </Button>
        </div>
      </div>
    </section>
  );
}
