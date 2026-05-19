ALTER TABLE public.lessons
  ADD CONSTRAINT lessons_status_check
  CHECK (status IN ('draft', 'reviewed', 'published'));
