
import {
  type Campaign,
  type InsertCampaign,
  type Coupon,
  type InsertCoupon,
  type Redemption,
  type InsertRedemption,
  campaigns,
  coupons,
  redemptions,
} from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Campaign methods
  getCampaigns(): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;

  // Coupon methods
  getCoupon(id: string): Promise<Coupon | undefined>;
  getCouponsByWCampaign(campaignId: string): Promise<Coupon[]>;
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  createCoupon(coupon: InsertCoupon & { code: string }): Promise<Coupon>;

  // Redemption methods
  getRedemption(couponId: string): Promise<Redemption | undefined>;
  createRedemption(redemption: InsertRedemption): Promise<Redemption>;
  getAllRedemptions(): Promise<Redemption[]>;

  // Profile methods
  getInfluencerProfile(userId: string): Promise<any>;
  saveInfluencerProfile(userId: string, profile: any): Promise<any>;
  getStaffProfile(userId: string): Promise<any>;
  saveStaffProfile(userId: string, profile: any): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private influencerProfiles: Map<string, any>;
  private staffProfiles: Map<string, any>;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    this.db = drizzle(pool);
    this.influencerProfiles = new Map();
    this.staffProfiles = new Map();
  }

  // Campaign methods
  async getCampaigns(): Promise<Campaign[]> {
    return await this.db.select().from(campaigns);
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    const results = await this.db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id))
      .limit(1);
    return results[0];
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const results = await this.db
      .insert(campaigns)
      .values(insertCampaign)
      .returning();
    return results[0];
  }

  // Coupon methods
  async getCoupon(id: string): Promise<Coupon | undefined> {
    const results = await this.db
      .select()
      .from(coupons)
      .where(eq(coupons.id, id))
      .limit(1);
    return results[0];
  }

  async getCouponsByWCampaign(campaignId: string): Promise<Coupon[]> {
    return await this.db
      .select()
      .from(coupons)
      .where(eq(coupons.campaignId, campaignId));
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const results = await this.db
      .select()
      .from(coupons)
      .where(eq(coupons.code, code))
      .limit(1);
    return results[0];
  }

  async createCoupon(
    insertCoupon: InsertCoupon & { code: string }
  ): Promise<Coupon> {
    const results = await this.db
      .insert(coupons)
      .values(insertCoupon)
      .returning();
    return results[0];
  }

  // Redemption methods
  async getRedemption(couponId: string): Promise<Redemption | undefined> {
    const results = await this.db
      .select()
      .from(redemptions)
      .where(eq(redemptions.couponId, couponId))
      .limit(1);
    return results[0];
  }

  async createRedemption(
    insertRedemption: InsertRedemption
  ): Promise<Redemption> {
    const results = await this.db
      .insert(redemptions)
      .values(insertRedemption)
      .returning();
    return results[0];
  }

  async getAllRedemptions(): Promise<Redemption[]> {
    return await this.db.select().from(redemptions);
  }

  // Profile methods (keeping in-memory for now as they're not in the schema)
  async getInfluencerProfile(userId: string): Promise<any> {
    return this.influencerProfiles.get(userId);
  }

  async saveInfluencerProfile(userId: string, profile: any): Promise<any> {
    this.influencerProfiles.set(userId, profile);
    return profile;
  }

  async getStaffProfile(userId: string): Promise<any> {
    return this.staffProfiles.get(userId);
  }

  async saveStaffProfile(userId: string, profile: any): Promise<any> {
    this.staffProfiles.set(userId, profile);
    return profile;
  }
}

export const storage = new DatabaseStorage();
