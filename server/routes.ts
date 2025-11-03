import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertCampaignSchema,
  insertCouponSchema,
  insertRedemptionSchema,
  insertUserSchema,
} from "@shared/schema";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";

// Authentication middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.session.role !== role) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
};

// Authentication check endpoint
function setupAuthRoutes(app: Express) {
  app.get('/api/auth/status', (req, res) => {
    if (req.session.userId) {
      res.json({
        authenticated: true,
        userId: req.session.userId,
        role: req.session.role
      });
    } else {
      res.json({ authenticated: false });
    }
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth endpoints
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, role } = insertUserSchema.parse(req.body);

      // Check if username exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        username,
        passwordHash,
        role,
      });

      // Create profile based on role
      if (role === "influencer") {
        await storage.saveInfluencerProfile(user.id, { name: username });
      } else if (role === "staff") {
        await storage.saveStaffProfile(user.id, { name: username });
      }

      // Set session
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.role = user.role;

      res.status(201).json({
        id: user.id,
        username: user.username,
        role: user.role,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to register" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.role = user.role;

      res.json({
        id: user.id,
        username: user.username,
        role: user.role,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUserById(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        username: user.username,
        role: user.role,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  // Get all campaigns
  app.get("/api/campaigns", requireAuth, async (_req, res) => {
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
  app.get("/api/influencer/profile", requireAuth, requireRole("influencer"), async (req, res) => {
    try {
      const profile = await storage.getInfluencerProfile(req.session.userId!);
      res.json(profile || {});
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/influencer/profile", requireAuth, requireRole("influencer"), async (req, res) => {
    try {
      const { name, bio, whatsappNumber, whatsappGroupLink } = req.body;

      await storage.updateInfluencerProfile(req.session.userId!, {
        name,
        bio,
        whatsappNumber,
        whatsappGroupLink
      });
      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to save profile" });
    }
  });

  // Staff profile endpoints
  app.get("/api/staff/profile", requireAuth, requireRole("staff"), async (req, res) => {
    try {
      const profile = await storage.getStaffProfile(req.session.userId!);
      // Return profile with default empty strings for missing fields
      res.json({
        name: profile?.name || "",
        storeName: profile?.storeName || "",
        storeAddress: profile?.storeAddress || "",
        phone: profile?.phone || "",
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/staff/profile", requireAuth, requireRole("staff"), async (req, res) => {
    try {
      const { name, storeName, storeAddress, phone } = req.body;
      const profile = await storage.saveStaffProfile(req.session.userId!, {
        name,
        storeName,
        storeAddress,
        phone
      });
      res.status(200).json(profile);
    } catch (error) {
      console.error("Error saving staff profile:", error);
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

  // Get top redeemers for influencer campaigns
  app.get("/api/influencer/top-redeemers", async (req, res) => {
    try {
      const allCampaigns = await storage.getCampaigns();
      const allRedemptions = await storage.getAllRedemptions();

      // Get all coupons for all campaigns
      const allCoupons: any[] = [];
      for (const campaign of allCampaigns) {
        const coupons = await storage.getCouponsByWCampaign(campaign.id);
        allCoupons.push(...coupons);
      }

      // Map coupon IDs to follower info
      const couponMap = new Map();
      allCoupons.forEach(coupon => {
        couponMap.set(coupon.id, {
          followerName: coupon.followerName,
          followerWhatsApp: coupon.followerWhatsApp,
        });
      });

      // Count redemptions per follower
      const followerRedemptions = new Map<string, {
        name: string;
        whatsapp: string;
        redemptionCount: number;
        totalSpent: number;
      }>();

      allRedemptions.forEach(redemption => {
        const follower = couponMap.get(redemption.couponId);
        if (follower) {
          const key = follower.followerWhatsApp;
          if (followerRedemptions.has(key)) {
            const existing = followerRedemptions.get(key)!;
            existing.redemptionCount++;
            existing.totalSpent += redemption.purchaseAmount;
          } else {
            followerRedemptions.set(key, {
              name: follower.followerName,
              whatsapp: follower.followerWhatsApp,
              redemptionCount: 1,
              totalSpent: redemption.purchaseAmount,
            });
          }
        }
      });

      // Convert to array and sort by redemption count
      const topRedeemers = Array.from(followerRedemptions.values())
        .sort((a, b) => b.redemptionCount - a.redemptionCount)
        .slice(0, 20); // Top 20 redeemers

      res.json(topRedeemers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top redeemers" });
    }
  });

  // Get detailed campaign follower analytics
  app.get("/api/campaigns/:id/followers", async (req, res) => {
    try {
      const campaignId = req.params.id;

      // Get all coupons for this campaign
      const coupons = await storage.getCouponsByWCampaign(campaignId);

      // Get all redemptions
      const allRedemptions = await storage.getAllRedemptions();

      // Map redemptions by coupon ID
      const redemptionMap = new Map();
      allRedemptions.forEach(redemption => {
        redemptionMap.set(redemption.couponId, redemption);
      });

      // Build follower list with redemption status
      const followers = coupons.map(coupon => {
        const redemption = redemptionMap.get(coupon.id);
        return {
          name: coupon.followerName,
          whatsapp: coupon.followerWhatsApp,
          couponCode: coupon.code,
          generatedAt: coupon.createdAt,
          redeemed: !!redemption,
          redeemedAt: redemption?.redeemedAt,
          purchaseAmount: redemption?.purchaseAmount || 0,
        };
      });

      res.json(followers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign followers" });
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

  // Get influencer performance for staff
  app.get("/api/staff/influencer-performance", async (req, res) => {
    try {
      const allCampaigns = await storage.getCampaigns();
      const allRedemptions = await storage.getAllRedemptions();

      // Calculate performance for each campaign
      const performance = await Promise.all(
        allCampaigns.map(async (campaign) => {
          const coupons = await storage.getCouponsByWCampaign(campaign.id);
          const totalCodes = coupons.length;

          // Find redemptions for this campaign's coupons
          const couponIds = new Set(coupons.map(c => c.id));
          const campaignRedemptions = allRedemptions.filter(r => couponIds.has(r.couponId));

          const redeemedCodes = campaignRedemptions.length;
          const totalSales = campaignRedemptions.reduce((sum, r) => sum + r.purchaseAmount, 0);
          const redemptionRate = totalCodes > 0
            ? Math.round((redeemedCodes / totalCodes) * 100)
            : 0;

          return {
            campaignName: campaign.name,
            totalCodes,
            redeemedCodes,
            totalSales,
            redemptionRate,
          };
        })
      );

      // Sort by total sales (highest first)
      performance.sort((a, b) => b.totalSales - a.totalSales);

      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch influencer performance" });
    }
  });

  const httpServer = createServer(app);
  // Setup authentication routes
  setupAuthRoutes(app);

  return httpServer;
}