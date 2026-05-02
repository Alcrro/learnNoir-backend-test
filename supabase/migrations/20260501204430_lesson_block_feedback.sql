create table lesson_block_feedback (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references profiles(id) on delete cascade,
  lesson_block_id uuid not null references lesson_blocks(id) on delete cascade,

  rating int not null check (rating between 1 and 5),

  created_at timestamp with time zone default now(),

  unique(user_id, lesson_block_id)
);

-- index
create index idx_lbf_block on lesson_block_feedback(lesson_block_id);