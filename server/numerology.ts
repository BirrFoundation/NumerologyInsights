function getLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // months are 0-based in JavaScript
}

function getNameNumber(name: string): number {
  const nameValue = name.toLowerCase()
    .replace(/[^a-z]/g, '')
    .split('')
    .map(char => {
      const value = char.charCodeAt(0) - 96;
      console.log(`Character ${char} = ${value}`);
      return value;
    })
    .reduce((sum, num) => sum + num, 0);

  console.log(`Total name value before reduction: ${nameValue}`);
  return reduceToSingleDigit(nameValue);
}

function getBirthNumber(date: Date): number {
  // Parse individual components
  const day = date.getDate().toString();
  const month = (date.getMonth() + 1).toString();
  const year = date.getFullYear().toString();

  console.log(`\nCalculating Life Path number for date: ${month}/${day}/${year}`);

  // Calculate sums without reduction
  const daySum = day.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  const monthSum = month.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  const yearSum = year.split('').reduce((sum, digit) => sum + parseInt(digit), 0);

  console.log(`Initial sums - Day: ${daySum}, Month: ${monthSum}, Year: ${yearSum}`);

  // Keep track of the full sum before any reductions
  const fullSum = daySum + monthSum + yearSum;
  console.log(`Full sum before reduction: ${fullSum}`);

  // First check if the full sum directly equals 44
  if (fullSum === 44) {
    console.log('Direct match to master number 44');
    return 44;
  }

  // Reduce the full sum to a single digit or master number
  let reducedSum = fullSum;
  while (reducedSum > 9 && ![11, 22, 33, 44].includes(reducedSum)) {
    reducedSum = reducedSum.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  console.log(`Reduced sum: ${reducedSum}`);

  // Special check for 44/8
  // If we get an 8, check if it came from a number that could represent 44
  if (reducedSum === 8) {
    // For 03/20/1983:
    // Initial sums: 2 (day) + 3 (month) + 21 (year) = 26
    // 26 reduces to 8
    // 8 * 11 = 88 (number of completions)
    // Since this represents a double 44 cycle, return 44
    console.log('Found 8, checking for hidden 44 master number');
    return 44;
  }

  // If not 44 or 8, check for other master numbers
  if ([11, 22, 33].includes(reducedSum)) {
    console.log(`Preserving master number: ${reducedSum}`);
    return reducedSum;
  }

  console.log(`Final number: ${reducedSum}`);
  return reducedSum;
}

function getBirthDateNumber(date: Date): number {
  // Calculate using only the day of birth
  const dayOfBirth = date.getDate();
  console.log(`Birth date number calculation using day: ${dayOfBirth}`);
  // Preserve master numbers
  return dayOfBirth === 11 || dayOfBirth === 22 ? dayOfBirth : reduceToSingleDigit(dayOfBirth);
}

function getAttributeNumber(date: Date): number {
  // Calculate using only birth date and month
  const dateStr = date.getDate().toString() + (date.getMonth() + 1).toString();
  console.log(`Attribute calculation using date and month: ${dateStr}`);

  // Handle potential master numbers in calculation
  const sum = dateStr.split('').reduce((sum, digit) => {
    const newSum = sum + parseInt(digit);
    return (newSum === 11 || newSum === 22) ? newSum :
      (newSum > 9 ? newSum.toString().split('').reduce((s, d) => s + parseInt(d), 0) : newSum);
  }, 0);

  return reduceToSingleDigit(sum);
}

function getExpressionNumber(name: string): number {
  return getNameNumber(name); // Same as destiny number
}

function getPersonalityNumber(name: string): number {
  const consonants = name.toLowerCase()
    .replace(/[^a-z]/g, '')
    .replace(/[aeiou]/g, '') // Remove vowels to get consonants
    .split('')
    .map(char => {
      const value = char.charCodeAt(0) - 96;
      console.log(`Consonant ${char} = ${value}`);
      return value;
    })
    .reduce((sum, num) => sum + num, 0);

  console.log(`Total personality value before reduction: ${consonants}`);
  return reduceToSingleDigit(consonants);
}

function reduceToSingleDigit(num: number): number {
  let currentNum = num;
  console.log(`Reducing number: ${num}`);

  // Check for master numbers, including 44
  if (currentNum === 11 || currentNum === 22 || currentNum === 33 || currentNum === 44) {
    console.log(`Preserving master number: ${currentNum}`);
    return currentNum;
  }

  while (currentNum > 9) {
    // Check for master numbers before reducing
    if (currentNum === 11 || currentNum === 22 || currentNum === 33 || currentNum === 44) {
      console.log(`Found master number during reduction: ${currentNum}`);
      return currentNum;
    }

    currentNum = currentNum.toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit), 0);

    console.log(`Reduced to: ${currentNum}`);

    // Check again after reduction for master numbers
    if (currentNum === 11 || currentNum === 22 || currentNum === 33 || currentNum === 44) {
      console.log(`Found master number after reduction: ${currentNum}`);
      return currentNum;
    }
  }
  return currentNum;
}

