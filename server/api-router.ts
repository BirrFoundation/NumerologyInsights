import { Router } from "express";
import { storage } from "./storage";
import { generateVerificationCode, sendVerificationEmail, hashPassword } from "./email-service";
import { userAuthSchema, verificationSchema } from "@shared/schema";
import { z } from "zod";

const router = Router();

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
      password: hashPassword(data.password)
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

export default router;