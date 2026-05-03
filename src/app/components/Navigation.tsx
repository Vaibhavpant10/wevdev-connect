import { Link, useLocation } from 'react-router-dom';
import { BookOpen, MessageSquare, LayoutDashboard, Map, Home, User, Plus, Edit, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDisplayName, initialsFromName } from '../lib/supabase';

export default function Navigation() {
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const displayName = getDisplayName(user, profile);

  const isActive = (path: string) => location.pathname === path;

  // Hide navigation on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 items-center justify-between gap-3 py-3">
            <Link to="/" className="flex min-w-0 items-center gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black shadow-sm">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="truncate text-lg font-semibold tracking-tight text-zinc-950 sm:text-xl">
                DevConnect AI
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 p-1">
              <NavLink to="/" icon={Home} label="Home" active={isActive('/')} />
              <NavLink to="/notes" icon={BookOpen} label="Notes" active={isActive('/notes')} />
              <NavLink to="/chat" icon={MessageSquare} label="AI Chat" active={isActive('/chat')} />
              <NavLink to="/roadmap" icon={Map} label="Roadmap" active={isActive('/roadmap')} />
              <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" active={isActive('/dashboard')} />
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {user && (
                <Link
                  to="/create-note"
                  className="hidden md:flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
                >
                  <Edit size={18} />
                  Post Note
                </Link>
              )}
              {user ? (
                <div className="flex items-center gap-2">
                  <Link to="/dashboard" className="hidden items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-700 shadow-sm sm:flex">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-xs text-white">
                      {initialsFromName(displayName)}
                    </span>
                    <span className="max-w-28 truncate">{displayName}</span>
                  </Link>
                  <button
                    onClick={() => void signOut()}
                    className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
                    aria-label="Sign out"
                  >
                    <LogOut size={19} />
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="rounded-xl px-3 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 sm:px-4"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-zinc-800 sm:px-5"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="grid grid-cols-5 gap-1 pb-3 lg:hidden">
            <MobileNavLink to="/" icon={Home} active={isActive('/')} />
            <MobileNavLink to="/notes" icon={BookOpen} active={isActive('/notes')} />
            <MobileNavLink to="/chat" icon={MessageSquare} active={isActive('/chat')} />
            <MobileNavLink to="/roadmap" icon={Map} active={isActive('/roadmap')} />
            <MobileNavLink to="/dashboard" icon={User} active={isActive('/dashboard')} />
          </div>
        </div>
      </nav>

      {/* Floating Action Button */}
      {user && (
        <Link
          to="/create-note"
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-xl bg-black text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-zinc-800 md:bottom-8 md:right-8"
          aria-label="Create note"
        >
          <Plus size={28} />
        </Link>
      )}
    </>
  );
}

function NavLink({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        active
          ? 'bg-white text-black shadow-sm'
          : 'text-zinc-600 hover:bg-white hover:text-zinc-950'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}

function MobileNavLink({ to, icon: Icon, active }: { to: string; icon: any; active: boolean }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
        active ? 'bg-zinc-100 text-black shadow-sm' : 'text-zinc-500'
      }`}
    >
      <Icon size={20} />
    </Link>
  );
}
