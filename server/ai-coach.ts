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
    Your role is to provide highly personalized coaching advice based on numerological patterns.

    Key rules:
    1. ALWAYS address the specific question asked by relating it to their numerological profile
    2. Different questions should receive distinctly different responses
    3. Use concrete examples and specific numbers from their profile
    4. If no specific question is asked, focus on their dominant numbers
    5. Never give generic advice - always tie it to their specific numbers

    Question handling rules:
    - For career questions: Focus on Life Path (${result.lifePath}) and Expression (${result.expression}) numbers
    - For relationship questions: Focus on Heart's Desire (${result.heartDesire}) and Personality (${result.personality}) numbers
    - For spiritual questions: Focus on Life Path and master numbers if present
    - For practical questions: Focus on Expression and Birth Date (${result.birthDateNum}) numbers

    Follow-up questions should:
    - Be specific to their numbers and current question
    - Explore different aspects of their profile
    - Help them understand the practical application of their numbers
    - Never be generic or repetitive

    Format response as JSON with:
    {
      "advice": "detailed coaching advice specific to their question and numbers",
      "followUpQuestions": ["3-4 questions that specifically relate to their current focus"]
    }`;

    const masterNumbers = [result.lifePath, result.destiny, result.expression, result.heartDesire]
      .filter(num => [11, 22, 33, 44].includes(num));

    const karmicInfluence = [result.lifePath, result.destiny, result.expression, result.heartDesire]
      .filter(num => num === 8 || num === 44).length > 0;

    const userContent = userQuery 
      ? `Question: "${userQuery}"

        Analyze this question in the context of their numerological profile:
        - Life Path ${result.lifePath}: Primary life direction
        - Expression ${result.expression}: Natural talents
        - Heart's Desire ${result.heartDesire}: Inner motivation
        - Personality ${result.personality}: External self
        - Destiny ${result.destiny}: Life goals
        - Birth Date ${result.birthDateNum}: Core traits

        Special Influences:
        ${masterNumbers.length > 0 ? `- Master Numbers Present: ${masterNumbers.join(', ')}` : ''}
        ${karmicInfluence ? '- Strong Karmic Influence (8/44) Present' : ''}

        Provide specific advice that addresses their question while incorporating relevant numbers.`
      : `Provide initial coaching insights focusing on their primary numbers:
        - Life Path ${result.lifePath}
        - Expression ${result.expression}
        - Heart's Desire ${result.heartDesire}

        Key Patterns:
        ${masterNumbers.length > 0 ? `- Master Numbers: ${masterNumbers.join(', ')}` : ''}
        ${karmicInfluence ? '- Karmic Influence Present' : ''}

        Focus on practical applications of these numbers in their life.`;

    const response = await openai.chat.completions.create({
      model: COACHING_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
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
    return DEFAULT_COACHING_RESPONSE;
  }
}