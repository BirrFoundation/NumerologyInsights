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

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new Error("Failed to get AI interpretation");
  }
}
