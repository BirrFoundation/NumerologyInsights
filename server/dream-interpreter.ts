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
- Birth Date Number: ${numerology.birthDateNum}
- Personality Number: ${numerology.personality}
- Destiny Number: ${numerology.destiny}

Consider the following in your analysis:
1. How the dream symbols relate to the dreamer's Life Path number
2. The emotional resonance with their Soul Urge number
3. Any numerical patterns in the dream and their significance
4. The influence of their Birth Date number on dream themes
5. How their Destiny number might be guiding the dream's message

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
  "personalGrowth": "Guidance for personal development based on dream and numerology",
  "cosmicInfluences": {
    "currentCycle": "Analysis of current numerological cycle",
    "karmicLessons": "Karmic implications from the dream",
    "spiritualGuidance": "Spiritual messages based on numerology"
  }
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a master numerologist and dream interpreter who provides deep insights by connecting dream symbolism with numerological meanings. Focus on the spiritual and transformative aspects of dreams through the lens of numerology."
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) {
      throw new Error("No interpretation received from AI");
    }

    const interpretation = JSON.parse(response.choices[0].message.content) as DreamInterpretation;

    return {
      interpretation,
      numerologyFactors: {
        lifePath: numerology.lifePath,
        expression: numerology.expression,
        heartDesire: numerology.heartDesire,
        birthDateNum: numerology.birthDateNum,
        personality: numerology.personality,
        destiny: numerology.destiny,
        dreamNumbers: interpretation.numerologicalInsights.numbers.reduce((acc, num) => acc + num, 0)
      }
    };
  } catch (error) {
    console.error("Dream interpretation error:", error);
    throw new Error("Failed to interpret dream. Please try again later.");
  }
}