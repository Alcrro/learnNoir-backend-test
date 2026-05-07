create table grade_levels (
    id uuid primary key default gen_random_uuid(),
    name text not null,              -- ex: "Clasa a 8-a"
    age_range text,
    education_stage text,            -- gimnaziu, liceu, etc
    curriculum_region text,          -- RO, US, UK
    created_at timestamptz default now()
);