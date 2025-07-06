-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create briefs table
create table if not exists public.briefs (
    id uuid primary key default uuid_generate_v4(),
    user_name text not null,
    user_email text not null,
    service_type text not null,
    details jsonb not null default '{}',
    status text not null default 'draft',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.briefs enable row level security;

-- Create policy for public access (temporary)
create policy "Allow access for all (for now)"
    on public.briefs
    for all
    using (true);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger handle_briefs_updated_at
    before update on public.briefs
    for each row
    execute function public.handle_updated_at();

-- Create indexes
create index if not exists idx_briefs_status on public.briefs(status);
create index if not exists idx_briefs_created_at on public.briefs(created_at); 