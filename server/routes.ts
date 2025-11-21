import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertCampaignSchema,
  insertCustomerSubmissionSchema,
  insertUserSchema,
} from "@shared/schema";
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
      if (role === "brand") {
        await storage.saveBrandProfile(user.id, { brandName: username });
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

  // Brand profile endpoints
  app.get("/api/brand/profile", requireAuth, requireRole("brand"), async (req, res) => {
    try {
      const profile = await storage.getBrandProfile(req.session.userId!);
      res.json(profile || {});
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/brand/profile", requireAuth, requireRole("brand"), async (req, res) => {
    try {
      const { brandName, website, contactEmail } = req.body;

      await storage.updateBrandProfile(req.session.userId!, {
        brandName,
        website,
        contactEmail
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

  // Get brand's campaigns
  app.get("/api/campaigns", requireAuth, requireRole("brand"), async (req, res) => {
    try {
      const campaigns = await storage.getCampaignsByUserId(req.session.userId!);
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get campaign by ID (authenticated)
  app.get("/api/campaigns/:id", requireAuth, async (req, res) => {
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
  app.post("/api/campaigns", requireAuth, requireRole("brand"), async (req, res) => {
    try {
      const data = {
        ...req.body,
        expirationDate: req.body.expirationDate ? new Date(req.body.expirationDate) : undefined,
      };
      const validatedData = insertCampaignSchema.parse(data);
      
      // Check if slug is already taken
      const existingCampaign = await storage.getCampaignBySlug(validatedData.slug);
      if (existingCampaign) {
        return res.status(400).json({ message: "This campaign URL is already taken. Please choose a different one." });
      }
      
      const campaign = await storage.createCampaign({
        ...validatedData,
        userId: req.session.userId!,
      });
      res.status(201).json(campaign);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create campaign" });
      }
    }
  });

  // Update campaign (toggle active status, etc.)
  app.patch("/api/campaigns/:id", requireAuth, requireRole("brand"), async (req, res) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      // Verify ownership
      if (campaign.userId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized" });
      }
      
      const updated = await storage.updateCampaign(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  // PUBLIC: Get campaign by slug (for hosted campaign page)
  app.get("/api/c/:slug", async (req, res) => {
    try {
      const campaign = await storage.getCampaignBySlug(req.params.slug);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      // Don't expose userId in public response
      const { userId, ...publicCampaign } = campaign;
      res.json(publicCampaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  // PUBLIC: Submit promo code and customer info
  app.post("/api/c/:slug/submit", async (req, res) => {
    try {
      const campaign = await storage.getCampaignBySlug(req.params.slug);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      if (!campaign.isActive) {
        return res.status(400).json({ 
          valid: false, 
          message: "This campaign is no longer active" 
        });
      }

      if (new Date(campaign.expirationDate) < new Date()) {
        return res.status(400).json({ 
          valid: false, 
          message: "This campaign has expired" 
        });
      }

      const { promoCode, customerName, customerWhatsApp } = req.body;

      if (!promoCode || !customerName || !customerWhatsApp) {
        return res.status(400).json({ 
          valid: false, 
          message: "Please provide all required fields" 
        });
      }

      // Check if promo code is valid
      const isValid = promoCode.trim().toUpperCase() === campaign.promoCode.toUpperCase();

      // Save the submission
      await storage.createCustomerSubmission({
        campaignId: campaign.id,
        customerName: customerName.trim(),
        customerWhatsApp: customerWhatsApp.trim(),
        promoCodeEntered: promoCode.trim(),
        wasValid: isValid,
      });

      // Return result with appropriate checkout link
      res.json({
        valid: isValid,
        checkoutUrl: isValid ? campaign.discountedCheckoutUrl : campaign.normalCheckoutUrl,
        discountPercentage: isValid ? campaign.discountPercentage : 0,
        message: isValid 
          ? `Success! Enjoy ${campaign.discountPercentage}% off your purchase.` 
          : "Invalid promo code. Redirecting to normal checkout.",
      });
    } catch (error) {
      console.error("Submission error:", error);
      res.status(500).json({ 
        valid: false, 
        message: "Failed to process submission" 
      });
    }
  });

  // Get campaign analytics
  app.get("/api/campaigns/:id/analytics", requireAuth, requireRole("brand"), async (req, res) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      // Verify ownership
      if (campaign.userId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const submissions = await storage.getCustomerSubmissions(req.params.id);
      const totalSubmissions = submissions.length;
      const validSubmissions = submissions.filter(s => s.wasValid).length;
      const invalidSubmissions = totalSubmissions - validSubmissions;
      const successRate = totalSubmissions > 0 
        ? Math.round((validSubmissions / totalSubmissions) * 100) 
        : 0;

      res.json({
        totalSubmissions,
        validSubmissions,
        invalidSubmissions,
        successRate,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Get campaign customer submissions
  app.get("/api/campaigns/:id/submissions", requireAuth, requireRole("brand"), async (req, res) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      // Verify ownership
      if (campaign.userId !== req.session.userId) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const submissions = await storage.getCustomerSubmissions(req.params.id);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  const httpServer = createServer(app);
  setupAuthRoutes(app);

  return httpServer;
}
