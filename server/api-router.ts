import { Router } from "express";
import { storage } from "./storage";
import { calculateNumerology, calculateWeeklyForecast, calculateMonthlyForecast, reduceToSingleDigit } from "./numerology";
import { getInterpretation } from "./ai";
import { getPersonalizedCoaching } from "./ai-coach";
import { log } from "./vite";
import { userAuthSchema, verificationSchema, numerologyInputSchema, compatibilityInputSchema, dreamInputSchema } from "@shared/schema";
import { z } from "zod";
import { interpretDream } from "./dream-interpreter";
import bcrypt from "bcryptjs";

const router = Router();

// Ensure all routes in this router return JSON
router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  log(`[API Router] Handling ${req.method} ${req.path}`);
  next();
});

// Daily forecast endpoint moved from routes.ts
router.get("/daily-forecast", async (req, res) => {
  try {
    const { date, userId } = req.query;
    console.log('Daily forecast request received:', { date, userId });

    if (!date || !userId) {
      return res.status(400).json({ error: 'Date and userId are required' });
    }

    const currentDate = new Date(date as string);
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    console.log('Calculating numerology for date:', { day, month, year });

    // Calculate Personal Day Number
    const personalDayNumber = reduceToSingleDigit(day + month + year);

    // Calculate Universal Day Number (based on date only)
    const universalDayNumber = reduceToSingleDigit(day + reduceToSingleDigit(month) + reduceToSingleDigit(year));

    // Calculate Cosmic Number (combines both)
    const cosmicNumber = reduceToSingleDigit(personalDayNumber + universalDayNumber);

    let aiGuidance = {
      advice: "Focus on your inner wisdom and trust your intuition today.",
      followUpQuestions: [
        "How can you best utilize today's energies?",
        "What opportunities are presenting themselves?",
        "How can you align with today's cosmic vibrations?"
      ]
    };

    try {
      // Try to get AI coaching but use fallback if unavailable
      aiGuidance = await getPersonalizedCoaching({
        id: parseInt(userId as string),
        lifePath: personalDayNumber,
        destiny: universalDayNumber,
        birthDateNum: cosmicNumber,
        name: "Daily Forecast",
        birthdate: date as string,
        heartDesire: personalDayNumber,
        expression: universalDayNumber,
        personality: cosmicNumber,
        attribute: reduceToSingleDigit(personalDayNumber + cosmicNumber),
        userId: parseInt(userId as string),
        interpretations: {} // Add empty interpretations as required by type
      });
    } catch (error) {
      console.log('AI coaching unavailable, using fallback guidance', error);
    }

    // Generate forecast response
    const forecast = {
      personalDayNumber,
      personalDayMeaning: `Day of ${personalDayNumber === 1 ? "New Beginnings" :
        personalDayNumber === 2 ? "Cooperation" :
        personalDayNumber === 3 ? "Creative Expression" :
        personalDayNumber === 4 ? "Foundation Building" :
        personalDayNumber === 5 ? "Change and Freedom" :
        personalDayNumber === 6 ? "Harmony and Balance" :
        personalDayNumber === 7 ? "Introspection" :
        personalDayNumber === 8 ? "Power and Achievement" :
        "Completion and Universal Love"}`,
      universalDayNumber,
      universalDayMeaning: `Universal energy favors ${universalDayNumber === 1 ? "leadership and initiative" :
        universalDayNumber === 2 ? "partnership and diplomacy" :
        universalDayNumber === 3 ? "social connections and creativity" :
        universalDayNumber === 4 ? "organization and practicality" :
        universalDayNumber === 5 ? "freedom and adaptability" :
        universalDayNumber === 6 ? "responsibility and nurturing" :
        universalDayNumber === 7 ? "analysis and spirituality" :
        universalDayNumber === 8 ? "material success and power" :
        "humanitarian efforts and completion"}`,
      cosmicNumber,
      cosmicInfluence: `Cosmic vibrations suggest ${cosmicNumber === 1 ? "taking bold action" :
        cosmicNumber === 2 ? "finding balance and harmony" :
        cosmicNumber === 3 ? "expressing your authentic self" :
        cosmicNumber === 4 ? "building strong foundations" :
        cosmicNumber === 5 ? "embracing change and adventure" :
        cosmicNumber === 6 ? "nurturing relationships" :
        cosmicNumber === 7 ? "seeking inner wisdom" :
        cosmicNumber === 8 ? "manifesting abundance" :
        "completing cycles"}`,
      dailyGuidance: aiGuidance.advice,
      opportunities: aiGuidance.followUpQuestions,
      focusAreas: [
        `Harness ${personalDayNumber} energy for personal growth`,
        `Align with universal ${universalDayNumber} vibrations`,
        `Work with cosmic ${cosmicNumber} influences`,
        "Practice mindful awareness",
        "Connect with your inner wisdom"
      ]
    };

    console.log('Generated forecast:', forecast);
    res.json(forecast);
  } catch (error) {
    console.error('Error generating daily forecast:', error);
    res.status(500).json({
      error: 'Failed to generate forecast',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Weekly forecast endpoint
router.get("/weekly-forecast", async (req, res) => {
  try {
    const { date, userId } = req.query;
    console.log('Weekly forecast request received:', { date, userId });

    if (!date || !userId) {
      return res.status(400).json({ error: 'Date and userId are required' });
    }

    const startDate = new Date(date as string);
    const userIdNum = parseInt(userId as string);

    // Get the user's numerology profile
    const latestResult = await storage.getLatestNumerologyResult(userIdNum);
    if (!latestResult) {
      return res.status(404).json({ error: 'Numerology profile not found' });
    }

    // Calculate weekly forecast
    const weeklyForecast = calculateWeeklyForecast(startDate, latestResult);

    // Get AI coaching insights if available
    try {
      const aiGuidance = await getPersonalizedCoaching(latestResult);
      weeklyForecast.guidance = aiGuidance.advice;
      weeklyForecast.insights = aiGuidance.followUpQuestions;
    } catch (error) {
      console.log('AI coaching unavailable, using fallback guidance', error);
      weeklyForecast.guidance = "Focus on your weekly themes and trust your intuition.";
      weeklyForecast.insights = [
        "How can you best utilize this week's energies?",
        "What opportunities are presenting themselves?",
        "How can you prepare for the peak energy days?"
      ];
    }

    res.json(weeklyForecast);
  } catch (error) {
    console.error('Error generating weekly forecast:', error);
    res.status(500).json({
      error: 'Failed to generate weekly forecast',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Monthly forecast endpoint
router.get("/monthly-forecast", async (req, res) => {
  try {
    const { date, userId } = req.query;
    console.log('Monthly forecast request received:', { date, userId });

    if (!date || !userId) {
      return res.status(400).json({ error: 'Date and userId are required' });
    }

    const monthDate = new Date(date as string);
    const userIdNum = parseInt(userId as string);

    // Get the user's numerology profile
    const latestResult = await storage.getLatestNumerologyResult(userIdNum);
    if (!latestResult) {
      return res.status(404).json({ error: 'Numerology profile not found' });
    }

    // Calculate monthly forecast
    const monthlyForecast = calculateMonthlyForecast(monthDate, latestResult);

    // Get AI coaching insights if available
    try {
      const aiGuidance = await getPersonalizedCoaching(latestResult);
      monthlyForecast.guidance = aiGuidance.advice;
      monthlyForecast.insights = aiGuidance.followUpQuestions;
    } catch (error) {
      console.log('AI coaching unavailable, using fallback guidance', error);
      monthlyForecast.guidance = "Focus on your monthly themes and align with the universal energies.";
      monthlyForecast.insights = [
        "How can you best utilize this month's energies?",
        "What long-term opportunities are emerging?",
        "How can you prepare for the month's challenges?"
      ];
    }

    res.json(monthlyForecast);
  } catch (error) {
    console.error('Error generating monthly forecast:', error);
    res.status(500).json({
      error: 'Failed to generate monthly forecast',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
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
router.post("/auth/signup", async (req, res) => {
  try {
    const data = userAuthSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(data.email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // Create user
    const user = await storage.createUser({
      email: data.email,
      password: hashedPassword,
    });

    // Store user ID in session
    if (req.session) {
      req.session.userId = user.id;
    }

    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create account" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const data = userAuthSchema.parse(req.body);

    // Find user
    const user = await storage.getUserByEmail(data.email);
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Check password
    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Store user ID in session
    if (req.session) {
      req.session.userId = user.id;
    }

    res.json({ message: "Logged in successfully" });
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to log in" });
  }
});

router.post("/auth/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  } else {
    res.json({ message: "Logged out successfully" });
  }
});

router.get("/auth/me", async (req, res) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUserById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Don't send password in response
    const { password, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({ error: "Failed to get user data" });
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

// Dream interpretation route
router.post("/dreams/interpret", async (req, res) => {
  try {
    const data = dreamInputSchema.parse(req.body);
    console.log('Processing dream interpretation request:', data);

    const userId = req.session.userId || null;
    let userBirthdate = "2000-01-01"; // Default fallback
    let userName = "Anonymous";

    // If user is logged in, get their details
    if (userId) {
      const user = await storage.getUserByEmail(req.body.email);
      if (user) {
        const numerologyResult = await storage.getLatestNumerologyResult(userId);
        if (numerologyResult) {
          userBirthdate = numerologyResult.birthdate;
          userName = numerologyResult.name;
        }
      }
    }

    const { interpretation, numerologyFactors } = await interpretDream(
      data.description,
      data.emotions,
      data.symbols,
      userBirthdate,
      userName
    );

    // Store the dream record
    const dreamRecord = await storage.createDreamRecord({
      ...data,
      userId,
      numerologyFactors,
      interpretation
    });

    res.json(dreamRecord);
  } catch (error) {
    console.error('Dream interpretation error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Invalid input data",
        errors: error.errors
      });
      return;
    }
    res.status(500).json({
      message: "Failed to process dream interpretation"
    });
  }
});

// Fetch dream records for user
router.get("/dreams", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ message: "Please log in to view your dream records" });
    }

    const dreams = await storage.getDreamRecordsByUserId(userId);
    res.json(dreams);
  } catch (error) {
    console.error('Error fetching dream records:', error);
    res.status(500).json({
      message: "Failed to fetch dream records"
    });
  }
});

export default router;