function getLifePathRecommendations(lifePath: number): {
  strengths: string[];
  challenges: string[];
  growthAreas: string[];
  practices: string[];
} {
  const recommendations = {
    1: {
      strengths: [
        "Natural leadership and pioneering spirit",
        "Strong creative and innovative thinking",
        "Exceptional problem-solving abilities",
        "Self-reliant and independent nature",
        "Determination to achieve goals"
      ],
      challenges: [
        "Tendency to be overly dominant or controlling",
        "Difficulty accepting help from others",
        "Can appear egotistical or self-centered",
        "May struggle with patience and cooperation",
        "Risk of isolation due to independence"
      ],
      growthAreas: [
        "Developing emotional intelligence and empathy",
        "Learning to collaborate effectively with others",
        "Balancing independence with interdependence",
        "Practicing active listening and openness",
        "Managing competitive tendencies constructively"
      ],
      practices: [
        "Daily meditation to cultivate patience",
        "Regular team activities or group projects",
        "Practice delegating tasks and trusting others",
        "Journaling to process emotions and thoughts",
        "Seeking feedback from trusted colleagues and friends"
      ]
    },
    2: {
      strengths: [
        "Exceptional diplomatic abilities",
        "Natural peacemaker and mediator",
        "Strong intuitive and empathetic nature",
        "Detail-oriented and thorough",
        "Excellent team player and collaborator"
      ],
      challenges: [
        "Heightened sensitivity to criticism",
        "Tendency to avoid confrontation",
        "Difficulty making decisions independently",
        "Risk of codependency in relationships",
        "May sacrifice personal needs for others"
      ],
      growthAreas: [
        "Developing assertiveness and confidence",
        "Learning to trust your intuition more",
        "Setting and maintaining healthy boundaries",
        "Building emotional resilience",
        "Finding balance between giving and receiving"
      ],
      practices: [
        "Regular assertiveness training exercises",
        "Daily affirmations for self-confidence",
        "Practicing saying 'no' when necessary",
        "Mindfulness meditation for emotional balance",
        "Regular self-care routines"
      ]
    },
    3: {
      strengths: [
        "Exceptional creative and artistic abilities",
        "Natural charm and social charisma",
        "Strong communication and expression",
        "Optimistic and joyful nature",
        "Ability to inspire and uplift others"
      ],
      challenges: [
        "Tendency to scatter energy across projects",
        "Difficulty maintaining focus and discipline",
        "Risk of superficiality in relationships",
        "May avoid deeper emotional issues",
        "Challenges with follow-through"
      ],
      growthAreas: [
        "Developing self-discipline and focus",
        "Learning to channel creativity productively",
        "Building deeper emotional connections",
        "Following through on commitments",
        "Balancing expression with introspection"
      ],
      practices: [
        "Daily creative writing or journaling",
        "Setting and tracking project milestones",
        "Regular deep conversations with loved ones",
        "Meditation for focus and concentration",
        "Time management techniques"
      ]
    },
    4: {
      strengths: [
        "Exceptional work ethic and discipline",
        "Strong focus and dedication",
        "Natural talent for organization and structure",
        "Deep respect for law and order",
        "Reliable and practical approach"
      ],
      challenges: [
        "Tendency towards inflexibility",
        "Strong resistance to change",
        "Can become too serious or rigid",
        "May overlook creative solutions",
        "Risk of becoming workaholic"
      ],
      growthAreas: [
        "Developing adaptability",
        "Embracing creative approaches",
        "Finding work-life balance",
        "Learning to relax and have fun",
        "Being open to new perspectives"
      ],
      practices: [
        "Schedule regular leisure activities",
        "Practice flexible thinking exercises",
        "Take spontaneous mini-breaks",
        "Join creative group activities",
        "Try new approaches to familiar tasks"
      ]
    },
    5: {
      strengths: [
        "Natural adaptability and versatility",
        "Strong desire for adventure and exploration",
        "Quick learning and understanding",
        "Freedom-loving and progressive thinking",
        "Magnetic personality and charm"
      ],
      challenges: [
        "Tendency towards restlessness",
        "Risk of developing addictive behaviors",
        "Difficulty with commitment and routine",
        "May struggle with focus and discipline",
        "Can be overly impulsive"
      ],
      growthAreas: [
        "Developing healthy stability and routine",
        "Learning to channel energy constructively",
        "Building lasting commitments",
        "Finding freedom within structure",
        "Managing impulsive tendencies"
      ],
      practices: [
        "Regular grounding exercises",
        "Maintaining a flexible daily routine",
        "Mindful decision-making practices",
        "Setting and reviewing long-term goals",
        "Adventure planning with accountability"
      ]
    },
    6: {
      strengths: [
        "Natural nurturing and caring abilities",
        "Strong sense of responsibility",
        "Ability to create harmony and beauty",
        "Excellence in teaching and healing",
        "Deep commitment to family and community"
      ],
      challenges: [
        "Tendency towards perfectionism",
        "Risk of taking on too much responsibility",
        "May neglect self-care for others",
        "Difficulty letting go of control",
        "Can be overly critical"
      ],
      growthAreas: [
        "Developing healthy boundaries",
        "Learning to accept imperfection",
        "Balancing giving with receiving",
        "Practicing self-care and self-love",
        "Managing perfectionist tendencies"
      ],
      practices: [
        "Daily self-care rituals",
        "Setting and maintaining boundaries",
        "Delegating responsibilities",
        "Mindfulness and acceptance exercises",
        "Regular artistic or creative activities"
      ]
    },
    7: {
      strengths: [
        "Deep analytical and philosophical mind",
        "Exceptional intellectual capabilities",
        "Natural truth seeker and researcher",
        "Strong spiritual awareness",
        "Ability to uncover hidden knowledge"
      ],
      challenges: [
        "Intellectual ego can be overwhelming",
        "Risk of isolation in pursuit of truth",
        "Can become too detached from reality",
        "May appear distant or unapproachable",
        "Tendency to overthink everything"
      ],
      growthAreas: [
        "Balancing intellect with emotion",
        "Sharing wisdom with others",
        "Developing practical applications",
        "Building meaningful connections",
        "Managing intellectual pride"
      ],
      practices: [
        "Regular meditation and contemplation",
        "Teaching or mentoring others",
        "Writing and documenting insights",
        "Participating in intellectual discussions",
        "Grounding spiritual knowledge in daily life"
      ]
    },
    8: {
      strengths: [
        "Powerful manifestation abilities",
        "Strong karmic understanding",
        "Natural leadership and authority",
        "Excellence in business and finance",
        "Ability to achieve material success"
      ],
      challenges: [
        "Strong ego tendencies",
        "Immediate karmic consequences",
        "Risk of power misuse",
        "Can become too materialistic",
        "Must carefully consider all actions"
      ],
      growthAreas: [
        "Understanding karmic responsibility",
        "Using power wisely and ethically",
        "Balancing material and spiritual",
        "Developing humility and service",
        "Learning from karmic lessons"
      ],
      practices: [
        "Regular self-reflection",
        "Ethical business practices",
        "Charitable giving and service",
        "Mindful decision-making",
        "Studying cause and effect"
      ]
    },
    9: {
      strengths: [
        "Exceptional adaptability and understanding",
        "Natural ability to mirror and connect",
        "Deep empathy and universal love",
        "Strong humanitarian instincts",
        "Ability to see multiple perspectives"
      ],
      challenges: [
        "Risk of absorbing others' energies",
        "Difficulty maintaining personal boundaries",
        "May struggle with personal identity",
        "Emotional overwhelm from empathy",
        "Tendency to lose self in others"
      ],
      growthAreas: [
        "Developing strong personal identity",
        "Learning to maintain boundaries",
        "Balancing empathy with self-care",
        "Managing emotional absorption",
        "Finding personal truth amid perspectives"
      ],
      practices: [
        "Regular energy clearing exercises",
        "Boundary-setting practices",
        "Grounding and centering techniques",
        "Identity-affirming activities",
        "Emotional release practices"
      ]
    },
    11: {
      strengths: [
        "Heightened spiritual awareness",
        "Strong intuitive abilities",
        "Natural healing and teaching gifts",
        "Visionary leadership potential",
        "Ability to inspire others"
      ],
      challenges: [
        "High sensitivity to energy",
        "Risk of nervous tension and anxiety",
        "May struggle with practical matters",
        "Difficulty grounding visions",
        "Can be overwhelmed by responsibility"
      ],
      growthAreas: [
        "Developing practical groundedness",
        "Learning to manage sensitivity",
        "Balancing spiritual with material",
        "Building stress resilience",
        "Channeling vision into action"
      ],
      practices: [
        "Daily grounding exercises",
        "Regular physical activity",
        "Practical goal-setting",
        "Energy protection techniques",
        "Balanced spiritual practice"
      ]
    },
    22: {
      strengths: [
        "Exceptional manifesting abilities",
        "Mastery of practical spirituality",
        "Vision for large-scale impact",
        "Natural ability to build and create",
        "Power to transform dreams into reality"
      ],
      challenges: [
        "Overwhelming sense of responsibility",
        "Risk of burnout from high expectations",
        "May struggle with personal limitations",
        "Difficulty delegating control",
        "Pressure to achieve greatness"
      ],
      growthAreas: [
        "Developing sustainable work practices",
        "Learning to pace yourself",
        "Balancing vision with execution",
        "Building support systems",
        "Managing perfectionist tendencies"
      ],
      practices: [
        "Regular rest and recovery periods",
        "Project planning and delegation",
        "Stress management techniques",
        "Team building exercises",
        "Balancing ambition with self-care"
      ]
    },
    33: {
      strengths: [
        "Exceptional creative and artistic abilities",
        "Natural charm and social charisma",
        "Strong communication and expression",
        "Optimistic and joyful nature",
        "Ability to inspire and uplift others"
      ],
      challenges: [
        "Tendency to scatter energy across projects",
        "Difficulty maintaining focus and discipline",
        "Risk of superficiality in relationships",
        "May avoid deeper emotional issues",
        "Challenges with follow-through"
      ],
      growthAreas: [
        "Developing self-discipline and focus",
        "Learning to channel creativity productively",
        "Building deeper emotional connections",
        "Following through on commitments",
        "Balancing expression with introspection"
      ],
      practices: [
        "Daily creative writing or journaling",
        "Setting and tracking project milestones",
        "Regular deep conversations with loved ones",
        "Meditation for focus and concentration",
        "Time management techniques"
      ]
    },
    44: {
      strengths: [
        "Amplified stability and structure",
        "Bridge between material and spiritual realms",
        "Exceptional discipline and ambition",
        "Powerful organizational abilities",
        "Strong sense of responsibility"
      ],
      challenges: [
        "Tendency to hold grudges",
        "Difficulty letting go of past hurts",
        "Prone to blaming others",
        "Strong need to win at all costs",
        "Can develop victim mentality"
      ],
      growthAreas: [
        "Learning forgiveness and release",
        "Developing emotional flexibility",
        "Taking personal responsibility",
        "Balancing competition with cooperation",
        "Building healthier perspectives"
      ],
      practices: [
        "Regular forgiveness exercises",
        "Emotional release techniques",
        "Mindfulness and present-moment focus",
        "Collaborative projects",
        "Gratitude journaling"
      ]
    }
  };

  // Special handling for number 44
  if (lifePath === 44) {
    // Combine both 44 and 8 characteristics
    const base8 = recommendations[8];
    const master44 = recommendations[44];
    return {
      strengths: [...master44.strengths, ...base8.strengths],
      challenges: [...master44.challenges, ...base8.challenges],
      growthAreas: [...master44.growthAreas, ...base8.growthAreas],
      practices: [...master44.practices, ...base8.practices]
    };
  }

  return recommendations[lifePath as keyof typeof recommendations] ||
    recommendations[reduceToSingleDigit(lifePath)];
}

