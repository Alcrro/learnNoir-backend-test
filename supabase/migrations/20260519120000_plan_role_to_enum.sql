-- =============================================================================
-- Convert text+CHECK columns to Postgres ENUM types
-- Allows Supabase CLI to generate proper TypeScript union types instead of string
-- =============================================================================

CREATE TYPE public.subscription_plan AS ENUM ('free', 'pro');
CREATE TYPE public.org_member_role   AS ENUM ('owner', 'admin', 'member');

-- -----------------------------------------------------------------------------
-- subscriptions.plan
-- -----------------------------------------------------------------------------
ALTER TABLE public.subscriptions ALTER COLUMN plan DROP DEFAULT;
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_check;
ALTER TABLE public.subscriptions
  ALTER COLUMN plan TYPE public.subscription_plan
  USING plan::public.subscription_plan;
ALTER TABLE public.subscriptions ALTER COLUMN plan SET DEFAULT 'free'::public.subscription_plan;

-- -----------------------------------------------------------------------------
-- organization_subscriptions.plan
-- -----------------------------------------------------------------------------
ALTER TABLE public.organization_subscriptions ALTER COLUMN plan DROP DEFAULT;
ALTER TABLE public.organization_subscriptions DROP CONSTRAINT IF EXISTS organization_subscriptions_plan_check;
ALTER TABLE public.organization_subscriptions
  ALTER COLUMN plan TYPE public.subscription_plan
  USING plan::public.subscription_plan;
ALTER TABLE public.organization_subscriptions ALTER COLUMN plan SET DEFAULT 'free'::public.subscription_plan;

-- -----------------------------------------------------------------------------
-- organization_members.role
-- -----------------------------------------------------------------------------
ALTER TABLE public.organization_members ALTER COLUMN role DROP DEFAULT;
ALTER TABLE public.organization_members DROP CONSTRAINT IF EXISTS organization_members_role_check;
ALTER TABLE public.organization_members
  ALTER COLUMN role TYPE public.org_member_role
  USING role::public.org_member_role;
ALTER TABLE public.organization_members ALTER COLUMN role SET DEFAULT 'member'::public.org_member_role;
