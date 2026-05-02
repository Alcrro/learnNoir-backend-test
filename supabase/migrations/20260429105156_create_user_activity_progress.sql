CREATE TABLE user_activity_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL
    REFERENCES auth.users(id)
    ON DELETE CASCADE,

  activity_id UUID NOT NULL
    REFERENCES lesson_activities(id)
    ON DELETE CASCADE,

  status progress_status NOT NULL DEFAULT 'not_started',

  score FLOAT
    CHECK (score >= 0 AND score <= 1),

  updated_at TIMESTAMP DEFAULT now(),

  UNIQUE (user_id, activity_id)
);