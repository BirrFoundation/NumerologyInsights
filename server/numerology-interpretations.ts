// Basic interpretations for when AI service is unavailable
export const basicInterpretations = {
  lifePath: (number: number) => {
    const meanings: Record<number, string> = {
      1: "Natural born leader, independent and ambitious",
      2: "Cooperative, diplomatic, and sensitive",
      3: "Creative, expressive, and optimistic",
      4: "Practical, hardworking, and trustworthy",
      5: "Adventurous, versatile, and freedom-loving",
      6: "Nurturing, responsible, and caring",
      7: "Analytical, introspective, and spiritual",
      8: "Ambitious, goal-oriented, and business-minded",
      9: "Humanitarian, compassionate, and selfless",
      11: "Intuitive visionary with spiritual awareness",
      22: "Master builder with great potential for achievement"
    };
    return meanings[number] || "A unique number with special significance";
  },

  destiny: (number: number) => {
    const meanings: Record<number, string> = {
      1: "Born to lead and pioneer new paths",
      2: "Natural mediator and peaceful soul",
      3: "Gifted communicator and creative spirit",
      4: "Builder and creator of stable foundations",
      5: "Agent of change and adventure",
      6: "Nurturing guide and responsible leader",
      7: "Seeker of wisdom and truth",
      8: "Material and spiritual abundance",
      9: "Humanitarian and compassionate teacher",
      11: "Inspirational teacher and healer",
      22: "Practical visionary with great potential"
    };
    return meanings[number] || "A number of unique destiny";
  },

  heartDesire: (number: number) => {
    const meanings: Record<number, string> = {
      1: "Desires independence and leadership",
      2: "Seeks harmony and cooperation",
      3: "Yearns for self-expression and joy",
      4: "Wants stability and order",
      5: "Craves freedom and adventure",
      6: "Seeks love and harmony",
      7: "Desires wisdom and understanding",
      8: "Aims for success and abundance",
      9: "Wants to make a difference",
      11: "Seeks spiritual enlightenment",
      22: "Desires to build lasting achievements"
    };
    return meanings[number] || "Has unique inner desires";
  },

  expression: (number: number) => {
    const meanings: Record<number, string> = {
      1: "Expresses leadership and innovation",
      2: "Shows diplomacy and cooperation",
      3: "Manifests creativity and communication",
      4: "Demonstrates practicality and organization",
      5: "Shows versatility and adaptability",
      6: "Expresses care and responsibility",
      7: "Manifests wisdom and analysis",
      8: "Shows executive ability and power",
      9: "Demonstrates universal love and artistry",
      11: "Expresses spiritual insight",
      22: "Shows mastery and achievement"
    };
    return meanings[number] || "Has a unique way of expression";
  },

  personality: (number: number) => {
    const meanings: Record<number, string> = {
      1: "Appears confident and independent",
      2: "Comes across as diplomatic and kind",
      3: "Appears social and expressive",
      4: "Seems reliable and organized",
      5: "Appears dynamic and adventurous",
      6: "Comes across as responsible and caring",
      7: "Seems mysterious and thoughtful",
      8: "Appears successful and capable",
      9: "Comes across as sophisticated and wise",
      11: "Seems inspired and inspiring",
      22: "Appears masterful and accomplished"
    };
    return meanings[number] || "Has a unique personality signature";
  },

  getBasicInterpretation: (numbers: { 
    lifePath: number;
    destiny: number;
    heartDesire: number;
    expression: number;
    personality: number;
  }) => {
    return {
      lifePath: basicInterpretations.lifePath(numbers.lifePath),
      destiny: basicInterpretations.destiny(numbers.destiny),
      heartDesire: basicInterpretations.heartDesire(numbers.heartDesire),
      expression: basicInterpretations.expression(numbers.expression),
      personality: basicInterpretations.personality(numbers.personality),
      overview: `Your Life Path ${numbers.lifePath} shows your life's purpose, while your Destiny number ${numbers.destiny} reveals your potential. Your Heart's Desire ${numbers.heartDesire} indicates your inner motivation, Expression number ${numbers.expression} shows how you express yourself, and Personality number ${numbers.personality} reflects how others see you.`
    };
  }
};
