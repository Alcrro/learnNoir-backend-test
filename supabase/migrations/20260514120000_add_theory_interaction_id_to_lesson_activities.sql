-- Links a lesson activity to the specific theory interaction it measures.
-- Nullable: lesson_activities can still be linked to blocks (lesson_block_id) or be standalone.
ALTER TABLE lesson_activities
ADD COLUMN theory_interaction_id UUID
  REFERENCES lesson_theory_interactions(id)
  ON DELETE SET NULL;

CREATE INDEX idx_la_theory_interaction
  ON lesson_activities(theory_interaction_id)
  WHERE theory_interaction_id IS NOT NULL;
