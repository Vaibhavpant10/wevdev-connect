import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Lightbulb, Upload, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createNote } from '../lib/notes';
import { getDisplayName, isSupabaseConfigured } from '../lib/supabase';

const AVAILABLE_TAGS = ['React', 'JavaScript', 'CSS', 'HTML', 'Node.js', 'Backend', 'DSA', 'Git', 'Python', 'TypeScript'];

export default function CreateNote() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [noteType, setNoteType] = useState<'note' | 'advice'>('note');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag].slice(0, 3)
    ));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Please upload a file under 10MB.');
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await createNote({
        title,
        description,
        noteType,
        tags: selectedTags,
        file,
        userId: user?.id ?? null,
        authorName: getDisplayName(user, profile),
      });
      navigate('/notes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not publish this post.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="mb-3 inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700">
            Share knowledge
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">Create New Post</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600 sm:text-base">Publish a note, tip, or file for other learners.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">
          {!isSupabaseConfigured && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-800">
              Demo mode: posts are saved in this browser only. Add Supabase keys to store them for everyone.
            </div>
          )}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <div className="mb-8">
            <label className="mb-3 block text-sm font-semibold text-zinc-700">Post Type</label>
            <div className="grid gap-3 sm:grid-cols-2">
              <TypeButton active={noteType === 'note'} onClick={() => setNoteType('note')} icon={FileText} title="Learning Note" />
              <TypeButton active={noteType === 'advice'} onClick={() => setNoteType('advice')} icon={Lightbulb} title="Advice / Tip" />
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-zinc-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter a clear, descriptive title"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none transition-all focus:border-zinc-950 focus:ring-4 focus:ring-zinc-100"
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-zinc-700">Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Share your knowledge, explain concepts, or give advice..."
              rows={8}
              className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none transition-all focus:border-zinc-950 focus:ring-4 focus:ring-zinc-100"
              required
            />
            <p className="mt-2 text-sm text-zinc-500">{description.length} characters</p>
          </div>

          <div className="mb-6">
            <label className="mb-3 block text-sm font-semibold text-zinc-700">Tags (select up to 3)</label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  disabled={!selectedTags.includes(tag) && selectedTags.length >= 3}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-45 ${
                    selectedTags.includes(tag)
                      ? 'bg-black text-white shadow-sm'
                      : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="mb-3 block text-sm font-semibold text-zinc-700">Attach File (optional)</label>
            <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-8 text-center transition-colors hover:border-zinc-400">
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.txt,.md"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {file ? (
                  <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                      <Upload size={24} className="text-zinc-700" />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="font-semibold text-zinc-900">{file.name}</p>
                      <p className="text-sm text-zinc-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        setFile(null);
                      }}
                      className="rounded-xl p-2 text-zinc-500 hover:bg-zinc-100"
                      aria-label="Remove file"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={40} className="mx-auto mb-3 text-zinc-400" />
                    <p className="mb-1 font-semibold text-zinc-700">Click to upload</p>
                    <p className="text-sm text-zinc-500">PDF, PNG, JPG, TXT, or MD up to 10MB</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-black px-8 py-4 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Publishing...' : 'Publish Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/notes')}
              className="rounded-xl border border-zinc-200 bg-white px-8 py-4 font-semibold text-zinc-700 transition-all hover:bg-zinc-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TypeButton({ active, onClick, icon: Icon, title }: { active: boolean; onClick: () => void; icon: typeof FileText; title: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border p-4 text-left font-semibold transition-all ${
        active
          ? 'border-zinc-950 bg-zinc-950 text-white shadow-sm'
          : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
      }`}
    >
      <Icon size={22} />
      {title}
    </button>
  );
}
