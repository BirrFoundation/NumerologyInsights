import { Router } from "express";
import { storage } from "./storage";
import { log } from "./vite";
import { userAuthSchema, verificationSchema, numerologyInputSchema, compatibilityInputSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sendVerificationEmail, sendResetEmail, generateVerificationCode } from "./email-service";

// Declare type with index signature for number mappings
type NumberIndexedMapping = {
  [key: number]: string;
};

type NumberIndexedArrayMapping = {
  [key: number]: string[];
};

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
    log('Processing signup for:', data.email);

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

    // Generate verification code
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await storage.createVerificationCode({
      userId: user.id,
      code,
      expiresAt
    });

    // Send verification email
    try {
      await sendVerificationEmail(user.email, code);
      res.status(201).json({
        message: "Account created. Please check your email for verification code.",
        userId: user.id,
        emailSent: true
      });
    } catch (emailError) {
      res.status(201).json({
        message: "Account created but verification email failed. Please request a new code.",
        userId: user.id,
        emailSent: false,
        emailError: emailError instanceof Error ? emailError.message : "Unknown error"
      });
    }
  } catch (error) {
    log("Signup error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to create account" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const data = userAuthSchema.parse(req.body);

    const user = await storage.getUserByEmail(data.email);
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (!user.verified) {
      return res.status(403).json({
        error: "Email not verified",
        userId: user.id
      });
    }

    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (req.session) {
      req.session.userId = user.id;
    }

    res.json({ message: "Logged in successfully" });
  } catch (error) {
    log("Login error:", error);
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

    const { password, ...userData } = user;
    res.json(userData);
  } catch (error) {
    log("Auth check error:", error);
    res.status(500).json({ error: "Failed to get user data" });
  }
});

// Numerology Routes
router.post("/calculate", async (req, res) => {
  try {
    const data = numerologyInputSchema.parse(req.body);
    const numbers = calculateNumerology(data.name, data.birthdate);

    const interpretations = await getInterpretation(numbers, data.name);
    const userId = req.session?.userId || null;

    const result = await storage.createResult({
      ...data,
      ...numbers,
      interpretations,
      userId
    });

    res.json(result);
  } catch (error) {
    log('Numerology calculation error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to calculate numerology" });
  }
});

// Compatibility calculation endpoint
router.post("/compatibility", async (req, res) => {
  try {
    const data = compatibilityInputSchema.parse(req.body);

    const person1 = calculateNumerology(data.name1, data.birthdate1);
    const person2 = calculateNumerology(data.name2, data.birthdate2);

    const zodiac1 = getChineseZodiacSign(data.birthdate1);
    const zodiac2 = getChineseZodiacSign(data.birthdate2);

    const zodiacCompatibility = getZodiacCompatibility(zodiac1, zodiac2);
    const yearDiff = calculateYearDifferenceCompatibility(data.birthdate1, data.birthdate2);

    const lifePathScore = calculateNumberCompatibility(person1.lifePath, person2.lifePath);
    const expressionScore = calculateNumberCompatibility(person1.expression, person2.expression);
    const heartDesireScore = calculateNumberCompatibility(person1.heartDesire, person2.heartDesire);

    const finalScore = Math.round(
      (lifePathScore * 0.3) +
      (expressionScore * 0.2) +
      (heartDesireScore * 0.2) +
      (zodiacCompatibility.score * 0.2) +
      (yearDiff.score * 0.1)
    );

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
      dynamics: [
        ...analyzeRelationshipDynamics(person1, person2, zodiac1.sign, zodiac2.sign, zodiacCompatibility.type),
        `Your zodiac signs create a ${zodiacCompatibility.score >= 80 ? 'harmonious' :
          zodiacCompatibility.score >= 60 ? 'balanced' : 'challenging'} interaction`,
        zodiacCompatibility.dynamic
      ],
      growthAreas: [
        ...identifyGrowthAreas(person1, person2, zodiac1.sign, zodiac2.sign, zodiacCompatibility.type),
        zodiacCompatibility.score < 60
          ? `Learn to balance the different energies of ${zodiac1.sign} (${zodiac1.element}) and ${zodiac2.sign} (${zodiac2.element})`
          : `Harness the natural harmony between your ${zodiac1.sign} and ${zodiac2.sign} energies`
      ],
      relationshipTypes: calculateRelationshipTypeScores(person1, person2)
    };

    res.json(result);
  } catch (error) {
    log('Compatibility calculation error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input data", details: error.errors });
    }
    res.status(500).json({ error: "Failed to calculate compatibility" });
  }
});

// Type definitions
interface NumerologyResult {
  lifePath: number;
  destiny: number;
  heartDesire: number;
  expression: number;
  personality?: number;
  attribute?: number;
  birthDateNum?: number;
  birthdate?: string;
  name?: string;
  userId?: number;
  interpretations?: Record<string, any>;
}

interface CoachingResponse {
  advice: string;
  followUpQuestions: string[];
}

type NumberMapping = Record<number, string>;
type NumberArrayMapping = Record<number, string[]>;
type NumerologyNumber = number | 11 | 22 | 33;