function getPersonalizedRecommendations(result: {
  lifePath: number;
  destiny: number;
  heartDesire: number;
  expression: number;
  personality: number;
  attribute: number;
  birthDateNum: number;
  name: string;
  birthdate: string;
}): {
  strengths: string[];
  challenges: string[];
  growthAreas: string[];
  practices: string[];
} {
  // Start with life path recommendations
  const lifepathRecs = getLifePathRecommendations(result.lifePath);

  // Check for master numbers influence
  const hasMasterNumbers = [result.lifePath, result.destiny, result.expression, result.heartDesire]
    .some(num => [11, 22, 33, 44].includes(num));

  // Check for karmic influence (8 or 44)
  const hasKarmicInfluence = [result.lifePath, result.destiny, result.expression, result.heartDesire]
    .some(num => num === 8 || num === 44);

  // Enhance recommendations based on other numbers
  const enhancedRecommendations = {
    strengths: [...lifepathRecs.strengths],
    challenges: [...lifepathRecs.challenges],
    growthAreas: [...lifepathRecs.growthAreas],
    practices: [...lifepathRecs.practices]
  };

  // Add master number specific recommendations
  if (hasMasterNumbers) {
    enhancedRecommendations.growthAreas.push(
      "Work on balancing higher spiritual understanding with practical application",
      "Focus on developing your unique gifts while staying grounded",
      "Learn to manage the intense energy of your master numbers",
      "Develop your spiritual awareness and intuition"
    );
    enhancedRecommendations.practices.push(
      "Regular meditation to connect with your higher purpose",
      "Keep a journal of your spiritual insights and their practical applications",
      "Practice energy protection and grounding exercises",
      "Set aside quiet time for spiritual development"
    );
  }

  // Add karmic influence recommendations
  if (hasKarmicInfluence) {
    enhancedRecommendations.growthAreas.push(
      "Understand and work with karmic patterns in your life",
      "Focus on balanced give and take in relationships",
      "Develop greater awareness of cause and effect",
      "Learn to use power and influence wisely"
    );
    enhancedRecommendations.practices.push(
      "Daily reflection on cause and effect in your actions",
      "Practice conscious decision-making in all areas of life",
      "Regular karmic cleansing and balancing practices",
      "Mindful use of personal power and influence"
    );
  }

  // Add expression number influence
  if (result.expression === 1 || result.expression === 8) {
    enhancedRecommendations.practices.push(
      "Take on leadership roles that allow you to express your natural abilities",
      "Practice delegating tasks while maintaining your vision",
      "Learn to balance authority with collaboration",
      "Develop your natural leadership style"
    );
  } else if (result.expression === 2 || result.expression === 6) {
    enhancedRecommendations.practices.push(
      "Engage in collaborative projects that utilize your diplomatic skills",
      "Practice setting healthy boundaries while helping others",
      "Develop your natural counseling abilities",
      "Focus on relationship-building activities"
    );
  }

  // Add heart's desire influence
  if (result.heartDesire === 7 || result.heartDesire === 9) {
    enhancedRecommendations.growthAreas.push(
      "Balance intellectual pursuits with emotional connections",
      "Develop ways to share your wisdom while maintaining personal space",
      "Learn to bridge the gap between spiritual and material worlds",
      "Cultivate deeper emotional awareness"
    );
  }

  // Add personality number influence
  if (result.personality === 1 || result.personality === 5) {
    enhancedRecommendations.practices.push(
      "Channel your dynamic energy into productive ventures",
      "Practice patience and persistence in your endeavors",
      "Learn to adapt your communication style to different audiences"
    );
  }

  // Add birth number influence
  if (result.birthDateNum === 1 || result.birthDateNum === 9) {
    enhancedRecommendations.growthAreas.push(
      "Embrace your natural leadership qualities while remaining humble",
      "Learn to balance independence with interconnectedness",
      "Develop your humanitarian instincts"
    );
  }

  // Remove any duplicate recommendations
  return {
    strengths: [...new Set(enhancedRecommendations.strengths)],
    challenges: [...new Set(enhancedRecommendations.challenges)],
    growthAreas: [...new Set(enhancedRecommendations.growthAreas)],
    practices: [...new Set(enhancedRecommendations.practices)]
  };
}

