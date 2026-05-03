import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Clock, Download, Filter, Heart, Search } from 'lucide-react';
import { listNotes } from '../lib/notes';
import { initialsFromName, type Note } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { listSavedNoteIds, toggleSavedNote } from '../lib/savedNotes';

const CATEGORIES = ['All', 'React', 'JavaScript', 'CSS', 'Backend', 'Git', 'Node.js', 'Advice'];

export default function NotesFeed() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([listNotes(), listSavedNoteIds(user?.id)])
      .then(([nextNotes, nextSavedIds]) => {
        setNotes(nextNotes);
        setSavedNotes(nextSavedIds);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const filteredNotes = useMemo(() => notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      note.title.toLowerCase().includes(query) ||
      note.description.toLowerCase().includes(query) ||
      note.tags.some((tag) => tag.toLowerCase().includes(query));
    const matchesCategory =
      selectedCategory === 'All' ||
      note.tags.includes(selectedCategory) ||
      (selectedCategory === 'Advice' && note.note_type === 'advice');
    return matchesSearch && matchesCategory;
  }), [notes, searchQuery, selectedCategory]);

  const toggleSave = async (noteId: string) => {
    if (!user) {
      navigate('/login', { state: { from: '/notes' } });
      return;
    }

    const saved = savedNotes.includes(noteId);
    setSavedNotes((prev) => (
      saved ? prev.filter((id) => id !== noteId) : [...prev, noteId]
    ));

    try {
      const next = await toggleSavedNote(noteId, saved, user?.id);
      setSavedNotes(next);
    } catch (error) {
      setSavedNotes((prev) => (
        saved ? [...prev, noteId] : prev.filter((id) => id !== noteId)
      ));
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700">
              Community library
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">Learning Notes</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
              Discover notes from the developer community, save useful ideas, and share your own lessons.
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search notes, tags, or topics..."
              className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-12 pr-4 outline-none transition-all focus:border-zinc-950 focus:ring-4 focus:ring-zinc-100"
            />
          </div>

          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
            <Filter size={18} className="shrink-0 text-zinc-500" />
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-black text-white shadow-sm'
                    : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center text-zinc-500">Loading notes...</div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredNotes.map((note) => {
              const author = note.author_name || 'DevConnect Learner';
              const saved = savedNotes.includes(note.id);

              return (
                <article
                  key={note.id}
                  className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-zinc-300"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {(note.tags.length ? note.tags : [note.note_type]).slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => void toggleSave(note.id)}
                      className={`rounded-xl p-2 transition-colors ${saved ? 'bg-zinc-950 text-white' : 'text-zinc-400 hover:bg-zinc-100'}`}
                      aria-label="Save note"
                    >
                      <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <h2 className="mb-2 text-xl font-semibold tracking-tight text-zinc-950">{note.title}</h2>
                  <p className="mb-5 line-clamp-3 text-sm leading-6 text-zinc-600">{note.description}</p>

                  {note.file_url && (
                    <a href={note.file_url} target="_blank" rel="noreferrer" className="mb-5 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-800">
                      <Download size={16} />
                      {note.file_name || 'Download attachment'}
                    </a>
                  )}

                  <div className="flex items-center justify-between border-t border-zinc-200 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                        {initialsFromName(author)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-800">{author}</p>
                        <p className="flex items-center gap-1 text-xs text-zinc-500">
                          <Clock size={12} />
                          {new Date(note.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-zinc-500">
                      <Heart size={18} />
                      <span className="text-sm font-semibold">{note.likes}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && filteredNotes.length === 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white py-16 text-center text-zinc-500">
            No notes found. Try another search or filter.
          </div>
        )}
      </div>
    </div>
  );
}
