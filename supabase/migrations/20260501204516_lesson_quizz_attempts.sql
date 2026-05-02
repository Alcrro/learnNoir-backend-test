create table quiz_attempts (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references profiles(id) on delete cascade,
  lesson_block_id uuid not null references lesson_blocks(id) on delete cascade,

  is_correct boolean not null,
  answer jsonb, -- flexibil (string, number, code)

  attempts_count int not null default 1 check (attempts_count > 0),
  time_spent_seconds int check (time_spent_seconds >= 0),

  created_at timestamp with time zone default now()
);

-- indexuri
create index idx_qa_user on quiz_attempts(user_id);
create index idx_qa_block on quiz_attempts(lesson_block_id);
create index idx_qa_correct on quiz_attempts(is_correct);