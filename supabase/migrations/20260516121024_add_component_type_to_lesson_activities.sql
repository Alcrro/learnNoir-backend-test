-- Add component_type to lesson_activities for direct lookup without joining theory_interactions.
-- Allows tracking student engagement by component type even when no approved interaction exists.

ALTER TABLE lesson_activities
ADD COLUMN IF NOT EXISTS component_type TEXT;

-- Backfill from linked theory_interactions
UPDATE lesson_activities la
SET component_type = lti.component_type
FROM lesson_theory_interactions lti
WHERE la.theory_interaction_id = lti.id
  AND la.component_type IS NULL;

-- At most one activity per lesson per component type
CREATE UNIQUE INDEX IF NOT EXISTS idx_la_lesson_component_type
  ON lesson_activities (lesson_id, component_type)
  WHERE component_type IS NOT NULL;

-- Replace trigger function to also populate component_type on new activities
CREATE OR REPLACE FUNCTION auto_create_activity_on_theory_approve()
RETURNS TRIGGER AS $$
DECLARE
  v_type       activity_type;
  v_weight     FLOAT;
  v_title      TEXT;
  v_position   INTEGER;
BEGIN
  IF NEW.status <> 'approved' THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'approved' THEN RETURN NEW; END IF;

  -- Skip if already linked to this exact interaction
  IF EXISTS (SELECT 1 FROM lesson_activities WHERE theory_interaction_id = NEW.id) THEN
    RETURN NEW;
  END IF;

  -- If a standalone activity already exists for lesson+component_type, link it instead
  IF EXISTS (SELECT 1 FROM lesson_activities WHERE lesson_id = NEW.lesson_id AND component_type = NEW.component_type) THEN
    UPDATE lesson_activities
       SET theory_interaction_id = NEW.id
     WHERE lesson_id = NEW.lesson_id AND component_type = NEW.component_type;
    RETURN NEW;
  END IF;

  CASE NEW.component_type
    WHEN 'predict_prompt'      THEN v_type := 'content';  v_weight := 0.05; v_title := 'Hook & Predict';
    WHEN 'elaboration'         THEN v_type := 'content';  v_weight := 0.05; v_title := 'Elaboration';
    WHEN 'interactive_exercise' THEN v_type := 'exercise'; v_weight := 0.10; v_title := 'Interactive Exercise';
    WHEN 'transfer'            THEN v_type := 'quiz';     v_weight := 0.10; v_title := 'Transfer Scenario';
    WHEN 'recall_1'            THEN v_type := 'quiz';     v_weight := 0.15; v_title := 'Recall Check 1';
    WHEN 'recall_2'            THEN v_type := 'quiz';     v_weight := 0.15; v_title := 'Recall Check 2';
    WHEN 'recall_final'        THEN v_type := 'quiz';     v_weight := 0.15; v_title := 'Final Recall';
    ELSE RETURN NEW;
  END CASE;

  SELECT COALESCE(MAX(position), 0) + 1 INTO v_position
    FROM lesson_activities WHERE lesson_id = NEW.lesson_id;

  INSERT INTO lesson_activities (lesson_id, type, title, position, required, weight, theory_interaction_id, component_type)
  VALUES (NEW.lesson_id, v_type, v_title, v_position, FALSE, v_weight, NEW.id, NEW.component_type::TEXT);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
