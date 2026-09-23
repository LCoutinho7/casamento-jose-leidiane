import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, align = 'center', className }: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <div className={cn('max-w-2xl', centered && 'mx-auto text-center', className)}>
      <p className={cn('eyebrow mb-4 flex items-center gap-3', centered && 'justify-center')}>
        <span className="h-px w-8 bg-clay/40" />
        {eyebrow}
        {centered && <span className="h-px w-8 bg-clay/40" />}
      </p>
      <h2 className="text-4xl leading-[1.1] tracking-tight text-ink sm:text-5xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-muted">{description}</p>}
    </div>
  );
}
