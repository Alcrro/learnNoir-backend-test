create table user_lesson_progress (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,

  status progress_status not null default 'not_started',

  -- Per-category weighted scores (0.0 – 1.0)
  -- read: viewing content blocks (low weight)
  -- quiz: passing assessments (medium weight)
  -- output: exercises, critical thinking (high weight)
  read_score  float not null default 0 check (read_score  >= 0 and read_score  <= 1),
  quiz_score  float not null default 0 check (quiz_score  >= 0 and quiz_score  <= 1),
  output_score float not null default 0 check (output_score >= 0 and output_score <= 1),

  -- Final weighted score combining all categories
  weighted_score float not null default 0 check (weighted_score >= 0 and weighted_score <= 1),

  last_activity_at timestamp with time zone default now(),
  created_at       timestamp with time zone default now(),
  updated_at       timestamp with time zone default now(),

  unique(user_id, lesson_id)
);

create index idx_ulp_user   on user_lesson_progress(user_id);
create index idx_ulp_lesson  on user_lesson_progress(lesson_id);
create index idx_ulp_status  on user_lesson_progress(user_id, status);

create trigger set_ulp_updated_at
before update on user_lesson_progress
for each row
execute function update_updated_at_column();
