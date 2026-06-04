CREATE TABLE creator_subscriptions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  started_at  timestamptz NOT NULL DEFAULT now(),
  expires_at  timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

CREATE INDEX creator_subscriptions_user_id_idx ON creator_subscriptions (user_id);
