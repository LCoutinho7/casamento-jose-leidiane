import { createClient } from '@supabase/supabase-js';
import { SUPABASE_KEY, SUPABASE_URL } from '../lib/api';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export interface NoteRow {
  id: string;
  author: string;
  message: string;
  paper: 'cream' | 'peach' | 'terracotta' | 'sage';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface PledgeRow {
  id: string;
  gift_name: string;
  amount: number;
  guest_name: string;
  message: string | null;
  status: 'announced' | 'received';
  created_at: string;
}
