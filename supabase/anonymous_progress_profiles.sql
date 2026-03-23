-- Physio Quiz anonymous progress profiles (MVP JSON payload model)
-- Run in Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.anonymous_progress_profiles (
  id uuid primary key default gen_random_uuid(),
  resume_code_hash text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  payload_json jsonb not null default '{}'::jsonb
);

create index if not exists anonymous_progress_profiles_last_active_idx
  on public.anonymous_progress_profiles (last_active_at desc);

alter table public.anonymous_progress_profiles enable row level security;

-- No direct table access for anon role.
revoke all on table public.anonymous_progress_profiles from anon;
revoke all on table public.anonymous_progress_profiles from authenticated;

create or replace function public.normalize_resume_code(input text)
returns text
language sql
immutable
as $$
  select regexp_replace(upper(trim(coalesce(input, ''))), '[^A-Z0-9]', '', 'g');
$$;

create or replace function public.hash_resume_code(input text)
returns text
language sql
immutable
as $$
  select encode(digest(public.normalize_resume_code(input), 'sha256'), 'hex');
$$;

create or replace function public.create_progress_profile(p_resume_code text, p_payload_json jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized text := public.normalize_resume_code(p_resume_code);
  created_row public.anonymous_progress_profiles%rowtype;
begin
  if char_length(normalized) < 20 then
    raise exception 'Resume code must be at least 20 characters.' using errcode = '22023';
  end if;

  insert into public.anonymous_progress_profiles (resume_code_hash, payload_json)
  values (public.hash_resume_code(normalized), coalesce(p_payload_json, '{}'::jsonb))
  returning * into created_row;

  return jsonb_build_object(
    'resume_code', normalized,
    'payload_json', created_row.payload_json,
    'updated_at', created_row.updated_at
  );
end;
$$;

create or replace function public.get_progress_profile_by_code(p_resume_code text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized text := public.normalize_resume_code(p_resume_code);
  target_row public.anonymous_progress_profiles%rowtype;
begin
  if char_length(normalized) < 20 then
    raise exception 'Resume code must be at least 20 characters.' using errcode = '22023';
  end if;

  select *
  into target_row
  from public.anonymous_progress_profiles
  where resume_code_hash = public.hash_resume_code(normalized);

  if not found then
    raise exception 'Resume code not found.' using errcode = 'P0002';
  end if;

  update public.anonymous_progress_profiles
  set last_active_at = now(),
      updated_at = now()
  where id = target_row.id
  returning * into target_row;

  return jsonb_build_object(
    'resume_code', normalized,
    'payload_json', target_row.payload_json,
    'updated_at', target_row.updated_at
  );
end;
$$;

create or replace function public.save_progress_profile_by_code(p_resume_code text, p_payload_json jsonb default '{}'::jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized text := public.normalize_resume_code(p_resume_code);
  target_row public.anonymous_progress_profiles%rowtype;
begin
  if char_length(normalized) < 20 then
    raise exception 'Resume code must be at least 20 characters.' using errcode = '22023';
  end if;

  update public.anonymous_progress_profiles
  set payload_json = coalesce(p_payload_json, '{}'::jsonb),
      last_active_at = now(),
      updated_at = now()
  where resume_code_hash = public.hash_resume_code(normalized)
  returning * into target_row;

  if not found then
    raise exception 'Resume code not found.' using errcode = 'P0002';
  end if;

  return jsonb_build_object(
    'resume_code', normalized,
    'payload_json', target_row.payload_json,
    'updated_at', target_row.updated_at
  );
end;
$$;

revoke all on function public.create_progress_profile(text, jsonb) from public;
revoke all on function public.get_progress_profile_by_code(text) from public;
revoke all on function public.save_progress_profile_by_code(text, jsonb) from public;

grant execute on function public.create_progress_profile(text, jsonb) to anon;
grant execute on function public.get_progress_profile_by_code(text) to anon;
grant execute on function public.save_progress_profile_by_code(text, jsonb) to anon;
