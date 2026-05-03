import { isSupabaseConfigured, supabase, type Note } from './supabase';

const localSavedKey = 'devconnect-saved-notes';

export function readLocalSavedNoteIds(): string[] {
  try {
    const raw = localStorage.getItem(localSavedKey);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeLocalSavedNoteIds(ids: string[]) {
  localStorage.setItem(localSavedKey, JSON.stringify(ids));
}

export async function listSavedNoteIds(userId?: string | null) {
  if (!userId) return [];
  if (!isSupabaseConfigured || !supabase) return readLocalSavedNoteIds();

  const { data, error } = await supabase
    .from('saved_notes')
    .select('note_id')
    .eq('user_id', userId);

  if (error) throw error;
  return (data ?? []).map((row) => row.note_id as string);
}

export async function toggleSavedNote(noteId: string, saved: boolean, userId?: string | null) {
  if (!userId) throw new Error('Please log in to save notes.');

  if (!isSupabaseConfigured || !supabase) {
    const ids = readLocalSavedNoteIds();
    const next = saved ? ids.filter((id) => id !== noteId) : [...new Set([...ids, noteId])];
    writeLocalSavedNoteIds(next);
    return next;
  }

  if (saved) {
    const { error } = await supabase
      .from('saved_notes')
      .delete()
      .eq('user_id', userId)
      .eq('note_id', noteId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('saved_notes')
      .insert({ user_id: userId, note_id: noteId });
    if (error && error.code !== '23505') throw error;
  }

  return listSavedNoteIds(userId);
}

export async function listSavedNotes(userId?: string | null): Promise<Note[]> {
  if (!isSupabaseConfigured || !supabase || !userId) return [];

  const { data, error } = await supabase
    .from('saved_notes')
    .select('created_at, note:notes(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? [])
    .map((row) => row.note)
    .filter(Boolean) as unknown as Note[];
}
