import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Code, MessageSquare, PanelLeft, Plus, Send, Sparkles, Trash2, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../context/AuthContext';
import { incrementActivityMetric } from '../lib/activity';
import {
  addChatMessage,
  createChatSession,
  deleteChatSession,
  listChatMessages,
  listChatSessions,
  renameChatSession,
  titleFromMessage,
} from '../lib/chatHistory';
import { askHuggingFace, isHuggingFaceConfigured } from '../lib/huggingface';
import type { ChatMessage, ChatSession } from '../lib/supabase';

const SAMPLE_QUESTIONS = [
  'How do I center a div in CSS?',
  'Explain React useState hook',
  'What is the difference between let and const?',
  'How do I fetch data from an API?',
];

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  session_id: 'welcome',
  user_id: 'system',
  role: 'assistant',
  content: "Hi! I'm your AI coding assistant. Start a new chat or ask me anything about web development.",
  created_at: new Date().toISOString(),
};

export default function ChatBot() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) ?? null,
    [sessions, activeSessionId],
  );

  useEffect(() => {
    void loadSessions();
  }, [user]);

  useEffect(() => {
    if (!activeSessionId) {
      setMessages([welcomeMessage]);
      return;
    }

    setHistoryLoading(true);
    listChatMessages(activeSessionId, user?.id)
      .then((nextMessages) => setMessages(nextMessages.length ? nextMessages : [welcomeMessage]))
      .finally(() => setHistoryLoading(false));
  }, [activeSessionId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function loadSessions(selectId?: string) {
    setHistoryLoading(true);
    try {
      const nextSessions = await listChatSessions(user?.id);
      setSessions(nextSessions);
      setActiveSessionId(selectId ?? nextSessions[0]?.id ?? null);
      if (nextSessions.length === 0) setMessages([welcomeMessage]);
    } finally {
      setHistoryLoading(false);
    }
  }

  async function handleNewChat() {
    const session = await createChatSession(user?.id, 'New chat');
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(session.id);
    setMessages([welcomeMessage]);
    setSidebarOpen(false);
  }

  async function handleDeleteSession(sessionId: string) {
    await deleteChatSession(sessionId, user?.id);
    const remaining = sessions.filter((session) => session.id !== sessionId);
    setSessions(remaining);
    if (activeSessionId === sessionId) {
      setActiveSessionId(remaining[0]?.id ?? null);
      if (remaining.length === 0) setMessages([welcomeMessage]);
    }
  }

  const handleSend = async (text = inputValue) => {
    const question = text.trim();
    if (!question || loading) return;
    if (!user) {
      setMessages((prev) => [...prev.filter((message) => message.id !== 'welcome'), {
        id: crypto.randomUUID(),
        session_id: activeSessionId || 'auth-required',
        user_id: 'system',
        role: 'assistant',
        content: 'Please log in to use AI chat.',
        created_at: new Date().toISOString(),
      }]);
      return;
    }

    setInputValue('');
    setLoading(true);

    try {
      let session = activeSession;
      if (!session) {
        session = await createChatSession(user?.id, titleFromMessage(question));
        setSessions((prev) => [session!, ...prev]);
        setActiveSessionId(session.id);
      } else if (session.title === 'New chat') {
        const nextTitle = titleFromMessage(question);
        await renameChatSession(session.id, nextTitle, user?.id);
        setSessions((prev) => prev.map((item) => (item.id === session!.id ? { ...item, title: nextTitle } : item)));
      }

      const userMessage = await addChatMessage(session.id, 'user', question, user?.id);
      setMessages((prev) => [...prev.filter((message) => message.id !== 'welcome'), userMessage]);

      const answer = await askHuggingFace(question);
      incrementActivityMetric('aiChats');
      const assistantMessage = await addChatMessage(session.id, 'assistant', answer, user?.id);
      setMessages((prev) => [...prev, assistantMessage]);
      await loadSessions(session.id);
    } catch (err) {
      const failedMessage: ChatMessage = {
        id: crypto.randomUUID(),
        session_id: activeSessionId || 'error',
        user_id: user?.id || 'system',
        role: 'assistant',
        content: err instanceof Error ? `AI request failed: ${err.message}` : 'AI request failed. Please try again.',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev.filter((message) => message.id !== 'welcome'), failedMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] bg-white px-4 py-6 sm:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-10rem)] w-full max-w-7xl gap-4 lg:grid-cols-[300px_1fr]">
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:block`}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-zinc-950">Chats</h2>
              <p className="text-xs text-zinc-500">Synced to your account</p>
            </div>
            <button
              onClick={() => void handleNewChat()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white transition hover:bg-zinc-800"
              aria-label="New chat"
            >
              <Plus size={19} />
            </button>
          </div>

          <button
            onClick={() => void handleNewChat()}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100"
          >
            <MessageSquare size={17} />
            New Chat
          </button>

          <div className="max-h-[calc(100vh-16rem)] space-y-2 overflow-y-auto pr-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`group flex items-center gap-2 rounded-2xl border p-2 transition ${
                  activeSessionId === session.id
                    ? 'border-zinc-950 bg-zinc-950 text-white'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                }`}
              >
                <button
                  onClick={() => {
                    setActiveSessionId(session.id);
                    setSidebarOpen(false);
                  }}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="truncate text-sm font-semibold">{session.title}</p>
                  <p className={`text-xs ${activeSessionId === session.id ? 'text-zinc-300' : 'text-zinc-500'}`}>{formatDate(session.updated_at)}</p>
                </button>
                <button
                  onClick={() => void handleDeleteSession(session.id)}
                  className="rounded-xl p-2 text-zinc-400 opacity-100 transition hover:bg-red-50 hover:text-red-600 lg:opacity-0 lg:group-hover:opacity-100"
                  aria-label="Delete chat"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {!historyLoading && sessions.length === 0 && (
              <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-5 text-center text-sm text-zinc-500">
                No chat history yet.
              </div>
            )}
          </div>
        </aside>

        <main className="flex min-w-0 flex-col">
          <div className="mb-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen((open) => !open)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 lg:hidden"
                  aria-label="Toggle chat sidebar"
                >
                  <PanelLeft size={19} />
                </button>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black shadow-sm">
                  <Bot size={24} className="text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-semibold tracking-tight text-slate-950">
                    {activeSession?.title || 'AI Coding Assistant'}
                  </h1>
                  <p className="text-sm text-zinc-600">Session-based AI help with your private history.</p>
                </div>
              </div>
              <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${isHuggingFaceConfigured ? 'border-zinc-200 bg-zinc-50 text-zinc-700' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
                {isHuggingFaceConfigured ? 'Hugging Face connected' : 'Demo AI fallback'}
              </div>
            </div>
          </div>

          {messages.length === 1 && messages[0].id === 'welcome' && (
            <div className="mb-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Sparkles size={16} className="text-zinc-700" />
                Try asking
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SAMPLE_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    onClick={() => void handleSend(question)}
                    className="rounded-xl border border-zinc-200 bg-white p-3 text-left text-sm text-zinc-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-zinc-50"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4 min-h-[420px] flex-1 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
            {historyLoading ? (
              <div className="rounded-xl bg-zinc-50 p-4 text-sm text-zinc-500">Loading chat history...</div>
            ) : (
              <div className="space-y-5">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                      message.role === 'assistant' ? 'bg-zinc-100 text-zinc-950' : 'bg-black'
                    }`}>
                      {message.role === 'assistant' ? <Bot size={20} /> : <User size={20} className="text-white" />}
                    </div>

                    <div className={`max-w-[86%] flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block rounded-3xl p-4 text-left text-sm leading-6 sm:text-base ${
                        message.role === 'assistant'
                          ? 'border border-zinc-200 bg-zinc-50 text-zinc-800 shadow-sm'
                          : 'bg-black text-white shadow-sm'
                      }`}>
                        {message.role === 'assistant' ? (
                          <MarkdownMessage text={message.content} />
                        ) : (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                      <p className="mt-1 px-2 text-xs text-zinc-500">
                        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-950">
                      <Bot size={20} />
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">Thinking...</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
            <div className="flex gap-2 sm:gap-3">
              <div className="relative flex-1">
                <Code size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && void handleSend()}
                  placeholder="Ask me anything about coding..."
                  className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 outline-none transition-all focus:border-zinc-950 focus:ring-4 focus:ring-zinc-100"
                />
              </div>
              <button
                onClick={() => void handleSend()}
                disabled={loading || !inputValue.trim()}
                className="flex items-center gap-2 rounded-xl bg-black px-4 py-3 font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
                aria-label="Send message"
              >
                <Send size={20} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MarkdownMessage({ text }: { text: string }) {
  return (
    <div className="devconnect-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {text}
      </ReactMarkdown>
    </div>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}
