import { useEffect, useRef, useState } from 'react';

/**
 * Dispara uma única vez, quando o elemento entra na viewport pela primeira vez.
 * Usado para animações de entrada que não devem repetir a cada scroll.
 */
export function useRevealOnce<T extends HTMLElement>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || revealed) return;

    if (!('IntersectionObserver' in window)) {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [revealed, threshold]);

  return { ref, revealed };
}
