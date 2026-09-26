import { useState } from 'react';
import { ExternalLink, Gift, QrCode } from 'lucide-react';
import { GIFT_LISTS, GIFT_QUOTAS } from '../../data/wedding';
import { formatCurrency } from '../../lib/format';
import type { GiftQuota } from '../../types';
import { GiftModal } from '../GiftModal';
import { Button, LinkButton } from '../ui/Button';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { TiltCard } from '../ui/TiltCard';

export function Gifts() {
  const [selected, setSelected] = useState<GiftQuota | null>(null);

  return (
    <section id="presentes" className="bg-sand/50 px-6 py-24 md:px-10 md:py-32">
      <Reveal>
        <SectionHeading
          eyebrow="Lista de presentes"
          title="Para o nosso começo"
          description="A presença de vocês já é o maior presente. Quem quiser nos mimar tem dois caminhos: as listas nas lojas ou uma cota simbólica via PIX."
        />
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
        <article className="flex flex-col justify-between rounded-2xl border border-clay/15 bg-paper p-6 shadow-card md:p-8">
          <div>
            <Gift className="size-8 text-clay" />
            <h3 className="mt-5 text-2xl text-ink">Listas nas lojas</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Itens escolhidos pelos noivos para a casa nova, com entrega direta para eles.
            </p>
          </div>

          <ul className="mt-6 space-y-2">
            {GIFT_LISTS.map((list) => (
              <li key={list.store}>
                {list.url ? (
                  <LinkButton href={list.url} target="_blank" rel="noopener noreferrer" variant="secondary" className="w-full justify-between">
                    {list.store} <ExternalLink className="size-4" />
                  </LinkButton>
                ) : (
                  <p className="rounded-full border border-dashed border-clay/30 px-6 py-3 text-center font-mono text-xs tracking-widest text-clay uppercase">
                    {list.store} — em breve
                  </p>
                )}
              </li>
            ))}
          </ul>
        </article>

        <article className="flex flex-col justify-between rounded-2xl border border-clay/15 bg-clay p-6 text-paper shadow-card md:p-8">
          <div>
            <QrCode className="size-8 text-sand" />
            <h3 className="mt-5 text-2xl">Cotas via PIX</h3>
            <p className="mt-3 text-sm leading-relaxed text-sand">
              Escolha uma cota abaixo e o site gera o PIX copia e cola com o valor certo. Sem taxa, sem cadastro.
            </p>
          </div>
          <p className="mt-6 font-mono text-xs tracking-widest text-sand uppercase">Qualquer valor é bem-vindo</p>
        </article>
      </div>

      <ul className="mx-auto mt-6 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GIFT_QUOTAS.map((gift) => (
          <li key={gift.id}>
            <TiltCard className="h-full">
              <div className="flex h-full flex-col justify-between rounded-2xl border border-clay/15 bg-paper p-6 shadow-paper transition-[border-color,box-shadow] duration-150 ease-out-soft hover:border-clay/40 hover:shadow-card">
                <div>
                  <h3 className="text-xl leading-snug text-ink">{gift.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{gift.description}</p>
                </div>
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-clay/15 pt-4">
                  <span className="font-mono text-lg text-clay">
                    {gift.customAmount ? 'Você escolhe' : formatCurrency(gift.price)}
                  </span>
                  <Button size="sm" onClick={() => setSelected(gift)}>
                    Presentear
                  </Button>
                </div>
              </div>
            </TiltCard>
          </li>
        ))}
      </ul>

      <GiftModal gift={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