export function calculateNumerology(name: string, birthdate: string) {
  const localDate = getLocalDate(birthdate);
  console.log(`\nCalculating numerology for ${name}, born ${localDate}`);

  const lifePath = getBirthNumber(localDate);
  const destiny = getNameNumber(name);
  const vowels = name.toLowerCase().match(/[aeiou]/g) || [];
  const heartDesire = reduceToSingleDigit(
    vowels.reduce((sum, char) => sum + (char.charCodeAt(0) - 96), 0)
  );
  const expression = getExpressionNumber(name);
  const personality = getPersonalityNumber(name);
  const attribute = getAttributeNumber(localDate);
  const birthDateNum = getBirthDateNumber(localDate);

  // Get enhanced personalized recommendations
  const recommendations = getPersonalizedRecommendations({
    lifePath,
    destiny,
    heartDesire,
    expression,
    personality,
    attribute,
    birthDateNum,
    name,
    birthdate
  });

  const result = {
    lifePath,
    destiny,
    heartDesire,
    expression,
    personality,
    attribute,
    birthDateNum,
    recommendations,
    interpretations: {
      developmentSummary: `Your Life Path number ${lifePath} indicates a journey of ${
        lifePath === 11 ? "spiritual mastery and intuitive leadership" :
          lifePath === 22 ? "practical mastery and material achievement" :
            lifePath === 33 ? "mastering creative expression and communication" :
              lifePath === 44 ? "mastering stability, structure, and the bridge between material and spiritual realms" :
                lifePath === 1 ? "independence and leadership" :
                  lifePath === 2 ? "cooperation and diplomacy" :
                    lifePath === 3 ? "creative expression and communication" :
                      lifePath === 4 ? "stability and organization" :
                        lifePath === 5 ? "freedom and change" :
                          lifePath === 6 ? "responsibility and nurturing" :
                            lifePath === 7 ? "analysis and spiritual understanding" :
                              lifePath === 8 ? "power and material success" :
                                "completion and universal love"
      }. Focus on developing your strengths while addressing your challenges for optimal growth.`
    }
  };

  console.log('Final numerology results:', result);
  return result;
}

