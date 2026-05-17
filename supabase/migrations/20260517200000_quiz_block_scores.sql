-- Per-quiz-block scores. One row per user × block (best score semantics via upsert).
CREATE TABLE IF NOT EXISTS public.quiz_block_scores (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_block_id   UUID NOT NULL REFERENCES public.lesson_blocks(id) ON DELETE CASCADE,
  score             INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  passed            BOOLEAN NOT NULL DEFAULT FALSE,
  attempts          INTEGER NOT NULL DEFAULT 1,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, lesson_block_id)
);

CREATE INDEX IF NOT EXISTS quiz_block_scores_user_lesson_block
  ON public.quiz_block_scores (user_id, lesson_block_id);
