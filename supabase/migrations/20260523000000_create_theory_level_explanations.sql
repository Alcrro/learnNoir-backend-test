-- Theory Level Explanations
-- Stochează explicații per bloc de teorie per nivel de dificultate.
-- Sursă: "teacher" (scriere manuală) sau "ai" (generat OpenAI, cacheuit Redis).
-- UNIQUE (lesson_block_id, level) — un singur rând per bloc per nivel.

CREATE TABLE IF NOT EXISTS theory_level_explanations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_block_id UUID NOT NULL REFERENCES lesson_blocks(id) ON DELETE CASCADE,
  level           TEXT NOT NULL CHECK (level IN ('copil', 'licean', 'student', 'expert')),
  content         TEXT NOT NULL,
  source          TEXT NOT NULL CHECK (source IN ('teacher', 'ai')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (lesson_block_id, level)
);

CREATE INDEX IF NOT EXISTS idx_tle_lesson_block_id
  ON theory_level_explanations(lesson_block_id);
