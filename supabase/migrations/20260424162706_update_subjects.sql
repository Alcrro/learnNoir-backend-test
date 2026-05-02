alter table subjects
add column if not exists description text;

alter table subjects
add column if not exists "order" int default 0;

alter table subjects
add column if not exists created_at timestamp with time zone default now();

alter table subjects
add column if not exists updated_at timestamp with time zone default now();

alter table subjects
add constraint subjects_slug_unique unique (slug);

select slug, count(*)
from subjects
group by slug
having count(*) > 1;

update subjects
set created_at = now()
where created_at is null;

update subjects
set updated_at = now()
where updated_at is null;

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_subjects_updated_at on subjects;

create trigger update_subjects_updated_at
before update on subjects
for each row execute function update_updated_at_column();