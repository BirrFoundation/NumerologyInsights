import OpenAI from "openai";
import type { NumerologyInterpretation } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getInterpretation(
  numbers: { lifePath: number; destiny: number; heartDesire: number },
  name: string
): Promise<NumerologyInterpretation> {
  const prompt = `Analyze the following numerology numbers for ${name}:
Life Path Number: ${numbers.lifePath}
Destiny Number: ${numbers.destiny}
Heart's Desire Number: ${numbers.heartDesire}

Provide detailed interpretations in JSON format with these keys:
- lifePath: interpretation of the Life Path number
- destiny: interpretation of the Destiny number
- heartDesire: interpretation of the Heart's Desire number
- overview: a holistic interpretation combining all numbers`;

  try {
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
  } catch (error: any) {
    console.error('OpenAI API error:', error);

    // Check for rate limit error
    if (error?.status === 429) {
      throw new Error("OpenAI API rate limit exceeded. Please try again in a few minutes.");
    }

    // Check for invalid API key
    if (error?.status === 401) {
      throw new Error("Invalid OpenAI API key. Please check your API key configuration.");
    }

    throw new Error("Failed to get AI interpretation. Please try again.");
  }
}