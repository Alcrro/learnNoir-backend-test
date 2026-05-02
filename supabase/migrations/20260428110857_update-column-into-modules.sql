-- 1. Adaugă coloana corectă
ALTER TABLE modules
ADD COLUMN category_id uuid;

-- 2. (IMPORTANT) Migrare date existente
-- presupunem că ai deja legătura corectă între module și categories logic
-- aici trebuie să faci mapping manual dacă nu e clar

-- exemplu (doar dacă ai cum să deduci corect):
-- UPDATE modules m
-- SET category_id = c.id
-- FROM categories c
-- WHERE m.subject_id = c.subject_id;

-- ⚠️ Dacă nu e 1:1, trebuie să faci asta manual

-- 3. Setează NOT NULL după ce e populat
ALTER TABLE modules
ALTER COLUMN category_id SET NOT NULL;

-- 4. Adaugă foreign key
ALTER TABLE modules
ADD CONSTRAINT modules_category_id_fkey
FOREIGN KEY (category_id)
REFERENCES categories(id)
ON DELETE CASCADE;

-- 5. Șterge coloana greșită
ALTER TABLE modules
DROP COLUMN subject_id;

UPDATE modules m
SET category_id = c.id
FROM categories c
WHERE m.subject_id = c.subject_id;