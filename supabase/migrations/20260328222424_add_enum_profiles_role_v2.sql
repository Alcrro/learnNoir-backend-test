select column_name, data_type
from information_schema.columns
where table_name = 'profiles' and column_name = 'role';

alter table profiles
alter column role type user_role
using role::user_role;