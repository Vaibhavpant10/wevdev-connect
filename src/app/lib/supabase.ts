import { createClient, type Session, type User } from '@supabase/supabase-js';

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'student' | 'admin' | string;
};

export type Note = {
  id: string;
  title: string;
  description: string;
  note_type: 'note' | 'advice';
  tags: string[];
  file_url: string | null;
  file_name: string | null;
  user_id: string | null;
  author_name?: string | null;
  likes: number;
  created_at: string;
};

export type SavedNote = {
  id: string;
  user_id: string;
  note_id: string;
  created_at: string;
  note?: Note;
};

export type ChatSession = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  session_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storageKey: 'devconnect-auth-session',
      },
    })
  : null;

export type AuthState = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
};

export function getDisplayName(user: User | null, profile?: Profile | null) {
  return (
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Learner'
  );
}

export function initialsFromName(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'DC';
}
