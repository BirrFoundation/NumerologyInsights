import { Router } from "express";
import { storage } from "./storage";
import { generateVerificationCode, sendVerificationEmail, hashPassword } from "./email-service";
import { userAuthSchema, verificationSchema, numerologyInputSchema, compatibilityInputSchema } from "@shared/schema";
import { z } from "zod";
import { calculateNumerology, calculateCompatibility } from "./numerology";
import { getInterpretation } from "./ai";
import { getPersonalizedCoaching } from "./ai-coach";
import { log } from "./vite";

const router = Router();

// Ensure all routes in this router return JSON
router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  log(`[API Router] Handling ${req.method} ${req.path}`);
  next();
});

// Healthz check endpoint - using z instead of k to avoid conflicts
router.get("/healthz", (_req, res) => {
  log('[API Router] Processing health check request');
  res.format({
    'application/json': () => {
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
      });
    },
    'default': () => {
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development'
      });
    }
  });
});

// Authentication Routes
router.post("/register", async (req, res) => {
  try {
    console.log('Processing registration request:', req.body);
    const data = userAuthSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(data.email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create user with hashed password
    const user = await storage.createUser({
      email: data.email,
      password: await hashPassword(data.password)
    });

    // Generate and store verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    await storage.createVerificationCode({
      userId: user.id,
      code,
      expiresAt
    });

    // Send verification email
    await sendVerificationEmail(data.email, code);

    res.status(201).json({ message: "Registration successful. Please check your email for verification code." });
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid input data", errors: error.errors });
      return;
    }
    res.status(500).json({ message: "Failed to register user" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    console.log('Processing verification request:', req.body);
    const data = verificationSchema.parse(req.body);

    const user = await storage.getUserByEmail(data.email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const verificationCode = await storage.getLatestVerificationCode(user.id);
    if (!verificationCode || verificationCode.code !== data.code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (new Date() > verificationCode.expiresAt) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    await storage.verifyUser(user.id);
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Verification error:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid input data", errors: error.errors });
      return;
    }
    res.status(500).json({ message: "Failed to verify email" });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log('Processing login request:', req.body);
    const { email, code } = verificationSchema.parse(req.body);

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const verificationCode = await storage.getLatestVerificationCode(user.id);
    if (!verificationCode || verificationCode.code !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (new Date() > verificationCode.expiresAt) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    // Create a new session
    req.session.userId = user.id;
    res.json({ message: "Logged in successfully" });
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid input data", errors: error.errors });
      return;
    }
    res.status(500).json({ message: "Failed to log in" });
  }
});

// Numerology Routes
router.post("/calculate", async (req, res) => {
  try {
    const data = numerologyInputSchema.parse(req.body);
    console.log('Received data:', data);

    const numbers = calculateNumerology(data.name, data.birthdate);
    console.log('Calculated numbers:', numbers);

    try {
      const interpretations = await getInterpretation(numbers, data.name);
      console.log('Got interpretations');

      const userId = req.session.userId || null;
      const result = await storage.createResult({
        ...data,
        ...numbers,
        interpretations,
        userId
      });

      res.json(result);
    } catch (aiError: any) {
      console.error('AI Interpretation error:', aiError);
      res.status(503).json({
        message: aiError.message || "Failed to get AI interpretation. Please try again."
      });
    }
  } catch (error) {
    console.error('Request error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Invalid input data",
        errors: error.errors
      });
      return;
    }
    res.status(500).json({
      message: "Failed to process numerology calculation"
    });
  }
});

router.post("/compatibility", async (req, res) => {
  try {
    const data = compatibilityInputSchema.parse(req.body);
    console.log('Received compatibility data:', data);

    const result = calculateCompatibility(
      data.name1,
      data.birthdate1,
      data.name2,
      data.birthdate2
    );

    res.json(result);
  } catch (error) {
    console.error('Compatibility calculation error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Invalid input data",
        errors: error.errors
      });
      return;
    }
    res.status(500).json({
      message: "Failed to calculate compatibility"
    });
  }
});

router.post("/coaching", async (req, res) => {
  try {
    if (!req.body.numerologyResult) {
      res.status(400).json({
        message: "Numerology result is required"
      });
      return;
    }

    const coaching = await getPersonalizedCoaching(
      req.body.numerologyResult,
      req.body.userQuery
    );

    res.json(coaching);
  } catch (error) {
    console.error('AI Coaching error:', error);
    res.status(503).json({
      message: "Failed to get coaching insights. Please try again."
    });
  }
});

export default router;