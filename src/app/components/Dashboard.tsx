import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Bot, Clock, FileText, Plus, Target, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getActivityMetrics } from '../lib/activity';
import { isSupabaseConfigured, supabase, type Note } from '../lib/supabase';
import { readLocalNotes } from '../lib/demoData';
import { listSavedNoteIds, listSavedNotes } from '../lib/savedNotes';

type DashboardStats = {
  totalNotes: number;
  myNotes: number;
  savedNotes: number;
  totalUsers: number;
  aiChats: number;
  roadmaps: number;
};

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalNotes: 0,
    myNotes: 0,
    savedNotes: 0,
    totalUsers: 0,
    aiChats: 0,
    roadmaps: 0,
  });
  const [myNotes, setMyNotes] = useState<Note[]>([]);
  const [savedNotes, setSavedNotes] = useState<Note[]>([]);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const activity = getActivityMetrics();

      if (!isSupabaseConfigured || !supabase) {
        const localNotes = readLocalNotes();
        setStats({
          totalNotes: localNotes.length,
          myNotes: localNotes.length,
          savedNotes: 0,
          totalUsers: user ? 1 : 0,
          aiChats: activity.aiChats,
          roadmaps: activity.roadmaps,
        });
        setMyNotes(localNotes.slice(0, 4));
        setSavedNotes([]);
        setRecentNotes(localNotes.slice(0, 5));
        setLoading(false);
        return;
      }

      const [totalNotesResult, myNotesResult, savedIdsResult, savedNotesResult, chatCountResult, usersResult, recentNotesResult] = await Promise.all([
        supabase.from('notes').select('id', { count: 'exact', head: true }),
        user
          ? supabase
              .from('notes')
              .select('*', { count: 'exact' })
              .eq('user_id', user.id)
              .order('created_at', { ascending: false })
              .limit(4)
          : Promise.resolve({ data: [], count: 0, error: null }),
        listSavedNoteIds(user?.id),
        listSavedNotes(user?.id),
        user
          ? supabase
              .from('chat_messages')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', user.id)
              .eq('role', 'user')
          : Promise.resolve({ count: activity.aiChats, error: null }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('notes').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      setStats({
        totalNotes: totalNotesResult.count ?? 0,
        myNotes: myNotesResult.count ?? 0,
        savedNotes: savedIdsResult.length,
        totalUsers: usersResult.count ?? 0,
        aiChats: chatCountResult.count ?? activity.aiChats,
        roadmaps: activity.roadmaps,
      });
      setMyNotes((myNotesResult.data ?? []) as Note[]);
      setSavedNotes(savedNotesResult.slice(0, 4));
      setRecentNotes((recentNotesResult.data ?? []) as Note[]);
      setLoading(false);
    }

    void loadDashboard();
  }, [user]);

  const displayName = useMemo(
    () => profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Learner',
    [profile, user],
  );

  const statCards = [
    { label: 'Community Notes', value: stats.totalNotes, icon: BookOpen, tone: 'indigo' },
    { label: 'Your Posts', value: stats.myNotes, icon: FileText, tone: 'cyan' },
    { label: 'Saved Posts', value: stats.savedNotes, icon: BookOpen, tone: 'violet' },
    { label: 'Members', value: stats.totalUsers, icon: Users, tone: 'emerald' },
    { label: 'AI Chats', value: stats.aiChats, icon: Bot, tone: 'indigo' },
  ];

  return (
    <div className="min-h-screen px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 backdrop-blur">
              Live workspace
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              {user ? `${displayName}'s Dashboard` : 'Dashboard'}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Real project activity from Supabase plus your local AI and roadmap usage.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/create-note"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              <Plus size={18} />
              New Post
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-white"
            >
              <Bot size={18} />
              Ask AI
            </Link>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statCards.map((stat) => (
            <StatCard key={stat.label} {...stat} loading={loading} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-white/70 bg-white/72 p-5 shadow-xl shadow-slate-200/60 backdrop-blur-2xl sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-950">
                <FileText size={22} className="text-indigo-700" />
                Your Posts
              </h2>
              <Link to="/notes" className="text-sm font-semibold text-indigo-700 hover:text-indigo-900">
                View Feed
              </Link>
            </div>

            {loading ? (
              <EmptyPanel message="Loading your posts..." />
            ) : myNotes.length > 0 ? (
              <div className="space-y-3">
                {myNotes.map((note) => (
                  <NoteRow key={note.id} note={note} />
                ))}
              </div>
            ) : (
              <EmptyPanel
                message={user ? 'You have not published anything yet.' : 'Log in to see your personal posts here.'}
                actionLabel="Create your first post"
                actionTo="/create-note"
              />
            )}
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/72 p-5 shadow-xl shadow-slate-200/60 backdrop-blur-2xl sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-950">
                  <BookOpen size={22} className="text-violet-700" />
                  Saved Community Posts
                </h2>
                <Link to="/notes" className="text-sm font-semibold text-indigo-700 hover:text-indigo-900">
                  Browse
                </Link>
              </div>

              {loading ? (
                <EmptyPanel message="Loading saved posts..." />
              ) : savedNotes.length > 0 ? (
                <div className="space-y-3">
                  {savedNotes.map((note) => (
                    <NoteRow key={note.id} note={note} />
                  ))}
                </div>
              ) : (
                <EmptyPanel
                  message={user ? 'Saved community posts will appear here.' : 'Log in to save community posts to your profile.'}
                  actionLabel="Explore notes"
                  actionTo="/notes"
                />
              )}
            </div>

            <div className="mt-8 border-t border-slate-200/70 pt-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-950">
                <TrendingUp size={20} className="text-cyan-700" />
                Progress Snapshot
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <ProgressMini label="Posts" value={Math.min(stats.myNotes * 20, 100)} />
                <ProgressMini label="AI practice" value={Math.min(stats.aiChats * 10, 100)} />
                <ProgressMini label="Roadmaps" value={Math.min(stats.roadmaps * 34, 100)} />
              </div>
            </div>
          </section>

          <aside className="rounded-3xl border border-white/70 bg-white/72 p-5 shadow-xl shadow-slate-200/60 backdrop-blur-2xl sm:p-6">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-950">
              <Clock size={22} className="text-cyan-700" />
              Latest Community Posts
            </h2>

            {loading ? (
              <EmptyPanel message="Loading activity..." />
            ) : recentNotes.length > 0 ? (
              <div className="space-y-4">
                {recentNotes.map((note) => (
                  <div key={note.id} className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500">
                      <BookOpen size={18} className="text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{note.title}</p>
                      <p className="text-xs text-slate-500">{formatDate(note.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyPanel message="No community posts yet. Publish the first one." />
            )}

            <div className="mt-8 border-t border-slate-200/70 pt-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-950">
                <Target size={20} className="text-indigo-700" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link to="/roadmap" className="block rounded-2xl bg-slate-950 p-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-700">
                  Generate Roadmap
                </Link>
                <Link to="/notes" className="block rounded-2xl border border-white/70 bg-white/80 p-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-white">
                  Browse Notes
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  loading,
}: {
  label: string;
  value: number;
  icon: typeof BookOpen;
  tone: string;
  loading: boolean;
}) {
  const toneClasses: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-700',
    cyan: 'bg-cyan-50 text-cyan-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    violet: 'bg-violet-50 text-violet-700',
  };

  return (
    <div className="rounded-3xl border border-white/70 bg-white/72 p-5 shadow-xl shadow-slate-200/50 backdrop-blur-2xl transition-all hover:-translate-y-1 hover:bg-white/90">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses[tone]}`}>
        <Icon size={23} />
      </div>
      <p className="mb-1 text-3xl font-semibold tracking-tight text-slate-950">{loading ? '...' : value}</p>
      <p className="text-sm font-medium text-slate-600">{label}</p>
    </div>
  );
}

function NoteRow({ note }: { note: Note }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/70 p-4 transition hover:bg-white">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-950">{note.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{note.description}</p>
        </div>
        <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {note.note_type}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        {note.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-600">{tag}</span>
        ))}
        <span>{formatDate(note.created_at)}</span>
      </div>
    </div>
  );
}

function ProgressMini({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/70 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="text-sm font-semibold text-indigo-700">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function EmptyPanel({ message, actionLabel, actionTo }: { message: string; actionLabel?: string; actionTo?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white/55 p-8 text-center">
      <p className="text-sm text-slate-500">{message}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="mt-4 inline-flex rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
