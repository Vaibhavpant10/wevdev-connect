create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text not null default 'student',
  created_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  note_type text not null check (note_type in ('note', 'advice')),
  tags text[] not null default '{}',
  file_url text,
  file_name text,
  user_id uuid not null references auth.users(id) on delete cascade,
  author_name text,
  likes integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.saved_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  note_id uuid not null references public.notes(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, note_id)
);

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New chat',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists saved_notes_user_id_idx on public.saved_notes(user_id);
create index if not exists saved_notes_note_id_idx on public.saved_notes(note_id);
create index if not exists chat_sessions_user_id_updated_at_idx on public.chat_sessions(user_id, updated_at desc);
create index if not exists chat_messages_session_id_created_at_idx on public.chat_messages(session_id, created_at asc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 'student')
  on conflict (id) do update set full_name = excluded.full_name;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.notes enable row level security;
alter table public.saved_notes enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "Profiles are readable by everyone" on public.profiles;
create policy "Profiles are readable by everyone"
on public.profiles for select
using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Notes are readable by everyone" on public.notes;
create policy "Notes are readable by everyone"
on public.notes for select
using (true);

drop policy if exists "Authenticated users can create notes" on public.notes;
create policy "Authenticated users can create notes"
on public.notes for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own notes" on public.notes;
create policy "Users can update their own notes"
on public.notes for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own notes" on public.notes;
create policy "Users can delete their own notes"
on public.notes for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read their saved notes" on public.saved_notes;
create policy "Users can read their saved notes"
on public.saved_notes for select
using (auth.uid() = user_id);

drop policy if exists "Users can save notes" on public.saved_notes;
create policy "Users can save notes"
on public.saved_notes for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can remove their saved notes" on public.saved_notes;
create policy "Users can remove their saved notes"
on public.saved_notes for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read their chat sessions" on public.chat_sessions;
create policy "Users can read their chat sessions"
on public.chat_sessions for select
using (auth.uid() = user_id);

drop policy if exists "Users can create chat sessions" on public.chat_sessions;
create policy "Users can create chat sessions"
on public.chat_sessions for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their chat sessions" on public.chat_sessions;
create policy "Users can update their chat sessions"
on public.chat_sessions for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their chat sessions" on public.chat_sessions;
create policy "Users can delete their chat sessions"
on public.chat_sessions for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read their chat messages" on public.chat_messages;
create policy "Users can read their chat messages"
on public.chat_messages for select
using (auth.uid() = user_id);

drop policy if exists "Users can create chat messages" on public.chat_messages;
create policy "Users can create chat messages"
on public.chat_messages for insert
with check (
  auth.uid() = user_id and exists (
    select 1 from public.chat_sessions
    where chat_sessions.id = chat_messages.session_id
    and chat_sessions.user_id = auth.uid()
  )
);

drop policy if exists "Users can delete their chat messages" on public.chat_messages;
create policy "Users can delete their chat messages"
on public.chat_messages for delete
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('note-files', 'note-files', true)
on conflict (id) do nothing;

drop policy if exists "Note files are readable by everyone" on storage.objects;
create policy "Note files are readable by everyone"
on storage.objects for select
using (bucket_id = 'note-files');

drop policy if exists "Authenticated users can upload note files" on storage.objects;
create policy "Authenticated users can upload note files"
on storage.objects for insert
with check (
  bucket_id = 'note-files'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can update their own note files" on storage.objects;
create policy "Users can update their own note files"
on storage.objects for update
using (bucket_id = 'note-files' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Users can delete their own note files" on storage.objects;
create policy "Users can delete their own note files"
on storage.objects for delete
using (bucket_id = 'note-files' and auth.uid()::text = (storage.foldername(name))[1]);
