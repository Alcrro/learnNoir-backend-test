-- Links a lesson activity to the specific block it measures.
-- Nullable: some activities may be lesson-level (not tied to a single block).
alter table lesson_activities
add column lesson_block_id uuid references lesson_blocks(id) on delete set null;

create index idx_la_lesson_block on lesson_activities(lesson_block_id);
