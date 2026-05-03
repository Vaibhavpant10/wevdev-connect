import { readLocalNotes, saveLocalNote } from './demoData';
import { isSupabaseConfigured, supabase, type Note } from './supabase';

const notesBucket = import.meta.env.VITE_SUPABASE_NOTES_BUCKET || 'note-files';

export async function listNotes(): Promise<Note[]> {
  if (!isSupabaseConfigured || !supabase) {
    return readLocalNotes();
  }

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Could not load community notes:', error.message);
    return [];
  }

  return data as Note[];
}

type CreateNoteInput = {
  title: string;
  description: string;
  noteType: 'note' | 'advice';
  tags: string[];
  file: File | null;
  userId: string | null;
  authorName: string;
};

export async function createNote(input: CreateNoteInput) {
  if (!input.userId) {
    throw new Error('Please log in to publish a post.');
  }

  let fileUrl: string | null = null;
  let fileName: string | null = null;

  if (isSupabaseConfigured && supabase && input.file) {
    const safeName = input.file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
    const path = `${input.userId}/${Date.now()}-${safeName}`;
    const upload = await supabase.storage.from(notesBucket).upload(path, input.file, {
      upsert: false,
    });

    if (upload.error) throw upload.error;

    const { data } = supabase.storage.from(notesBucket).getPublicUrl(path);
    fileUrl = data.publicUrl;
    fileName = input.file.name;
  }

  const note: Note = {
    id: crypto.randomUUID(),
    title: input.title,
    description: input.description,
    note_type: input.noteType,
    tags: input.tags,
    file_url: fileUrl,
    file_name: fileName,
    user_id: input.userId,
    author_name: input.authorName,
    likes: 0,
    created_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured || !supabase) {
    saveLocalNote(note);
    return note;
  }

  const { data, error } = await supabase
    .from('notes')
    .insert({
      title: note.title,
      description: note.description,
      note_type: note.note_type,
      tags: note.tags,
      file_url: note.file_url,
      file_name: note.file_name,
      user_id: note.user_id,
      author_name: note.author_name,
      likes: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Note;
}
