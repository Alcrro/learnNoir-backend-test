alter table modules
add column position int default 0;

alter table modules
add column created_at timestamp with time zone default now();

alter table modules
add column updated_at timestamp with time zone;

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_modules_updated_at
before update on modules
for each row
execute function update_updated_at_column();

create index idx_modules_subject_id on modules(subject_id);
create index idx_modules_position on modules(position);