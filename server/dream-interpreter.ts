import OpenAI from "openai";
import { calculateNumerology } from "./numerology";
import { type DreamInterpretation } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function interpretDream(
  description: string,
  emotions: string[],
  symbols: string[],
  birthdate: string,
  name: string
): Promise<{
  interpretation: DreamInterpretation;
  numerologyFactors: Record<string, number>;
}> {
  try {
    // Calculate numerology factors
    const numerology = calculateNumerology(name, birthdate);
    
    const prompt = `As a master numerologist and dream interpreter, analyze this dream with numerological insights:

Dream Description: ${description}
Emotions Felt: ${emotions.join(", ")}
Key Symbols: ${symbols.join(", ")}

Numerological Context:
- Life Path Number: ${numerology.lifePath}
- Expression Number: ${numerology.expression}
- Soul Urge Number: ${numerology.heartDesire}

Please provide a comprehensive dream interpretation that incorporates numerological significance. Format the response as a JSON object with the following structure:
{
  "overview": "General interpretation of the dream",
  "symbolism": {
    [key: string]: "Meaning of each symbol and its numerological significance"
  },
  "numerologicalInsights": {
    "numbers": [relevant numbers found in dream],
    "meanings": [meanings of these numbers],
    "guidance": "How these numbers relate to the dreamer's life path"
  },
  "actionSteps": [suggested actions based on the dream],
  "personalGrowth": "Guidance for personal development based on dream and numerology"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a master numerologist and dream interpreter who provides deep insights by connecting dream symbolism with numerological meanings." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const interpretation = JSON.parse(response.choices[0].message.content) as DreamInterpretation;

    return {
      interpretation,
      numerologyFactors: {
        lifePath: numerology.lifePath,
        expression: numerology.expression,
        heartDesire: numerology.heartDesire,
        dreamNumbers: interpretation.numerologicalInsights.numbers
      }
    };
  } catch (error) {
    console.error("Dream interpretation error:", error);
    throw new Error("Failed to interpret dream. Please try again later.");
  }
}
