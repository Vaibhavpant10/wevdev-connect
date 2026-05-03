import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomeNew from './components/HomeNew';
import { Login, Signup } from './components/Auth';
import NotesFeed from './components/NotesFeed';
import CreateNote from './components/CreateNote';
import ChatBot from './components/ChatBot';
import Dashboard from './components/Dashboard';
import Roadmap from './components/Roadmap';
import Admin from './components/Admin';
import { AuthProvider, useAuth } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white text-zinc-950">
          <Routes>
            <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
            <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
            <Route path="/admin" element={<AdminOnly><Admin /></AdminOnly>} />
            <Route path="/*" element={
              <>
                <Navigation />
                <Routes>
                  <Route path="/" element={<HomeNew />} />
                  <Route path="/notes" element={<NotesFeed />} />
                  <Route path="/create-note" element={<Protected><CreateNote /></Protected>} />
                  <Route path="/chat" element={<Protected><ChatBot /></Protected>} />
                  <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
                  <Route path="/roadmap" element={<Protected><Roadmap /></Protected>} />
                </Routes>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageStatus message="Checking your session..." />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <FullPageStatus message="Restoring your session..." />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AdminOnly({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <FullPageStatus message="Checking admin access..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (profile?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function FullPageStatus({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-sm font-medium text-zinc-600 shadow-sm">
        {message}
      </div>
    </div>
  );
}
