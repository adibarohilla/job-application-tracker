-- Run this in the Supabase SQL Editor after creating a free project.
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  role text not null,
  location text,
  status text not null check (status in ('Applied', 'Interview', 'Offer', 'Rejected')) default 'Applied',
  applied_date date not null default current_date,
  job_link text,
  notes text,
  created_at timestamptz not null default now()
);
alter table public.applications enable row level security;
create policy "Users manage their own applications" on public.applications for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
