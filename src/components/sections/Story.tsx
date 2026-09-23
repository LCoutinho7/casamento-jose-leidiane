import { useEffect, useRef, useState } from 'react';
import { STORY } from '../../data/wedding';
import { cn } from '../../lib/cn';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

/**
 * Quanto da linha do tempo já foi percorrido (0 a 1), medido pelo ponto
 * central da viewport em relação à lista de capítulos.
 */
function useTimelineProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const { top, height } = element.getBoundingClientRect();
      const traveled = window.innerHeight / 2 - top;
      setProgress(Math.min(Math.max(traveled / height, 0), 1));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return { ref, progress };
}

export function Story() {
  const { ref, progress } = useTimelineProgress<HTMLOListElement>();

  return (
    <section id="nossa-historia" className="px-6 py-24 md:px-10 md:py-32">
      <Reveal>
        <SectionHeading
          eyebrow="Nossa história"
          title="Capítulos de nós dois"
          description="Do primeiro encontro ao pedido: os momentos que nos trouxeram até aqui."
        />
      </Reveal>

      <ol ref={ref} className="relative mx-auto mt-20 max-w-5xl space-y-20 md:space-y-32">
        {/* trilho e traço percorrido, desenhado conforme o scroll */}
        <span className="absolute top-8 bottom-8 left-1/2 hidden w-px -translate-x-1/2 bg-olive/15 md:block" aria-hidden />
        <span
          className="absolute top-8 bottom-8 left-1/2 hidden w-px origin-top -translate-x-1/2 bg-olive/50 will-change-transform md:block"
          style={{ transform: `translateX(-50%) scaleY(${progress})` }}
          aria-hidden
        />

        {STORY.map((chapter, index) => (
          <li
            key={chapter.id}
            className={cn('relative flex flex-col items-center gap-8 md:gap-16', index % 2 ? 'md:flex-row-reverse' : 'md:flex-row')}
          >
            <span
              className="absolute top-1/2 left-1/2 hidden size-3 -translate-1/2 rounded-full border-2 border-olive bg-paper md:block"
              aria-hidden
            />

            <Reveal className="w-full md:w-1/2">
              <p className="font-mono text-xs tracking-[0.25em] text-olive uppercase">{chapter.date}</p>
              <h3 className="mt-3 text-3xl leading-tight text-ink sm:text-4xl">{chapter.title}</h3>
              <blockquote className="my-5 border-l-2 border-olive pl-4 font-serif text-xl whitespace-pre-line text-olive italic">
                {chapter.quote}
              </blockquote>
              <p className="max-w-[60ch] leading-relaxed text-muted">{chapter.text}</p>
            </Reveal>

            <Reveal as="figure" delay={120} className={cn('w-full md:w-1/2', chapter.portrait && 'md:max-w-sm')}>
              <img
                src={chapter.image}
                alt={chapter.imageAlt}
                loading="lazy"
                className={cn(
                  'w-full rounded-2xl border border-olive/15 object-cover shadow-card',
                  chapter.portrait ? 'aspect-[3/4]' : 'aspect-[4/3]',
                )}
              />
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
