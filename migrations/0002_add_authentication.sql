
-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "username" text NOT NULL UNIQUE,
  "password_hash" text NOT NULL,
  "role" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- Create staff_profiles table
CREATE TABLE IF NOT EXISTS "staff_profiles" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" varchar NOT NULL UNIQUE,
  "name" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- Add user_id to influencer_profiles
ALTER TABLE "influencer_profiles" ADD COLUMN IF NOT EXISTS "user_id" varchar UNIQUE;

-- Create indexes
CREATE INDEX IF NOT EXISTS "idx_users_username" ON "users" ("username");
CREATE INDEX IF NOT EXISTS "idx_influencer_profiles_user_id" ON "influencer_profiles" ("user_id");
CREATE INDEX IF NOT EXISTS "idx_staff_profiles_user_id" ON "staff_profiles" ("user_id");
