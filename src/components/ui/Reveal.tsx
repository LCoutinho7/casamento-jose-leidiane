import type { ElementType, ReactNode } from 'react';
import { useRevealOnce } from '../../hooks/useRevealOnce';
import { cn } from '../../lib/cn';

interface RevealProps {
  children: ReactNode;
  /** Atraso da entrada, em milissegundos. Use para escalonar itens irmãos. */
  delay?: number;
  /** Fração do elemento que precisa estar visível para disparar. */
  threshold?: number;
  as?: ElementType;
  className?: string;
}

/**
 * Revela o conteúdo com fade + deslize quando ele entra na viewport.
 * Acontece uma única vez; com `prefers-reduced-motion` a entrada é imediata.
 */
export function Reveal({ children, delay = 0, threshold = 0.2, as: Tag = 'div', className }: RevealProps) {
  const { ref, revealed } = useRevealOnce<HTMLElement>(threshold);

  return (
    <Tag
      ref={ref}
      className={cn(revealed ? 'animate-reveal-up motion-reduce:animate-none' : 'opacity-0 motion-reduce:opacity-100', className)}
      style={revealed && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
