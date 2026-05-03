import { isSupabaseConfigured, supabase, type ChatMessage, type ChatSession } from './supabase';

const localSessionsKey = 'devconnect-chat-sessions';
const localMessagesKey = 'devconnect-chat-messages';

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export async function listChatSessions(userId?: string | null): Promise<ChatSession[]> {
  if (!userId) return [];

  if (!isSupabaseConfigured || !supabase) {
    return readLocal<ChatSession[]>(localSessionsKey, []).sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  }

  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as ChatSession[];
}

export async function createChatSession(userId?: string | null, title = 'New chat'): Promise<ChatSession> {
  if (!userId) throw new Error('Please log in to start an AI chat.');

  const now = new Date().toISOString();

  if (!isSupabaseConfigured || !supabase) {
    const session: ChatSession = {
      id: crypto.randomUUID(),
      user_id: userId,
      title,
      created_at: now,
      updated_at: now,
    };
    writeLocal(localSessionsKey, [session, ...readLocal<ChatSession[]>(localSessionsKey, [])]);
    return session;
  }

  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({ user_id: userId, title })
    .select()
    .single();

  if (error) throw error;
  return data as ChatSession;
}

export async function renameChatSession(sessionId: string, title: string, userId?: string | null) {
  if (!userId) throw new Error('Please log in to update this chat.');

  const updated_at = new Date().toISOString();

  if (!isSupabaseConfigured || !supabase) {
    const sessions = readLocal<ChatSession[]>(localSessionsKey, []).map((session) => (
      session.id === sessionId ? { ...session, title, updated_at } : session
    ));
    writeLocal(localSessionsKey, sessions);
    return;
  }

  const { error } = await supabase
    .from('chat_sessions')
    .update({ title, updated_at })
    .eq('id', sessionId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function deleteChatSession(sessionId: string, userId?: string | null) {
  if (!userId) throw new Error('Please log in to delete this chat.');

  if (!isSupabaseConfigured || !supabase) {
    writeLocal(localSessionsKey, readLocal<ChatSession[]>(localSessionsKey, []).filter((session) => session.id !== sessionId));
    const messages = readLocal<Record<string, ChatMessage[]>>(localMessagesKey, {});
    delete messages[sessionId];
    writeLocal(localMessagesKey, messages);
    return;
  }

  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function listChatMessages(sessionId: string, userId?: string | null): Promise<ChatMessage[]> {
  if (!userId) return [];

  if (!isSupabaseConfigured || !supabase) {
    return readLocal<Record<string, ChatMessage[]>>(localMessagesKey, {})[sessionId] ?? [];
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as ChatMessage[];
}

export async function addChatMessage(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
  userId?: string | null,
): Promise<ChatMessage> {
  if (!userId) throw new Error('Please log in to send AI messages.');

  const now = new Date().toISOString();

  if (!isSupabaseConfigured || !supabase) {
    const message: ChatMessage = {
      id: crypto.randomUUID(),
      session_id: sessionId,
      user_id: userId,
      role,
      content,
      created_at: now,
    };
    const messages = readLocal<Record<string, ChatMessage[]>>(localMessagesKey, {});
    messages[sessionId] = [...(messages[sessionId] ?? []), message];
    writeLocal(localMessagesKey, messages);
    return message;
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .insert({ session_id: sessionId, user_id: userId, role, content })
    .select()
    .single();

  if (error) throw error;

  await supabase
    .from('chat_sessions')
    .update({ updated_at: now })
    .eq('id', sessionId)
    .eq('user_id', userId);

  return data as ChatMessage;
}

export function titleFromMessage(message: string) {
  const normalized = message.replace(/\s+/g, ' ').trim();
  return normalized.length > 42 ? `${normalized.slice(0, 42)}...` : normalized || 'New chat';
}
