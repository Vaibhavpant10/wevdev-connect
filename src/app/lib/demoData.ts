import type { Note } from './supabase';

const now = new Date().toISOString();

export const demoNotes: Note[] = [
  {
    id: 'demo-1',
    title: 'Understanding React Hooks',
    description:
      "A beginner's guide to useState, useEffect, and custom hooks. Learn how to manage state and side effects in functional components.",
    note_type: 'note',
    tags: ['React'],
    file_url: null,
    file_name: null,
    user_id: null,
    author_name: 'Sarah Chen',
    likes: 234,
    created_at: now,
  },
  {
    id: 'demo-2',
    title: 'CSS Flexbox Cheat Sheet',
    description:
      'Master flexbox with visual examples, common layout patterns, and the mental model that makes alignment easier.',
    note_type: 'note',
    tags: ['CSS'],
    file_url: null,
    file_name: null,
    user_id: null,
    author_name: 'Mike Johnson',
    likes: 189,
    created_at: now,
  },
  {
    id: 'demo-3',
    title: 'JavaScript Array Methods',
    description:
      'A practical tour through map, filter, reduce, find, some, every, and when each one makes your code clearer.',
    note_type: 'advice',
    tags: ['JavaScript'],
    file_url: null,
    file_name: null,
    user_id: null,
    author_name: 'Emily Davis',
    likes: 312,
    created_at: now,
  },
  {
    id: 'demo-4',
    title: 'Building Your First API',
    description:
      'Learn how to create a REST API with routes, validation, database access, and friendly errors.',
    note_type: 'note',
    tags: ['Backend', 'Node.js'],
    file_url: null,
    file_name: null,
    user_id: null,
    author_name: 'Alex Kumar',
    likes: 278,
    created_at: now,
  },
];

const localNotesKey = 'devconnect-local-notes';

export function readLocalNotes(): Note[] {
  try {
    const raw = localStorage.getItem(localNotesKey);
    return raw ? (JSON.parse(raw) as Note[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalNote(note: Note) {
  const notes = [note, ...readLocalNotes()];
  localStorage.setItem(localNotesKey, JSON.stringify(notes));
}
