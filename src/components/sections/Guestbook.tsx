import { useState } from 'react';
import { Clock, Heart, MessageSquarePlus, Quote } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { cn } from '../../lib/cn';
import { formatDate } from '../../lib/format';
import type { GuestNote } from '../../types';
import { NoteModal, paperStyles } from '../NoteModal';
import { Button } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';

// Bilhetes aprovados pelos noivos. Até o painel de moderação existir, a lista fica aqui.
const APPROVED_NOTES: GuestNote[] = [];

// Rotação fixa por posição: dá o ar de mural sem depender de aleatoriedade no render.
const tilt = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'];

function NoteCard({ note, index }: { note: GuestNote; index: number }) {
  const pending = note.status === 'pending';
  return (
    <li
      className={cn(
        'relative flex min-h-56 flex-col justify-between rounded-2xl border p-6 shadow-paper transition-transform duration-200 ease-out-soft hover:rotate-0',
        paperStyles[note.paper].className,
        tilt[index % tilt.length],
      )}
    >
      <span className="absolute -top-3 left-1/2 h-4 w-16 -translate-x-1/2 -rotate-1 rounded-xs border-y border-clay/30 bg-clay/15" aria-hidden />

      <div>
        <Quote className="size-5 text-clay/40" />
        <p className="mt-3 font-serif text-lg leading-relaxed text-ink italic">"{note.message}"</p>
      </div>

      <div className="mt-5 flex items-end justify-between border-t border-ink/10 pt-4">
        <div>
          <p className="text-sm font-semibold text-ink">{note.author}</p>
          <p className="font-mono text-[0.6875rem] text-clay">{formatDate(note.createdAt)}</p>
        </div>
        {pending ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-clay/10 px-2.5 py-1 text-[0.625rem] font-semibold tracking-wider text-clay uppercase">
            <Clock className="size-3" /> Aguardando aprovação
          </span>
        ) : (
          <Heart className="size-4 fill-current text-clay/60" />
        )}
      </div>
    </li>
  );
}

export function Guestbook() {
  const [open, setOpen] = useState(false);
  const [myNotes, setMyNotes] = useLocalStorage<GuestNote[]>('guestbook:pending', []);

  const notes = [...myNotes, ...APPROVED_NOTES];

  const addNote = (note: Omit<GuestNote, 'id' | 'createdAt' | 'status'>) => {
    setMyNotes((prev) => [{ ...note, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: 'pending' }, ...prev]);
  };

  return (
    <section id="bilhetinhos" className="px-6 py-24 md:px-10 md:py-32">
      <SectionHeading
        eyebrow="Mural afetivo"
        title="Bilhetinhos para os noivos"
        description="Um cantinho para deixar votos de felicidade, conselhos ou uma lembrança. Os noivos leem tudo e aprovam o que vai para o mural."
      />

      <div className="mt-8 text-center">
        <Button size="lg" onClick={() => setOpen(true)}>
          <MessageSquarePlus className="size-4" /> Escrever um bilhetinho
        </Button>
      </div>

      {notes.length > 0 ? (
        <ul className="mx-auto mt-16 grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note, i) => (
            <NoteCard key={note.id} note={note} index={i} />
          ))}
        </ul>
      ) : (
        <p className="mx-auto mt-16 max-w-md rounded-2xl border border-dashed border-clay/30 p-8 text-center text-sm text-muted">
          O mural ainda está vazio. Que tal pregar o primeiro bilhete?
        </p>
      )}

      <NoteModal open={open} onClose={() => setOpen(false)} onSubmit={addNote} />
    </section>
  );
}