// Constants
const NUMBER_MEANINGS: NumberMapping = {
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

const LIFE_PATH_QUESTIONS: NumberMapping = {
  1: "What leadership initiatives could you take on to express your pioneering spirit?",
  2: "How can you foster more harmony in your relationships through cooperation?",
  3: "Which creative projects would allow you to express your artistic talents?",
  4: "What practical steps can you take to build a stronger foundation?",
  5: "How might you embrace change while maintaining your sense of adventure?",
  6: "In what ways can you nurture others while honoring your own needs?",
  7: "Which areas of spiritual or intellectual study intrigue you most?",
  8: "What specific actions could you take to manifest greater abundance and power in your life?",
  9: "How might you expand your humanitarian influence to make a meaningful impact?",
  11: "How can you use your intuitive gifts to guide others?",
  22: "What practical steps would help manifest your grand vision?",
  33: "How can you use your teaching abilities to uplift more people?"
};

const DESTINY_QUESTIONS: NumberMapping = {
  1: "Which unique leadership opportunities align with your destiny path?",
  2: "How might you deepen cooperation in your relationships?",
  3: "What forms of creative expression best fulfill your destiny?",
  4: "Which foundations need strengthening to support your life's mission?",
  5: "What new experiences would support your path of freedom?",
  6: "How can you better serve others while honoring your own journey?",
  7: "What wisdom are you being called to both study and share?",
  8: "How can you align your material goals with your higher purpose and abundance?",
  9: "Which humanitarian causes most strongly resonate with your destiny path?",
  11: "How might you better channel your intuitive gifts to guide others?",
  22: "What concrete steps would help manifest your grand vision?",
  33: "How can you expand your influence as a teacher and mentor?"
};

// Helper function to handle number indexing safely
function getNumberMapping<T>(map: { [key: number]: T }, num: number, defaultKey: number = 1): T {
  if (num === 11 || num === 22 || num === 33) {
    return map[num] || map[defaultKey];
  }
  const reducedNum = num % 9 || 9;
  return map[reducedNum] || map[defaultKey];
}

// Get personalized coaching questions based on numerology numbers
const getPersonalizedCoaching = async (numerologyResult: NumerologyResult): Promise<CoachingResponse> => {
  // Get meanings using safe number indexing
  const lifePathMeaning = getNumberMapping(NUMBER_MEANINGS, numerologyResult.lifePath);
  const destinyMeaning = getNumberMapping(NUMBER_MEANINGS, numerologyResult.destiny);
  const heartDesireMeaning = getNumberMapping(NUMBER_MEANINGS, numerologyResult.heartDesire);
  const expressionMeaning = getNumberMapping(NUMBER_MEANINGS, numerologyResult.expression);

  // Create a personalized advice message with proper formatting
  const advice = [
    'Your Numerological Profile Analysis',
    '================================',
    '',
    `Life Path ${numerologyResult.lifePath}:`,
    `  Your core purpose aligns with ${lifePathMeaning.toLowerCase()}`,
    '',
    `Destiny Number ${numerologyResult.destiny}:`,
    `  Your life's mission guides you toward ${destinyMeaning.toLowerCase()}`,
    '',
    `Heart's Desire ${numerologyResult.heartDesire}:`,
    `  Your inner motivation seeks ${heartDesireMeaning.toLowerCase()}`,
    '',
    `Expression Number ${numerologyResult.expression}:`,
    `  You naturally manifest ${expressionMeaning.toLowerCase()}`
  ].join('\n');

  // Get questions using safe number indexing
  const lifePathQ = getNumberMapping(LIFE_PATH_QUESTIONS, numerologyResult.lifePath);
  const destinyQ = getNumberMapping(DESTINY_QUESTIONS, numerologyResult.destiny);
  const integrationQ = [
    `How can you balance your Heart's Desire ${numerologyResult.heartDesire}`,
    `(${heartDesireMeaning.toLowerCase()}) with your Expression Number ${numerologyResult.expression}`,
    `(${expressionMeaning.toLowerCase()}) in your daily life and relationships?`
  ].join(' ');

  return {
    advice,
    followUpQuestions: [lifePathQ, destinyQ, integrationQ]
  };
};

// Coaching endpoint
router.post("/coaching", async (req, res) => {
  try {
    if (!req.body.numerologyResult) {
      return res.status(400).json({ message: "Numerology result is required" });
    }

    const coaching = await getPersonalizedCoaching(req.body.numerologyResult);
    res.json(coaching);
  } catch (error) {
    console.error('AI Coaching error:', error);
    res.status(503).json({
      message: "Failed to get coaching insights. Please try again."
    });
  }
});

//Helper functions (These need to be added from the original file or other relevant files)
function calculateNumerology(name: string, birthdate: string): any {
    //Implementation for calculateNumerology
    return {lifePath:1, destiny:2, heartDesire:3, expression:4};
}

async function getInterpretation(numbers:any, name:string):Promise<any>{
    //Implementation for getInterpretation
    return {};
}

function getChineseZodiacSign(birthdate: string): any {
    //Implementation for getChineseZodiacSign
    return {sign:"rat", element:"water", yinYang:"yin"};
}

function getZodiacCompatibility(zodiac1:any, zodiac2:any):any{
    //Implementation for getZodiacCompatibility
    return {score:70, description:"Good compatibility", dynamic:"They are good", type:"fire"};
}

function calculateYearDifferenceCompatibility(birthdate1:string, birthdate2:string):any{
    //Implementation for calculateYearDifferenceCompatibility
    return {score:80, description:"Good compatibility"};
}


function calculateNumberCompatibility(num1: number, num2: number): number {
    //Implementation for calculateNumberCompatibility
    return 70;
}

function generateCompatibilityAspects(person1: any, person2: any): string[] {
    //Implementation for generateCompatibilityAspects
    return ["aspect1", "aspect2"];
}

function analyzeRelationshipDynamics(person1: any, person2: any, zodiac1: string, zodiac2: string, type: string): string[] {
    //Implementation for analyzeRelationshipDynamics
    return ["dynamic1", "dynamic2"];
}

function identifyGrowthAreas(person1: any, person2: any, zodiac1: string, zodiac2: string, type: string): string[] {
    //Implementation for identifyGrowthAreas
    return ["growthArea1", "growthArea2"];
}

function calculateRelationshipTypeScores(person1: any, person2: any): any {
    //Implementation for calculateRelationshipTypeScores
    return {};
}


export default router;