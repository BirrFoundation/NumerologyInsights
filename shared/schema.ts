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
  interpretations: jsonb("interpretations").notNull()
});

export const insertNumerologySchema = createInsertSchema(numerologyResults)
  .omit({ id: true })
  .extend({
    name: z.string().min(2).max(100),
    birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
  });

export type InsertNumerology = z.infer<typeof insertNumerologySchema>;
export type NumerologyResult = typeof numerologyResults.$inferSelect;

export type NumerologyInterpretation = {
  lifePath: string;
  destiny: string;
  heartDesire: string;
  overview: string;
};
