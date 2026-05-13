-- Migration: feedback_options + selected_option_ids on lesson_component_feedback
-- Run after 002_lesson_component_feedback.sql

CREATE TABLE IF NOT EXISTS feedback_options (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  component_type TEXT        NOT NULL,
  label        TEXT         NOT NULL,
  position     INTEGER      NOT NULL DEFAULT 0,
  is_active    BOOLEAN      NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_fo_component_type ON feedback_options(component_type) WHERE is_active = true;

-- Add selected option IDs to feedback submissions
ALTER TABLE lesson_component_feedback
  ADD COLUMN IF NOT EXISTS selected_option_ids UUID[] NOT NULL DEFAULT '{}';

-- Seed default options per component type
INSERT INTO feedback_options (component_type, label, position) VALUES
  -- concrete_example
  ('concrete_example', 'Exemplul e greu de urmărit', 1),
  ('concrete_example', 'Lipsesc mai multe exemple', 2),
  ('concrete_example', 'Descrierea pasului e neclară', 3),
  ('concrete_example', 'Prea rapid, vreau să văd mai lent', 4),

  -- elaboration
  ('elaboration', 'Explicația e prea vagă', 1),
  ('elaboration', 'Răspunsul nu mi-a clarificat nimic', 2),
  ('elaboration', 'Aș vrea un alt tip de exemplu', 3),

  -- interactive_exercise (complexity derivation)
  ('interactive_exercise', 'Derivarea e prea complicată', 1),
  ('interactive_exercise', 'Formulele nu sunt explicate', 2),
  ('interactive_exercise', 'Lipsește contextul matematic', 3),

  -- transfer
  ('transfer', 'Scenariile sunt neclare', 1),
  ('transfer', 'Feedback-ul nu e suficient de detaliat', 2),
  ('transfer', 'Aș vrea mai multe scenarii', 3),

  -- recall_1 / recall_2 / recall_final
  ('recall_1', 'Întrebările sunt prea grele', 1),
  ('recall_1', 'Explicația răspunsului e insuficientă', 2),
  ('recall_2', 'Întrebările sunt prea grele', 1),
  ('recall_2', 'Explicația răspunsului e insuficientă', 2),
  ('recall_final', 'Întrebările sunt prea grele', 1),
  ('recall_final', 'Explicația răspunsului e insuficientă', 2),

  -- predict_prompt
  ('predict_prompt', 'Întrebarea e prea neclară', 1),
  ('predict_prompt', 'Nu știu de unde să pornesc', 2);
