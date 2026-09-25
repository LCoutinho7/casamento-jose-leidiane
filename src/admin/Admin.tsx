import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Check, LogOut, RefreshCw, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Field';
import { formatCurrency, formatDate } from '../lib/format';
import { supabase, type NoteRow, type PledgeRow } from './supabase';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) setError('E-mail ou senha incorretos.');
    setBusy(false);
  };

  return (
    <main className="flex min-h-svh items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-2xl border border-clay/15 bg-paper p-8 shadow-card">
        <div>
          <p className="eyebrow">Área dos noivos</p>
          <h1 className="mt-2 text-3xl text-ink">Entrar</h1>
        </div>
        <Input label="E-mail" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Senha" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-clay-dark">{error}</p>}
        <Button type="submit" size="lg" disabled={busy} className="w-full">
          {busy ? 'Entrando' : 'Entrar'}
        </Button>
      </form>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <li className="rounded-2xl border border-clay/15 bg-paper p-6 shadow-paper">{children}</li>;
}

export function Admin() {
  const [session, setSession] = useState<unknown>(null);
  const [ready, setReady] = useState(false);
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [pledges, setPledges] = useState<PledgeRow[]>([]);
  const [tab, setTab] = useState<'notes' | 'pledges'>('notes');
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    setError('');
    const [notesResult, pledgesResult] = await Promise.all([
      supabase.from('notes').select('*').order('created_at', { ascending: false }),
      supabase.from('pledges').select('*').order('created_at', { ascending: false }),
    ]);
    if (notesResult.error || pledgesResult.error) {
      setError('Sua conta não tem permissão de moderação.');
      return;
    }
    setNotes(notesResult.data as NoteRow[]);
    setPledges(pledgesResult.data as PledgeRow[]);
  }, []);

  useEffect(() => {
    if (session) load();
  }, [session, load]);

  if (!ready) return null;
  if (!session) return <Login />;

  const setNoteStatus = async (id: string, status: NoteRow['status']) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, status } : note)));
    const { error: updateError } = await supabase.from('notes').update({ status }).eq('id', id);
    if (updateError) {
      setError('Não foi possível salvar. Recarregue a página.');
      load();
    }
  };

  const setPledgeStatus = async (id: string, status: PledgeRow['status']) => {
    setPledges((prev) => prev.map((pledge) => (pledge.id === id ? { ...pledge, status } : pledge)));
    const { error: updateError } = await supabase.from('pledges').update({ status }).eq('id', id);
    if (updateError) {
      setError('Não foi possível salvar. Recarregue a página.');
      load();
    }
  };

  const pendingNotes = notes.filter((note) => note.status === 'pending').length;
  const openPledges = pledges.filter((pledge) => pledge.status === 'announced').length;
  const tabs = [
    { id: 'notes' as const, label: 'Bilhetinhos', badge: pendingNotes },
    { id: 'pledges' as const, label: 'Presentes', badge: openPledges },
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="flex items-center justify-between gap-4 border-b border-clay/15 pb-6">
        <div>
          <p className="eyebrow">Área dos noivos</p>
          <h1 className="mt-1 text-3xl text-ink">Moderação</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={load}>
            <RefreshCw className="size-3.5" /> Atualizar
          </Button>
          <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()}>
            <LogOut className="size-3.5" /> Sair
          </Button>
        </div>
      </header>

      {error && <p className="mt-6 rounded-xl bg-sand/60 p-4 text-sm text-clay-dark">{error}</p>}

      <div className="mt-8 flex gap-2">
        {tabs.map((item) => (
          <Button key={item.id} size="sm" variant={tab === item.id ? 'primary' : 'secondary'} onClick={() => setTab(item.id)}>
            {item.label}
            {item.badge > 0 && <span className="font-mono">{item.badge}</span>}
          </Button>
        ))}
      </div>

      {tab === 'notes' ? (
        <ul className="mt-8 space-y-4">
          {notes.map((note) => (
            <Card key={note.id}>
              <p className="font-serif text-lg text-ink italic">"{note.message}"</p>
              <p className="mt-3 text-sm font-semibold text-ink">{note.author}</p>
              <p className="font-mono text-xs text-clay">
                {formatDate(note.created_at)} · {note.status}
              </p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" onClick={() => setNoteStatus(note.id, 'approved')} disabled={note.status === 'approved'}>
                  <Check className="size-3.5" /> Aprovar
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setNoteStatus(note.id, 'rejected')} disabled={note.status === 'rejected'}>
                  <X className="size-3.5" /> Recusar
                </Button>
              </div>
            </Card>
          ))}
          {notes.length === 0 && <p className="text-sm text-muted">Nenhum bilhete ainda.</p>}
        </ul>
      ) : (
        <ul className="mt-8 space-y-4">
          {pledges.map((pledge) => (
            <Card key={pledge.id}>
              <p className="font-mono text-lg text-clay">{formatCurrency(pledge.amount)}</p>
              <p className="mt-1 text-ink">{pledge.gift_name}</p>
              <p className="mt-2 text-sm font-semibold text-ink">{pledge.guest_name}</p>
              {pledge.message && <p className="mt-1 text-sm text-muted italic">"{pledge.message}"</p>}
              <p className="font-mono text-xs text-clay">
                {formatDate(pledge.created_at)} · {pledge.status === 'received' ? 'recebido' : 'aguardando confirmação'}
              </p>
              <div className="mt-4">
                <Button size="sm" onClick={() => setPledgeStatus(pledge.id, 'received')} disabled={pledge.status === 'received'}>
                  <Check className="size-3.5" /> Confirmar recebimento
                </Button>
              </div>
            </Card>
          ))}
          {pledges.length === 0 && <p className="text-sm text-muted">Nenhum presente anunciado ainda.</p>}
        </ul>
      )}
    </main>
  );
}
