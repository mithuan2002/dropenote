import {
  type Campaign,
  type InsertCampaign,
  type Coupon,
  type InsertCoupon,
  type Redemption,
  type InsertRedemption,
  type User,
  type InsertUser,
  campaigns,
  coupons,
  redemptions,
  users,
  influencerProfiles,
  staffProfiles,
} from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

class DatabaseStorage implements IStorage {
  async createUser(userData: Omit<InsertUser, 'password'> & { passwordHash: string }): Promise<User> {
    const [user] = await db.insert(users).values({
      username: userData.username,
      passwordHash: userData.passwordHash,
      role: userData.role,
    }).returning();
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getCampaigns(): Promise<Campaign[]> {
    return db.select().from(campaigns);
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign;
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [newCampaign] = await db.insert(campaigns).values(campaign).returning();
    return newCampaign;
  }

  async getCoupon(id: string): Promise<Coupon | undefined> {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.id, id));
    return coupon;
  }

  async getCouponsByWCampaign(campaignId: string): Promise<Coupon[]> {
    return db.select().from(coupons).where(eq(coupons.campaignId, campaignId));
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.code, code));
    return coupon;
  }

  async createCoupon(coupon: InsertCoupon & { code: string }): Promise<Coupon> {
    const [newCoupon] = await db.insert(coupons).values(coupon).returning();
    return newCoupon;
  }

  async getRedemption(couponId: string): Promise<Redemption | undefined> {
    const [redemption] = await db.select().from(redemptions).where(eq(redemptions.couponId, couponId));
    return redemption;
  }

  async createRedemption(redemption: InsertRedemption): Promise<Redemption> {
    const [newRedemption] = await db.insert(redemptions).values(redemption).returning();
    return newRedemption;
  }

  async getAllRedemptions(): Promise<Redemption[]> {
    return db.select().from(redemptions);
  }

  async getInfluencerProfile(userId: string): Promise<any> {
    const [profile] = await db.select().from(influencerProfiles).where(eq(influencerProfiles.userId, userId));
    return profile;
  }

  async saveInfluencerProfile(userId: string, profileData: any): Promise<any> {
    const existing = await this.getInfluencerProfile(userId);
    if (existing) {
      const [updated] = await db.update(influencerProfiles)
        .set(profileData)
        .where(eq(influencerProfiles.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(influencerProfiles)
        .values({ ...profileData, userId })
        .returning();
      return created;
    }
  }

  async updateInfluencerProfile(userId: string, data: any): Promise<any> {
    return this.saveInfluencerProfile(userId, data);
  }

  async getStaffProfile(userId: string): Promise<any> {
    const [profile] = await db.select().from(staffProfiles).where(eq(staffProfiles.userId, userId));
    return profile;
  }

  async saveStaffProfile(userId: string, profileData: any): Promise<any> {
    const existing = await this.getStaffProfile(userId);
    if (existing) {
      const [updated] = await db.update(staffProfiles)
        .set(profileData)
        .where(eq(staffProfiles.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(staffProfiles)
        .values({ ...profileData, userId })
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();