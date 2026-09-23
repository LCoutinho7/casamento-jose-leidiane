import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

const control =
  'w-full rounded-xl border border-clay/30 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-clay/50 transition-colors focus:border-clay focus:outline-none';

interface LabelProps {
  label: string;
  hint?: string;
}

export function Input({ label, hint, className, id, ...rest }: LabelProps & InputHTMLAttributes<HTMLInputElement>) {
  const inputId = id ?? rest.name;
  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 flex items-baseline justify-between text-xs font-semibold tracking-wider text-muted uppercase">
        {label}
        {hint && <span className="font-mono text-[0.6875rem] font-normal normal-case text-clay">{hint}</span>}
      </label>
      <input id={inputId} className={cn(control, className)} {...rest} />
    </div>
  );
}

export function Textarea({ label, hint, className, id, ...rest }: LabelProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const inputId = id ?? rest.name;
  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 flex items-baseline justify-between text-xs font-semibold tracking-wider text-muted uppercase">
        {label}
        {hint && <span className="font-mono text-[0.6875rem] font-normal normal-case text-clay">{hint}</span>}
      </label>
      <textarea id={inputId} className={cn(control, 'resize-none', className)} {...rest} />
    </div>
  );
}
