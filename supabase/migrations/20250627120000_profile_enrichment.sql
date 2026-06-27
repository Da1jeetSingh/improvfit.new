-- Profile enrichment: signup fields, personalization, avatar storage

-- ---------------------------------------------------------------------------
-- New profile columns
-- ---------------------------------------------------------------------------

alter table public.profiles
  add column if not exists mobile_number text,
  add column if not exists avatar_url text,
  add column if not exists is_academy_player boolean,
  add column if not exists played_professionally boolean,
  add column if not exists tracks_performance boolean,
  add column if not exists playing_level text;

comment on column public.profiles.mobile_number is 'Player contact number collected at signup.';
comment on column public.profiles.avatar_url is 'Public URL for the player profile image.';
comment on column public.profiles.is_academy_player is 'Whether the player trains at an academy.';
comment on column public.profiles.played_professionally is 'Whether the player has professional experience.';
comment on column public.profiles.tracks_performance is 'Whether the player already tracks performance elsewhere.';
comment on column public.profiles.playing_level is 'Current level of play (club, school, etc.).';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_playing_level_check'
  ) then
    alter table public.profiles
      add constraint profiles_playing_level_check
      check (
        playing_level is null
        or playing_level in (
          'grassroots',
          'school',
          'club',
          'academy',
          'county',
          'semi-professional',
          'professional'
        )
      );
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Avatar storage bucket
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can upload own avatar" on storage.objects;
drop policy if exists "Users can update own avatar" on storage.objects;
drop policy if exists "Users can delete own avatar" on storage.objects;
drop policy if exists "Avatar images are publicly readable" on storage.objects;

create policy "Users can upload own avatar"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update own avatar"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete own avatar"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Avatar images are publicly readable"
  on storage.objects
  for select
  to public
  using (bucket_id = 'avatars');

-- ---------------------------------------------------------------------------
-- Signup trigger: persist metadata from auth
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  parsed_age integer;
begin
  begin
    parsed_age := nullif(meta ->> 'age', '')::integer;
  exception
    when others then
      parsed_age := null;
  end;

  insert into public.profiles (id, email, full_name, age, mobile_number)
  values (
    new.id,
    new.email,
    nullif(meta ->> 'full_name', ''),
    parsed_age,
    nullif(meta ->> 'mobile_number', '')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    age = coalesce(public.profiles.age, excluded.age),
    mobile_number = coalesce(public.profiles.mobile_number, excluded.mobile_number);

  return new;
end;
$$;
