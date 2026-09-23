import { useState } from 'react';
import { Check, Clock, Copy, MapPin, Navigation } from 'lucide-react';
import { VENUES, WEDDING_DATE_LABEL } from '../../data/wedding';
import type { Venue } from '../../types';
import { Button, LinkButton } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';

function VenueCard({ kind, venue }: { kind: string; venue: Venue }) {
  const [copied, setCopied] = useState(false);
  const fullAddress = `${venue.name}, ${venue.address}, ${venue.city}`;

  const copy = async () => {
    await navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  };

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-clay/15 bg-paper p-8 shadow-card">
      <div>
        <p className="eyebrow">{kind}</p>
        <h3 className="mt-3 text-3xl text-ink">{venue.name}</h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-clay">
          <Clock className="size-4 shrink-0" />
          {/* horário em monospace; texto livre ("logo após a cerimônia") na fonte de leitura */}
          <span className={/^\d/.test(venue.time) ? 'font-mono' : undefined}>{venue.time}</span>
        </p>
        <p className="mt-4 flex items-start gap-2 text-sm text-muted">
          <MapPin className="mt-0.5 size-4 shrink-0 text-clay" />
          <span>
            {venue.address}
            <br />
            {venue.city}
          </span>
        </p>
        {venue.note && <p className="mt-4 rounded-xl bg-sand/60 p-4 text-sm text-muted italic">{venue.note}</p>}
      </div>

      <div className="mt-8 flex flex-col gap-3 border-t border-clay/15 pt-6">
        <LinkButton href={venue.mapsUrl} target="_blank" rel="noopener noreferrer">
          <Navigation className="size-4" /> Como chegar
        </LinkButton>
        <Button variant="ghost" size="sm" onClick={copy}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? 'Endereço copiado' : 'Copiar endereço'}
        </Button>
      </div>
    </article>
  );
}

export function EventDetails() {
  const announced = VENUES.ceremony || VENUES.reception;

  return (
    <section id="o-grande-dia" className="px-6 py-24 md:px-10 md:py-32">
      <SectionHeading
        eyebrow="O grande dia"
        title="Cerimônia & recepção"
        description={`Reserve ${WEDDING_DATE_LABEL}. Cada detalhe está sendo preparado com carinho.`}
      />

      {announced ? (
        <div className="mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-2">
          {VENUES.ceremony && <VenueCard kind="Cerimônia" venue={VENUES.ceremony} />}
          {VENUES.reception && <VenueCard kind="Recepção" venue={VENUES.reception} />}
        </div>
      ) : (
        <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-dashed border-clay/30 bg-sand/40 p-10 text-center">
          <MapPin className="mx-auto size-8 text-clay" />
          <h3 className="mt-4 text-2xl text-ink">Local e horário em breve</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Estamos fechando os últimos detalhes. Assim que o local for confirmado, ele aparece aqui com mapa e
            endereço para copiar.
          </p>
        </div>
      )}
    </section>
  );
}
