import { STORY } from '../../data/wedding';
import { cn } from '../../lib/cn';
import { SectionHeading } from '../ui/SectionHeading';

export function Story() {
  return (
    <section id="nossa-historia" className="px-6 py-24 md:px-10 md:py-32">
      <SectionHeading
        eyebrow="Nossa história"
        title="Capítulos de nós dois"
        description="Do primeiro encontro ao pedido: os momentos que nos trouxeram até aqui."
      />

      <ol className="relative mx-auto mt-20 max-w-5xl space-y-20 md:space-y-32">
        <span className="absolute top-8 bottom-8 left-1/2 hidden w-px -translate-x-1/2 bg-olive/20 md:block" aria-hidden />

        {STORY.map((chapter, index) => (
          <li
            key={chapter.id}
            className={cn('relative flex flex-col items-center gap-8 md:gap-16', index % 2 ? 'md:flex-row-reverse' : 'md:flex-row')}
          >
            <span
              className="absolute top-1/2 left-1/2 hidden size-3 -translate-1/2 rounded-full border-2 border-olive bg-paper md:block"
              aria-hidden
            />

            <div className="w-full md:w-1/2">
              <p className="font-mono text-xs tracking-[0.25em] text-olive uppercase">{chapter.date}</p>
              <h3 className="mt-3 text-3xl leading-tight text-ink sm:text-4xl">{chapter.title}</h3>
              <blockquote className="my-5 border-l-2 border-olive pl-4 font-serif text-xl text-olive italic">{chapter.quote}</blockquote>
              <p className="max-w-[60ch] leading-relaxed text-muted">{chapter.text}</p>
            </div>

            <figure className={cn('w-full md:w-1/2', chapter.portrait && 'md:max-w-sm')}>
              <img
                src={chapter.image}
                alt={chapter.imageAlt}
                loading="lazy"
                className={cn(
                  'w-full rounded-2xl border border-olive/15 object-cover shadow-card',
                  chapter.portrait ? 'aspect-[3/4]' : 'aspect-[4/3]',
                )}
              />
            </figure>
          </li>
        ))}
      </ol>
    </section>
  );
}
