import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertCampaignSchema,
  insertCouponSchema,
  insertRedemptionSchema,
} from "@shared/schema";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all campaigns
  app.get("/api/campaigns", async (_req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get campaign by ID
  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  // Create campaign
  app.post("/api/campaigns", async (req, res) => {
    try {
      // Convert expirationDate string to Date object before validation
      const data = {
        ...req.body,
        expirationDate: req.body.expirationDate ? new Date(req.body.expirationDate) : undefined,
      };
      const validatedData = insertCampaignSchema.parse(data);
      const campaign = await storage.createCampaign(validatedData);
      res.status(201).json(campaign);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create campaign" });
      }
    }
  });

  // Get campaign analytics
  app.get("/api/campaigns/:id/analytics", async (req, res) => {
    try {
      const campaignId = req.params.id;
      
      // Get all coupons for this campaign
      const coupons = await storage.getCouponsByWCampaign(campaignId);
      const totalCodes = coupons.length;

      // Get all redemptions
      const allRedemptions = await storage.getAllRedemptions();
      
      // Find redemptions for this campaign's coupons
      const couponIds = new Set(coupons.map(c => c.id));
      const campaignRedemptions = allRedemptions.filter(r => couponIds.has(r.couponId));
      
      const redeemedCodes = campaignRedemptions.length;
      const totalSales = campaignRedemptions.reduce((sum, r) => sum + r.purchaseAmount, 0);
      const redemptionRate = totalCodes > 0 
        ? Math.round((redeemedCodes / totalCodes) * 100) 
        : 0;

      res.json({
        totalCodes,
        redeemedCodes,
        totalSales,
        redemptionRate,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Influencer profile endpoints
  app.get("/api/influencer/profile", async (req, res) => {
    try {
      // For now, return a mock profile. In production, use authentication
      const profile = await storage.getInfluencerProfile("default");
      res.json(profile || {});
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/influencer/profile", async (req, res) => {
    try {
      const profile = await storage.saveInfluencerProfile("default", req.body);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to save profile" });
    }
  });

  // Staff profile endpoints
  app.get("/api/staff/profile", async (req, res) => {
    try {
      // For now, return a mock profile. In production, use authentication
      const profile = await storage.getStaffProfile("default");
      res.json(profile || {});
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/staff/profile", async (req, res) => {
    try {
      const profile = await storage.saveStaffProfile("default", req.body);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to save profile" });
    }
  });

  // Generate coupon
  app.post("/api/coupons", async (req, res) => {
    try {
      const validatedData = insertCouponSchema.parse(req.body);
      
      // Verify campaign exists and is not expired
      const campaign = await storage.getCampaign(validatedData.campaignId);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      if (new Date(campaign.expirationDate) < new Date()) {
        return res.status(400).json({ message: "Campaign has expired" });
      }

      // Generate unique coupon code
      const code = nanoid(6).toUpperCase();
      
      const coupon = await storage.createCoupon({
        ...validatedData,
        code,
      });

      res.status(201).json(coupon);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to generate coupon" });
      }
    }
  });

  // Verify coupon
  app.post("/api/coupons/verify", async (req, res) => {
    try {
      const { code } = req.body;
      
      if (!code || typeof code !== "string") {
        return res.status(400).json({
          valid: false,
          message: "Invalid request",
        });
      }

      // Find coupon by code
      const coupon = await storage.getCouponByCode(code.toUpperCase());
      
      if (!coupon) {
        return res.json({
          valid: false,
          message: "Coupon code not found",
        });
      }

      // Check if already redeemed
      const existingRedemption = await storage.getRedemption(coupon.id);
      if (existingRedemption) {
        return res.json({
          valid: false,
          message: "Coupon has already been redeemed",
        });
      }

      // Get campaign details
      const campaign = await storage.getCampaign(coupon.campaignId);
      if (!campaign) {
        return res.json({
          valid: false,
          message: "Associated campaign not found",
        });
      }

      // Check if campaign is expired
      if (new Date(campaign.expirationDate) < new Date()) {
        return res.json({
          valid: false,
          message: "Campaign has expired",
        });
      }

      res.json({
        valid: true,
        coupon,
        campaign,
        message: "Valid coupon",
      });
    } catch (error) {
      res.status(500).json({
        valid: false,
        message: "Failed to verify coupon",
      });
    }
  });

  // Redeem coupon
  app.post("/api/redemptions", async (req, res) => {
    try {
      const validatedData = insertRedemptionSchema.parse(req.body);
      
      // Check if coupon exists
      const coupon = await storage.getCoupon(validatedData.couponId);
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }

      // Check if already redeemed
      const existingRedemption = await storage.getRedemption(validatedData.couponId);
      if (existingRedemption) {
        return res.status(400).json({ message: "Coupon already redeemed" });
      }

      const redemption = await storage.createRedemption(validatedData);
      res.status(201).json(redemption);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to redeem coupon" });
      }
    }
  });

  // Get staff analytics
  app.get("/api/staff/analytics", async (req, res) => {
    try {
      const allRedemptions = await storage.getAllRedemptions();
      const totalRedemptions = allRedemptions.length;
      const totalRevenue = allRedemptions.reduce((sum, r) => sum + r.purchaseAmount, 0);
      
      // Get all campaigns to calculate active campaigns
      const allCampaigns = await storage.getCampaigns();
      const activeCampaigns = allCampaigns.filter(c => new Date(c.expirationDate) >= new Date()).length;
      
      // Get all coupons
      const allCoupons = await Promise.all(
        allCampaigns.map(c => storage.getCouponsByWCampaign(c.id))
      );
      const totalCoupons = allCoupons.reduce((sum, coupons) => sum + coupons.length, 0);

      res.json({
        totalRedemptions,
        totalRevenue,
        activeCampaigns,
        totalCoupons,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Get redemption history with details
  app.get("/api/staff/redemptions", async (req, res) => {
    try {
      const allRedemptions = await storage.getAllRedemptions();
      
      // Enrich redemptions with coupon and campaign details
      const enrichedRedemptions = await Promise.all(
        allRedemptions.map(async (redemption) => {
          const coupon = await storage.getCoupon(redemption.couponId);
          if (!coupon) return null;
          
          const campaign = await storage.getCampaign(coupon.campaignId);
          if (!campaign) return null;
          
          return {
            id: redemption.id,
            redeemedAt: redemption.redeemedAt,
            purchaseAmount: redemption.purchaseAmount,
            couponCode: coupon.code,
            customerName: coupon.followerName,
            customerWhatsApp: coupon.followerWhatsApp,
            campaignName: campaign.name,
            discountPercentage: campaign.discountPercentage,
          };
        })
      );

      // Filter out nulls and sort by date (newest first)
      const validRedemptions = enrichedRedemptions
        .filter((r): r is NonNullable<typeof r> => r !== null)
        .sort((a, b) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime());

      res.json(validRedemptions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch redemption history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
