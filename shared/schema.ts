import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull(), // 'influencer' or 'staff'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["influencer", "staff"]),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  discountPercentage: integer("discount_percentage").notNull(),
  expirationDate: timestamp("expiration_date").notNull(),
  termsAndConditions: text("terms_and_conditions"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  createdAt: true,
});

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;

export const coupons = pgTable("coupons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  campaignId: varchar("campaign_id").notNull(),
  followerName: text("follower_name").notNull(),
  followerWhatsApp: text("follower_whatsapp").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCouponSchema = createInsertSchema(coupons).omit({
  id: true,
  code: true,
  createdAt: true,
});

export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type Coupon = typeof coupons.$inferSelect;

export const redemptions = pgTable("redemptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  couponId: varchar("coupon_id").notNull().unique(),
  purchaseAmount: integer("purchase_amount"),
  redeemedAt: timestamp("redeemed_at").notNull().defaultNow(),
});

export const insertRedemptionSchema = createInsertSchema(redemptions).omit({
  id: true,
  redeemedAt: true,
}).extend({
  purchaseAmount: z.number().int().positive().optional(),
});

export type InsertRedemption = z.infer<typeof insertRedemptionSchema>;
export type Redemption = typeof redemptions.$inferSelect;

// Assuming there was an influencer profile schema that needs to be modified.
// If the schema doesn't exist in the original code, it's being added here based on the intention.
// If it exists, this is where the modification would happen.
export const influencerProfiles = pgTable("influencer_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  name: text("name").notNull(),
  bio: text("bio"),
  whatsappNumber: text("whatsapp_number"),
  whatsappGroupLink: text("whatsapp_group_link"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const staffProfiles = pgTable("staff_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  name: text("name").notNull(),
  storeName: text("store_name"),
  storeAddress: text("store_address"),
  phone: text("phone"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertInfluencerProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
  whatsappNumber: z.string().optional(),
  whatsappGroupLink: z.string().optional(), // Added this field to the schema
});

export type InsertInfluencerProfile = z.infer<typeof insertInfluencerProfileSchema>;
export type InfluencerProfile = typeof influencerProfiles.$inferSelect;