alter table profiles
add column role text not null default 'student'
check (role in ('student', 'teacher'));