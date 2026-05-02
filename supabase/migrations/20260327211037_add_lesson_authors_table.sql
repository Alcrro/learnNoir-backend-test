create table lesson_authors (
  lesson_id uuid references lessons(id) on delete cascade,
  user_id uuid references auth.users(id),

  role text default 'author', -- optional

  primary key (lesson_id, user_id)
);