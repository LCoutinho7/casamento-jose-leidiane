import { AlertCircle, MessageCircle, Shirt } from 'lucide-react';
import { COUPLE } from '../../data/wedding';
import { LinkButton } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';

const palette = [
  { name: 'Oliva', className: 'bg-olive text-paper' },
  { name: 'Sálvia', className: 'bg-sage text-paper' },
  { name: 'Areia', className: 'bg-sand-dark text-ink' },
  { name: 'Linho', className: 'bg-sand text-ink' },
  { name: 'Terracota', className: 'bg-terracotta text-paper' },
];

const whatsappMessage = 'Olá! Estou no site do casamento de Zé e Leidi e tenho uma dúvida.';

export function GuestGuide() {
  const whatsappUrl = COUPLE.whatsapp
    ? `https://wa.me/${COUPLE.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  return (
    <section id="informacoes" className="bg-sand/50 px-6 py-24 md:px-10 md:py-32">
      <SectionHeading eyebrow="Guia dos convidados" title="O que você precisa saber" />

      <div className="mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-[3fr_2fr]">
        <article className="rounded-2xl border border-olive/15 bg-paper p-8 shadow-card">
          <div className="flex items-center gap-4">
            <span className="flex size-11 items-center justify-center rounded-full bg-olive/10 text-olive">
              <Shirt className="size-5" />
            </span>
            <div>
              <h3 className="text-2xl text-ink">Traje</h3>
              <p className="eyebrow text-[0.625rem]">Passeio completo</p>
            </div>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-muted">
            Terno ou costume para eles; vestido longo ou midi para elas. Se quiser entrar no clima, a paleta da
            celebração fica nestes tons:
          </p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {palette.map((color) => (
              <li key={color.name} className={`rounded-full px-4 py-1.5 text-xs font-medium ${color.className}`}>
                {color.name}
              </li>
            ))}
          </ul>

          <p className="mt-6 flex items-start gap-2 text-xs text-olive italic">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
            Branco, off-white e marfim ficam reservados à noiva.
          </p>
        </article>

        <article className="flex flex-col justify-between rounded-2xl border border-olive/15 bg-olive p-8 text-paper shadow-card">
          <div>
            <MessageCircle className="size-8 text-sand" />
            <h3 className="mt-5 text-2xl">Ficou com dúvida?</h3>
            <p className="mt-3 text-sm leading-relaxed text-sand">
              Hospedagem, transporte, crianças, restrições alimentares. Fale direto com os noivos.
            </p>
          </div>
          {whatsappUrl ? (
            <LinkButton href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="light" className="mt-8">
              Falar no WhatsApp
            </LinkButton>
          ) : (
            <p className="mt-8 font-mono text-xs tracking-widest text-sand uppercase">Contato em breve</p>
          )}
        </article>
      </div>
    </section>
  );
}
