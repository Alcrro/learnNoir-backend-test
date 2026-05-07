create table lesson_versions (
    id uuid primary key default gen_random_uuid(),
    concept_id uuid references concepts(id) on delete cascade,
    processed_version_id uuid references lesson_processed_versions(id) on delete cascade,
    grade_level_id uuid references grade_levels(id),
    pedagogy_style text,             -- beginner/deep_dive/exam/critique
    title text not null,
    description text,
    estimated_duration_minutes integer,
    difficulty_level integer,
    version integer default 1,
    is_published boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);