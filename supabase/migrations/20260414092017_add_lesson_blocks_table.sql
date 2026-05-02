create table lesson_blocks (
  id uuid primary key,
  lesson_id uuid not null references lessons(id) on delete cascade,
  type text not null check (type in ('content', 'interactive', 'assessment')),
  engine text null,
  data jsonb not null,
  position int not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
