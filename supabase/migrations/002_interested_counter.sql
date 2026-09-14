-- Atomic increment function for the "I'm interested" button.
-- Using a function (rather than read-then-write from the app) avoids
-- a race condition where two simultaneous clicks could both read the
-- same starting count and one increment gets lost.

create or replace function increment_interested(listing_id uuid)
returns integer as $$
declare
  new_count integer;
begin
  update listings
  set interested_count = interested_count + 1
  where id = listing_id
  returning interested_count into new_count;

  return new_count;
end;
$$ language plpgsql;
