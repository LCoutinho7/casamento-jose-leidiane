import type { GuestNote, NotePaper } from '../types';

export const SUPABASE_URL = 'https://nxxfvtzdvvnvrlyevfzk.supabase.co';
// Chave publicável: pública por design, o que protege os dados é o RLS.
export const SUPABASE_KEY = 'sb_publishable_oZAcOpHGuxrq-1zjjpvvmA_ymXxcyvy';

const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' };

async function rest(path: string, init?: RequestInit) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers: { ...headers, ...init?.headers } });
  // POST sem Prefer: return=representation responde 201 sem corpo, então nada de json() direto.
  const body = await response.text();
  const parsed = body ? JSON.parse(body) : null;
  if (!response.ok) throw new Error(parsed?.message ?? 'Falha na comunicação');
  return parsed;
}

interface NoteRow {
  id: string;
  author: string;
  message: string;
  paper: NotePaper;
  created_at: string;
}

export async function fetchApprovedNotes(): Promise<GuestNote[]> {
  const rows: NoteRow[] = await rest('notes?select=id,author,message,paper,created_at&order=created_at.desc');
  return rows.map((row) => ({ ...row, createdAt: row.created_at, status: 'approved' }));
}

export function createNote(note: { author: string; message: string; paper: NotePaper }) {
  return rest('notes', { method: 'POST', body: JSON.stringify(note) });
}

export function createPledge(pledge: {
  gift_id: string;
  gift_name: string;
  amount: number;
  guest_name: string;
  guest_email: string;
  message?: string;
}) {
  return rest('pledges', { method: 'POST', body: JSON.stringify(pledge) });
}

// ---------------------------------------------------------------- RSVP
// As funções do banco devolvem um motivo em vez de erro nos caminhos esperados.

export interface RsvpPerson {
  id: string;
  full_name: string;
  kind?: 'principal' | 'companion';
  is_self: boolean;
  status: 'pending' | 'confirmed' | 'declined';
  responded_by: string | null;
  responded_at: string | null;
}

export type RsvpReason = 'ok' | 'short' | 'not_found' | 'ambiguous' | 'throttled' | 'closed' | 'invalid';

export function rsvpLookup(name: string): Promise<{ reason: RsvpReason; group?: RsvpPerson[] }> {
  return rest('rpc/rsvp_lookup', { method: 'POST', body: JSON.stringify({ raw_name: name }) });
}

export function rsvpRespond(
  name: string,
  answers: { id: string; status: 'confirmed' | 'declined' }[],
): Promise<{ reason: RsvpReason }> {
  return rest('rpc/rsvp_respond', { method: 'POST', body: JSON.stringify({ raw_name: name, answers }) });
}
