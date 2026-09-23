import { useRef, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface TiltCardProps {
  children: ReactNode;
  /** Inclinação máxima, em graus. */
  max?: number;
  className?: string;
}

const NEUTRAL = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';

/**
 * Inclina levemente o cartão seguindo o ponteiro. Só responde a mouse fino:
 * em toque e com movimento reduzido o cartão fica parado.
 */
export function TiltCard({ children, max = 4, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(NEUTRAL);

  const allowsTilt = () =>
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element || !allowsTilt()) return;

    const { left, top, width, height } = element.getBoundingClientRect();
    const x = (event.clientX - left) / width - 0.5;
    const y = (event.clientY - top) / height - 0.5;
    setTransform(`perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateY(-2px)`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setTransform(NEUTRAL)}
      style={{ transform }}
      className={cn('transition-transform duration-150 ease-out-soft will-change-transform', className)}
    >
      {children}
    </div>
  );
}
