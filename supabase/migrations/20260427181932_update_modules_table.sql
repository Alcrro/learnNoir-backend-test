alter table modules
add column category_id uuid;

update modules m
set category_id = c.id
from categories c
where m.subject_id = c.subject_id;