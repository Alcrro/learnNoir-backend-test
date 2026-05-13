-- Migration: lesson_theory_interactions
-- Run this in Supabase SQL editor (or via supabase db push)
-- After applying, regenerate TypeScript types: npx supabase gen types typescript --project-id <id> > src/database.types.ts

CREATE TABLE IF NOT EXISTS lesson_theory_interactions (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id    UUID         NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  component_type TEXT       NOT NULL CHECK (component_type IN (
    'predict_prompt', 'concrete_example', 'elaboration',
    'interactive_exercise', 'transfer', 'recall_1', 'recall_2', 'recall_final'
  )),
  content      JSONB        NOT NULL,
  status       TEXT         NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved')),
  version      INTEGER      NOT NULL DEFAULT 1,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  created_by   UUID         REFERENCES profiles(id) ON DELETE SET NULL
);

-- Speed up common queries
CREATE INDEX IF NOT EXISTS idx_lti_lesson_id ON lesson_theory_interactions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lti_lesson_component ON lesson_theory_interactions(lesson_id, component_type);
CREATE INDEX IF NOT EXISTS idx_lti_lesson_status ON lesson_theory_interactions(lesson_id, status);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON lesson_theory_interactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
