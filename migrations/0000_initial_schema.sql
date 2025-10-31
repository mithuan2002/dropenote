
-- Create campaigns table
CREATE TABLE IF NOT EXISTS "campaigns" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "discount_percentage" integer NOT NULL,
  "expiration_date" timestamp NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS "coupons" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "code" text NOT NULL UNIQUE,
  "campaign_id" varchar NOT NULL,
  "follower_name" text NOT NULL,
  "follower_whatsapp" text NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- Create redemptions table
CREATE TABLE IF NOT EXISTS "redemptions" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "coupon_id" varchar NOT NULL UNIQUE,
  "purchase_amount" integer NOT NULL,
  "redeemed_at" timestamp NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS "idx_coupons_campaign_id" ON "coupons" ("campaign_id");
CREATE INDEX IF NOT EXISTS "idx_coupons_code" ON "coupons" ("code");
CREATE INDEX IF NOT EXISTS "idx_redemptions_coupon_id" ON "redemptions" ("coupon_id");
