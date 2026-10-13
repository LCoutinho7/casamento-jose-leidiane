import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Baby, Check, Plus, Trash2, UserPlus, X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Field';
import { cn } from '../lib/cn';
import { supabase, type GuestLinkRow, type GuestRow } from './supabase';

type Status = GuestRow['status'];

const STATUS_LABEL: Record<Status, string> = {
  confirmed: 'Confirmado',
  pending: 'Pendente',
  declined: 'Não vai',
};

// Mesma ideia da busca do banco: sem acento, sem caixa, espaços colapsados.
const normalize = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

interface CompanionDraft {
  full_name: string;
  is_child: boolean;
}

function AddGuestForm({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isChild, setIsChild] = useState(false);
  const [companions, setCompanions] = useState<CompanionDraft[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const reset = () => {
    setName('');
    setPhone('');
    setEmail('');
    setIsChild(false);
    setCompanions([]);
    setError('');
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    const { error: rpcError } = await supabase.rpc('admin_add_guest', {
      full_name: name,
      phone,
      email,
      is_child: isChild,
      companions: companions.filter((c) => c.full_name.trim()),
    });
    setBusy(false);
    if (rpcError) {
      setError('Não foi possível adicionar. Confira os nomes e tente de novo.');
      return;
    }
    reset();
    setOpen(false);
    onAdded();
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="size-4" /> Adicionar convidado
      </Button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-clay/15 bg-paper p-6 shadow-paper">
      <p className="eyebrow">Novo convidado</p>
      <Input label="Nome completo" name="guest_full_name" required value={name} onChange={(e) => setName(e.target.value)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Telefone (opcional)" name="guest_phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input label="E-mail (opcional)" name="guest_email_new" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <label className="flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" checked={isChild} onChange={(e) => setIsChild(e.target.checked)} /> É criança
      </label>

      <div className="space-y-3 border-t border-clay/15 pt-4">
        <p className="text-xs font-semibold tracking-wider text-muted uppercase">Acompanhantes</p>
        {companions.map((companion, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              aria-label={`Nome do acompanhante ${i + 1}`}
              value={companion.full_name}
              onChange={(e) =>
                setCompanions((prev) => prev.map((c, j) => (j === i ? { ...c, full_name: e.target.value } : c)))
              }
              placeholder="Nome e sobrenome"
              className="min-w-0 flex-1 rounded-xl border border-clay/30 bg-white px-4 py-2.5 text-sm text-ink focus:border-clay focus:outline-none"
            />
            <label className="flex shrink-0 items-center gap-1 text-xs text-muted">
              <input
                type="checkbox"
                checked={companion.is_child}
                onChange={(e) =>
                  setCompanions((prev) => prev.map((c, j) => (j === i ? { ...c, is_child: e.target.checked } : c)))
                }
              />
              criança
            </label>
            <button
              type="button"
              aria-label="Remover acompanhante"
              onClick={() => setCompanions((prev) => prev.filter((_, j) => j !== i))}
              className="rounded-full p-2 text-clay hover:bg-sand"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setCompanions((prev) => [...prev, { full_name: '', is_child: false }])}
        >
          <Plus className="size-3.5" /> Acompanhante
        </Button>
      </div>

      {error && <p className="text-sm text-clay-dark">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={busy || !name.trim()}>
          {busy ? 'Salvando' : 'Salvar'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            reset();
            setOpen(false);
          }}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

export function Guests() {
  const [guests, setGuests] = useState<GuestRow[]>([]);
  const [links, setLinks] = useState<GuestLinkRow[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const [guestsResult, linksResult] = await Promise.all([
      supabase.from('guests').select('*').order('full_name'),
      supabase.from('guest_links').select('*'),
    ]);
    if (guestsResult.error || linksResult.error) {
      setError('Não foi possível carregar a lista de convidados.');
      return;
    }
    setGuests(guestsResult.data as GuestRow[]);
    setLinks(linksResult.data as GuestLinkRow[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const byId = useMemo(() => new Map(guests.map((g) => [g.id, g])), [guests]);

  // "Acompanhante de Takeo e Tomio": nomes dos convidados principais de cada acompanhante.
  const hostsOf = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const link of links) {
      const host = byId.get(link.principal_id)?.full_name.split(' ')[0];
      if (host) map.set(link.companion_id, [...(map.get(link.companion_id) ?? []), host]);
    }
    return map;
  }, [links, byId]);

  // Criança não entra no total nem no buffet.
  const adults = guests.filter((g) => !g.is_child);
  const count = (status: Status) => adults.filter((g) => g.status === status).length;
  const children = guests.length - adults.length;

  const visible = useMemo(() => {
    const term = normalize(query);
    return term ? guests.filter((g) => normalize(g.full_name).includes(term)) : guests;
  }, [guests, query]);

  const update = async (id: string, change: Partial<GuestRow>) => {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, ...change } : g)));
    const { error: updateError } = await supabase.from('guests').update(change).eq('id', id);
    if (updateError) {
      setError('Não foi possível salvar. Recarregue a página.');
      load();
    }
  };

  const remove = async (guest: GuestRow) => {
    const aviso =
      guest.kind === 'principal' ? '\n\nOs acompanhantes dele continuam na lista.' : '';
    if (!window.confirm(`Excluir ${guest.full_name} da lista?${aviso}`)) return;
    setGuests((prev) => prev.filter((g) => g.id !== guest.id));
    const { error: deleteError } = await supabase.from('guests').delete().eq('id', guest.id);
    if (deleteError) {
      setError('Não foi possível excluir. Recarregue a página.');
      load();
    }
  };

  const setStatus = (id: string, status: Status) =>
    update(id, { status, responded_at: status === 'pending' ? null : new Date().toISOString() });

  return (
    <section className="mt-8 space-y-6">
      {error && <p className="rounded-xl bg-sand/60 p-4 text-sm text-clay-dark">{error}</p>}

      <div className="grid grid-cols-3 gap-3">
        {(['confirmed', 'pending', 'declined'] as const).map((status) => (
          <div key={status} className="rounded-2xl border border-clay/15 bg-paper p-4 text-center">
            <p className="font-mono text-3xl text-clay tabular-nums">{count(status)}</p>
            <p className="mt-1 text-xs font-semibold tracking-wider text-muted uppercase">{STATUS_LABEL[status]}</p>
          </div>
        ))}
      </div>

      <p className="text-center font-mono text-xs text-muted">
        {adults.length} na lista final{children > 0 && ` · ${children} ${children === 1 ? 'criança' : 'crianças'} à parte`}
      </p>

      <AddGuestForm onAdded={load} />

      <input
        type="search"
        aria-label="Buscar convidado"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar por nome"
        className="w-full rounded-full border border-clay/30 bg-white px-5 py-3 text-sm text-ink focus:border-clay focus:outline-none"
      />

      <ul className="divide-y divide-clay/10 rounded-2xl border border-clay/15 bg-paper">
        {visible.map((guest) => (
          <li key={guest.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium text-ink">
                {guest.full_name}
                {guest.is_child && <span className="ml-2 text-xs text-clay">criança</span>}
              </p>
              <p className="mt-0.5 font-mono text-xs text-muted">
                {STATUS_LABEL[guest.status]}
                {guest.kind === 'companion' && hostsOf.get(guest.id) && ` · acompanhante de ${hostsOf.get(guest.id)!.join(' e ')}`}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-1.5">
              {(['confirmed', 'declined', 'pending'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  aria-pressed={guest.status === status}
                  onClick={() => setStatus(guest.id, status)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-[0.6875rem] font-semibold tracking-wider uppercase transition-colors duration-150',
                    guest.status === status ? 'border-clay bg-clay text-paper' : 'border-clay/30 text-clay hover:border-clay',
                  )}
                >
                  {status === 'confirmed' && <Check className="mr-1 inline size-3" />}
                  {STATUS_LABEL[status]}
                </button>
              ))}
              <button
                type="button"
                aria-label={guest.is_child ? 'Marcar como adulto' : 'Marcar como criança'}
                aria-pressed={guest.is_child}
                onClick={() => update(guest.id, { is_child: !guest.is_child })}
                className={cn(
                  'rounded-full border p-1.5 transition-colors duration-150',
                  guest.is_child ? 'border-clay bg-clay text-paper' : 'border-clay/30 text-clay hover:border-clay',
                )}
              >
                <Baby className="size-3.5" />
              </button>
              <button
                type="button"
                aria-label={`Excluir ${guest.full_name}`}
                onClick={() => remove(guest)}
                className="rounded-full border border-clay/30 p-1.5 text-clay transition-colors duration-150 hover:border-clay-dark hover:text-clay-dark"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </li>
        ))}
        {visible.length === 0 && <li className="p-6 text-center text-sm text-muted">Nenhum convidado encontrado.</li>}
      </ul>
    </section>
  );
}
