import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull(), // 'brand' or 'staff'
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["brand", "staff"]),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(), // The brand owner
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // URL slug for hosted page
  promoCode: text("promo_code").notNull(), // Single promo code for the campaign
  discountPercentage: integer("discount_percentage").notNull(),
  discountedCheckoutUrl: text("discounted_checkout_url").notNull(),
  normalCheckoutUrl: text("normal_checkout_url").notNull(),
  expirationDate: timestamp("expiration_date").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCampaignSchema = createInsertSchema(campaigns).omit({
  id: true,
  userId: true,
  createdAt: true,
}).extend({
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  promoCode: z.string().min(3).max(20),
  discountPercentage: z.number().int().min(1).max(100),
  discountedCheckoutUrl: z.string().url("Must be a valid URL"),
  normalCheckoutUrl: z.string().url("Must be a valid URL"),
});

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;

export const customerSubmissions = pgTable("customer_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  campaignId: varchar("campaign_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerWhatsApp: text("customer_whatsapp").notNull(),
  promoCodeEntered: text("promo_code_entered").notNull(),
  wasValid: boolean("was_valid").notNull(),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const insertCustomerSubmissionSchema = createInsertSchema(customerSubmissions).omit({
  id: true,
  submittedAt: true,
});

export type InsertCustomerSubmission = z.infer<typeof insertCustomerSubmissionSchema>;
export type CustomerSubmission = typeof customerSubmissions.$inferSelect;

export const brandProfiles = pgTable("brand_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  brandName: text("brand_name").notNull(),
  website: text("website"),
  contactEmail: text("contact_email"),
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

export const insertBrandProfileSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  website: z.string().url().optional().or(z.literal("")),
  contactEmail: z.string().email().optional().or(z.literal("")),
});

export type InsertBrandProfile = z.infer<typeof insertBrandProfileSchema>;
export type BrandProfile = typeof brandProfiles.$inferSelect;

// Keep staff profile schema as is
export const insertStaffProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  storeName: z.string().optional(),
  storeAddress: z.string().optional(),
  phone: z.string().optional(),
});

export type InsertStaffProfile = z.infer<typeof insertStaffProfileSchema>;
export type StaffProfile = typeof staffProfiles.$inferSelect;
