-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgvector";

-- Create custom types
create type user_role as enum ('admin', 'team', 'client');
create type project_status as enum ('draft', 'in_progress', 'review', 'completed', 'archived');

-- Create users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  full_name text,
  role user_role default 'client'::user_role,
  avatar_url text,
  primary key (id)
);

-- Create projects table
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  title text not null,
  description text,
  status project_status default 'draft'::project_status,
  client_id uuid references public.profiles(id),
  team_id uuid references public.profiles(id)
);

-- Create chat sessions table
create table public.chat_sessions (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  user_id uuid references public.profiles(id),
  project_id uuid references public.projects(id),
  title text,
  summary text
);

-- Create chat messages table
create table public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  session_id uuid references public.chat_sessions(id) on delete cascade,
  role text not null,
  content text not null,
  tokens integer,
  embedding vector(1536)
);

-- Create RLS policies
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Projects policies
create policy "Team members can view all projects"
  on public.projects for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'team')
    )
  );

create policy "Clients can view own projects"
  on public.projects for select
  using (client_id = auth.uid());

create policy "Team members can insert projects"
  on public.projects for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'team')
    )
  );

create policy "Team members can update projects"
  on public.projects for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'team')
    )
  );

-- Chat sessions policies
create policy "Users can view own chat sessions"
  on public.chat_sessions for select
  using (user_id = auth.uid());

create policy "Users can insert own chat sessions"
  on public.chat_sessions for insert
  with check (user_id = auth.uid());

-- Chat messages policies
create policy "Users can view messages from own sessions"
  on public.chat_messages for select
  using (
    exists (
      select 1 from public.chat_sessions
      where id = chat_messages.session_id
      and user_id = auth.uid()
    )
  );

create policy "Users can insert messages to own sessions"
  on public.chat_messages for insert
  with check (
    exists (
      select 1 from public.chat_sessions
      where id = chat_messages.session_id
      and user_id = auth.uid()
    )
  ); 