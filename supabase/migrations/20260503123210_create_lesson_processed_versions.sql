create table lesson_processed_versions (
    id uuid primary key default gen_random_uuid(),
    concept_id uuid references concepts(id) on delete cascade,
    raw_version_id uuid references lesson_raw_versions(id) on delete cascade,
    prompt_version text,
    model_version text,
    processed_content jsonb not null,
    summary text,
    learning_objectives text[],
    keywords text[],
    version integer not null default 1,
    created_at timestamptz default now()
);