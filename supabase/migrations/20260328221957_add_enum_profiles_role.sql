update profiles set role = lower(role);
alter table profiles
alter column role type user_role
using role::user_role;