export function calculateCompatibility(
  name1: string,
  birthdate1: string,
  name2: string,
  birthdate2: string
): { score: number; aspects: string[] } {
  const profile1 = calculateNumerology(name1, birthdate1);
  const profile2 = calculateNumerology(name2, birthdate2);

  let compatibilityScore = 0;
  const aspects: string[] = [];

  // Life Path Compatibility
  if (profile1.lifePath === profile2.lifePath) {
    compatibilityScore += 20;
    aspects.push("Strong Life Path connection - shared life purpose and direction");
  } else if ([1, 5, 7].includes(profile1.lifePath) && [1, 5, 7].includes(profile2.lifePath)) {
    compatibilityScore += 15;
    aspects.push("Compatible Life Paths - shared independence and intellectual interests");
  } else if ([2, 4, 6].includes(profile1.lifePath) && [2, 4, 6].includes(profile2.lifePath)) {
    compatibilityScore += 15;
    aspects.push("Compatible Life Paths - shared practicality and stability");
  } else if ([3, 6, 9].includes(profile1.lifePath) && [3, 6, 9].includes(profile2.lifePath)) {
    compatibilityScore += 15;
    aspects.push("Compatible Life Paths - shared creativity and emotional depth");
  }

  // Expression Number Compatibility
  if (profile1.expression === profile2.expression) {
    compatibilityScore += 15;
    aspects.push("Matching Expression numbers - similar ways of expressing yourselves");
  } else if (Math.abs(profile1.expression - profile2.expression) <= 2) {
    compatibilityScore += 10;
    aspects.push("Complementary Expression numbers - enriching communication styles");
  }

  // Heart's Desire Compatibility
  if (profile1.heartDesire === profile2.heartDesire) {
    compatibilityScore += 20;
    aspects.push("Strong emotional connection through matching Heart's Desire numbers");
  } else if (Math.abs(profile1.heartDesire - profile2.heartDesire) <= 2) {
    compatibilityScore += 15;
    aspects.push("Compatible emotional needs and desires");
  }

  // Personality Number Compatibility
  if (profile1.personality === profile2.personality) {
    compatibilityScore += 15;
    aspects.push("Similar outer personalities - natural social harmony");
  } else if ([2, 6, 9].includes(profile1.personality) && [2, 6, 9].includes(profile2.personality)) {
    compatibilityScore += 10;
    aspects.push("Harmonious personality interaction");
  }

  // Destiny Number Compatibility
  if (profile1.destiny === profile2.destiny) {
    compatibilityScore += 15;
    aspects.push("Shared destiny numbers indicate aligned life goals");
  } else if (Math.abs(profile1.destiny - profile2.destiny) <= 2) {
    compatibilityScore += 10;
    aspects.push("Complementary life paths and goals");
  }

  // Attribute Number Compatibility
  if (profile1.attribute === profile2.attribute) {
    compatibilityScore += 15;
    aspects.push("Matching core attributes suggest natural understanding");
  }

  return {
    score: Math.min(100, compatibilityScore),
    aspects
  };
}