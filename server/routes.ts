import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { calculateNumerology } from "./numerology";
import { getInterpretation } from "./ai";
import { insertNumerologySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/calculate", async (req, res) => {
    try {
      // Validate input data
      const data = insertNumerologySchema.parse(req.body);

      // Calculate numerology numbers
      const numbers = calculateNumerology(data.name, new Date(data.birthdate));

      try {
        // Get AI interpretation
        const interpretations = await getInterpretation(numbers, data.name);

        // Store result
        const result = await storage.createResult({
          ...data,
          ...numbers,
          interpretations
        });

        res.json(result);
      } catch (aiError) {
        console.error('AI Interpretation error:', aiError);
        res.status(500).json({ 
          message: "Failed to get AI interpretation. Please try again." 
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

  const httpServer = createServer(app);
  return httpServer;
}