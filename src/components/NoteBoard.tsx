import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { cn } from '../lib/cn';
import type { GuestNote } from '../types';

const PER_PAGE = 3;
const INTERVAL = 5000;

interface NoteBoardProps {
  notes: GuestNote[];
  children: (note: GuestNote, index: number) => ReactNode;
}

/**
 * Mural em carrossel: no desktop passa de três em três, no mobile vira um
 * slider com scroll-snap. Autoplay pausa enquanto o visitante está lendo.
 */
export function NoteBoard({ notes, children }: NoteBoardProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const track = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  const pages = Math.ceil(notes.length / PER_PAGE);
  // Com uma tela só de bilhetes não há o que passar.
  const rotates = isDesktop ? pages > 1 : notes.length > 1;

  useEffect(() => {
    setPage(0);
  }, [isDesktop, notes.length]);

  useEffect(() => {
    if (!rotates || paused) return;

    const timer = window.setInterval(() => {
      if (isDesktop) {
        setPage((current) => (current + 1) % pages);
        return;
      }

      const element = track.current;
      const card = element?.firstElementChild as HTMLElement | undefined;
      if (!element || !card) return;
      // Avança de card em card (largura + gap), para o passo bater com o snap.
      const step = card.offsetWidth + parseFloat(getComputedStyle(element).columnGap || '0');
      const fim = element.scrollLeft + element.clientWidth >= element.scrollWidth - 8;
      element.scrollTo({ left: fim ? 0 : element.scrollLeft + step, behavior: 'smooth' });
    }, INTERVAL);

    return () => window.clearInterval(timer);
  }, [rotates, paused, isDesktop, pages]);

  // Na última página a janela desliza para trás: assim o grid nunca fica com buraco.
  const start = Math.max(0, Math.min(page * PER_PAGE, notes.length - PER_PAGE));
  const visible = isDesktop ? notes.slice(start, start + PER_PAGE) : notes;

  return (
    <div
      className="mx-auto mt-16 max-w-6xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <ul
        ref={track}
        key={isDesktop ? page : 'mobile'}
        className={cn(
          isDesktop
            ? 'grid animate-fade-in grid-cols-3 gap-8'
            : // o padding de 10vw é metade da sobra de um card de 80vw: com ele o
              // primeiro e o último bilhete também param no centro da tela
              '-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[10vw] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        )}
      >
        {visible.map((note, i) => (
          <li key={note.id} className={cn(!isDesktop && 'w-[80vw] shrink-0 snap-center')}>
            {children(note, i)}
          </li>
        ))}
      </ul>

      {isDesktop && rotates && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Ver bilhetes ${i + 1} de ${pages}`}
              aria-current={page === i}
              className={cn(
                'h-1.5 rounded-full transition-[width,background-color] duration-200 ease-out-soft',
                page === i ? 'w-6 bg-clay' : 'w-1.5 bg-clay/30 hover:bg-clay/60',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
