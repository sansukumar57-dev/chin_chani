-- =========================================================================
-- StudyGenie Database Schema (Supabase PostgreSQL)
-- Built for Shinchan 24-Hour Online Hackathon 2026 by Devengers
-- =========================================================================

-- 1. Student profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  streak_days integer default 1,
  total_study_hours numeric(6, 2) default 0.0,
  created_at timestamptz default now()
);

-- 2. Uploaded study documents
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  subject text default 'General',
  file_path text,
  file_size text,
  content_text text,
  status text default 'ready',
  created_at timestamptz default now()
);

-- 3. AI-generated learning content (Summaries, Quizzes, Flashcards, Study Plans)
create table if not exists public.study_outputs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_id uuid references public.documents(id) on delete cascade,
  output_type text not null check (output_type in ('summary', 'quiz', 'flashcards', 'study_plan')),
  title text,
  content jsonb not null,
  created_at timestamptz default now()
);

-- 4. AI Doubt Solver Chat history
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_id uuid references public.documents(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  message text not null,
  citations jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- 5. Quiz attempts & scores
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  study_output_id uuid references public.study_outputs(id) on delete set null,
  document_id uuid references public.documents(id) on delete cascade,
  score integer not null default 0,
  total_questions integer not null,
  percentage integer not null,
  topic_breakdown jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- 6. Topic mastery & weak-topic analysis
create table if not exists public.topic_mastery (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic text not null,
  subject text default 'General',
  correct_answers integer default 0,
  total_questions integer default 0,
  accuracy integer default 0,
  status text default 'Needs Revision' check (status in ('Mastered', 'Improving', 'Needs Revision')),
  recommendation text,
  updated_at timestamptz default now(),
  unique(user_id, topic)
);

-- 7. Flashcards tracking (SRS / Leitner)
create table if not exists public.flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_id uuid references public.documents(id) on delete cascade,
  front text not null,
  back text not null,
  topic text not null,
  status text default 'unseen' check (status in ('unseen', 'learning', 'mastered')),
  created_at timestamptz default now()
);

-- Enable Row Level Security (RLS) on all tables
alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.study_outputs enable row level security;
alter table public.chat_messages enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.topic_mastery enable row level security;
alter table public.flashcards enable row level security;

-- Row Level Security Policies
create policy "Own profile access" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Own documents" on public.documents for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own study outputs" on public.study_outputs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own chat messages" on public.chat_messages for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own quiz attempts" on public.quiz_attempts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own topic mastery" on public.topic_mastery for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own flashcards" on public.flashcards for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Storage bucket configuration for 'study-materials'
-- (Run this in the Supabase Storage setup or SQL editor)
insert into storage.buckets (id, name, public) 
values ('study-materials', 'study-materials', false)
on conflict (id) do nothing;

create policy "Users upload own study materials" on storage.objects 
for insert to authenticated 
with check (
  bucket_id = 'study-materials' and 
  (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Users read own study materials" on storage.objects 
for select to authenticated 
using (
  bucket_id = 'study-materials' and 
  (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Users delete own study materials" on storage.objects 
for delete to authenticated 
using (
  bucket_id = 'study-materials' and 
  (storage.foldername(name))[1] = (select auth.uid())::text
);
