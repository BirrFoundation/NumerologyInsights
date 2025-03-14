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

    // Get detailed zodiac information including elements and yin/yang
    const zodiac1 = getChineseZodiacSign(data.birthdate1);
    const zodiac2 = getChineseZodiacSign(data.birthdate2);

    // Calculate zodiac compatibility with enhanced information
    const zodiacCompatibility = getZodiacCompatibility(zodiac1, zodiac2);

    // Calculate year difference compatibility
    const yearDiff = calculateYearDifferenceCompatibility(data.birthdate1, data.birthdate2);

    // Calculate numerology scores
    const lifePathScore = calculateNumberCompatibility(person1.lifePath, person2.lifePath);
    const expressionScore = calculateNumberCompatibility(person1.expression, person2.expression);
    const heartDesireScore = calculateNumberCompatibility(person1.heartDesire, person2.heartDesire);

    // Calculate final compatibility with weights
    const finalScore = Math.round(
      (lifePathScore * 0.3) +           // Life Path: 30%
      (expressionScore * 0.2) +         // Expression: 20%
      (heartDesireScore * 0.2) +        // Heart's Desire: 20%
      (zodiacCompatibility.score * 0.2) + // Zodiac: 20%
      (yearDiff.score * 0.1)             // Year Cycle: 10%
    );

    // Prepare response with enhanced zodiac information
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
        `${data.name2} is a ${zodiac2.sign} (${zodiac2.element}, ${zodiac2.yinYang} polarity)`,
        zodiacCompatibility.description
      ],
      dynamics: analyzeRelationshipDynamics(zodiac1.sign, zodiac2.sign, zodiacCompatibility.type),
      growthAreas: generateGrowthAreas(zodiac1.sign, zodiac2.sign, zodiacCompatibility.type),
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

  // Get the base number for numbers > 9 that aren't master numbers
  const getBaseNumber = (num: number) => {
    if (num === 11 || num === 22 || num === 33) return num;
    return num % 9 || 9;
  };

  return {
    lifePath: `Your Life Path number ${numbers.lifePath} indicates ${lifePathMeanings[getBaseNumber(numbers.lifePath)]}. This is your primary life purpose andthe path you're meant to follow.`,
    destiny: `Your Destiny number ${numbers.destiny} reveals yourpotential and the talents you possess to achieveyour goals. Itrepresents your capacity for achievement.`,
    heartDesire: `Your Heart's Desire number ${numbers.heartDesire} shows your inner motivation and what truly drives you. It represents your emotional needs and deepest desires.`,
    expression: `Your Expression number ${numbers.expression} reflects how you present yourself to the world. It shows your natural abilities and how you express yourself.`,
    personality: `Your Personality number ${numbers.personality} represents how others see you initially. It's your outer personality and first impression.`,    attribute: `Your Attribute number ${numbers.attribute} (calculated from your birth month ${numbers.birthDateNum})indicates yourinnate talents and natural abilities.`,
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

function getZodiacCompatibility(sign1: { sign: string, element: string, yinYang: string }, sign2: { sign: string, element: string, yinYang: string }): { score: number; description: string; dynamic: string } {
  const compatibilityMap: Record<string, Record<string, { type: string, score: number }>> = {
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
      'Tiger': { type: 'Average', score: 70 },
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
    }
    // Add other signs with their exact relationships...
  };

  const getCompatibilityType = (sign1: string, sign2: string): { type: string, score: number } => {
    // Check both directions as compatibility might be defined in either direction
    return compatibilityMap[sign1]?.[sign2] || compatibilityMap[sign2]?.[sign1] || { type: 'Average', score: 70 };
  };

  const compatibility = getCompatibilityType(sign1.sign, sign2.sign);
  const description = getDescription(compatibility.type, sign1.sign, sign2.sign);

  // Generate dynamics based on compatibility type
  const dynamics = analyzeRelationshipDynamics(sign1.sign, sign2.sign, compatibility.type);
  const dynamic = dynamics.join('. ');

  return {
    score: compatibility.score,
    description,
    dynamic
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

// Update the dynamics analysis function
function analyzeRelationshipDynamics(sign1: string, sign2: string, compatibilityType: string): string[] {
  // Special case for Dragon and Dog
  if ((sign1 === 'Dragon' && sign2 === 'Dog') || (sign1 === 'Dog' && sign2 === 'Dragon')) {
    return [
      "Dragon's independent and ambitious nature directly conflicts with Dog's need for loyalty and stability",
      "Dog's cautious and protective approach clashes with Dragon's bold and adventurous spirit",
      "Their opposing views on authority and freedom create fundamental tension"
    ];
  }

  // Handle other combinations based on compatibility type
  switch (compatibilityType) {
    case 'Perfect Match':
      return [
        `${sign1} and ${sign2} naturally complement each other's energies`,
        "Their core values and life approaches align harmoniously",
        "They create a balanced and supportive partnership"
      ];
    case 'Good Match':
      return [
        `${sign1} and ${sign2} share positive energy and understanding`,
        "They can build a strong foundation through mutual respect",
        "Their differences tend to complement rather than conflict"
      ];
    case 'Bento Buddies':
      return [
        `${sign1} and ${sign2} maintain a comfortable connection`,
        "They respect each other's independence while sharing common interests",
        "Their relationship thrives on mutual understanding and space"
      ];
    case 'Average':
      return [
        `${sign1} and ${sign2} have a moderate connection`,
        "Their relationship requires effort but can be rewarding",
        "Balance can be achieved through conscious communication"
      ];
    case 'Worst Couple':
      return [
        `${sign1} and ${sign2} face significant compatibility challenges`,
        "Their core values and approaches often conflict",
        "The relationship requires substantial effort and understanding"
      ];
    default:
      return [
        `${sign1} and ${sign2} have unique interaction patterns`,
        "Their relationship benefits from open communication",
        "Success depends on mutual respect and understanding"
      ];
  }
}

function generateGrowthAreas(sign1: string, sign2: string, compatibilityType: string): string[] {
  // Special case for Dragon and Dog
  if ((sign1 === 'Dragon' && sign2 === 'Dog') || (sign1 === 'Dog' && sign2 === 'Dragon')) {
    return [
      "Learn to balance Dragon's need for independence with Dog's desire for security",
      "Develop mutual respect for different approaches to loyalty and trust",
      "Find common ground between Dragon's ambition and Dog's practicality",
      "Practice patience and understanding when viewpoints naturally conflict"
    ];
  }

  // Handle other combinations based on compatibility type
  switch (compatibilityType) {
    case 'Perfect Match':
      return [
        "Maintain individual growth while nurturing your natural connection",
        "Build on your shared strengths and values",
        "Keep communication open and honest"
      ];
    case 'Good Match':
      return [
        "Focus on appreciating your complementary qualities",
        "Build deeper understanding through shared experiences",
        "Maintain the positive aspects of your connection"
      ];
    case 'Bento Buddies':
      return [
        "Respect and maintain healthy boundaries",
        "Cultivate friendship while honoring independence",
        "Focus on shared interests and activities"
      ];
    case 'Average':
      return [
        "Work on understanding each other's perspectives",
        "Develop effective communication strategies",
        "Find ways to turn differences into strengths"
      ];
    case 'Worst Couple':
      return [
        "Focus on developing patience and understanding",
        "Learn to appreciate and respect your differences",
        "Work on finding common ground despite challenges"
      ];
    default:
      return [
        "Build mutual respect and understanding",
        "Practice active listening and empathy",
        "Focus on effective communication"
      ];
  }
}

function getDescription(type: string, sign1: string, sign2: string): string {
  switch (type) {
    case 'Perfect Match':
      return `${sign1} and ${sign2} are a Perfect Match! This is one of the most harmonious combinations in Chinese zodiac.`;
    case 'Good Friend':
      return `${sign1} and ${sign2} make Good Friends. They have natural understanding and cooperation.`;
    case 'Good Match':
      return `${sign1} and ${sign2} are a Good Match, creating a positive and supportive relationship.`;
    case 'Average':
      return `${sign1} and ${sign2} have an Average compatibility. Their relationship requires balance and understanding.`;
    case 'Bento Buddies':
      return `${sign1} and ${sign2} are Bento Buddies - they can maintain a friendly relationship with good communication.`;
    case 'Worst Couple':
      return `${sign1} and ${sign2} are considered a Worst Couple match. This combination faces significant challenges.`;
    case 'Good Match or Enemy':
      return `${sign1} and ${sign2} can be either a Good Match or challenging - much depends on individual effort.`;
    default:
      return `${sign1} and ${sign2} have a unique dynamic that requires understanding.`;
  }
}


function identifyGrowthAreas(person1: any, person2: any): string[] {
  // Placeholder implementation; replace with actual analysis logic
  return [
    `Focus on understanding each other's core values and motivations`,
    `Practice active listening and open communication`,
    `Build trust through consistent actions and respect`
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