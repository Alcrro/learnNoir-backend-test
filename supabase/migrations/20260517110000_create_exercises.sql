-- =============================================================================
-- Create exercises and exercise_attempts tables — 2026-05-17
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. exercises
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exercises (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id       UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  algorithm_id    TEXT NOT NULL,
  position        INTEGER NOT NULL DEFAULT 0,
  title           TEXT NOT NULL,
  difficulty      TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  description     TEXT NOT NULL DEFAULT '',
  examples        JSONB NOT NULL DEFAULT '[]',
  constraints     JSONB NOT NULL DEFAULT '[]',
  hints           JSONB NOT NULL DEFAULT '[]',
  starter_code    TEXT NOT NULL DEFAULT '',
  test_cases      JSONB NOT NULL DEFAULT '[]',
  tags            TEXT[] NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE (lesson_id, position)
);

-- -----------------------------------------------------------------------------
-- 2. exercise_attempts
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exercise_attempts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  exercise_id       UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  code              TEXT NOT NULL DEFAULT '',
  status            TEXT NOT NULL CHECK (status IN ('passed', 'failed', 'error')),
  passed_tests      INTEGER NOT NULL DEFAULT 0,
  total_tests       INTEGER NOT NULL DEFAULT 0,
  hints_used        INTEGER NOT NULL DEFAULT 0,
  score             NUMERIC(5,2) NOT NULL DEFAULT 0,
  execution_time_ms INTEGER,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- Index for per-user progress lookups
CREATE INDEX IF NOT EXISTS exercise_attempts_user_exercise
  ON public.exercise_attempts (user_id, exercise_id);
