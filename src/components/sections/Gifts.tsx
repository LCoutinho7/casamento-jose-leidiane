import { useState } from 'react';
import { ExternalLink, Gift, QrCode } from 'lucide-react';
import { COUPLE, GIFT_QUOTAS } from '../../data/wedding';
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
          description="A presença de vocês já é o maior presente. Quem quiser nos mimar tem dois caminhos: a lista na loja ou uma cota simbólica via PIX."
        />
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-2">
        <article className="flex flex-col justify-between rounded-2xl border border-olive/15 bg-paper p-6 shadow-card md:p-8">
          <div>
            <Gift className="size-8 text-olive" />
            <h3 className="mt-5 text-2xl text-ink">Lista no Magazine Luiza</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Itens escolhidos pelos noivos para a casa nova, com entrega direta para eles.
            </p>
          </div>
          {COUPLE.giftListUrl ? (
            <LinkButton href={COUPLE.giftListUrl} target="_blank" rel="noopener noreferrer" className="mt-8">
              Abrir lista <ExternalLink className="size-4" />
            </LinkButton>
          ) : (
            <p className="mt-6 font-mono text-xs tracking-widest text-olive uppercase">Lista em preparação</p>
          )}
        </article>

        <article className="flex flex-col justify-between rounded-2xl border border-olive/15 bg-olive p-6 text-paper shadow-card md:p-8">
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
              <div className="flex h-full flex-col justify-between rounded-2xl border border-olive/15 bg-paper p-6 shadow-paper transition-[border-color,box-shadow] duration-150 ease-out-soft hover:border-olive/40 hover:shadow-card">
                <div>
                  <h3 className="text-xl leading-snug text-ink">{gift.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{gift.description}</p>
                </div>
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-olive/15 pt-4">
                  <span className="font-mono text-lg text-olive">
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
