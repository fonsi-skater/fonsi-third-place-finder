-- Fonsi Third Place Finder — initial schema
-- Run this in the Supabase SQL editor, or via `supabase db push`

create extension if not exists "uuid-ossp";

create type listing_category as enum (
  'sports',
  'hobbies',
  'faith',
  'tech',
  'arts',
  'other'
);

create type listing_source as enum (
  'eventbrite',
  'google_places',
  'manual',
  'user_submitted'
);

create table listings (
  id uuid primary key default uuid_generate_v4(),

  -- core info
  title text not null,
  description text,
  category listing_category not null default 'other',

  -- location
  address text,
  latitude double precision not null,
  longitude double precision not null,

  -- schedule (for recurring groups, store a plain-text pattern;
  -- for one-off events, use starts_at/ends_at)
  recurrence text,               -- e.g. "Every Sunday, 7:00 AM"
  starts_at timestamptz,
  ends_at timestamptz,

  -- contact / join
  contact_url text,              -- WhatsApp link, website, etc.
  organizer_name text,

  -- provenance
  source listing_source not null default 'manual',
  source_id text,                -- external API's own event/place id, for de-duping

  -- social proof
  interested_count integer not null default 0,

  -- moderation / freshness
  is_active boolean not null default true,
  last_confirmed_at timestamptz default now(),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- prevent the same external event/place from being inserted twice
create unique index listings_source_dedupe
  on listings (source, source_id)
  where source_id is not null;

-- speeds up "near me" radius queries
create index listings_lat_lng_idx on listings (latitude, longitude);
create index listings_category_idx on listings (category);
create index listings_active_idx on listings (is_active) where is_active = true;

-- keep updated_at fresh on every edit
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger listings_set_updated_at
  before update on listings
  for each row
  execute function set_updated_at();

-- Row Level Security: public can read active listings,
-- only the service role (used by the cron job) can write.
alter table listings enable row level security;

create policy "Public can view active listings"
  on listings for select
  using (is_active = true);