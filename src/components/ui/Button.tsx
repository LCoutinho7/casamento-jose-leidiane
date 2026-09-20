import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'light' | 'outline-light';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold uppercase tracking-[0.18em] transition-[background-color,border-color,transform] duration-150 ease-out-soft active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-olive text-paper hover:bg-olive-dark',
  secondary: 'border border-olive/40 text-olive hover:border-olive hover:bg-olive/5',
  ghost: 'text-olive hover:text-ink',
  light: 'bg-paper text-ink hover:bg-sand',
  'outline-light': 'border border-paper/40 bg-ink/25 text-paper backdrop-blur-sm hover:border-paper hover:bg-ink/40',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-[0.6875rem]',
  md: 'px-6 py-3 text-xs',
  lg: 'px-8 py-4 text-xs',
};

interface StyleProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

const classes = ({ variant = 'primary', size = 'md', className }: StyleProps) =>
  cn(base, variants[variant], sizes[size], className);

export function Button({ variant, size, className, children, ...rest }: StyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={classes({ variant, size, className, children })} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({ variant, size, className, children, ...rest }: StyleProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={classes({ variant, size, className, children })} {...rest}>
      {children}
    </a>
  );
}
