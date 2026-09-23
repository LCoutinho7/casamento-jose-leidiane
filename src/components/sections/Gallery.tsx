import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GALLERY } from '../../data/wedding';
import { cn } from '../../lib/cn';
import { pad } from '../../lib/format';
import type { GalleryCategory } from '../../types';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

type Filter = GalleryCategory | 'todas';

const filters: { id: Filter; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'ensaio', label: 'Ensaio' },
  { id: 'viagens', label: 'Viagens' },
  { id: 'noivado', label: 'Noivado' },
];

export function Gallery() {
  const [filter, setFilter] = useState<Filter>('todas');
  const [current, setCurrent] = useState<number | null>(null);

  const photos = filter === 'todas' ? GALLERY : GALLERY.filter((p) => p.category === filter);

  const step = useCallback(
    (delta: number) => setCurrent((i) => (i === null ? null : (i + delta + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (current === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCurrent(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [current, step]);

  const photo = current === null ? null : photos[current];

  return (
    <section id="galeria" className="bg-sand/50 px-6 py-24 md:px-10 md:py-32">
      <Reveal>
        <SectionHeading eyebrow="Fotos" title="Nossos momentos" description="Instantes que guardam o riso leve e a verdade dos nossos dias." />
      </Reveal>

      <div className="mt-10 flex flex-wrap justify-center gap-2" role="tablist" aria-label="Filtrar fotos">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => {
              setFilter(f.id);
              setCurrent(null);
            }}
            className={cn(
              'rounded-full border px-5 py-2 text-xs font-semibold tracking-[0.15em] uppercase transition-colors duration-150',
              filter === f.id ? 'border-clay bg-clay text-paper' : 'border-clay/25 bg-paper text-clay hover:border-clay',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="mx-auto mt-10 columns-2 gap-4 [column-fill:balance] md:columns-3 md:gap-6 lg:max-w-6xl">
        {photos.map((p, i) => (
          <li key={p.src} className="mb-4 break-inside-avoid md:mb-6">
            <button
              type="button"
              onClick={() => setCurrent(i)}
              className="group block w-full overflow-hidden rounded-2xl border border-clay/15 bg-sand shadow-paper"
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className={cn(
                  'w-full object-cover transition-transform duration-300 ease-out-soft group-hover:scale-[1.03]',
                  p.portrait ? 'aspect-[3/4]' : 'aspect-[4/3]',
                )}
              />
            </button>
          </li>
        ))}
      </ul>

      {photo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
          onClick={() => setCurrent(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4 animate-fade-in sm:p-8"
        >
          <button type="button" aria-label="Fechar" onClick={() => setCurrent(null)} className="absolute top-5 right-5 rounded-full bg-paper/10 p-2 text-paper transition-colors hover:bg-paper/20">
            <X className="size-6" />
          </button>
          <button
            type="button"
            aria-label="Foto anterior"
            onClick={(e) => { e.stopPropagation(); step(-1); }}
            className="absolute left-3 rounded-full bg-paper/10 p-3 text-paper transition-colors hover:bg-paper/20 sm:left-8"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            aria-label="Próxima foto"
            onClick={(e) => { e.stopPropagation(); step(1); }}
            className="absolute right-3 rounded-full bg-paper/10 p-3 text-paper transition-colors hover:bg-paper/20 sm:right-8"
          >
            <ChevronRight className="size-6" />
          </button>

          <figure className="flex max-h-full flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img src={photo.src} alt={photo.alt} className="max-h-[78vh] max-w-full rounded-xl object-contain" />
            <figcaption className="mt-4 text-center text-sm text-sand">
              {photo.alt}
              <span className="mt-1 block font-mono text-xs tracking-widest text-clay-light">
                {pad(current! + 1)} / {pad(photos.length)}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
