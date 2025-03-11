import { pgTable, text, serial, integer, date, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  verified: boolean("verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const verificationCodes = pgTable("verification_codes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  code: text("code").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const numerologyResults = pgTable("numerology_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  birthdate: date("birthdate").notNull(),
  lifePath: integer("life_path").notNull(),
  destiny: integer("destiny").notNull(),
  heartDesire: integer("heart_desire").notNull(),
  expression: integer("expression").notNull(),
  personality: integer("personality").notNull(),
  attribute: integer("attribute").notNull(),
  birthDateNum: integer("birth_date_num").notNull(),
  interpretations: jsonb("interpretations").notNull()
});

export const dreamRecords = pgTable("dream_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  dreamDate: timestamp("dream_date").notNull(),
  description: text("description").notNull(),
  emotions: text("emotions").array().notNull(),
  symbols: text("symbols").array().notNull(),
  numerologyFactors: jsonb("numerology_factors").notNull(),
  interpretation: jsonb("interpretation").notNull()
});

// User schemas
export const userAuthSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
});

export const verificationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  code: z.string().length(6, "Verification code must be 6 characters")
});

// Numerology schemas
export const numerologyInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Please enter a valid date in YYYY-MM-DD format"
  })
});

export const compatibilityInputSchema = z.object({
  name1: z.string().min(2, "First name must be at least 2 characters"),
  birthdate1: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  name2: z.string().min(2, "Second name must be at least 2 characters"),
  birthdate2: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

// Dream input schema
export const dreamInputSchema = z.object({
  description: z.string().min(10, "Please provide a more detailed description of your dream"),
  dreamDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Please enter a valid date in YYYY-MM-DD format"
  }),
  emotions: z.array(z.string()).min(1, "Please select at least one emotion"),
  symbols: z.array(z.string()).min(1, "Please identify at least one symbol from your dream")
});


// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  verified: true,
  createdAt: true 
});

export const insertVerificationSchema = createInsertSchema(verificationCodes).omit({ 
  id: true,
  createdAt: true 
});

export const insertNumerologySchema = createInsertSchema(numerologyResults).omit({ 
  id: true,
  userId: true 
});

export const insertDreamSchema = createInsertSchema(dreamRecords).omit({
  id: true,
  userId: true,
  numerologyFactors: true,
  interpretation: true
});

// Export types
export type InsertUser = z.infer<typeof userAuthSchema>;
export type User = typeof users.$inferSelect;
export type VerificationCode = typeof verificationCodes.$inferSelect;
export type NumerologyResult = typeof numerologyResults.$inferSelect;

export interface CompatibilityResult {
  score: number;
  aspects: string[];
}

export type NumerologyInterpretation = {
  lifePath: string;
  destiny: string;
  heartDesire: string;
  expression: string;
  personality: string;
  attribute: string;
  birthDateNum: string;
  overview: string;
  recommendations: {
    strengths: string[];
    challenges: string[];
    growthAreas: string[];
    practices: string[];
  };
  developmentSummary: string;
  compatibility?: CompatibilityResult;
};

export type InsertDream = z.infer<typeof dreamInputSchema>;
export type DreamRecord = typeof dreamRecords.$inferSelect;

export interface DreamInterpretation {
  overview: string;
  symbolism: {
    [key: string]: string;
  };
  numerologicalInsights: {
    numbers: number[];
    meanings: string[];
    guidance: string;
  };
  actionSteps: string[];
  personalGrowth: string;
  cosmicInfluences: {
    currentCycle: string;
    karmicLessons: string;
    spiritualGuidance: string;
  };
}