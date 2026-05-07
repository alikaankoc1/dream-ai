create extension if not exists "pgcrypto";

create table if not exists public.dreams (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  dream_text text not null,
  interpretation text not null,
  category text not null,
  user_id uuid references auth.users (id) on delete set null
);

create index if not exists dreams_created_at_idx on public.dreams (created_at desc);
create index if not exists dreams_user_id_idx on public.dreams (user_id);
