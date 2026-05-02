SELECT m.id, m.subject_id, c.id AS category_id, c.subject_id
FROM modules m
LEFT JOIN categories c
  ON m.subject_id = c.subject_id;

UPDATE modules m
SET category_id = c.id
FROM categories c
WHERE m.subject_id = c.subject_id;