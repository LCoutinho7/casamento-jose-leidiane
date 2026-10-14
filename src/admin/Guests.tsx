import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Baby, Check, Pencil, Plus, Trash2, UserMinus, UserPlus, X } from 'lucide-react';
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
const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();

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
      <Input
        label="Nome completo"
        name="guest_full_name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Telefone (opcional)"
          name="guest_phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          label="E-mail (opcional)"
          name="guest_email_new"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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

function EditGuestForm({
  guest,
  onSave,
  onCancel,
}: {
  guest: GuestRow;
  onSave: (change: Partial<GuestRow>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(guest.full_name);
  const [phone, setPhone] = useState(guest.phone ?? '');
  const [email, setEmail] = useState(guest.email ?? '');

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSave({
      full_name: name.trim(),
      phone: phone.trim() || null,
      email: email.trim() || null,
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4 p-4">
      <Input
        label="Nome completo"
        name="edit_full_name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Telefone (opcional)" name="edit_phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input
          label="E-mail (opcional)"
          name="edit_email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={!name.trim()}>
          Salvar
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function CompanionsPanel({
  companions,
  onSave,
  onAdd,
  onRemove,
}: {
  companions: GuestRow[];
  onSave: (id: string, change: Partial<GuestRow>) => void;
  onAdd: (fullName: string, isChild: boolean) => Promise<boolean>;
  onRemove: (companion: GuestRow) => void;
}) {
  const [name, setName] = useState('');
  const [isChild, setIsChild] = useState(false);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const added = await onAdd(name.trim(), isChild);
    setBusy(false);
    if (added) {
      setName('');
      setIsChild(false);
    }
  };

  return (
    <div className="space-y-3">
      {companions.length === 0 && <p className="text-sm text-muted">Nenhum acompanhante neste convite.</p>}
      {companions.length > 0 && (
        <ul className="divide-y divide-clay/10">
          {companions.map((companion) =>
            editing === companion.id ? (
              <li key={companion.id}>
                <EditGuestForm
                  guest={companion}
                  onCancel={() => setEditing(null)}
                  onSave={(change) => {
                    setEditing(null);
                    onSave(companion.id, change);
                  }}
                />
              </li>
            ) : (
              <li key={companion.id} className="flex items-center justify-between gap-3 py-2">
                <div className="min-w-0">
                  <p className="text-sm text-ink">
                    {companion.full_name}
                    {companion.is_child && <span className="ml-2 text-xs text-clay">criança</span>}
                  </p>
                  <p className="font-mono text-xs text-muted">{STATUS_LABEL[companion.status]}</p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    aria-label={`Editar ${companion.full_name}`}
                    onClick={() => setEditing(companion.id)}
                    className="rounded-full border border-clay/30 p-1.5 text-clay transition-colors duration-150 hover:border-clay"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Tirar ${companion.full_name} do convite`}
                    onClick={() => onRemove(companion)}
                    className="rounded-full border border-clay/30 p-1.5 text-clay transition-colors duration-150 hover:border-clay-dark hover:text-clay-dark"
                  >
                    <UserMinus className="size-3.5" />
                  </button>
                </div>
              </li>
            ),
          )}
        </ul>
      )}

      <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
        <input
          aria-label="Nome do novo acompanhante"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome e sobrenome"
          className="min-w-0 flex-1 basis-48 rounded-xl border border-clay/30 bg-white px-4 py-2.5 text-sm text-ink focus:border-clay focus:outline-none"
        />
        <label className="flex shrink-0 items-center gap-1 text-xs text-muted">
          <input type="checkbox" checked={isChild} onChange={(e) => setIsChild(e.target.checked)} />
          criança
        </label>
        <Button type="submit" size="sm" disabled={busy || !name.trim()}>
          <Plus className="size-3.5" /> Adicionar
        </Button>
      </form>
    </div>
  );
}

function GuestModal({
  guest,
  companions,
  onClose,
  onSave,
  onAddCompanion,
  onRemoveCompanion,
}: {
  guest: GuestRow;
  companions: GuestRow[];
  onClose: () => void;
  onSave: (id: string, change: Partial<GuestRow>) => void;
  onAddCompanion: (fullName: string, isChild: boolean) => Promise<boolean>;
  onRemoveCompanion: (companion: GuestRow) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState<'guest' | 'companions'>('guest');
  const isPrincipal = guest.kind === 'principal';

  // <dialog> nativo: foco preso, Esc fecha e o fundo fica inerte sem biblioteca.
  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(event) => event.target === dialog.current && dialog.current?.close()}
      aria-label={`Editar ${guest.full_name}`}
      className="m-auto max-h-[90svh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-clay/15 bg-paper p-0 text-ink shadow-card backdrop:bg-ink/40"
    >
      <div className="flex items-start justify-between gap-4 border-b border-clay/15 px-6 pt-6 pb-4">
        <div className="min-w-0">
          <p className="eyebrow">{isPrincipal ? 'Convidado' : 'Acompanhante'}</p>
          <h2 className="mt-1 truncate text-2xl text-ink">{guest.full_name}</h2>
        </div>
        <button
          type="button"
          aria-label="Fechar"
          onClick={() => dialog.current?.close()}
          className="rounded-full p-2 text-clay transition-colors duration-150 hover:bg-sand"
        >
          <X className="size-4" />
        </button>
      </div>

      {isPrincipal && (
        <div role="tablist" className="flex gap-2 px-6 pt-4">
          {(
            [
              ['guest', 'Dados'],
              ['companions', `Acompanhantes · ${companions.length}`],
            ] as const
          ).map(([id, label]) => (
            <Button
              key={id}
              role="tab"
              aria-selected={tab === id}
              size="sm"
              variant={tab === id ? 'primary' : 'secondary'}
              onClick={() => setTab(id)}
            >
              {label}
            </Button>
          ))}
        </div>
      )}

      <div className="px-2 pb-4 sm:px-2">
        {tab === 'guest' ? (
          <EditGuestForm
            guest={guest}
            onCancel={() => dialog.current?.close()}
            onSave={(change) => {
              onSave(guest.id, change);
              dialog.current?.close();
            }}
          />
        ) : (
          <div className="p-4">
            <CompanionsPanel
              companions={companions}
              onSave={onSave}
              onAdd={onAddCompanion}
              onRemove={onRemoveCompanion}
            />
          </div>
        )}
      </div>
    </dialog>
  );
}

export function Guests() {
  const [guests, setGuests] = useState<GuestRow[]>([]);
  const [links, setLinks] = useState<GuestLinkRow[]>([]);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
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

  const companionsOf = useMemo(() => {
    const map = new Map<string, GuestRow[]>();
    for (const link of links) {
      const companion = byId.get(link.companion_id);
      if (companion) map.set(link.principal_id, [...(map.get(link.principal_id) ?? []), companion]);
    }
    return map;
  }, [links, byId]);

  const editingGuest = editing ? byId.get(editing) : undefined;

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
    const aviso = guest.kind === 'principal' ? '\n\nOs acompanhantes dele continuam na lista.' : '';
    if (!window.confirm(`Excluir ${guest.full_name} da lista?${aviso}`)) return;
    setGuests((prev) => prev.filter((g) => g.id !== guest.id));
    const { error: deleteError } = await supabase.from('guests').delete().eq('id', guest.id);
    if (deleteError) {
      setError('Não foi possível excluir. Recarregue a página.');
      load();
    }
  };

  // Duas chamadas: se o vínculo falhar, desfaz o convidado para não sobrar acompanhante solto.
  const addCompanion = async (principal: GuestRow, fullName: string, isChild: boolean) => {
    const { data, error: insertError } = await supabase
      .from('guests')
      .insert({ full_name: fullName, kind: 'companion', is_child: isChild })
      .select('id')
      .single();
    if (insertError) {
      setError('Não foi possível adicionar o acompanhante.');
      return false;
    }
    const { error: linkError } = await supabase
      .from('guest_links')
      .insert({ principal_id: principal.id, companion_id: data.id });
    if (linkError) {
      await supabase.from('guests').delete().eq('id', data.id);
      setError('Não foi possível adicionar o acompanhante.');
      return false;
    }
    await load();
    return true;
  };

  // Acompanhante de casal só sai deste convite; se não estiver em outro, sai da lista.
  const removeCompanion = async (principal: GuestRow, companion: GuestRow) => {
    const elsewhere = links.some((l) => l.companion_id === companion.id && l.principal_id !== principal.id);
    const question = elsewhere
      ? `Tirar ${companion.full_name} do convite de ${principal.full_name}?\n\nContinua no outro convite.`
      : `Excluir ${companion.full_name} da lista?`;
    if (!window.confirm(question)) return;
    const { error: removeError } = elsewhere
      ? await supabase.from('guest_links').delete().eq('principal_id', principal.id).eq('companion_id', companion.id)
      : await supabase.from('guests').delete().eq('id', companion.id);
    if (removeError) setError('Não foi possível tirar o acompanhante.');
    load();
  };

  const setStatus = (id: string, status: Status) =>
    update(id, {
      status,
      responded_at: status === 'pending' ? null : new Date().toISOString(),
    });

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
        {adults.length} na lista final
        {children > 0 && ` · ${children} ${children === 1 ? 'criança' : 'crianças'} à parte`}
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
          <li key={guest.id} className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-ink">
                  {guest.full_name}
                  {guest.is_child && <span className="ml-2 text-xs text-clay">criança</span>}
                </p>
                <p className="mt-0.5 font-mono text-xs text-muted">
                  {STATUS_LABEL[guest.status]}
                  {guest.kind === 'companion' &&
                    hostsOf.get(guest.id) &&
                    ` · acompanhante de ${hostsOf.get(guest.id)!.join(' e ')}`}
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
                      guest.status === status
                        ? 'border-clay bg-clay text-paper'
                        : 'border-clay/30 text-clay hover:border-clay',
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
                  aria-label={`Editar ${guest.full_name}`}
                  onClick={() => setEditing(guest.id)}
                  className="rounded-full border border-clay/30 p-1.5 text-clay transition-colors duration-150 hover:border-clay"
                >
                  <Pencil className="size-3.5" />
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
            </div>
          </li>
        ))}
        {visible.length === 0 && <li className="p-6 text-center text-sm text-muted">Nenhum convidado encontrado.</li>}
      </ul>

      {editingGuest && (
        <GuestModal
          key={editingGuest.id}
          guest={editingGuest}
          companions={companionsOf.get(editingGuest.id) ?? []}
          onClose={() => setEditing(null)}
          onSave={update}
          onAddCompanion={(fullName, isChild) => addCompanion(editingGuest, fullName, isChild)}
          onRemoveCompanion={(companion) => removeCompanion(editingGuest, companion)}
        />
      )}
    </section>
  );
}
