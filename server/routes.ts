import type { Express } from "express";
import { createServer, type Server } from "http";
import { log } from "./vite";
import { getPersonalizedCoaching } from "./ai-coach";
import { reduceToSingleDigit } from "./numerology";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Daily Forecast endpoint
  app.get('/api/daily-forecast', async (req, res) => {
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

  // Register API routes before creating server
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
  });

  log("Created HTTP server");

  return httpServer;
}