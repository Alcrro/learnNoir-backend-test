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
