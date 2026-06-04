ALTER TABLE lessons
  ADD COLUMN IF NOT EXISTS language text CHECK (language IN ('python', 'javascript', 'java', 'cpp'));
