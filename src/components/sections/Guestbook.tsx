import { useEffect, useState } from 'react';
import { Clock, Heart, MessageSquarePlus, Quote } from 'lucide-react';
import { createNote, fetchApprovedNotes } from '../../lib/api';
import { cn } from '../../lib/cn';
import { formatDate } from '../../lib/format';
import type { GuestNote } from '../../types';
import { NoteBoard } from '../NoteBoard';
import { NoteModal, paperStyles } from '../NoteModal';
import { Button } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';

// Rotação fixa por posição: dá o ar de mural sem depender de aleatoriedade no render.
const tilt = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'];

function NoteCard({ note, index }: { note: GuestNote; index: number }) {
  const pending = note.status === 'pending';
  return (
    <article
      className={cn(
        'relative flex h-full min-h-56 flex-col justify-between rounded-2xl border p-6 shadow-paper transition-transform duration-200 ease-out-soft hover:rotate-0',
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
    </article>
  );
}

export function Guestbook() {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState<GuestNote[]>([]);
  // Bilhete recém-enviado: fica visível só para quem escreveu, até os noivos aprovarem.
  const [mine, setMine] = useState<GuestNote[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApprovedNotes().then(setNotes).catch(() => setError('Não foi possível carregar o mural agora.'));
  }, []);

  const addNote = async (note: { author: string; message: string; paper: GuestNote['paper'] }) => {
    setError('');
    try {
      await createNote(note);
      setMine((prev) => [{ ...note, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: 'pending' }, ...prev]);
    } catch (e) {
      setError(e instanceof Error && e.message.includes('limite') ? 'Você já enviou bilhetes demais hoje. Volte amanhã!' : 'Não conseguimos enviar seu bilhete. Tente de novo.');
    }
  };

  const board = [...mine, ...notes];

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
        {error && <p className="mt-4 text-sm text-clay-dark">{error}</p>}
      </div>

      {board.length > 0 ? (
        <NoteBoard notes={board}>{(note, i) => <NoteCard note={note} index={i} />}</NoteBoard>
      ) : (
        <p className="mx-auto mt-16 max-w-md rounded-2xl border border-dashed border-clay/30 p-8 text-center text-sm text-muted">
          O mural ainda está vazio. Que tal pregar o primeiro bilhete?
        </p>
      )}

      <NoteModal open={open} onClose={() => setOpen(false)} onSubmit={addNote} />
    </section>
  );
}
