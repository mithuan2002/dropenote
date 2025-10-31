import {
  type Campaign,
  type InsertCampaign,
  type Coupon,
  type InsertCoupon,
  type Redemption,
  type InsertRedemption,
} from "@shared/schema";
import { randomUUID } from "crypto";

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

export class MemStorage implements IStorage {
  private campaigns: Map<string, Campaign>;
  private coupons: Map<string, Coupon>;
  private redemptions: Map<string, Redemption>;

  // Placeholder for profile data
  private influencerProfiles: Map<string, any>;
  private staffProfiles: Map<string, any>;

  constructor() {
    this.campaigns = new Map();
    this.coupons = new Map();
    this.redemptions = new Map();
    this.influencerProfiles = new Map();
    this.staffProfiles = new Map();
  }

  // Campaign methods
  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = randomUUID();
    const campaign: Campaign = {
      ...insertCampaign,
      id,
      createdAt: new Date(),
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  // Coupon methods
  async getCoupon(id: string): Promise<Coupon | undefined> {
    return this.coupons.get(id);
  }

  async getCouponsByWCampaign(campaignId: string): Promise<Coupon[]> {
    return Array.from(this.coupons.values()).filter(
      (coupon) => coupon.campaignId === campaignId
    );
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    return Array.from(this.coupons.values()).find(
      (coupon) => coupon.code === code
    );
  }

  async createCoupon(
    insertCoupon: InsertCoupon & { code: string }
  ): Promise<Coupon> {
    const id = randomUUID();
    const coupon: Coupon = {
      ...insertCoupon,
      id,
      createdAt: new Date(),
    };
    this.coupons.set(id, coupon);
    return coupon;
  }

  // Redemption methods
  async getRedemption(couponId: string): Promise<Redemption | undefined> {
    return Array.from(this.redemptions.values()).find(
      (redemption) => redemption.couponId === couponId
    );
  }

  async createRedemption(
    insertRedemption: InsertRedemption
  ): Promise<Redemption> {
    const id = randomUUID();
    const redemption: Redemption = {
      ...insertRedemption,
      id,
      redeemedAt: new Date(),
    };
    this.redemptions.set(id, redemption);
    return redemption;
  }

  async getAllRedemptions(): Promise<Redemption[]> {
    return Array.from(this.redemptions.values());
  }

  // Profile methods
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

export const storage = new MemStorage();