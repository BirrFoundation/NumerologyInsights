import { pgTable, text, serial, integer, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const numerologyResults = pgTable("numerology_results", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  birthdate: date("birthdate").notNull(),
  lifePath: integer("life_path").notNull(),
  destiny: integer("destiny").notNull(),
  heartDesire: integer("heart_desire").notNull(),
  expression: integer("expression").notNull(),
  personality: integer("personality").notNull(),
  attribute: integer("attribute").notNull(),
  interpretations: jsonb("interpretations").notNull()
});

// Create a separate schema just for the form input
export const numerologyInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Please enter a valid date in YYYY-MM-DD format"
  })
});

export const insertNumerologySchema = createInsertSchema(numerologyResults)
  .omit({ id: true });

export type InsertNumerology = z.infer<typeof numerologyInputSchema>;
export type NumerologyResult = typeof numerologyResults.$inferSelect;

export type NumerologyInterpretation = {
  lifePath: string;
  destiny: string;
  heartDesire: string;
  expression: string;
  personality: string;
  attribute: string;
  overview: string;
};