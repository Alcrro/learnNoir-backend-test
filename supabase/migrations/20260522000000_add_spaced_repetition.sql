-- Add spaced repetition fields to user_lesson_progress
-- Schedule (Ebbinghaus): 1d → 3d → 7d → 21d → 60d

ALTER TABLE user_lesson_progress
  ADD COLUMN IF NOT EXISTS next_review_at    TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS last_reviewed_at  TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS review_count      INTEGER     NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_next_review
  ON user_lesson_progress (user_id, next_review_at)
  WHERE next_review_at IS NOT NULL AND status = 'completed';
