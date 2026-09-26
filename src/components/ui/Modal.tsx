import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Classe de fundo do cartão; permite pré-visualizar a cor escolhida. */
  surfaceClassName?: string;
  /** Troca a animação de entrada pela de confirmação (o cartão afunda e volta). */
  pressing?: boolean;
}

/** Diálogo modal com fechamento por Esc, clique no fundo e botão. */
export function Modal({ open, onClose, title, children, surfaceClassName, pressing }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/70 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'relative my-8 w-full max-w-lg rounded-2xl border border-clay/15 p-6 shadow-card transition-colors duration-200 ease-out-soft sm:p-8',
          pressing ? 'animate-press' : 'animate-rise-in',
          surfaceClassName ?? 'bg-paper',
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 rounded-full p-2 text-clay transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <X className="size-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
