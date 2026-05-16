-- Records each student attempt at a theory interaction (EmbeddedRecall, TransferScenario, etc.).
-- One row per attempt — preserves full history so the frontend can show "wrong → correct" progression.
-- is_correct is NULL for non-evaluated components (predict_prompt, elaboration) where any engagement = full score.
CREATE TABLE theory_interaction_attempts (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_id UUID        NOT NULL REFERENCES lesson_theory_interactions(id) ON DELETE CASCADE,
  is_correct     BOOLEAN,
  chosen_answer  JSONB       NOT NULL,
  correct_answer JSONB,
  attempt_number INTEGER     NOT NULL DEFAULT 1 CHECK (attempt_number > 0),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tia_user_interaction ON theory_interaction_attempts(user_id, interaction_id);
CREATE INDEX idx_tia_user             ON theory_interaction_attempts(user_id);
CREATE INDEX idx_tia_interaction      ON theory_interaction_attempts(interaction_id);

-- Links a lesson activity to the specific theory interaction it measures.
-- Nullable: lesson_activities can still be linked to blocks (lesson_block_id) or be standalone.
ALTER TABLE lesson_activities
ADD COLUMN theory_interaction_id UUID
  REFERENCES lesson_theory_interactions(id)
  ON DELETE SET NULL;

CREATE INDEX idx_la_theory_interaction
  ON lesson_activities(theory_interaction_id)
  WHERE theory_interaction_id IS NOT NULL;

-- Automatically creates a lesson_activities row when a theory interaction is approved.
-- Weights follow the pedagogical design (learning-methods.md):
--   predict_prompt / elaboration → content, weight 0.05 (low — activation, not assessment)
--   interactive_exercise / transfer → quiz/exercise, weight 0.10
--   recall_1 / recall_2 / recall_final → quiz, weight 0.15 (highest — core retrieval practice)
-- concrete_example is passive (dual-coding visual), so no activity is generated.

CREATE OR REPLACE FUNCTION auto_create_activity_on_theory_approve()
RETURNS TRIGGER AS $$
DECLARE
  v_type     activity_type;
  v_weight   FLOAT;
  v_title    TEXT;
  v_position INTEGER;
BEGIN
  -- Only fire on the draft→approved transition (avoid re-creating on subsequent updates)
  IF NEW.status <> 'approved' THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'approved' THEN
    RETURN NEW;
  END IF;

  -- Skip if an activity already exists for this interaction (idempotent)
  IF EXISTS (
    SELECT 1 FROM lesson_activities WHERE theory_interaction_id = NEW.id
  ) THEN
    RETURN NEW;
  END IF;

  CASE NEW.component_type
    WHEN 'predict_prompt' THEN
      v_type := 'content'; v_weight := 0.05; v_title := 'Hook & Predict';
    WHEN 'elaboration' THEN
      v_type := 'content'; v_weight := 0.05; v_title := 'Elaboration';
    WHEN 'interactive_exercise' THEN
      v_type := 'exercise'; v_weight := 0.10; v_title := 'Interactive Exercise';
    WHEN 'transfer' THEN
      v_type := 'quiz'; v_weight := 0.10; v_title := 'Transfer Scenario';
    WHEN 'recall_1' THEN
      v_type := 'quiz'; v_weight := 0.15; v_title := 'Recall Check 1';
    WHEN 'recall_2' THEN
      v_type := 'quiz'; v_weight := 0.15; v_title := 'Recall Check 2';
    WHEN 'recall_final' THEN
      v_type := 'quiz'; v_weight := 0.15; v_title := 'Final Recall';
    ELSE
      RETURN NEW;  -- concrete_example and unknown types → no activity
  END CASE;

  SELECT COALESCE(MAX(position), 0) + 1
    INTO v_position
    FROM lesson_activities
   WHERE lesson_id = NEW.lesson_id;

  INSERT INTO lesson_activities (lesson_id, type, title, position, required, weight, theory_interaction_id)
  VALUES (NEW.lesson_id, v_type, v_title, v_position, FALSE, v_weight, NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_auto_create_activity_on_theory_approve
  AFTER INSERT OR UPDATE ON lesson_theory_interactions
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_activity_on_theory_approve();
