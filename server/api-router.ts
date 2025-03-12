import { Router } from "express";
import { storage } from "./storage";
import { log } from "./vite";
import { userAuthSchema, verificationSchema, numerologyInputSchema, compatibilityInputSchema, dreamInputSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sendVerificationEmail, sendResetEmail, generateVerificationCode } from "./email-service";

const router = Router();

// Ensure all routes in this router return JSON
router.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  log(`[API Router] Handling ${req.method} ${req.path}`);
  next();
});

// Authentication Routes
router.post("/auth/signup", async (req, res) => {
  try {
    const data = userAuthSchema.parse(req.body);
    console.log('Processing signup for:', data.email);

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(data.email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // Create user first
    const user = await storage.createUser({
      email: data.email,
      password: hashedPassword,
    });

    // Generate verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // Save verification code
    await storage.createVerificationCode({
      userId: user.id,
      code,
      expiresAt
    });

    // Try to send verification email, but don't fail if it doesn't work
    let emailSent = false;
    let emailError = null;
    try {
      await sendVerificationEmail(user.email, code);
      console.log('Verification email sent successfully during signup');
      emailSent = true;
    } catch (error) {
      emailError = error instanceof Error ? error.message : "Unknown error";
      console.error('Failed to send verification email during signup:', error);
      // Log the error but continue with account creation
    }

    // Return user ID and email status
    res.status(201).json({
      message: emailSent 
        ? "Account created successfully. Please check your email for verification code."
        : `Account created but could not send verification email. Please try requesting a new code. (${emailError})`,
      userId: user.id,
      emailSent,
      emailError: emailError
    });

  } catch (error) {
    console.error("Signup error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create account" });
  }
});

router.post("/auth/resend-verification", async (req, res) => {
  try {
    if (!req.body.userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userId = parseInt(req.body.userId);
    console.log("Attempting to resend verification code for userId:", userId);

    const user = await storage.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate new verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save new verification code first
    await storage.createVerificationCode({
      userId: user.id,
      code,
      expiresAt
    });

    // Try to send the verification email
    try {
      await sendVerificationEmail(user.email, code);
      console.log('New verification code sent successfully');
      res.json({ 
        message: "New verification code sent successfully",
        emailSent: true
      });
    } catch (emailError) {
      console.error('Failed to send new verification code:', emailError);
      // Include detailed error message for debugging
      const errorMessage = emailError instanceof Error ? emailError.message : "Unknown error";
      res.status(500).json({ 
        error: "Failed to send verification code",
        message: `Email service error: ${errorMessage}. Please try again in a few minutes.`,
        emailSent: false,
        details: process.env.NODE_ENV !== 'production' ? errorMessage : undefined
      });
    }
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ 
      error: "Failed to resend verification code",
      message: error instanceof Error ? error.message : "Unknown error occurred"
    });
  }
});

