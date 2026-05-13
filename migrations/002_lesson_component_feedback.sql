-- Migration: lesson_component_feedback
-- Run in Supabase SQL editor after 001_lesson_theory_interactions.sql
-- Assumes update_updated_at_column() function already exists from migration 001

CREATE TABLE IF NOT EXISTS lesson_component_feedback (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id    UUID         NOT NULL,
  component_id TEXT         NOT NULL,
  user_id      UUID         NOT NULL,
  vote         TEXT         NOT NULL CHECK (vote IN ('up', 'down')),
  message      TEXT,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_lcf_user_component UNIQUE (lesson_id, component_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_lcf_lesson_component ON lesson_component_feedback(lesson_id, component_id);

CREATE TRIGGER set_lcf_updated_at
  BEFORE UPDATE ON lesson_component_feedback
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
