import OpenAI from "openai";
import type { NumerologyResult } from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const COACHING_MODEL = "gpt-4o";

interface CoachingResponse {
  advice: string;
  followUpQuestions: string[];
}

function determineQuestionCategory(query: string): string {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('career') || lowerQuery.includes('work') || lowerQuery.includes('job') || lowerQuery.includes('business')) {
    return 'career';
  }
  if (lowerQuery.includes('love') || lowerQuery.includes('relationship') || lowerQuery.includes('partner')) {
    return 'relationships';
  }
  if (lowerQuery.includes('spirit') || lowerQuery.includes('meditation') || lowerQuery.includes('soul')) {
    return 'spiritual';
  }
  if (lowerQuery.includes('money') || lowerQuery.includes('finance') || lowerQuery.includes('wealth')) {
    return 'financial';
  }
  return 'general';
}

export async function getPersonalizedCoaching(
  result: NumerologyResult,
  userQuery?: string
): Promise<CoachingResponse> {
  try {
    const questionCategory = userQuery ? determineQuestionCategory(userQuery) : 'general';

    const systemPrompt = `You are an expert numerology-based personal development coach.
    Your role is to provide highly personalized coaching advice based on numerological patterns.
    The current question category is: ${questionCategory}

    Key rules:
    1. NEVER give generic advice - every response must directly reference their specific numbers
    2. For each response, focus on different aspects of their numerology than previous responses
    3. Include at least one concrete action step they can take immediately
    4. When addressing questions, explain WHY your advice connects to their specific numbers
    5. Follow the specific guidance for each question category

    Category-specific focus:
    - Career questions: Analyze Life Path (${result.lifePath}), Expression (${result.expression}), and Destiny (${result.destiny})
    - Relationship questions: Focus on Heart's Desire (${result.heartDesire}) and Personality (${result.personality})
    - Spiritual questions: Emphasize Life Path and any master numbers present
    - Financial questions: Focus on the 8/44 influence if present, or Expression number
    - General questions: Provide balanced insight from all numbers

    Follow-up questions should:
    1. Never repeat previous questions
    2. Target different aspects of their numerology each time
    3. Help them explore practical applications
    4. Connect to their current focus area
    5. Lead to deeper understanding of their numbers

    Format your response as JSON matching this exact structure:
    {
      "advice": "string containing detailed coaching advice that directly references their numbers",
      "followUpQuestions": ["array of 3-4 unique questions that explore different aspects"]
    }`;

    const masterNumbers = [result.lifePath, result.destiny, result.expression, result.heartDesire]
      .filter(num => [11, 22, 33, 44].includes(num));

    const karmicNumbers = [result.lifePath, result.destiny, result.expression, result.heartDesire]
      .filter(num => num === 8 || num === 44);

    const userContent = userQuery 
      ? `Question: "${userQuery}"

        Numerological Context for ${questionCategory} question:
        ${questionCategory === 'career' 
          ? `Primary Career Numbers:
             - Life Path ${result.lifePath}: Your career direction
             - Expression ${result.expression}: Your natural talents
             - Destiny ${result.destiny}: Your ultimate career goals`
          : questionCategory === 'relationships'
          ? `Key Relationship Numbers:
             - Heart's Desire ${result.heartDesire}: Your emotional needs
             - Personality ${result.personality}: How you interact with others`
          : questionCategory === 'spiritual'
          ? `Spiritual Indicators:
             - Life Path ${result.lifePath}: Your spiritual journey
             - Master Numbers Present: ${masterNumbers.join(', ') || 'None'}`
          : questionCategory === 'financial'
          ? `Financial Influences:
             - Expression ${result.expression}: Your earning potential
             - Karmic Numbers Present: ${karmicNumbers.join(', ') || 'None'}`
          : `Core Numbers:
             - Life Path ${result.lifePath}: Life direction
             - Expression ${result.expression}: Natural talents
             - Heart's Desire ${result.heartDesire}: Inner motivation`}

        Additional Context:
        - Master Numbers: ${masterNumbers.length > 0 ? masterNumbers.join(', ') : 'None'}
        - Karmic Influence: ${karmicNumbers.length > 0 ? 'Strong' : 'Normal'}

        Based on their numbers and this specific question, provide unique guidance that directly connects to their numerological profile.`
      : `Provide initial coaching insights focusing on their core numbers:
        - Life Path ${result.lifePath}: Primary life direction
        - Expression ${result.expression}: Natural talents
        - Heart's Desire ${result.heartDesire}: Inner motivation

        Special Influences:
        ${masterNumbers.length > 0 ? `- Master Numbers: ${masterNumbers.join(', ')}` : ''}
        ${karmicNumbers.length > 0 ? '- Strong Karmic Influence Present' : ''}

        Focus on immediate practical steps they can take based on these numbers.`;

    const response = await openai.chat.completions.create({
      model: COACHING_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000
    });

    if (!response.choices[0].message.content) {
      throw new Error("Empty response from OpenAI");
    }

    return JSON.parse(response.choices[0].message.content) as CoachingResponse;
  } catch (error) {
    console.error('AI Coaching error:', error);
    throw error; // Throw the error instead of returning default response
  }
}