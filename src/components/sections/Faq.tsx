import { ChevronDown } from 'lucide-react';
import { FAQ } from '../../data/wedding';
import { SectionHeading } from '../ui/SectionHeading';

export function Faq() {
  return (
    <section id="faq" className="bg-sand/50 px-6 py-24 md:px-10 md:py-32">
      <SectionHeading eyebrow="Dúvidas frequentes" title="Perguntas & respostas" />

      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {FAQ.map((item, index) => (
          <details
            key={item.question}
            open={index === 0}
            className="group rounded-2xl border border-clay/15 bg-paper shadow-paper open:border-clay/40"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 font-serif text-xl text-ink transition-colors hover:text-clay [&::-webkit-details-marker]:hidden">
              {item.question}
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sand text-clay transition-transform duration-200 ease-out-soft group-open:rotate-180 group-open:bg-clay group-open:text-paper">
                <ChevronDown className="size-4" />
              </span>
            </summary>
            <p className="border-t border-clay/10 px-6 pt-4 pb-6 text-sm leading-relaxed text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
