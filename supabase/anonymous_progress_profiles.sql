-- Physio Quiz anonymous progress profiles (Edge Function access model)
-- Run in Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.progress_profiles (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique,
  code_last4 text not null,
  payload_json jsonb not null default '{}'::jsonb,
  app_data_version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  constraint progress_profiles_code_last4_length check (char_length(code_last4) = 4),
  constraint progress_profiles_payload_is_object check (jsonb_typeof(payload_json) = 'object')
);

create index if not exists progress_profiles_updated_at_idx
  on public.progress_profiles (updated_at desc);

create index if not exists progress_profiles_last_active_at_idx
  on public.progress_profiles (last_active_at desc);

create or replace function public.set_progress_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_progress_profiles_updated_at on public.progress_profiles;
create trigger trg_progress_profiles_updated_at
before update on public.progress_profiles
for each row
execute function public.set_progress_profiles_updated_at();

alter table public.progress_profiles enable row level security;

-- No direct table access for anon/authenticated roles.
revoke all on table public.progress_profiles from anon;
revoke all on table public.progress_profiles from authenticated;

-- Optional helper view for operational debugging (service-role only).
-- No permissive RLS policies are created for anon/authenticated.
