import OpenAI from "openai";
import type { NumerologyInterpretation } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      if (error?.status === 429) { // Rate limit error
        const waitTime = Math.pow(2, i) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`Rate limited, waiting ${waitTime}ms before retry ${i + 1}/${maxRetries}`);
        await sleep(waitTime);
        continue;
      }
      throw error; // For other errors, throw immediately
    }
  }
  throw lastError;
}

export async function getInterpretation(
  numbers: { 
    lifePath: number; 
    destiny: number; 
    heartDesire: number;
    expression: number;
    personality: number;
  },
  name: string
): Promise<NumerologyInterpretation> {
  const prompt = `Analyze the following numerology numbers for ${name}:
Life Path Number: ${numbers.lifePath}
Destiny Number: ${numbers.destiny}
Heart's Desire Number: ${numbers.heartDesire}
Expression Number: ${numbers.expression}
Personality Number: ${numbers.personality}

Provide detailed interpretations in JSON format with these keys:
- lifePath: interpretation of the Life Path number
- destiny: interpretation of the Destiny number
- heartDesire: interpretation of the Heart's Desire number
- expression: interpretation of the Expression number
- personality: interpretation of the Personality number
- overview: a holistic interpretation combining all numbers`;

  try {
    return await retryWithBackoff(async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert numerologist providing detailed interpretations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content in OpenAI response");
      }

      const parsedContent = JSON.parse(content) as NumerologyInterpretation;
      return parsedContent;
    });
  } catch (error: any) {
    console.error('OpenAI API error:', error);

    // Check for rate limit error
    if (error?.status === 429) {
      throw new Error("The AI service is temporarily busy. Please try again in a few minutes.");
    }

    // Check for invalid API key
    if (error?.status === 401) {
      throw new Error("Invalid OpenAI API key. Please check your API key configuration.");
    }

    throw new Error("Failed to get AI interpretation. Please try again.");
  }
}