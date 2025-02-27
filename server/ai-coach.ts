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
    Use the provided numerology results to give personalized, actionable advice.
    Focus on practical steps and insights based on the person's numbers.
    Be encouraging but direct. Keep responses concise and actionable.

    When providing advice:
    1. Consider all numerology numbers in the profile
    2. Focus on strengths while acknowledging challenges
    3. Provide specific, actionable steps
    4. Connect advice to the person's numerological DNA pattern
    5. Consider both spiritual and practical aspects

    Format response as JSON with:
    {
      "advice": "detailed coaching advice",
      "followUpQuestions": ["2-3 relevant follow-up questions to deepen the coaching"]
    }`;

    const userPrompt = userQuery 
      ? `Based on the numerology profile and this specific question: "${userQuery}", provide personalized coaching advice.`
      : "Based on this numerology profile, provide initial coaching insights and guidance.";

    const response = await openai.chat.completions.create({
      model: COACHING_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `
            Numerology Profile:
            - Life Path: ${result.lifePath}
            - Destiny: ${result.destiny}
            - Expression: ${result.expression}
            - Heart's Desire: ${result.heartDesire}
            - Personality: ${result.personality}
            - Birth Date: ${result.birthDateNum}

            Current Question/Focus: ${userPrompt}
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