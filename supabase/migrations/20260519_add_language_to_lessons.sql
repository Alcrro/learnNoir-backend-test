ALTER TABLE lessons
  ADD COLUMN language text CHECK (language IN ('python', 'javascript', 'java', 'cpp'));
