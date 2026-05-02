create table lessons (
  id uuid primary key,
  title text not null,
  description text,
  position int,
  is_active boolean,
  status text,
  created_at timestamp,
  updated_at timestamp
);