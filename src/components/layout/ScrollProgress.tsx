import { useEffect, useState } from 'react';

/**
 * Fio de 2px no topo da página que acompanha o quanto já foi lido.
 * Usa scaleX para não provocar layout a cada frame do scroll.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const scrollable = scrollHeight - clientHeight;
      setProgress(scrollable > 0 ? Math.min(scrollTop / scrollable, 1) : 0);
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

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5" aria-hidden>
      <div
        className="h-full origin-left bg-olive/70 will-change-transform"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
