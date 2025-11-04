create extension if not exists "pgcrypto";

create table if not exists public.creator_applications (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null,
  time_slots text[] not null,
  artwork_description text,
  source text,
  created_at timestamptz not null default now()
);

alter table public.creator_applications enable row level security;

create policy if not exists public_insert_creator_app
  on public.creator_applications
  for insert to anon
  with check (true);
