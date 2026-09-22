import { AlertCircle, MessageCircle, Shirt } from 'lucide-react';
import { COUPLE } from '../../data/wedding';
import { LinkButton } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';

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
            <h3 className="text-2xl text-ink">Traje social</h3>
          </div>

          <p className="mt-6 flex items-start gap-2 text-sm leading-relaxed text-muted">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-olive" />
            Lembre-se: não usem branco, off-white, marfim e outros tons claros que possam parecer branco. Essa cor fica
            reservada para a noiva.
          </p>
        </article>

        <article className="flex flex-col justify-between rounded-2xl border border-olive/15 bg-olive p-8 text-paper shadow-card">
          <div>
            <MessageCircle className="size-8 text-sand" />
            <h3 className="mt-5 text-2xl">Ficou com dúvida?</h3>
            <p className="mt-3 text-sm leading-relaxed text-sand">
              Caso não tenha a resposta nas Perguntas Frequentes, fale com os noivos.
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
