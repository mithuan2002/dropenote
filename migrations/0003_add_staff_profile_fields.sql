
-- Add additional fields to staff_profiles table
ALTER TABLE "staff_profiles" ADD COLUMN IF NOT EXISTS "store_name" text;
ALTER TABLE "staff_profiles" ADD COLUMN IF NOT EXISTS "store_address" text;
ALTER TABLE "staff_profiles" ADD COLUMN IF NOT EXISTS "phone" text;
