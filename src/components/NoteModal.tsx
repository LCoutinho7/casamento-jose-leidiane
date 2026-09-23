import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { cn } from '../lib/cn';
import type { GuestNote, NotePaper } from '../types';
import { Button } from './ui/Button';
import { Input, Textarea } from './ui/Field';
import { Modal } from './ui/Modal';

const MAX_LENGTH = 300;

export const paperStyles: Record<NotePaper, { label: string; className: string; surface: string }> = {
  cream: { label: 'Creme', className: 'bg-note-cream border-clay/20', surface: 'bg-note-cream' },
  peach: { label: 'Pêssego', className: 'bg-note-peach border-note-peach-edge', surface: 'bg-note-peach' },
  terracotta: {
    label: 'Terracota',
    className: 'bg-note-terracotta border-note-terracotta-edge',
    surface: 'bg-note-terracotta',
  },
  sage: { label: 'Sálvia', className: 'bg-note-sage border-note-sage-edge', surface: 'bg-note-sage' },
};

interface NoteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (note: Omit<GuestNote, 'id' | 'createdAt' | 'status'>) => void;
}

export function NoteModal({ open, onClose, onSubmit }: NoteModalProps) {
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [paper, setPaper] = useState<NotePaper>('cream');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;
    onSubmit({ author: author.trim(), message: message.trim(), paper });
    setAuthor('');
    setMessage('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Deixar um bilhetinho" surfaceClassName={paperStyles[paper].surface}>
      <p className="eyebrow">Mural de bilhetinhos</p>
      <h3 className="mt-2 text-3xl leading-tight text-ink">Deixe seu recadinho</h3>
      <p className="mt-2 text-sm text-muted">Algumas palavras de carinho que os noivos vão guardar para sempre.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input label="Seu nome ou família" name="author" required value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Ex.: Família Coutinho" />

        <fieldset>
          <legend className="mb-1.5 text-xs font-semibold tracking-wider text-muted uppercase">Cor do papel</legend>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(paperStyles) as NotePaper[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setPaper(id)}
                aria-pressed={paper === id}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-xs transition-[border-color,box-shadow] duration-150',
                  paperStyles[id].className,
                  paper === id ? 'border-clay font-semibold text-ink ring-2 ring-clay/30' : 'text-muted',
                )}
              >
                {paperStyles[id].label}
              </button>
            ))}
          </div>
        </fieldset>

        <Textarea
          label="Sua mensagem"
          name="message"
          hint={`${message.length}/${MAX_LENGTH}`}
          required
          rows={4}
          maxLength={MAX_LENGTH}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Um desejo, uma lembrança, um conselho para a vida a dois..."
        />

        <Button type="submit" size="lg" disabled={!author.trim() || !message.trim()} className="w-full">
          <Send className="size-4" /> Pregar no mural
        </Button>
        <p className="text-center text-xs text-muted">Os bilhetes passam pela aprovação dos noivos antes de aparecer para todos.</p>
      </form>
    </Modal>
  );
}
