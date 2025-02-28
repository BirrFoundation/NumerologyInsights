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
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  console.log(`\nCalculating Life Path number for date: ${month}/${day}/${year}`);

  // Keep day as is if it's a master number
  const dayValue = [11, 22, 33].includes(day) ? day : day;

  // For month, simply use the value (no master numbers possible in months 1-12)
  const monthValue = month;

  // For year, add digits together but keep master numbers
  const yearStr = year.toString();
  let yearValue = 0;
  if (yearStr.startsWith('11')) {
    yearValue = 11 + parseInt(yearStr.slice(2).split('').reduce((sum, digit) => sum + parseInt(digit), '0'));
  } else if (yearStr.startsWith('22')) {
    yearValue = 22 + parseInt(yearStr.slice(2).split('').reduce((sum, digit) => sum + parseInt(digit), '0'));
  } else if (yearStr.startsWith('33')) {
    yearValue = 33 + parseInt(yearStr.slice(2).split('').reduce((sum, digit) => sum + parseInt(digit), '0'));
  } else {
    yearValue = yearStr.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }

  console.log(`Component values - Day: ${dayValue}, Month: ${monthValue}, Year: ${yearValue}`);

  // Calculate the total while preserving master numbers
  const totalSum = dayValue + monthValue + yearValue;
  console.log(`Total sum before reduction: ${totalSum}`);

  // Check for master numbers and special numbers in the total
  if ([11, 22, 33, 44].includes(totalSum)) {
    console.log(`Found master/special number in total: ${totalSum}`);
    return totalSum;
  }

  // Special check for 44/8
  if (totalSum === 44) {
    console.log('Found special number 44');
    return 44;
  }

  // If not a master number, reduce while checking for master numbers in reduction
  let currentNum = totalSum;
  while (currentNum > 9) {
    // Before reducing, check for master numbers
    if ([11, 22, 33].includes(currentNum)) {
      console.log(`Found master number during reduction: ${currentNum}`);
      return currentNum;
    }

    currentNum = currentNum.toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit), 0);

    console.log(`Reduced to: ${currentNum}`);

    // Check again after reduction
    if ([11, 22, 33].includes(currentNum)) {
      console.log(`Found master number after reduction: ${currentNum}`);
      return currentNum;
    }
  }

  // Special handling for karmic number 8
  if (currentNum === 8) {
    console.log('Found karmic number 8 - requires special attention for karmic influences');
  }

  console.log(`Final number: ${currentNum}`);
  return currentNum;
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

  // First check for special numbers
  // Check for 28 (wealth number)
  if (currentNum === 28) {
    console.log(`Found wealth number: ${currentNum}`);
    return 28;
  }

  // Check for master numbers and special number 44
  if ([11, 22, 33, 44].includes(currentNum)) {
    console.log(`Preserving master/special number: ${currentNum}`);
    return currentNum;
  }

  while (currentNum > 9) {
    // Before reducing, check for master numbers and special number 44
    if ([11, 22, 33, 44].includes(currentNum)) {
      console.log(`Found master/special number during reduction: ${currentNum}`);
      return currentNum;
    }

    currentNum = currentNum.toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit), 0);

    console.log(`Reduced to: ${currentNum}`);

    // Check again after reduction for master numbers
    if ([11, 22, 33, 44].includes(currentNum)) {
      console.log(`Found master/special number after reduction: ${currentNum}`);
      return currentNum;
    }
  }

  // Special handling for the karmic number 8
  if (currentNum === 8) {
    console.log('Found karmic number 8 - requires special attention for karmic influences');
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
        "Strong desire for recognition and achievement",
        "Exceptional creative abilities",
        "Self-reliant and independent nature",
        "Powerful manifestation abilities"
      ],
      challenges: [
        "Tendency towards excessive ego",
        "Need for constant recognition",
        "Can become overly dominant",
        "Risk of alienating others",
        "May struggle with sharing spotlight"
      ],
      growthAreas: [
        "Learning to balance ego with humility",
        "Developing collaborative skills",
        "Recognizing others' contributions",
        "Building emotional intelligence",
        "Finding inner validation"
      ],
      practices: [
        "Regular gratitude exercises",
        "Team-building activities",
        "Mindfulness meditation",
        "Service to others",
        "Active listening practice"
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
        "Powerful karmic manifestation abilities",
        "Strong business and financial acumen",
        "Natural authority and leadership",
        "Ability to achieve material success",
        "Understanding of cause and effect"
      ],
      challenges: [
        "Intense karmic consequences for actions",
        "Risk of power misuse",
        "Strong materialistic tendencies",
        "Must carefully consider all decisions",
        "Karmic debt responsibilities"
      ],
      growthAreas: [
        "Developing ethical business practices",
        "Understanding karmic responsibility",
        "Balancing material and spiritual",
        "Learning from past life lessons",
        "Building positive karma"
      ],
      practices: [
        "Daily karmic reflection",
        "Ethical decision-making",
        "Regular charitable giving",
        "Conscious business practices",
        "Karmic cleansing meditation"
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
    28: {
      strengths: [
        "Natural abundance attraction",
        "Financial leadership abilities",
        "Balance of material and spiritual",
        "Strong manifestation power",
        "Business acumen"
      ],
      challenges: [
        "Risk of material attachment",
        "Balancing wealth with spirituality",
        "Managing financial responsibility",
        "Avoiding greed",
        "Maintaining ethical standards"
      ],
      growthAreas: [
        "Developing wealth consciousness",
        "Learning spiritual wealth principles",
        "Building sustainable abundance",
        "Understanding money energy",
        "Creating wealth for greater good"
      ],
      practices: [
        "Abundance meditation",
        "Conscious spending",
        "Wealth affirmations",
        "Charitable giving",
        "Financial planning with spiritual alignment"
      ]
    },
    33: {
      strengths: [
        "Highest spiritual teaching abilities",
        "Universal love and compassion",
        "Master healing capabilities",
        "Enlightened creativity",
        "Service to humanity"
      ],
      challenges: [
        "Intense spiritual responsibility",
        "Risk of avoiding higher calling",
        "Challenge of maintaining balance",
        "Overwhelming sensitivity",
        "Personal sacrifice tendencies"
      ],
      growthAreas: [
        "Embracing spiritual leadership",
        "Balancing service with self-care",
        "Developing teaching abilities",
        "Understanding universal love",
        "Mastering spiritual wisdom"
      ],
      practices: [
        "Regular spiritual practice",
        "Teaching and mentoring",
        "Healing work",
        "Compassion meditation",
        "Service projects"
      ]
    },
    44: {
      strengths: [
        "Mastery of material and spiritual realms",
        "Exceptional organizational abilities",
        "Powerful manifestation capabilities",
        "Strong sense of structure",
        "Business mastery"
      ],
      challenges: [
        "Intense karmic responsibility",
        "Risk of power misuse",
        "Challenge of balancing realms",
        "Heavy spiritual burden",
        "Material temptations"
      ],
      growthAreas: [
        "Developing spiritual business practices",
        "Understanding universal laws",
        "Balancing power with wisdom",
        "Creating sustainable structures",
        "Mastering manifestation"
      ],
      practices: [
        "Regular grounding exercises",
        "Spiritual business planning",
        "Power meditation",
        "Structure creation",
        "Manifestation rituals"
      ]
    }
  };

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
      developmentSummary: `Your Life Path number ${lifePath} indicates ${
        lifePath === 11 ? "a journey of spiritual mastery and intuitive leadership" :
          lifePath === 22 ? "a path of practical mastery and material achievement" :
            lifePath === 33 ? "the highest path of spiritual teaching and healing" :
              lifePath === 44 ? "a powerful journey of structure and manifestation" :
                lifePath === 28 ? "a special path of wealth and abundance" :
                  lifePath === 1 ? "a path of leadership and recognition" :
                    lifePath === 3 ? "a creative path with potential for rule-breaking" :
                      lifePath === 4 ? "a path of law-abiding structure" :
                        lifePath === 5 ? "a path requiring careful management of addictive tendencies" :
                          lifePath === 7 ? "a path of intellectual mastery and ego management" :
                            lifePath === 8 ? "a powerful karmic path requiring careful actions" :
                              lifePath === 9 ? "a path of adaptability and universal reflection" :
                                "a unique numerological journey"
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