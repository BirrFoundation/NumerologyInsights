import OpenAI from "openai";
import type { NumerologyResult } from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const COACHING_MODEL = "gpt-4o";

interface CoachingResponse {
  advice: string;
  followUpQuestions: string[];
}

const DEFAULT_COACHING_RESPONSE = {
  advice: "Based on your numerological profile, focus on developing your core strengths while being mindful of potential challenges. Consider keeping a journal to track your personal growth journey.",
  followUpQuestions: [
    "What aspect of your numerology reading resonated with you the most?",
    "Which area of personal development would you like to focus on first?",
    "How can you apply your numerological strengths in your daily life?"
  ]
};

export async function getPersonalizedCoaching(
  result: NumerologyResult,
  userQuery?: string
): Promise<CoachingResponse> {
  try {
    const systemPrompt = `You are an expert numerology-based personal development coach.
    Use the numerology results to provide highly personalized, specific advice that directly relates to the person's numbers.

    Key rules:
    1. Always connect advice to specific numbers in their profile
    2. Provide concrete, actionable steps, not generic advice
    3. If responding to a question, address it directly using their numerological patterns
    4. Keep responses clear and practical
    5. Generate unique follow-up questions based on their specific numbers and any previous query

    When crafting follow-up questions:
    - Focus on their strongest numbers and potential growth areas
    - Ask about specific challenges indicated by their numbers
    - Suggest practical applications of their numerological strengths
    - Never use generic questions
    - Each question should relate to a different aspect of their numerological profile

    Format response as JSON with:
    {
      "advice": "detailed coaching advice",
      "followUpQuestions": ["3-4 highly specific follow-up questions that relate to their numbers"]
    }`;

    const userPrompt = userQuery 
      ? `Based on the numerology profile and this specific question: "${userQuery}", provide personalized coaching advice that addresses their question while considering their specific numbers.
        Ensure the advice connects directly to their numbers and life path.`
      : `Based on this numerology profile, provide initial coaching insights that specifically address the strengths and challenges indicated by their Life Path ${result.lifePath}, Expression ${result.expression}, and Heart's Desire ${result.heartDesire} numbers.`;

    const response = await openai.chat.completions.create({
      model: COACHING_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `
            Numerology Profile:
            - Life Path: ${result.lifePath} (Primary life direction)
            - Destiny: ${result.destiny} (Ultimate goals)
            - Expression: ${result.expression} (Natural talents)
            - Heart's Desire: ${result.heartDesire} (Inner motivation)
            - Personality: ${result.personality} (External self)
            - Birth Date: ${result.birthDateNum} (Core traits)

            Key Patterns:
            - Master Numbers Present: ${[result.lifePath, result.destiny, result.expression, result.heartDesire]
              .filter(num => [11, 22, 33, 44].includes(num))
              .join(', ') || 'None'}
            - Karmic Numbers (8): ${[result.lifePath, result.destiny, result.expression, result.heartDesire]
              .filter(num => num === 8 || num === 44)
              .length > 0 ? 'Present' : 'Not present'}

            Current Focus: ${userPrompt}
          `
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      console.warn('OpenAI returned empty content, using default response');
      return DEFAULT_COACHING_RESPONSE;
    }

    const coaching = JSON.parse(content);
    return coaching as CoachingResponse;
  } catch (error) {
    console.error('AI Coaching error:', error);
    // Return default coaching response instead of throwing error
    return DEFAULT_COACHING_RESPONSE;
  }
}