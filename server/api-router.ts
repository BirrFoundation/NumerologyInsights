import { Router } from "express";
import { storage } from "./storage";
import { log } from "./vite";
import { userAuthSchema, verificationSchema, numerologyInputSchema, compatibilityInputSchema, dreamInputSchema } from "@shared/schema";
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

export default router;