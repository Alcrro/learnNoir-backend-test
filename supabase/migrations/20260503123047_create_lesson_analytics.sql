create table lesson_analytics (
    id uuid primary key default gen_random_uuid(),
    lesson_version_id uuid references lesson_versions(id) on delete cascade,
    total_views integer default 0,
    completion_rate numeric default 0,
    avg_score numeric default 0,
    avg_time_spent integer default 0,
    satisfaction_rating numeric default 0,
    dropout_rate numeric default 0,
    updated_at timestamptz default now()
);