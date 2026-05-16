-- =============================================================================
-- Schema Refactor — 2026-05-16
-- =============================================================================
-- Sumar modificări:
--   DROP:   lesson_feedback, lesson_processed_versions, lesson_raw_versions
--   ALTER:  lesson_versions (+ lesson_id, - processed_version_id)
--           lessons (+ grade_level_id)
--           modules (+ FK category_id)
--           theory_interaction_attempts (fix user_id FK → profiles)
--   CREATE: lesson_video
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. DROP lesson_feedback
--    Înlocuit de lesson_component_feedback (structură mai completă)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS public.lesson_feedback;


-- -----------------------------------------------------------------------------
-- 2. ALTER lesson_versions
--    a) Scoatem processed_version_id (lesson_processed_versions cade)
--    b) Adăugăm lesson_id FK → lessons (conectăm la sistemul principal)
-- -----------------------------------------------------------------------------
ALTER TABLE public.lesson_versions
  DROP CONSTRAINT IF EXISTS lesson_versions_processed_version_id_fkey;

ALTER TABLE public.lesson_versions
  DROP COLUMN IF EXISTS processed_version_id;

ALTER TABLE public.lesson_versions
  ADD COLUMN lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE;


-- -----------------------------------------------------------------------------
-- 3. DROP lesson_processed_versions
--    Nu mai e intermediar — output AI merge direct în lesson_blocks
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS public.lesson_processed_versions;


-- -----------------------------------------------------------------------------
-- 4. DROP lesson_raw_versions
--    Textul din textarea se trimite direct la AI fără persistare intermediară
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS public.lesson_raw_versions;


-- -----------------------------------------------------------------------------
-- 5. ALTER lessons — adăugăm grade_level_id
--    Marchează pentru ce nivel educațional e lecția
-- -----------------------------------------------------------------------------
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS grade_level_id UUID REFERENCES public.grade_levels(id);


-- -----------------------------------------------------------------------------
-- 6. ALTER modules — adăugăm FK lipsă pe category_id
--    Era string liber fără integritate referențială
-- -----------------------------------------------------------------------------
ALTER TABLE public.modules
  DROP CONSTRAINT IF EXISTS modules_category_id_fkey;

ALTER TABLE public.modules
  ADD CONSTRAINT modules_category_id_fkey
  FOREIGN KEY (category_id) REFERENCES public.categories(id)
  NOT VALID; -- NOT VALID = nu blochează dacă există deja date orfane; validează separat

-- Validează constraint-ul pe datele existente (rulează separat dacă e slow pe prod)
-- ALTER TABLE public.modules VALIDATE CONSTRAINT modules_category_id_fkey;


-- -----------------------------------------------------------------------------
-- 7. ALTER theory_interaction_attempts — fix FK user_id
--    Era referențiat la auth.users; restul schemei folosește profiles
-- -----------------------------------------------------------------------------
ALTER TABLE public.theory_interaction_attempts
  DROP CONSTRAINT IF EXISTS theory_interaction_attempts_user_id_fkey;

ALTER TABLE public.theory_interaction_attempts
  ADD CONSTRAINT theory_interaction_attempts_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


-- -----------------------------------------------------------------------------
-- 8. CREATE lesson_video
--    Output video generat AI — parallel cu lesson_audio
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lesson_video (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id    UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  video_url    TEXT NOT NULL,
  script       JSONB NOT NULL DEFAULT '{}',
  provider     TEXT,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT lesson_video_lesson_id_key UNIQUE (lesson_id)
);

CREATE INDEX IF NOT EXISTS lesson_video_lesson_id_idx ON public.lesson_video(lesson_id);


-- -----------------------------------------------------------------------------
-- 9. FIX lesson_component_feedback — adăugăm FK-uri lipsă
--    lesson_id și user_id erau string-uri libere fără integritate referențială
--    component_id rămâne polimorfic (poate fi block_id sau interaction_id)
-- -----------------------------------------------------------------------------
ALTER TABLE public.lesson_component_feedback
  DROP CONSTRAINT IF EXISTS lesson_component_feedback_lesson_id_fkey;

ALTER TABLE public.lesson_component_feedback
  ADD CONSTRAINT lesson_component_feedback_lesson_id_fkey
  FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;

ALTER TABLE public.lesson_component_feedback
  DROP CONSTRAINT IF EXISTS lesson_component_feedback_user_id_fkey;

ALTER TABLE public.lesson_component_feedback
  ADD CONSTRAINT lesson_component_feedback_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.lesson_component_feedback
  DROP CONSTRAINT IF EXISTS lesson_component_feedback_vote_check;

ALTER TABLE public.lesson_component_feedback
  ADD CONSTRAINT lesson_component_feedback_vote_check
  CHECK (vote IN ('up', 'down'));


-- -----------------------------------------------------------------------------
-- 10. FIX lesson_authors — FK-uri lipsă + timestamp + unique constraint
--     user_id și lesson_id erau fără FK; fără created_at; fără PK composite
-- -----------------------------------------------------------------------------
ALTER TABLE public.lesson_authors
  DROP CONSTRAINT IF EXISTS lesson_authors_lesson_id_fkey;

ALTER TABLE public.lesson_authors
  ADD CONSTRAINT lesson_authors_lesson_id_fkey
  FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE;

ALTER TABLE public.lesson_authors
  DROP CONSTRAINT IF EXISTS lesson_authors_user_id_fkey;

ALTER TABLE public.lesson_authors
  ADD CONSTRAINT lesson_authors_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.lesson_authors
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.lesson_authors
  DROP CONSTRAINT IF EXISTS lesson_authors_lesson_user_unique;

ALTER TABLE public.lesson_authors
  ADD CONSTRAINT lesson_authors_lesson_user_unique UNIQUE (lesson_id, user_id);


-- -----------------------------------------------------------------------------
-- 11. FIX lesson_edit_history — FK pe editor_id
--     editor_id era string liber; dacă userul e șters, rândul rămânea orfan
--     ON DELETE SET NULL păstrează istoricul dar marchează editorul ca necunoscut
-- -----------------------------------------------------------------------------
ALTER TABLE public.lesson_edit_history
  DROP CONSTRAINT IF EXISTS lesson_edit_history_editor_id_fkey;

ALTER TABLE public.lesson_edit_history
  ADD CONSTRAINT lesson_edit_history_editor_id_fkey
  FOREIGN KEY (editor_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


-- -----------------------------------------------------------------------------
-- 12. FIX lesson_activities — CHECK constraint pe conținut
--     Previne activități fără niciun conținut asociat
-- -----------------------------------------------------------------------------
ALTER TABLE public.lesson_activities
  DROP CONSTRAINT IF EXISTS lesson_activities_has_content_check;

ALTER TABLE public.lesson_activities
  ADD CONSTRAINT lesson_activities_has_content_check
  CHECK (lesson_block_id IS NOT NULL OR theory_interaction_id IS NOT NULL)
  NOT VALID;


-- -----------------------------------------------------------------------------
-- 13. RLS — lesson_video
--     Tabelul nou trebuie să aibă aceleași politici ca lesson_audio
-- -----------------------------------------------------------------------------
ALTER TABLE public.lesson_video ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lesson_video_select_authenticated"
  ON public.lesson_video FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "lesson_video_insert_staff"
  ON public.lesson_video FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "lesson_video_update_staff"
  ON public.lesson_video FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "lesson_video_delete_admin"
  ON public.lesson_video FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
