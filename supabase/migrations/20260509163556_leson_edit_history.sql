CREATE TABLE lesson_edit_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  editor_id UUID NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  changes JSONB NOT NULL
);
