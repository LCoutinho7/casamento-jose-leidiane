import { useState } from 'react';
import { Calendar, Check, Download } from 'lucide-react';
import { COUPLE, WEDDING_DATE, WEDDING_DATE_LABEL } from '../../data/wedding';
import { useCountdown } from '../../hooks/useCountdown';
import { useRevealOnce } from '../../hooks/useRevealOnce';
import { CountdownCard } from '../CountdownCard';
import { Button, LinkButton } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';

const title = `Casamento de ${COUPLE.groom} & ${COUPLE.bride}`;
const toIcsDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
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

export function Countdown() {
  const time = useCountdown(WEDDING_DATE);
  const [saved, setSaved] = useState(false);
  const { ref, revealed } = useRevealOnce<HTMLDivElement>();

  const units = [
    { label: 'dias', value: time.days },
    { label: 'horas', value: time.hours },
    { label: 'minutos', value: time.minutes },
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
    <section className="bg-sand/50 px-6 py-24 md:px-10 md:py-32">
      <SectionHeading
        eyebrow="Contagem regressiva"
        title={time.finished ? 'O grande dia chegou' : 'Contando os dias para o nosso sim'}
        description={`${WEDDING_DATE_LABEL}, em ${COUPLE.city}.`}
      />

      <div ref={ref} className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4" aria-live="polite">
        {units.map((unit, index) => (
          <CountdownCard key={unit.label} label={unit.label} value={unit.value} revealed={revealed} delay={index * 120} />
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <LinkButton href={googleCalendarUrl} target="_blank" rel="noopener noreferrer" variant="secondary">
          <Calendar className="size-4" /> Google Agenda
        </LinkButton>
        <Button variant="secondary" onClick={downloadIcs}>
          {saved ? <Check className="size-4" /> : <Download className="size-4" />}
          {saved ? 'Salvo' : 'Apple / Outlook (.ics)'}
        </Button>
      </div>
    </section>
  );
}
