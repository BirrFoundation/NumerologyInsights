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

// Password Reset Routes
router.post("/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find user
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate reset code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save reset code
    await storage.createVerificationCode({
      userId: user.id,
      code,
      expiresAt
    });

    // Send reset email
    try {
      await sendResetEmail(user.email, code);
      res.json({
        message: "Password reset code sent successfully",
        userId: user.id,
        emailSent: true
      });
    } catch (emailError) {
      console.error('Failed to send reset code:', emailError);
      const errorMessage = emailError instanceof Error ? emailError.message : "Unknown error";
      res.status(500).json({
        error: "Failed to send reset code",
        message: `Email service error: ${errorMessage}. Please try again in a few minutes.`,
        emailSent: false
      });
    }
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ error: "Failed to process password reset request" });
  }
});

router.post("/auth/reset-password", async (req, res) => {
  try {
    const { userId, code, newPassword } = req.body;
    if (!userId || !code || !newPassword) {
      return res.status(400).json({ error: "User ID, code, and new password are required" });
    }

    // Find user
    const user = await storage.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify code
    const verificationCode = await storage.getLatestVerificationCode(userId);
    if (!verificationCode || verificationCode.code !== code) {
      return res.status(400).json({ error: "Invalid reset code" });
    }

    // Check if code is expired
    if (new Date() > verificationCode.expiresAt) {
      return res.status(400).json({ error: "Reset code expired" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await storage.updatePassword(userId, hashedPassword);

    // Invalidate reset code
    await storage.invalidateVerificationCode(userId, code);

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ error: "Failed to reset password" });
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

// Compatibility endpoint
router.post("/compatibility", async (req, res) => {
  try {
    const data = compatibilityInputSchema.parse(req.body);
    console.log('Received compatibility request:', {
      name1: data.name1,
      birthdate1: data.birthdate1,
      name2: data.name2,
      birthdate2: data.birthdate2
    });

    // Get individual numerology calculations
    const person1 = calculateNumerology(data.name1, data.birthdate1);
    const person2 = calculateNumerology(data.name2, data.birthdate2);

    // Get detailed zodiac information
    const zodiac1 = getChineseZodiacSign(data.birthdate1);
    const zodiac2 = getChineseZodiacSign(data.birthdate2);

    // Calculate zodiac compatibility
    const zodiacCompatibility = getZodiacCompatibility(zodiac1, zodiac2);

    // Calculate year difference compatibility
    const yearDiff = calculateYearDifferenceCompatibility(data.birthdate1, data.birthdate2);

    // Calculate numerology scores
    const lifePathScore = calculateNumberCompatibility(person1.lifePath, person2.lifePath);
    const expressionScore = calculateNumberCompatibility(person1.expression, person2.expression);
    const heartDesireScore = calculateNumberCompatibility(person1.heartDesire, person2.heartDesire);

    // Calculate final score with weights
    const finalScore = Math.round(
      (lifePathScore * 0.3) +           // Life Path: 30%
      (expressionScore * 0.2) +         // Expression: 20%
      (heartDesireScore * 0.2) +        // Heart's Desire: 20%
      (zodiacCompatibility.score * 0.2) + // Zodiac: 20%
      (yearDiff.score * 0.1)             // Year Cycle: 10%
    );

    // Get relationship dynamics and growth areas
    const dynamics = analyzeRelationshipDynamics(person1, person2, zodiac1.sign, zodiac2.sign, zodiacCompatibility.type);
    const growthAreas = identifyGrowthAreas(person1, person2, zodiac1.sign, zodiac2.sign, zodiacCompatibility.type);

    const result = {
      score: finalScore,
      lifePathScore,
      expressionScore,
      heartDesireScore,
      zodiacCompatibility: {
        person1: `${zodiac1.sign} (${zodiac1.element}, ${zodiac1.yinYang})`,
        person2: `${zodiac2.sign} (${zodiac2.element}, ${zodiac2.yinYang})`,
        score: zodiacCompatibility.score,
        description: zodiacCompatibility.description,
        dynamic: zodiacCompatibility.dynamic
      },
      yearDifference: yearDiff,
      aspects: [
        ...generateCompatibilityAspects(person1, person2),
        `${data.name1} is a ${zodiac1.sign} (${zodiac1.element} energy, ${zodiac1.yinYang} polarity)`,
        `${data.name2} is a ${zodiac2.sign} (${zodiac2.element} energy, ${zodiac2.yinYang} polarity)`,
        zodiacCompatibility.description
      ],
      dynamics,
      growthAreas,
      relationshipTypes: calculateRelationshipTypeScores(person1, person2)
    };

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

function getDailyGuidanceQuestions(personalDayNumber: number, universalDayNumber: number, cosmicNumber: number): string[] {
  const personalQualities = {
    1: ["leadership", "independence", "initiative"],
    2: ["cooperation", "harmony", "diplomacy"],
    3: ["creativity", "expression", "joy"],
    4: ["organization", "stability", "practicality"],
    5: ["change", "freedom", "adventure"],
    6: ["responsibility", "nurturing", "balance"],
    7: ["wisdom", "analysis", "spirituality"],
    8: ["power", "abundance", "achievement"],
    9: ["compassion", "completion", "universal love"]
  };

  const personalEnergy = personalQualities[personalDayNumber] || personalQualities[1];
  const universalEnergy = personalQualities[universalDayNumber] || personalQualities[1];
  const cosmicEnergy = personalQualities[cosmicNumber] || personalQualities[1];

  return [
    `How can you embody ${personalEnergy[0]} while maintaining ${personalEnergy[1]} in your interactions today?`,
    `What opportunities might arise to express ${universalEnergy[0]} and cultivate ${universalEnergy[1]} in your environment?`,
    `How can you balance your need for ${personalEnergy[2]} with the universal energy of ${universalEnergy[2]}?`,
    `In what ways can you use today's ${cosmicEnergy[0]} energy to enhance your personal growth?`,
    `What practical steps can you take to align your actions with the day's ${cosmicEnergy[1]} vibration?`
  ];
}

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

    // Generate personalized guidance questions
    const guidanceQuestions = getDailyGuidanceQuestions(personalDayNumber, universalDayNumber, cosmicNumber);

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
      dailyGuidance: `Focus on ${personalDayNumber === 1 ? "initiating new projects and showing leadership" :
        personalDayNumber === 2 ? "cooperation and finding harmony in relationships" :
        personalDayNumber === 3 ? "creative self-expression and joyful communication" :
        personalDayNumber === 4 ? "building solid foundations and staying organized" :
        personalDayNumber === 5 ? "embracing change and seeking adventure" :
        personalDayNumber === 6 ? "nurturing relationships and taking responsibility" :
        personalDayNumber === 7 ? "inner reflection and spiritual growth" :
        personalDayNumber === 8 ? "pursuing goals and manifesting abundance" :
        "completion and letting go of what no longer serves you"}`,
      opportunities: guidanceQuestions,
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
      weeklyForecast.insights = aiGuidance.suggestions;
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
      monthlyForecast.insights = aiGuidance.suggestions;
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
  const [year, month, day] = birthdate.split('-').map(Number);

  // Calculate Life Path (sum of all birth date numbers)
  const lifePath = reduceToSingleDigit(
    reduceToSingleDigit(year) +
    reduceToSingleDigit(month) +
    reduceToSingleDigit(day)
  );

  // Calculate Name Numbers
  const nameNumber = calculateNameNumber(name);
  const heartDesire = calculateHeartDesire(name);
  const expression = calculateExpression(name);
  const personality = calculatePersonality(name);

  // Calculate Attribute (birth month + birth date)
  const attribute = reduceToSingleDigit(month + day);

  return {
    lifePath,
    destiny: nameNumber,
    heartDesire,
    expression,
    personality,
    attribute,
    birthDateNum: reduceToSingleDigit(day)
  };
}

function calculateNameNumber(name: string): number {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  const sum = Array.from(cleanName).reduce((acc, char) => {
    return acc + (char.charCodeAt(0) - 96); // a=1, b=2, etc.
  }, 0);
  return reduceToSingleDigit(sum);
}

function calculateHeartDesire(name: string): number {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  const sum = Array.from(cleanName).reduce((acc, char) => {
    // Sum only vowels
    return 'aeiou'.includes(char) ? acc + (char.charCodeAt(0) - 96) : acc;
  }, 0);
  return reduceToSingleDigit(sum);
}

function calculateExpression(name: string): number {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  const sum = Array.from(cleanName).reduce((acc, char) => {
    // Sum only consonants
    return !'aeiou'.includes(char) ? acc + (char.charCodeAt(0) - 96) : acc;
  }, 0);
  return reduceToSingleDigit(sum);
}

function calculatePersonality(name: string): number {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  if (cleanName.length === 0) return 0;

  // Only sum consonants (non-vowels)
  const sum = Array.from(cleanName).reduce((acc, char) => {
    // Skip vowels
    if (!'aeiou'.includes(char)) {
      return acc + (char.charCodeAt(0) - 96); // a=1, b=2, etc.
    }
    return acc;
  }, 0);

  return reduceToSingleDigit(sum);
}

function reduceToSingleDigit(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num; // Master numbers
  while (num > 9) {
    num = String(num).split('').reduce((acc, digit) => acc + Number(digit), 0);
  }
  return num;
}

// Add the getInterpretation function back
async function getInterpretation(numbers: any, name: string) {
  // Mapping for Life Path interpretations
  const lifePathMeanings = {
    1: "Leadership and independence",
    2: "Cooperation and harmony",
    3: "Creativeexpression and joy",
    4: "Stability andhard work",
    5: "Freedom and adventure",
    6:"Nurturing andresponsibility",
    7: "Analysis and wisdom",
    8: "Power and abundance",
    9: "Humanitarian and compassionate",
    11: "Spiritual messenger",
    22: "Master builder",
    33: "Master teacher"
  };

  // Get the base number for numbers > 9 that aren't master numbers
  const getBaseNumber = (num: number) => {
    if (num === 11 || num === 22 || num === 33) return num;
    return num % 9 || 9;
  };

  return {
    lifePath: `Your Life Path number ${numbers.lifePath} indicates ${lifePathMeanings[getBaseNumber(numbers.lifePath)]}. This is your primary life purpose andthe path you're meant to follow.`,
    destiny: `Your Destiny number ${numbers.destiny} reveals yourpotential and the talents you possess to achieveyour goals. It represents your capacity for achievement.`,
    heartDesire: `Your Heart's Desire number ${numbers.heartDesire} shows your inner motivation and what truly drives you. It represents your emotional needs and deepest desires.`,
    expression: `Your Expression number ${numbers.expression} reflects how you present yourself to theworld. It shows your natural abilities and how you express yourself.`,
    personality: `Your Personality number ${numbers.personality} represents how others see you initially. It's your outer personality and first impression.`,
    attribute: `Your Attribute number ${numbers.attribute} (calculated from your birth month ${numbers.birthDateNum}) indicates your innate talents and natural abilities.`,
    birthDateNum: `Your Birth Day number ${numbers.birthDateNum} reveals specific talents and abilities you brought into this life.`,
    overview: `${name}, your numerological profile combines several powerful numbers that create your unique energetic signature. Your Life Path ${numbers.lifePath} and Destiny ${numbers.destiny} numbers work together to shape your journey.`,
    recommendations: {
      strengths: [
        "Natural " + lifePathMeanings[getBaseNumber(numbers.lifePath)].toLowerCase(),
        "Strong " + lifePathMeanings[getBaseNumber(numbers.destiny)].toLowerCase(),
        "Inner " + lifePathMeanings[getBaseNumber(numbers.heartDesire)].toLowerCase()
      ],
      challenges: [
        "Balancing material and spiritual aspects",
        "Managing expectations",
        "Maintaining focus on goals"
      ],
      growthAreas: [
        "Developing patience",
        "Strengthening communication",
        "Building confidence"
      ],
      practices: [
        "Daily meditation or reflection",
        "Journaling your experiences",
        "Setting clear intentions",
        "Regular exercise for energy balance"
      ]
    },
    developmentSummary: `Focus on developing your ${lifePathMeanings[getBaseNumber(numbers.lifePath)].toLowerCase()} while nurturing your inner ${lifePathMeanings[getBaseNumber(numbers.heartDesire)].toLowerCase()}. Your path to success lies in embracing your ${lifePathMeanings[getBaseNumber(numbers.destiny)].toLowerCase()}.`
  };
}

// Helper functions -  These need to be implemented separately.
const calculateCompatibility = (name1: string, birthdate1: string, name2: string, birthdate2: string) => {
  // Calculate individual numerology numbersfor both people
  const person1 = calculateNumerology(name1, birthdate1);
  const person2 = calculateNumerology(name2, birthdate2);

  // Calculate compatibility scores
  const lifePathScore = calculateNumberCompatibility(person1.lifePath, person2.lifePath);
  const expressionScore = calculateNumberCompatibility(person1.expression, person2.expression);
  const heartDesireScore = calculateNumberCompatibility(person1.heartDesire, person2.heartDesire);

  // Calculate overall score
  const score = Math.round((lifePathScore + expressionScore + heartDesireScore) / 3);

  // Generate compatibility aspects
  const aspects = generateCompatibilityAspects(person1, person2);

  // Calculate relationship type scores and insights
  const relationshipTypes = {
    work: calculateWorkCompatibility(person1, person2),
    business: calculateBusinessCompatibility(person1, person2),
    friendship: calculateFriendshipCompatibility(person1, person2),
    family: calculateFamilyCompatibility(person1, person2)
  };

  return {
    score,
    lifePathScore,
    expressionScore,
    heartDesireScore,
    aspects,
    dynamics: generateDynamics(person1, person2),
    growthAreas: generateGrowthAreas(person1, person2),
    relationshipTypes
  };
};

// Helper functions for compatibility calculations
function calculateNumberCompatibility(num1: number, num2: number): number {
  console.log('Calculating number compatibility:', { num1, num2 });

  // Special case for master numbers
  if ((num1 === 11 || num1 === 22 || num1 === 33) &&
    (num2 === 11 || num2 === 22 || num2 === 33)) {
    console.log('Master numbers detected, returning 100%');
    return 100;
  }

  // Reduce to single digits if not master numbers
  const n1 = (num1 === 11 || num1 === 22 || num1 === 33) ? num1 : reduceToSingleDigit(num1);
  const n2 = (num2 === 11 || num2 === 22 || num2 === 33) ? num2 : reduceToSingleDigit(num2);

  console.log('Reduced numbers:', { n1, n2 });

  // Calculate base compatibility
  const diff = Math.abs(n1 - n2);
  let score = 50;

  if (diff === 0) score = 100;
  else if (diff === 1 || diff === 8) score = 90;
  else if (diff === 2 || diff === 7) score = 80;
  else if (diff === 3 || diff === 6) score = 70;
  else if (diff === 4 || diff === 5) score = 60;

  console.log('Compatibility score:', { diff, score });
  return score;
}

function generateCompatibilityAspects(person1: any, person2: any): string[] {
  const aspects = [];

  // Life Path compatibility insights
  if (person1.lifePath === person2.lifePath) {
    aspects.push("You share the same life path, creating a deep understanding of each other's purpose");
  }

  // Expression number insights
  if (calculateNumberCompatibility(person1.expression, person2.expression) >= 80) {
    aspects.push("Your expression numbers are highly compatible, facilitating excellent communication");
  }

  // Heart's Desire insights
  if (calculateNumberCompatibility(person1.heartDesire, person2.heartDesire) >= 80) {
    aspects.push("Your heart's desires align well, indicating strong emotional compatibility");
  }

  // Add general aspects
  aspects.push("You both bring unique strengths that complement each other");
  aspects.push("There's potential for significant personal growth through this connection");

  return aspects;
}

function generateDynamics(person1: any, person2: any): string[] {
  return [
    "You have a natural ability to understand each other's perspectives",
    "Your connection promotes mutual growth and development",
    "You can create a balanced and harmonious relationship",
    "There's potential for long-term stability and growth"
  ];
}

function generateGrowthAreas(person1: any, person2: any): string[] {
  return [
    "Develop better communication patterns",
    "Work on understanding each other's emotional needs",
    "Focus on building trust and mutual respect",
    "Learn to appreciate your differences"
  ];
}

function calculateWorkCompatibility(person1: any, person2: any) {
  const score = Math.round(
    (calculateNumberCompatibility(person1.expression, person2.expression) +
      calculateNumberCompatibility(person1.lifePath, person2.lifePath)) / 2
  );

  return {
    score,
    strengths: [
      "Complementary work styles",
      "Shared professional values",
      "Effective communication",
    ],
    challenges: [
      "Different approaches to problem-solving",
      "Balancing individual and shared goals",
      "Maintaining professional boundaries"
    ]
  };
}

function calculateBusinessCompatibility(person1: any, person2: any) {
  const score = Math.round(
    (calculateNumberCompatibility(person1.lifePath, person2.lifePath) +
      calculateNumberCompatibility(person1.attribute, person2.attribute)) / 2
  );

  return {
    score,
    strengths: [
      "Combined business acumen",
      "Shared vision for success",
      "Complementary skills"
    ],
    challenges: [
      "Different risk tolerances",
      "Varying business priorities",
      "Decision-making styles"
    ]
  };
}

function calculateFriendshipCompatibility(person1: any, person2: any) {
  const score = Math.round(
    (calculateNumberCompatibility(person1.heartDesire, person2.heartDesire) +
      calculateNumberCompatibility(person1.personality, person2.personality)) / 2
  );

  return {
    score,
    strengths: [
      "Natural understanding",
      "Mutual support",
      "Shared interests"
    ],
    challenges: [
      "Respecting boundaries",
      "Managing expectations",
      "Balancing social needs"
    ]
  };
}

function calculateFamilyCompatibility(person1: any, person2: any) {
  const score = Math.round(
    (calculateNumberCompatibility(person1.heartDesire, person2.heartDesire) +
      calculateNumberCompatibility(person1.expression, person2.expression)) / 2
  );

  return {
    score,
    strengths: [
      "Deep emotional connection",
      "Strong family values",
      "Lasting bond"
    ],
    challenges: [
      "Managing family dynamics",
      "Balancing independence",
      "Addressing emotional needs"
    ]
  };
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
  const lifePathMeaning = getLifePathMeaning(numerologyResult.lifePath);
  const destinyMeaning = getLifePathMeaning(numerologyResult.destiny);
  const heartDesireMeaning = getLifePathMeaning(numerologyResult.heartDesire);

  return {
    advice: `Focus on developing your ${lifePathMeaning.toLowerCase()} qualities while working towards your destiny of ${destinyMeaning.toLowerCase()}. Your unique numerological profile suggests a path of personal growth through conscious self-development.`,
    suggestions: [
      `Practice ${lifePathMeaning.toLowerCase()} through daily mindfulness and intentional actions`,
      `Strengthen your ${destinyMeaning.toLowerCase()} qualities in your career and personal projects`,
      `Cultivate ${heartDesireMeaning.toLowerCase()} in your relationships and personal endeavors`,
      `Consider joining groups or communities that value ${lifePathMeaning.toLowerCase()}`,
      `Create a daily practice that aligns with your destiny of ${destinyMeaning.toLowerCase()}`
    ]
  };
};

function getLifePathMeaning(number: number): string {
  const meanings = {
    1: "Leadership and independence",
    2: "Cooperation and harmony",
    3: "Creative expression and joy",
    4: "Stability and hard work",
    5: "Freedom and adventure",
    6: "Nurturing and responsibility",
    7: "Analysis and wisdom",
    8: "Power and abundance",
    9: "Humanitarian and compassionate",
    11: "Spiritual messenger",
    22: "Master builder",
    33: "Master teacher"
  };

  // Handle master numbers
  if ([11, 22, 33].includes(number)) {
    return meanings[number];
  }

  // Reduce to single digit if not a master number
  const reduced = number % 9 || 9;
  return meanings[reduced];
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

//New functions for zodiac compatibility
function getChineseZodiacSign(birthdate: string): { sign: string, element: string, yinYang: string } {
  const year = parseInt(birthdate.split('-')[0]);
  const zodiacs = [
    { sign: 'Rat', element: 'Water', yinYang: 'Yang' },
    { sign: 'Ox', element: 'Earth', yinYang: 'Yin' },
    { sign: 'Tiger', element: 'Wood', yinYang: 'Yang' },
    { sign: 'Rabbit', element: 'Wood', yinYang: 'Yin' },
    { sign: 'Dragon', element: 'Earth', yinYang: 'Yang' },
    { sign: 'Snake', element: 'Fire', yinYang: 'Yin' },
    { sign: 'Horse', element: 'Fire', yinYang: 'Yang' },
    { sign: 'Sheep', element: 'Earth', yinYang: 'Yin' },
    { sign: 'Monkey', element: 'Metal', yinYang: 'Yang' },
    { sign: 'Rooster', element: 'Metal', yinYang: 'Yin' },
    { sign: 'Dog', element: 'Earth', yinYang: 'Yang' },
    { sign: 'Pig', element: 'Water', yinYang: 'Yin' }
  ];
  return zodiacs[(year - 4) % 12];
}

function getZodiacCompatibility(sign1: { sign: string, element: string, yinYang: string }, sign2: { sign: string, element: string, yinYang: string }): { score: number; description: string; dynamic: string; type: string } {
  const compatibilityMap: Record<string, Record<string, { type: string, score: number }>> = {
    'Ox': {
      'Ox': { type: 'Average', score: 70 },
      'Tiger': { type: 'Worst Couple', score: 35 },
      'Rabbit': { type: 'Bento Buddies', score: 65 },
      'Dragon': { type: 'Worst Couple', score: 35 },
      'Snake': { type: 'Bento Buddies', score: 65 },
      'Horse': { type: 'Worst Couple', score: 35 },
      'Sheep': { type: 'Worst Couple', score: 35 },
      'Monkey': { type: 'Perfect Match', score: 95 },
      'Rooster': { type: 'Perfect Match', score: 95 },
      'Dog': { type: 'Bento Buddies', score: 65 },
      'Pig': { type: 'Good Match', score: 80 },
      'Rat': { type: 'Perfect Match', score: 95 }
    },
    'Tiger': {
      'Ox': { type: 'Worst Couple', score: 35 },
      'Tiger': { type: 'Worst Couple', score: 35 },
      'Rabbit': { type: 'Average', score: 70 },
      'Dragon': { type: 'Perfect Match', score: 95 },
      'Snake': { type: 'Worst Couple', score: 35 },
      'Horse': { type: 'Perfect Match', score: 95 },
      'Sheep': { type: 'Good Friend', score: 80 },
      'Monkey': { type: 'Worst Couple', score: 35 },
      'Rooster': { type: 'Bento Buddies', score: 65 },
      'Dog': { type: 'Bento Buddies', score: 65 },
      'Pig': { type: 'Perfect Match', score: 95 },
      'Rat': { type: 'Average', score: 70 }
    },
    'Rabbit': {
      'Ox': { type: 'Bento Buddies', score: 65 },
      'Tiger': { type: 'Average', score: 70 },
      'Rabbit': { type: 'Average', score: 70 },
      'Dragon': { type: 'Average', score: 70 },
      'Snake': { type: 'Worst Couple', score: 35 },
      'Horse': { type: 'Average', score: 70 },
      'Sheep': { type: 'Perfect Match', score: 95 },
      'Monkey': { type: 'Perfect Match', score: 95 },
      'Rooster': { type: 'Worst Couple', score: 35 },
      'Dog': { type: 'Perfect Match', score: 95 },
      'Pig': { type: 'Perfect Match', score: 95 },
      'Rat': { type: 'Perfect Match', score: 95 }
    },
    'Dragon': {
      'Ox': { type: 'Worst Couple', score: 35 },
      'Tiger': { type: 'Perfect Match', score: 95 },
      'Rabbit': { type: 'Average', score: 70 },
      'Dragon': { type: 'Good Friend', score: 80 },
      'Snake': { type: 'Perfect Match', score: 95 },
      'Horse': { type: 'Average', score: 70 },
      'Sheep': { type: 'Worst Couple', score: 35 },
      'Monkey': { type: 'Bento Buddies', score: 65 },
      'Rooster': { type: 'Bento Buddies', score: 65 },
      'Dog': { type: 'Worst Couple', score: 35 },
      'Pig': { type: 'Average', score: 70 },
      'Rat': { type: 'Perfect Match', score: 95 }
    },
    'Snake': {
      'Ox': { type: 'Bento Buddies', score: 65 },
      'Tiger': { type: 'Worst Couple', score: 35 },
      'Rabbit': { type: 'Worst Couple', score: 35 },
      'Dragon': { type: 'Perfect Match', score: 95 },
      'Snake': { type: 'Worst Couple', score: 35 },
      'Horse': { type: 'Good Friend', score: 80 },
      'Sheep': { type: 'Worst Couple', score: 35 },
      'Monkey': { type: 'Good Friend', score: 80 },
      'Rooster': { type: 'Perfect Match', score: 95 },
      'Dog': { type: 'Average', score: 70 },
      'Pig': { type: 'Worst Couple', score: 35 },
      'Rat': { type: 'Good Friend', score: 80 }
    },
    'Horse': {
      'Ox': { type: 'Worst Couple', score: 35 },
      'Tiger': { type: 'Perfect Match', score: 95 },
      'Rabbit': { type: 'Average', score: 70 },
      'Dragon': { type: 'Average', score: 70 },
      'Snake': { type: 'Good Friend', score: 80 },
      'Horse': { type: 'Worst Couple', score: 35 },
      'Sheep': { type: 'Perfect Match', score: 95 },
      'Monkey': { type: 'Average', score: 70 },
      'Rooster': { type: 'Worst Couple', score: 35 },
      'Dog': { type: 'Average', score: 70 },
      'Pig': { type: 'Bento Buddies', score: 65 },
      'Rat': { type: 'Worst Couple', score: 35 }
    },
    'Sheep': {
      'Ox': { type: 'Worst Couple', score: 35 },
      'Tiger': { type: 'Good Friend', score: 80 },
      'Rabbit': { type: 'Perfect Match', score: 95 },
      'Dragon': { type: 'Worst Couple', score: 35 },
      'Snake': { type: 'Worst Couple', score: 35 },
      'Horse': { type: 'Perfect Match', score: 95 },
      'Sheep': { type: 'Bento Buddies', score: 65 },
      'Monkey': { type: 'Bento Buddies', score: 65 },
      'Rooster': { type: 'Average', score: 70 },
      'Dog': { type: 'Worst Couple', score: 35 },
      'Pig': { type: 'Perfect Match', score: 95 },
      'Rat': { type: 'Good Match or Enemy', score: 50 }
    },
    'Monkey': {
      'Ox': { type: 'Perfect Match', score: 95 },
      'Tiger': { type: 'Worst Couple', score: 35 },
      'Rabbit': { type: 'Perfect Match', score: 95 },
      'Dragon': { type: 'Bento Buddies', score: 65 },
      'Snake': { type: 'Good Friend', score: 80 },
      'Horse': { type: 'Average', score: 70 },
      'Sheep': { type: 'Bento Buddies', score: 65 },
      'Monkey': { type: 'Good Friend', score: 80 },
      'Rooster': { type: 'Average', score: 70 },
      'Dog': { type: 'Bento Buddies', score: 65 },
      'Pig': { type: 'Worst Couple', score: 35 },
      'Rat': { type: 'Perfect Match', score: 95 }
    },
    'Rooster': {
      'Ox': { type: 'Perfect Match', score: 95 },
      'Tiger': { type: 'Bento Buddies', score: 65 },
      'Rabbit': { type: 'Worst Couple', score: 35 },
      'Dragon': { type: 'Bento Buddies', score: 65 },
      'Snake': { type: 'Perfect Match', score: 95 },
      'Horse': { type: 'Worst Couple', score: 35 },
      'Sheep': { type: 'Average', score: 70 },
      'Monkey': { type: 'Average', score: 70 },
      'Rooster': { type: 'Worst Couple', score: 35 },
      'Dog': { type: 'Worst Couple', score: 35 },
      'Pig': { type: 'Average', score: 70 },
      'Rat': { type: 'Worst Couple', score: 35 }
    },
    'Dog': {
      'Ox': { type: 'Bento Buddies', score: 65 },
      'Tiger': { type: 'Bento Buddies', score: 65 },
      'Rabbit': { type: 'Perfect Match', score: 95 },
      'Dragon': { type: 'Worst Couple', score: 35 },
      'Snake': { type: 'Average', score: 70 },
      'Horse': { type: 'Average', score: 70 },
      'Sheep': { type: 'Worst Couple', score: 35 },
      'Monkey': { type: 'Bento Buddies', score: 65 },
      'Rooster': { type: 'Worst Couple', score: 35 },
      'Dog': { type: 'Average', score: 70 },
      'Pig': { type: 'Bento Buddies', score: 65 },
      'Rat': { type: 'Bento Buddies', score: 65 }
    },
    'Pig': {
      'Ox': { type: 'Good Match', score: 80 },
      'Tiger': { type: 'Perfect Match', score: 95 },
      'Rabbit': { type: 'Perfect Match', score: 95 },
      'Dragon': { type: 'Average', score: 70 },
      'Snake': { type: 'Worst Couple', score: 35 },
      'Horse': { type: 'Bento Buddies', score: 65 },
      'Sheep': { type: 'Perfect Match', score: 95 },
      'Monkey': { type: 'Worst Couple', score: 35 },
      'Rooster': { type: 'Average', score: 70 },
      'Dog': { type: 'Bento Buddies', score: 65 },
      'Pig': { type: 'Good Friend', score: 80 },
      'Rat': { type: 'Bento Buddies', score: 65 }
    },
    'Rat': {
      'Ox': { type: 'Perfect Match', score: 95 },
      'Tiger': { type: 'Average', score: 70 },
      'Rabbit': { type: 'Perfect Match', score: 95 },
      'Dragon': { type: 'Perfect Match', score: 95 },
      'Snake': { type: 'Good Friend', score: 80 },
      'Horse': { type: 'Worst Couple', score: 35 },
      'Sheep': { type: 'Good Match or Enemy', score: 50 },
      'Monkey': { type: 'Perfect Match', score: 95 },
      'Rooster': { type: 'Worst Couple', score: 35 },
      'Dog': { type: 'Bento Buddies', score: 65 },
      'Pig': { type: 'Bento Buddies', score: 65 },
      'Rat': { type: 'Average', score: 70 }
    }
  };

  // Get compatibility type and score
  const getCompatibilityInfo = (sign1: string, sign2: string): { type: string, score: number } => {
    return compatibilityMap[sign1]?.[sign2] || compatibilityMap[sign2]?.[sign1] || { type: 'Average', score: 70 };
  };

  const compatibility = getCompatibilityInfo(sign1.sign, sign2.sign);

  // Generate description based on compatibility type
  const getDescription = (type: string, sign1: string, sign2: string): string => {
    switch (type) {
      case 'Perfect Match':
        return `${sign1} and ${sign2} form a Perfect Match! This combination promises deep harmony and understanding.`;
      case 'Good Match':
        return `${sign1} and ${sign2} make a Good Match, with strong potential for a fulfilling relationship.`;
      case 'Good Friend':
        return `${sign1} and ${sign2} are naturally Good Friends, sharing mutual understanding and respect.`;
      case 'Bento Buddies':
        return `${sign1} and ${sign2} are Bento Buddies - they can maintain a friendly connection with good communication.`;
      case 'Average':
        return `${sign1} and ${sign2} have an Average compatibility - success requires effort and understanding.`;
      case 'Worst Couple':
        return `${sign1} and ${sign2} face significant challenges as a Worst Couple match - careful consideration is needed.`;
      case 'Good Match or Enemy':
        return `${sign1} and ${sign2} have a complex dynamic that could be either very positive or challenging.`;
      default:
        return `${sign1} and ${sign2} have a unique relationship dynamic that requires understanding.`;
    }
  };

  return {
    score: compatibility.score,
    type: compatibility.type,
    description: getDescription(compatibility.type, sign1.sign, sign2.sign),
    dynamic: `This ${compatibility.type.toLowerCase()} relationship combines ${sign1.element} and ${sign2.element} energies with ${sign1.yinYang} and ${sign2.yinYang} forces.`
  };
}

function calculateYearDifferenceCompatibility(birthdate1: string, birthdate2: string): { score: number; description: string } {
  const date1 = new Date(birthdate1);
  const date2 = new Date(birthdate2);
  const diff = Math.abs(date1.getFullYear() - date2.getFullYear());
  let score = 100 - Math.min(diff, 10) * 10; //Simple example; adjust as needed
  const description = `The age difference might affect compatibility. The difference is ${diff} years`;
  return { score, description };
}

function analyzeRelationshipDynamics(person1: any, person2: any, zodiac1: string, zodiac2: string, compatibility: string): string[] {
  const dynamics = {
    'Perfect Match': {
      'Dragon-Rat': [
        "Natural leadership dynamic with Dragon's strength and Rat's wisdom",
        "Strong intellectual connection and shared ambitions",
        "Mutual support in career and personal growth"
      ],
      'Dragon-Tiger': [
        "Powerful alliance of strong personalities",
        "Shared love for adventure and challenges",
        "Natural understanding of each other's independence"
      ],
      'Dragon-Snake': [
        "Deep intuitive understanding between both signs",
        "Complementary strengths in decision making",
        "Strong emotional and intellectual bond"
      ]
    },
    'Worst Couple': {
      'Dragon-Dog': [
        "Conflicting approaches to loyalty and trust",
        "Different values in relationships and life",
        "Communication challenges due to opposing viewpoints"
      ],
      'Dragon-Sheep': [
        "Mismatched expectations in relationship roles",
        "Different approaches to emotional expression",
        "Contrasting needs for freedom versus security"
      ]
    },
    'Bento Buddies': {
      'Dragon-Monkey': [
        "Good teamwork in professional settings",
        "Shared intellectual interests",
        "Respect for each other's capabilities"
      ],
      'Dragon-Rooster': [
        "Practical approach to solving problems together",
        "Mutual appreciation for directness",
        "Good balance in work relationships"
      ]
    },
    'Average': {
      'Dragon-Rabbit': [
        "Need to balance Dragon's boldness with Rabbit's caution",
        "Can learn from each other's different approaches",
        "Moderate understanding of each other's needs"
      ],
      'Dragon-Horse': [
        "Both value independence and freedom",
        "Need to manage strong personalities",
        "Can work together with clear boundaries"
      ]
    }
  };

  // Get specific dynamics based on zodiac combination
  const combinationKey = `${zodiac1}-${zodiac2}`;
  const reverseCombinationKey = `${zodiac2}-${zodiac1}`;

  return dynamics[compatibility]?.[combinationKey] ||
         dynamics[compatibility]?.[reverseCombinationKey] ||
         [
           `${zodiac1} and ${zodiac2} need to focus on understanding each other's perspectives`,
           "Building trust through open communication",
           "Finding common ground in shared interests"
         ];
}

function identifyGrowthAreas(person1: any, person2: any, zodiac1: string, zodiac2: string, compatibility: string): string[] {
  const growthAreas = {
    'Perfect Match': {
      'Dragon-Rat': [
        "Develop shared long-term goals while maintaining individuality",
        "Balance Dragon's dominance with Rat's need for independence",
        "Create space for both to pursue personal interests"
      ],
      'Dragon-Tiger': [
        "Learn to channel competitive energy constructively",
        "Develop patience with each other's strong personalities",
        "Create stability while maintaining excitement"
      ]
    },
    'Worst Couple': {
      'Dragon-Dog': [
        "Work on accepting fundamental differences in values",
        "Develop mutual respect for different life approaches",
        "Find common ground despite contrasting personalities"
      ],
      'Dragon-Sheep': [
        "Bridge the gap between practical and emotional needs",
        "Learn to appreciate different communication styles",
        "Build trust despite natural incompatibilities"
      ]
    },
    'Bento Buddies': {
      'Dragon-Monkey': [
        "Maintain boundaries while working together",
        "Develop deeper emotional understanding",
        "Balance competition with cooperation"
      ],
      'Dragon-Rooster': [
        "Build trust through consistent communication",
        "Respect each other's different approaches",
        "Find middle ground in decision-making"
      ]
    },
    'Average': {
      'Dragon-Rabbit': [
        "Balance boldness with sensitivity",
        "Develop patience for different paces",
        "Create safe space for open dialogue"
      ]
    }
  };

  const combinationKey = `${zodiac1}-${zodiac2}`;
  const reverseCombinationKey = `${zodiac2}-${zodiac1}`;

  return growthAreas[compatibility]?.[combinationKey] ||
         growthAreas[compatibility]?.[reverseCombinationKey] ||
         [
           "Focus on developing mutual understanding and respect",
           "Work on bridging communication gaps",
           "Find ways to appreciate each other's unique qualities"
         ];
}

function calculateRelationshipTypeScores(person1: any, person2: any): any {
  // Placeholder implementation; replace with actual scoring logic
  return {
    work: { score: 70, strengths: [], challenges: [] },
    business: { score: 80, strengths: [], challenges: [] },
    friendship: { score: 90, strengths: [], challenges: [] },
    family: { score: 60, strengths: [], challenges: [] }
  };
}

export default router;