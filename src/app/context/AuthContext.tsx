import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase, type AuthState, type Profile } from '../lib/supabase';

type AuthContextValue = AuthState & {
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, session: null, profile: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    async function loadProfile(userId: string): Promise<Profile | null> {
      if (!supabase) return null;
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (error) {
        console.warn('Could not load profile:', error.message);
        return null;
      }
      return data as Profile | null;
    }

    function applySession(session: Session | null) {
      const user = session?.user ?? null;
      setState((current) => ({
        session,
        user,
        profile: user && current.profile?.id === user.id ? current.profile : null,
      }));
    }

    async function hydrateProfile(user: User | null) {
      if (!user) {
        if (mounted) setState((current) => ({ ...current, profile: null }));
        return;
      }

      const profile = await loadProfile(user.id);
      if (mounted) {
        setState((current) => (
          current.user?.id === user.id ? { ...current, profile } : current
        ));
      }
    }

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!mounted) return;
        if (error) console.warn('Could not restore auth session:', error.message);
        applySession(data.session ?? null);
        setLoading(false);
        void hydrateProfile(data.session?.user ?? null);
      })
      .catch((error) => {
        console.warn('Could not restore auth session:', error instanceof Error ? error.message : error);
        if (mounted) {
          setState({ session: null, user: null, profile: null });
          setLoading(false);
        }
      });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session);
      setLoading(false);
      setTimeout(() => {
        void hydrateProfile(session?.user ?? null);
      }, 0);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    ...state,
    loading,
    async signIn(email, password) {
      if (!supabase) throw new Error('Supabase is not configured yet.');
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    async signUp(name, email, password) {
      if (!supabase) throw new Error('Supabase is not configured yet.');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) throw error;

      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: name,
          role: 'student',
        });
      }
    },
    async signOut() {
      if (!supabase) return;
      await supabase.auth.signOut();
    },
  }), [state, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
