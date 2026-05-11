create table lesson_audio (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  script jsonb not null,
  audio_url text not null,
  generated_at timestamptz default now(),
  unique(lesson_id)
);