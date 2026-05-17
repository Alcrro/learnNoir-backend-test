-- The original constraint required lesson_block_id OR theory_interaction_id.
-- Standalone component-type activities are created before a theory_interaction
-- exists (the trigger links them later on approve), so component_type IS NOT NULL
-- must also satisfy the constraint.

ALTER TABLE lesson_activities
  DROP CONSTRAINT IF EXISTS lesson_activities_has_content_check;

ALTER TABLE lesson_activities
  ADD CONSTRAINT lesson_activities_has_content_check
  CHECK (
    lesson_block_id IS NOT NULL
    OR theory_interaction_id IS NOT NULL
    OR component_type IS NOT NULL
  )
  NOT VALID;
