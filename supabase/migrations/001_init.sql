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
  'openstreetmap',
  'manual',
  'user_submitted'
);

create table listings (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  category listing_category not null default 'other',
  address text,
  latitude double precision not null,
  longitude double precision not null,
  recurrence text,
  starts_at timestamptz,
  ends_at timestamptz,
  contact_url text,
  organizer_name text,
  source listing_source not null default 'manual',
  source_id text,
  interested_count integer not null default 0,
  is_active boolean not null default true,
  last_confirmed_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index listings_source_dedupe
  on listings (source, source_id)
  where source_id is not null;

create index listings_lat_lng_idx on listings (latitude, longitude);
create index listings_category_idx on listings (category);
create index listings_active_idx on listings (is_active) where is_active = true;

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

alter table listings enable row level security;

create policy "Public can view active listings"
  on listings for select
  using (is_active = true);