router.post("/auth/verify-email", async (req, res) => {
  try {
    console.log('Received verification request:', req.body);

    if (!req.body.userId || !req.body.code) {
      return res.status(400).json({ error: "UserId and verification code are required" });
    }

    const userId = parseInt(req.body.userId);
    const code = req.body.code;

    const user = await storage.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get the latest verification code
    const verificationCode = await storage.getLatestVerificationCode(userId);
    if (!verificationCode || verificationCode.code !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    // Check if code is expired
    if (new Date() > verificationCode.expiresAt) {
      return res.status(400).json({ error: "Verification code expired" });
    }

    // Mark user as verified
    await storage.verifyUser(userId);
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Failed to verify email" });
  }
});

router.post("/auth/resend-verification", async (req, res) => {
  try {
    if (!req.body.userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userId = parseInt(req.body.userId);
    console.log("Attempting to resend verification code for userId:", userId);

    const user = await storage.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate new verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save new verification code first
    await storage.createVerificationCode({
      userId: user.id,
      code,
      expiresAt
    });

    // Try to send the verification email
    try {
      await sendVerificationEmail(user.email, code);
      console.log('New verification code sent successfully');
      res.json({ 
        message: "New verification code sent successfully",
        emailSent: true
      });
    } catch (emailError) {
      console.error('Failed to send new verification code:', emailError);
      // Include detailed error message for debugging
      const errorMessage = emailError instanceof Error ? emailError.message : "Unknown error";
      res.status(500).json({ 
        error: "Failed to send verification code",
        message: `Email service error: ${errorMessage}. Please try again in a few minutes.`,
        emailSent: false,
        details: process.env.NODE_ENV !== 'production' ? errorMessage : undefined
      });
    }
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ 
      error: "Failed to resend verification code",
      message: error instanceof Error ? error.message : "Unknown error occurred"
    });
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

    // Check if user is verified
    if (!user.verified) {
      return res.status(403).json({
        error: "Email not verified",
        userId: user.id
      });
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


// Numerology calculation helper functions
function calculateNumerology(name: string, birthdate: string) {
  // Basic numerology calculations
  const nameNumber = calculateNameNumber(name);
  const birthdateNumber = calculateBirthdateNumber(birthdate);

  return {
    lifePath: birthdateNumber,
    destiny: nameNumber,
    heartDesire: Math.floor(Math.random() * 9) + 1, // Placeholder
    expression: Math.floor(Math.random() * 9) + 1, // Placeholder
    personality: Math.floor(Math.random() * 9) + 1, // Placeholder
    attribute: Math.floor(Math.random() * 9) + 1, // Placeholder
    birthDateNum: birthdateNumber
  };
}

function calculateNameNumber(name: string): number {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  const sum = Array.from(cleanName).reduce((acc, char) => {
    return acc + (char.charCodeAt(0) - 96);
  }, 0);
  return reduceToSingleDigit(sum);
}

function calculateBirthdateNumber(birthdate: string): number {
  const dateNumbers = birthdate.split('-').map(Number);
  const sum = dateNumbers.reduce((acc, num) => acc + reduceToSingleDigit(num), 0);
  return reduceToSingleDigit(sum);
}

function reduceToSingleDigit(num: number): number {
  while (num > 9) {
    num = String(num).split('').reduce((acc, digit) => acc + Number(digit), 0);
  }
  return num;
}

async function getInterpretation(numbers: any, name: string) {
  // Placeholder interpretation
  return {
    lifePath: `Your life path number ${numbers.lifePath} indicates your journey.`,
    destiny: `Your destiny number ${numbers.destiny} reveals your potential.`,
    heartDesire: "Your heart's desire points to your inner motivation.",
    expression: "Your expression number shows how you present yourself.",
    personality: "Your personality number reflects your outer self.",
    attribute: "Your attribute number indicates natural talents.",
    birthDateNum: "Your birth date number reveals innate characteristics.",
    overview: `${name}, your numerological profile suggests a unique path.`,
    recommendations: {
      strengths: ["Adaptability", "Creativity"],
      challenges: ["Patience", "Focus"],
      growthAreas: ["Communication", "Leadership"],
      practices: ["Meditation", "Journaling"]
    },
    developmentSummary: "Focus on developing your natural strengths while addressing challenges."
  };
}

// Keep existing routes and export...

export default router;

//Helper functions -  These need to be implemented separately.
const calculateCompatibility = async (name1: string, birthdate1: string, name2: string, birthdate2: string) => {
    //Implementation for calculating compatibility.  Placeholder for now.
    return { compatibilityScore: 0.5 };
}

const calculateWeeklyForecast = async (startDate: Date, latestResult: any) => {
    //Implementation for calculating weekly forecast. Placeholder for now.
    return {
        weekNumber: startDate.getWeekNumber(),
        summary: "This is a placeholder weekly forecast.",
        dailyForecasts: [],
        guidance: "",
        insights: []
    }
}


const calculateMonthlyForecast = async (monthDate: Date, latestResult: any) => {
    //Implementation for calculating monthly forecast. Placeholder for now.
    return {
        month: monthDate.toLocaleString('default', { month: 'long' }),
        summary: "This is a placeholder monthly forecast.",
        weeklyForecasts: [],
        guidance: "",
        insights: []
    }
}

const getPersonalizedCoaching = async (numerologyResult: any, userQuery?: string) => {
    //Implementation for getting personalized coaching. Placeholder for now.
    return {
        advice: "This is placeholder personalized coaching advice.",
        followUpQuestions: ["Question 1", "Question 2"]
    }
}

const interpretDream = async (description: string, emotions: string[], symbols: string[], birthdate: string, userName: string) => {
    //Implementation for dream interpretation. Placeholder for now.
    return {
        interpretation: "This is a placeholder dream interpretation.",
        numerologyFactors: {}
    }
}


Date.prototype.getWeekNumber = function () {
    const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};