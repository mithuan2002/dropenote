import {
  type Campaign,
  type InsertCampaign,
  type CustomerSubmission,
  type InsertCustomerSubmission,
  type User,
  type InsertUser,
  type BrandProfile,
  type InsertBrandProfile,
  type StaffProfile,
  campaigns,
  customerSubmissions,
  users,
  brandProfiles,
  staffProfiles,
} from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

interface IStorage {
  createUser(userData: Omit<InsertUser, 'password'> & { passwordHash: string }): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getCampaigns(): Promise<Campaign[]>;
  getCampaignsByUserId(userId: string): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  getCampaignBySlug(slug: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign & { userId: string }): Promise<Campaign>;
  updateCampaign(id: string, campaign: Partial<InsertCampaign>): Promise<Campaign>;
  getCustomerSubmissions(campaignId: string): Promise<CustomerSubmission[]>;
  createCustomerSubmission(submission: InsertCustomerSubmission): Promise<CustomerSubmission>;
  getBrandProfile(userId: string): Promise<BrandProfile | undefined>;
  saveBrandProfile(userId: string, profileData: Partial<InsertBrandProfile>): Promise<BrandProfile>;
  updateBrandProfile(userId: string, data: Partial<InsertBrandProfile>): Promise<BrandProfile>;
  getStaffProfile(userId: string): Promise<StaffProfile | null>;
  saveStaffProfile(userId: string, profileData: any): Promise<StaffProfile>;
}

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

  async getCampaignsByUserId(userId: string): Promise<Campaign[]> {
    return db.select().from(campaigns).where(eq(campaigns.userId, userId));
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign;
  }

  async getCampaignBySlug(slug: string): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.slug, slug));
    return campaign;
  }

  async createCampaign(campaign: InsertCampaign & { userId: string }): Promise<Campaign> {
    const [newCampaign] = await db.insert(campaigns).values(campaign).returning();
    return newCampaign;
  }

  async updateCampaign(id: string, data: Partial<InsertCampaign>): Promise<Campaign> {
    const [updated] = await db.update(campaigns)
      .set(data)
      .where(eq(campaigns.id, id))
      .returning();
    return updated;
  }

  async getCustomerSubmissions(campaignId: string): Promise<CustomerSubmission[]> {
    return db.select().from(customerSubmissions).where(eq(customerSubmissions.campaignId, campaignId));
  }

  async createCustomerSubmission(submission: InsertCustomerSubmission): Promise<CustomerSubmission> {
    const [newSubmission] = await db.insert(customerSubmissions).values(submission).returning();
    return newSubmission;
  }

  async getBrandProfile(userId: string): Promise<BrandProfile | undefined> {
    const [profile] = await db.select().from(brandProfiles).where(eq(brandProfiles.userId, userId));
    return profile;
  }

  async saveBrandProfile(userId: string, profileData: Partial<InsertBrandProfile>): Promise<BrandProfile> {
    const existing = await this.getBrandProfile(userId);
    if (existing) {
      const [updated] = await db.update(brandProfiles)
        .set({
          brandName: profileData.brandName,
          website: profileData.website,
          contactEmail: profileData.contactEmail,
          whatsappGroupLink: profileData.whatsappGroupLink,
        })
        .where(eq(brandProfiles.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(brandProfiles)
        .values({ 
          userId,
          brandName: profileData.brandName || '',
          website: profileData.website,
          contactEmail: profileData.contactEmail,
          whatsappGroupLink: profileData.whatsappGroupLink,
        })
        .returning();
      return created;
    }
  }

  async updateBrandProfile(userId: string, data: Partial<InsertBrandProfile>): Promise<BrandProfile> {
    return this.saveBrandProfile(userId, data);
  }

  async getStaffProfile(userId: string): Promise<StaffProfile | null> {
    const [profile] = await db.select().from(staffProfiles).where(eq(staffProfiles.userId, userId));
    return profile || null;
  }

  async saveStaffProfile(userId: string, profileData: any): Promise<StaffProfile> {
    const existing = await this.getStaffProfile(userId);
    if (existing) {
      const [updated] = await db.update(staffProfiles)
        .set({
          name: profileData.name,
          storeName: profileData.storeName,
          storeAddress: profileData.storeAddress,
          phone: profileData.phone,
        })
        .where(eq(staffProfiles.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(staffProfiles)
        .values({ 
          userId,
          name: profileData.name || '',
          storeName: profileData.storeName,
          storeAddress: profileData.storeAddress,
          phone: profileData.phone,
        })
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
