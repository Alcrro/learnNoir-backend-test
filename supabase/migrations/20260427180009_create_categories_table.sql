create table categories (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  slug text not null,

  subject_id uuid not null references subjects(id) on delete cascade,

  position integer not null default 0,

  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),

  constraint unique_slug_per_subject unique (subject_id, slug)
);

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
before update on categories
for each row
execute function update_updated_at();