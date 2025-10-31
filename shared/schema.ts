import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  discountPercentage: integer("discount_percentage").notNull(),
  expirationDate: timestamp("expiration_date").notNull(),
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
  purchaseAmount: integer("purchase_amount").notNull(),
  redeemedAt: timestamp("redeemed_at").notNull().defaultNow(),
});

export const insertRedemptionSchema = createInsertSchema(redemptions).omit({
  id: true,
  redeemedAt: true,
});

export type InsertRedemption = z.infer<typeof insertRedemptionSchema>;
export type Redemption = typeof redemptions.$inferSelect;
