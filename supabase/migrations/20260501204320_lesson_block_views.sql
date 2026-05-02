create table lesson_block_views (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references profiles(id) on delete cascade,
  lesson_block_id uuid not null references lesson_blocks(id) on delete cascade,

  time_spent_seconds int not null check (time_spent_seconds >= 0),
  viewed_at timestamp with time zone default now(),

  created_at timestamp with time zone default now()
);

-- indexuri importante
create index idx_lbv_user on lesson_block_views(user_id);
create index idx_lbv_block on lesson_block_views(lesson_block_id);
create index idx_lbv_user_block on lesson_block_views(user_id, lesson_block_id);