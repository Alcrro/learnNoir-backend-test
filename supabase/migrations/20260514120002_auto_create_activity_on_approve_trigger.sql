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
