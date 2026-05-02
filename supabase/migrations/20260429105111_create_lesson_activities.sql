CREATE TABLE lesson_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  lesson_id UUID NOT NULL
    REFERENCES lessons(id)
    ON DELETE CASCADE,

  type activity_type NOT NULL,

  title TEXT NOT NULL,

  position INTEGER NOT NULL,

  required BOOLEAN NOT NULL DEFAULT true,

  weight FLOAT NOT NULL
    CHECK (weight > 0 AND weight <= 1),

  created_at TIMESTAMP DEFAULT now(),

  UNIQUE (lesson_id, position)
);