-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgvector";

-- Create custom types
create type project_type as enum ('branding', 'web_design', 'content', 'marketing', 'other');
create type project_status as enum ('draft', 'in_progress', 'review', 'completed', 'archived');
create type service_type as enum ('brief_builder', 'project_advisor', 'content_assistant');

-- Create users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  avatar_url text,
  language text default 'en',
  preferences jsonb default '{}'::jsonb
);

-- Create projects table
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  type project_type not null,
  title text not null,
  description text,
  status project_status default 'draft'::project_status,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create briefs table
create table public.briefs (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  answers_json jsonb not null default '{}'::jsonb,
  pdf_url text,
  trello_card_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create chat sessions table
create table public.chat_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  service_type service_type not null,
  title text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create messages table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  audio_url text,
  tokens integer,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create feedback table
create table public.feedback (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.chat_sessions(id) on delete cascade,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create analytics table for KPIs
create table public.analytics (
  id uuid default uuid_generate_v4() primary key,
  metric text not null,
  value numeric not null,
  dimensions jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.briefs enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.messages enable row level security;
alter table public.feedback enable row level security;
alter table public.analytics enable row level security;

-- Create RLS Policies

-- Users can read their own data
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

-- Projects policies
create policy "Users can view own projects"
  on public.projects for select
  using (user_id = auth.uid());

create policy "Users can create projects"
  on public.projects for insert
  with check (user_id = auth.uid());

create policy "Users can update own projects"
  on public.projects for update
  using (user_id = auth.uid());

-- Briefs policies
create policy "Users can view own briefs"
  on public.briefs for select
  using (
    exists (
      select 1 from public.projects
      where id = briefs.project_id
      and user_id = auth.uid()
    )
  );

-- Chat sessions policies
create policy "Users can view own chat sessions"
  on public.chat_sessions for select
  using (user_id = auth.uid());

create policy "Users can create chat sessions"
  on public.chat_sessions for insert
  with check (user_id = auth.uid());

-- Messages policies
create policy "Users can view messages from own sessions"
  on public.messages for select
  using (
    exists (
      select 1 from public.chat_sessions
      where id = messages.session_id
      and user_id = auth.uid()
    )
  );

create policy "Users can create messages in own sessions"
  on public.messages for insert
  with check (
    exists (
      select 1 from public.chat_sessions
      where id = session_id
      and user_id = auth.uid()
    )
  );

-- Feedback policies
create policy "Users can view own feedback"
  on public.feedback for select
  using (
    exists (
      select 1 from public.chat_sessions
      where id = feedback.session_id
      and user_id = auth.uid()
    )
  );

-- Create indexes for better performance
create index idx_projects_user_id on public.projects(user_id);
create index idx_briefs_project_id on public.briefs(project_id);
create index idx_chat_sessions_user_id on public.chat_sessions(user_id);
create index idx_messages_session_id on public.messages(session_id);
create index idx_feedback_session_id on public.feedback(session_id);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_users_updated_at
  before update on public.users
  for each row execute function update_updated_at_column();

create trigger update_projects_updated_at
  before update on public.projects
  for each row execute function update_updated_at_column();

create trigger update_briefs_updated_at
  before update on public.briefs
  for each row execute function update_updated_at_column();

create trigger update_chat_sessions_updated_at
  before update on public.chat_sessions
  for each row execute function update_updated_at_column(); 