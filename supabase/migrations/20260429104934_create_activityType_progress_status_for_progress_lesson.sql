CREATE TYPE activity_type AS ENUM (
  'content',
  'quiz',
  'exercise',
  'critical_thinking'
);

CREATE TYPE progress_status AS ENUM (
  'not_started',
  'in_progress',
  'completed'
);