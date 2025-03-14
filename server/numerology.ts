function getLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // months are 0-based in JavaScript
}

function getNameNumber(name: string): number {
  // Calculate the numerical value of the name by adding all letters
  const nameValue = name.toLowerCase()
    .replace(/[^a-z]/g, '')  // Remove non-letters
    .split('')
    .map(char => {
      const value = char.charCodeAt(0) - 96;  // Convert a=1, b=2, etc.
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

  // Convert numbers to strings for manipulation
  const dayStr = day.toString();
  const monthStr = month.toString();
  const yearStr = year.toString();

  // Initialize components array to store numbers
  let components: number[] = [];

  // Handle day - preserve master numbers
  if ([11, 22, 33].includes(day)) {
    components.push(day);
  } else {
    components.push(...dayStr.split('').map(Number));
  }

  // Handle month - preserve master numbers
  if ([11, 22, 33].includes(month)) {
    components.push(month);
  } else {
    components.push(...monthStr.split('').map(Number));
  }

  // Handle year - add each digit
  components.push(...yearStr.split('').map(Number));

  // Calculate total sum
  const totalSum = components.reduce((sum, num) => sum + num, 0);
  console.log(`Components for addition:`, components);
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
  // Expression number is calculated the same way as destiny number
  return getNameNumber(name);
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

function calculateNumerology(name: string, birthdate: string) {
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

function calculateNumberCompatibility(num1: number, num2: number): number {
  // If numbers are the same, highest compatibility
  if (num1 === num2) return 100;

  // Check for master number compatibility
  if ([11, 22, 33].includes(num1) && [11, 22, 33].includes(num2)) return 90;

  // Check for harmonic number groups
  const harmonicGroups = [
    [1, 5, 7], // Independent numbers
    [2, 4, 6], // Practical numbers
    [3, 6, 9], // Creative numbers
    [8, 4, 1]  // Material success numbers
  ];

  for (const group of harmonicGroups) {
    if (group.includes(reduceToSingleDigit(num1)) && group.includes(reduceToSingleDigit(num2))) {
      return 80;
    }
  }

  // Calculate base compatibility
  const diff = Math.abs(reduceToSingleDigit(num1) - reduceToSingleDigit(num2));
  return Math.max(60 - (diff * 10), 40);
}

function generateCompatibilityAspects(profile1: ReturnType<typeof calculateNumerology>, profile2: ReturnType<typeof calculateNumerology>): string[] {
  const aspects: string[] = [];

  // Life Path Compatibility
  if (profile1.lifePath === profile2.lifePath) {
    aspects.push("Strong life path connection - shared life purpose and direction");
  } else if ([1, 5, 7].includes(profile1.lifePath) && [1, 5, 7].includes(profile2.lifePath)) {
    aspects.push("Compatible independent life paths - mutual respect for freedom");
  }

  // Expression Compatibility
  if (profile1.expression === profile2.expression) {
    aspects.push("Similar ways of expressing yourselves to the world");
  } else if (Math.abs(profile1.expression - profile2.expression) <= 2) {
    aspects.push("Complementary expression styles enhance communication");
  }

  // Heart's Desire Compatibility
  if (profile1.heartDesire === profile2.heartDesire) {
    aspects.push("Deep emotional connection through shared inner desires");
  } else if ([2, 6, 9].includes(profile1.heartDesire) && [2, 6, 9].includes(profile2.heartDesire)) {
    aspects.push("Harmonious emotional understanding and support");
  }

  return aspects;
}

function analyzeRelationshipDynamics(profile1: ReturnType<typeof calculateNumerology>, profile2: ReturnType<typeof calculateNumerology>): string[] {
  const dynamics: string[] = [];

  // Analyze Life Path interaction
  if ([1, 8].includes(profile1.lifePath) && [2, 6].includes(profile2.lifePath)) {
    dynamics.push("Leadership and support dynamic - one leads while the other nurtures");
  }

  // Check for creative partnership
  if ([3, 6, 9].includes(profile1.expression) || [3, 6, 9].includes(profile2.expression)) {
    dynamics.push("Creative energy flows naturally in this partnership");
  }

  // Emotional depth analysis
  if (profile1.heartDesire === profile2.heartDesire) {
    dynamics.push("Strong emotional resonance and mutual understanding");
  }

  // Balance of practical and spiritual
  if ([4, 8].includes(profile1.lifePath) && [7, 9].includes(profile2.lifePath)) {
    dynamics.push("Balance between practical matters and spiritual growth");
  }

  return dynamics;
}

function identifyGrowthAreas(profile1: ReturnType<typeof calculateNumerology>, profile2: ReturnType<typeof calculateNumerology>): string[] {
  const growthAreas: string[] = [];

  // Communication dynamics
  if (Math.abs(profile1.expression - profile2.expression) > 2) {
    growthAreas.push("Develop clearer communication channels and understanding");
  }

  // Emotional balance
  if (Math.abs(profile1.heartDesire - profile2.heartDesire) > 2) {
    growthAreas.push("Work on understanding each other's emotional needs");
  }

  // Life direction alignment
  if (profile1.lifePath !== profile2.lifePath) {
    growthAreas.push("Find common ground in life goals while respecting individual paths");
  }

  // Spiritual growth
  if ([7, 9].includes(profile1.lifePath) || [7, 9].includes(profile2.lifePath)) {
    growthAreas.push("Explore spiritual growth and deeper meaning together");
  }

  return growthAreas;
}

function calculateRelationshipTypeScores(profile1: ReturnType<typeof calculateNumerology>, profile2: ReturnType<typeof calculateNumerology>) {
  return {
    work: {
      score: calculateWorkCompatibility(profile1, profile2),
      strengths: getWorkStrengths(profile1, profile2),
      challenges: getWorkChallenges(profile1, profile2)
    },
    business: {
      score: calculateBusinessCompatibility(profile1, profile2),
      strengths: getBusinessStrengths(profile1, profile2),
      challenges: getBusinessChallenges(profile1, profile2)
    },
    friendship: {
      score: calculateFriendshipCompatibility(profile1, profile2),
      strengths: getFriendshipStrengths(profile1, profile2),
      challenges: getFriendshipChallenges(profile1, profile2)
    },
    family: {
      score: calculateFamilyCompatibility(profile1, profile2),
      strengths: getFamilyStrengths(profile1, profile2),
      challenges: getFamilyChallenges(profile1, profile2)
    }
  };
}

function calculateWorkCompatibility(profile1: ReturnType<typeof calculateNumerology>, profile2: ReturnType<typeof calculateNumerology>): number {
  let score = 70; // Base score

  // Leadership and practical number combinations work well
  if ([1, 8].includes(profile1.lifePath) && [4, 6].includes(profile2.lifePath)) score += 15;
  if ([4, 8].includes(profile1.expression) && [4, 8].includes(profile2.expression)) score += 15;

  // Strong work ethic combinations
  if ([4, 8, 22].includes(profile1.lifePath) && [4, 8, 22].includes(profile2.lifePath)) score += 20;

  // Potential conflicts
  if ([5, 7].includes(profile1.lifePath) && [1, 8].includes(profile2.lifePath)) score -= 10;

  return Math.min(100, Math.max(40, score));
}

function getWorkStrengths(profile1: ReturnType<typeof calculateNumerology>, profile2: ReturnType<typeof calculateNumerology>): string[] {
  const strengths = [];

  // Leadership dynamics
  if ([1, 8].includes(profile1.lifePath) && [2, 6].includes(profile2.lifePath)) {
    strengths.push("Excellentleadership-support dynamic with clear roles");
    strengths.push("One naturally leadswhilethe otherprovides essential support");
  }

  //// Practical approach
  if ([4, 8].includes(profile1.expression) && [4, 8].includes(profile2.expression)) {
    strengths.push("Shared practical and methodical approach to tasks");
    strengths.push("Strong focus on efficiency and results");
  }

  // Creative synergy
  if ([3, 6, 9].includes(profile1.expression) || [3, 6, 9].includes(profile2.expression)) {
    strengths.push("Natural ability to bring creative solutions to work challenges");
  }

  // Master number influence
  if ([11, 22, 33].includes(profile1.lifePath) || [11, 22, 33].includes(profile2.lifePath)) {
    strengths.push("High-level vision and inspiration in the workplace");
  }

  return strengths;
}

function getWorkChallenges(profile1: ReturnType<typeof calculateNumerology>, profile2: ReturnType<typeof calculateNumerology>): string[] {
  const challenges = [];

  // Leadership and authority challenges
  if ([1, 8].includes(profile1.lifePath) && [1, 8].includes(profile2.lifePath)) {
    challenges.push("Potential power struggles over leadership positions");
    challenges.push("May compete for authority and control");
  }

  // Structure vs. Freedom
  if ([5, 7].includes(profile1.lifePath) && [1, 8].includes(profile2.lifePath)) {
    challenges.push("Different approaches to organization and structure");
    challenges.push("Need to balance flexibility with discipline");
  }

  // Communication differences
  if (Math.abs(profile1.expression - profile2.expression) > 3) {
    challenges.push("Differing communication styles need alignment");
    challenges.push("May struggle with misunderstandings in work context");
  }

  return challenges.length > 0 ? challenges : ["Need to establish clear work boundaries and expectations"];
}

function getBusinessStrengths(profile1: ReturnType<typeof calculateNumerology>, profile2: ReturnType<typeof calculateNumerology>): string[] {
  const strengths = [];

  // Strong business acumen
  if ([8, 4].includes(profile1.lifePath) && [8, 4].includes(profile2.lifePath)) {
    strengths.push("Exceptional combined business sense and financial acumen");
    strengths.push("Natural ability to identify and pursue opportunities");
  }

  // Innovation and stability
  if ([1, 5].includes(profile1.lifePath) && [4, 8].includes(profile2.lifePath)) {
    strengths.push("Perfect balance of innovation and practical implementation");
    strengths.push("One brings new ideas while the other ensures solid execution");
  }

  // Strategic thinking
  if ([7, 9].includes(profile1.expression) || [7, 9].includes(profile2.expression)) {
    strengths.push("Strong analytical and strategic planning abilities");
  }

  return strengths;
}

function getBusinessChallenges(profile1: ReturnType<typeof calculateNumerology>, profile2: ReturnType<typeof calculateNumerology>): string[] {
  const challenges = [];

  // Risk management
  if ([3, 7].includes(profile1.lifePath) && [8, 4].includes(profile2.lifePath)) {
    challenges.push("Different approaches to risk and opportunity");
    challenges.push("Need to balance innovation with stability");
  }

  // Decision-making styles
  if (Math.abs(profile1.destiny - profile2.destiny) > 3) {
    challenges.push("Conflicting approaches to business decisions");
    challenges.push("May have different long-term business visions");
  }

  // Resource management
  if ([5, 7].includes(profile1.lifePath) && [8, 4].includes(profile2.lifePath)) {
    challenges.push("Different views on resource allocation");
    challenges.push("May disagree on investment priorities");
  }

  return challenges.length > 0 ? challenges : ["Need to develop shared business strategies and goals"];
}

function getFriendshipStrengths(profile1: ReturnType<typeof calculateNumerology>, profile2: ReturnType<typeof calculateNumerology>): string[] {
  const strengths = [];

  // Emotional connection
  if ([2, 3, 6].includes(profile1.lifePath) && [2, 3, 6].includes(profile2.lifePath)) {
    strengths.push("Deep emotional understanding and natural rapport");
    strengths.push("Strong ability to support each other emotionally");
  }

  // Shared interests
  if (profile1.heartDesire === profile2.heartDesire) {
    strengths.push("Natural alignment in interests and personal values");
    strengths.push("Strong mutual understanding of each other's needs");
  }

  // Social dynamics
  if ([3, 5, 7].includes(profile1.expression) || [3, 5, 7].includes(profile2.expression)) {
    strengths.push("Enjoyable and engaging social interactions");
  }

  return strengths;
}

function getFriendshipChallenges(profile1: ReturnType<typeof calculateNumerology>, profile2: ReturnType<typeof calculateNumerology>): string[] {
  const challenges = [];

  // Emotional dynamics
  if (Math.abs(profile1.heartDesire - profile2.heartDesire) > 3) {
    challenges.push("Different emotional needs in friendship");
    challenges.push("May have varying expectations from the relationship");
  }

  // Social preferences
  if ([8, 4].includes(profile1.lifePath) && [3, 5].includes(profile2.lifePath)) {
    challenges.push("Different social interaction preferences");
    challenges.push("May struggle with activity planning");
  }

  // Personal space
  if ([1, 7].includes(profile1.lifePath) && [2, 6].includes(profile2.lifePath)) {
    challenges.push("Different needs for personal space");
    challenges.push("May need to balance togetherness with independence");
  }

  return challenges.length > 0 ? challenges : ["Need to maintain open communication about friendship expectations"];
}

function getFamilyStrengths(profile1: ReturnType<typeof calculateNumerology>, profile2: ReturnType<typeof calculateNumerology>): string[] {
  const strengths = [];

  // Emotional bonds
  if ([6, 2].includes(profile1.lifePath) && [6, 2].includes(profile2.lifePath)) {
    strengths.push("Strong nurturing abilities and deep family bonds");
    strengths.push("Natural understanding of family needs and dynamics");
  }

  // Emotional harmony
  if (profile1.heartDesire === profile2.heartDesire) {
    strengths.push("Deep emotional connection and mutual understanding");
    strengths.push("Shared values in family matters");
  }

  // Stability
  if ([4, 8].includes(profile1.lifePath) || [4, 8].includes(profile2.lifePath)) {
    strengths.push("Ability to create stable and secure family environment");
  }

  return strengths;
}

function getFamilyChallenges(profile1: ReturnType<typeof calculateNumerology>, profile2: ReturnType<typeof calculateNumerology>): string[] {
  const challenges = [];

  // Communication styles
  if (Math.abs(profile1.expression - profile2.expression) > 3) {
    challenges.push("Different family communication styles");
    challenges.push("May struggle with expressing needs effectively");
  }

  // Balance of independence
  if ([1, 5].includes(profile1.lifePath) && [2, 6].includes(profile2.lifePath)) {
    challenges.push("Different needs for family time vs. personal space");
    challenges.push("May need to balance independence with togetherness");
  }

  // Decision-making
  if ([8, 1].includes(profile1.lifePath) && [2, 6].includes(profile2.lifePath)) {
    challenges.push("Different approaches to family decisions");
    challenges.push("May need to work on compromise strategies");
  }

  return challenges.length > 0 ? challenges : ["Need to develop shared understanding of family dynamics"];
}

function calculateWeeklyForecast(date: Date, result: ReturnType<typeof calculateNumerology>) {
  const weekNumber = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
  const personalDayNumber = reduceToSingleDigit(result.lifePath + weekNumber);

  console.log(`Calculating weekly forecast for week ${weekNumber}, personal day number: ${personalDayNumber}`);

  // Calculate peak energy days based on personal day number and life path
  const peakDays = [
    { day: 'Monday', number: reduceToSingleDigit(personalDayNumber + 1) },
    { day: 'Tuesday', number: reduceToSingleDigit(personalDayNumber + 2) },
    { day: 'Wednesday', number: reduceToSingleDigit(personalDayNumber + 3) },
    { day: 'Thursday', number: reduceToSingleDigit(personalDayNumber + 4) },
    { day: 'Friday', number: reduceToSingleDigit(personalDayNumber + 5) },
    { day: 'Saturday', number: reduceToSingleDigit(personalDayNumber + 6) },
    { day: 'Sunday', number: reduceToSingleDigit(personalDayNumber + 7) }
  ];

  // Calculate weekly essence based on personal day number
  const weeklyEssence = [
    "Initiation and New Beginnings",
    "Cooperation and Balance",
    "Creative Expression",
    "Foundation Building",
    "Change and Adventure",
    "Harmony and Responsibility",
    "Introspection and Wisdom",
    "Material Success",
    "Completion and Universal Love"
  ][personalDayNumber - 1];

  // Generate weekly theme based on life path and personal day interaction
  const weeklyTheme = `This week carries the energy of ${weeklyEssence}, particularly strong for those with Life Path ${result.lifePath}. Focus on personal growth and spiritual development.`;

  const forecast = {
    weeklyEssence,
    weeklyTheme,
    peakDays,
    opportunities: [
      "Focus on starting new projects and initiatives",
      "Connect with like-minded individuals",
      "Express your creativity through various mediums"
    ],
    challenges: [
      "Managing energy levels throughout the week",
      "Balancing personal and professional responsibilities",
      "Staying focused on long-term goals"
    ],
    guidance: "Use the peak energy days for important tasks and decisions. Take time for self-reflection during lower energy periods.",
    insights: [
      "How can you best utilize your peak energy days?",
      "What patterns are emerging in your daily experiences?",
      "What lessons are being presented through your challenges?"
    ]
  };

  console.log('Generated weekly forecast:', forecast);
  return forecast;
}

function calculateMonthlyForecast(date: Date, result: ReturnType<typeof calculateNumerology>) {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  console.log(`Calculating monthly forecast for ${month}/${year}`);

  // Calculate personal month number
  const personalMonthNumber = reduceToSingleDigit(result.lifePath + month + reduceToSingleDigit(year));

  // Calculate universal month number
  const universalMonthNumber = reduceToSingleDigit(month + reduceToSingleDigit(year));

  console.log(`Personal month: ${personalMonthNumber}, Universal month: ${universalMonthNumber}`);

  // Calculate monthly essence
  const monthlyEssence = [
    "New Beginnings",
    "Partnership",
    "Creative Expression",
    "Foundation",
    "Freedom",
    "Harmony",
    "Spiritual Growth",
    "Power",
    "Completion"
  ][personalMonthNumber - 1];

  // Generate theme based on personal and universal month numbers
  const theme = `${monthlyEssence} - A month of ${
    personalMonthNumber === universalMonthNumber
      ? "aligned personal and universal energies"
      : "balancing personal goals with universal timing"
  }`;

  const forecast = {
    theme,
    personalMonthNumber,
    universalMonthNumber,
    monthlyEssence,
    opportunities: [
      "Align your actions with your long-term vision",
      "Build meaningful connections and partnerships",
      "Express your authentic self through your work"
    ],
    challenges: [
      "Maintaining focus on priority goals",
      "Managing energy and resources effectively",
      "Navigating relationship dynamics"
    ],
    focusAreas: [
      "Personal development and growth",
      "Professional advancement",
      "Spiritual connection",
      "Relationship building"
    ],
    guidance: `This month emphasizes ${monthlyEssence.toLowerCase()}. Pay attention to synchronicities and follow your intuition.`,
    insights: [
      "What new opportunities are presenting themselves?",
      "How can you better align with your life purpose?",
      "What patterns need to be released or transformed?"
    ]
  };

  console.log('Generated monthly forecast:', forecast);
  return forecast;
}

function calculateBusinessCompatibility(profile1: ReturnType<typeof calculateNumerology>, profile2: ReturnType<typeof calculateNumerology>): number {
  let score = 70; // Base score

  // Strong business combinations
  if ([8, 4].includes(profile1.lifePath) && [8, 4].includes(profile2.lifePath)) score += 20;
  if ([1, 8].includes(profile1.expression) && [2, 6].includes(profile2.expression)) score += 15;

  // Innovation and stability
  if ([1, 5].includes(profile1.lifePath) && [4, 8].includes(profile2.lifePath)) score += 15;

  return Math.min(100, Math.max(40, score));
}

function calculateFriendshipCompatibility(profile1: ReturnType<typeof calculateNumerology>, profile2: ReturnType<typeof calculateNumerology>): number {
  let score = 70; // Base score

  // Natural friendship combinations
  if ([2, 3, 6].includes(profile1.lifePath) && [2, 3, 6].includes(profile2.lifePath)) score += 20;
  if (profile1.heartDesire === profile2.heartDesire) score += 15;

  // Complementary energies
  if ([1, 5, 7].includes(profile1.lifePath) && [2, 3, 6].includes(profile2.lifePath)) score += 15;

  return Math.min(100, Math.max(40, score));
}

function calculateFamilyCompatibility(profile1: ReturnType<typeof calculateNumerology>, profile2: ReturnType<typeof calculateNumerology>): number {
  let score = 70; // Base score

  // Strong family bonds
  if ([6, 2].includes(profile1.lifePath) && [6, 2].includes(profile2.lifePath)) score += 20;
  if ([4, 8].includes(profile1.lifePath) && [2, 6].includes(profile2.lifePath)) score += 15;

  // Emotional understanding
  if (profile1.heartDesire === profile2.heartDesire) score += 15;

  return Math.min(100, Math.max(40, score));
}

function calculateCompatibility(name1: string, birthdate1: string, name2: string, birthdate2: string) {
  // Get individual numerology calculations
  const person1 = calculateNumerology(name1, birthdate1);
  const person2 = calculateNumerology(name2, birthdate2);

  // Calculate birth years
  const year1 = new Date(birthdate1).getFullYear();
  const year2 = new Date(birthdate2).getFullYear();

  // Get zodiac signs and their descriptions
  const zodiacSign1 = getChineseZodiacSign(birthdate1);
  const zodiacSign2 = getChineseZodiacSign(birthdate2);

  // Get detailed descriptions for each sign
  const zodiacDescription1 = getDetailedZodiacDescription(zodiacSign1);
  const zodiacDescription2 = getDetailedZodiacDescription(zodiacSign2);

  // Calculate zodiac compatibility
  const zodiacCompatibilityResult = getZodiacCompatibility(zodiacSign1, zodiacSign2);
  const yearDiffCompatibilityResult = calculateYearDifferenceCompatibility(birthdate1, birthdate2);

  // Calculate numerology scores
  const numerologyScore = (
    calculateNumberCompatibility(person1.lifePath, person2.lifePath) +
    calculateNumberCompatibility(person1.expression, person2.expression) +
    calculateNumberCompatibility(person1.heartDesire, person2.heartDesire)
  ) / 3;

  // Calculate weighted final score
  const finalScore = Math.round(
    (numerologyScore * 0.6) +    // Numerology has 60% weight
    (zodiacCompatibilityResult.score * 0.25) +    // Zodiac compatibility has 25% weight
    (yearDiffCompatibilityResult.score * 0.15)    // Year difference has 15% weight
  );

  return {
    score: finalScore,
    lifePathScore: calculateNumberCompatibility(person1.lifePath, person2.lifePath),
    expressionScore: calculateNumberCompatibility(person1.expression, person2.expression),
    heartDesireScore: calculateNumberCompatibility(person1.heartDesire, person2.heartDesire),
    zodiacCompatibility: {
      person1: zodiacSign1,
      person2: zodiacSign2,
      score: zodiacCompatibilityResult.score,
      description: zodiacCompatibilityResult.description,
      dynamic: zodiacCompatibilityResult.dynamic
    },
    zodiacDescription: {
      person1: zodiacDescription1,
      person2: zodiacDescription2
    },
    yearDifference: yearDiffCompatibilityResult,
    aspects: [
      ...generateCompatibilityAspects(person1, person2),
      `${name1} is a ${zodiacSign1} and ${name2} is a ${zodiacSign2} in Chinese Zodiac`,
      zodiacCompatibilityResult.description
    ],
    dynamics: [
      ...generateDynamics(person1, person2),
      zodiacCompatibilityResult.dynamic
    ],
    growthAreas: [
      ...generateGrowthAreas(person1, person2),
      zodiacCompatibilityResult.score < 60 
        ? `Learn to balance your different zodiac energies (${zodiacSign1} and ${zodiacSign2})`
        : `Harness the natural harmony between your ${zodiacSign1} and ${zodiacSign2} signs`
    ],
    relationshipTypes: calculateRelationshipTypeScores(person1, person2)
  };
}

interface CompatibilityResult extends ReturnType<typeof calculateNumerology> {
  lifePathScore: number;
  expressionScore: number;
  heartDesireScore: number;
  dynamics: string[];
  growthAreas: string[];
  relationshipTypes: {
    work: {
      score: number;
      strengths: string[];
      challenges: string[];
    };
    business: {
      score: number;
      strengths: string[];
      challenges: string[];
    };
    friendship: {
      score: number;
      strengths: string[];
      challenges: string[];
    };
    family: {
      score: number;
      strengths: string[];
      challenges: string[];
    };
  };
  zodiacCompatibility: {
    person1: string;
    person2: string;
    score: number;
    description: string;
    dynamic: string;
  };
  yearDifferenceScore: number;
  zodiacDescription: {
    person1: string;
    person2: string;
  };
  yearDifference: {
    score: number;
    description: string;
  };
  aspects: string[];
}

function getWeeklyTheme(essence: number, profile: ReturnType<typeof calculateNumerology>): string {
  const themes = {
    1: "Week of New Beginnings - Perfect for starting new projects and taking initiative",
    2: "Week of Cooperation - Focus on partnerships and diplomatic solutions",
    3: "Week of Creative Expression - Ideal for artistic pursuits and communication",
    4: "Week of Foundation Building - Time to organize and establish structure",
    5: "Week of Change - Embrace new opportunities and adventure",
    6: "Week of Balance - Focus on harmony in relationships and responsibilities",
    7: "Week of Reflection - Ideal for research and spiritual growth",
    8: "Week of Manifestation - Focus on achievement and material goals",
    9: "Week of Completion - Time to finish projects and release what no longer serves",
    11: "Week of Inspiration - Heightened intuition and spiritual awareness",
    22: "Week of Master Building - Manifest your highest visions"
  };

  return themes[essence as keyof typeof themes] || themes[reduceToSingleDigit(essence)];
}

function getWeeklyOpportunities(essence: number): string[] {
  const baseOpportunities = {
    1: ["Start new projects", "Take leadership roles", "Show initiative"],
    2: ["Build partnerships", "Mediate conflicts", "Focus on details"],
    3: ["Express creativity", "Communicate ideas", "Socialize"],
    4: ["Organize systems", "Build foundations", "Create structure"],
    5: ["Embrace change", "Travel or explore", "Try new experiences"],
    6: ["Focus on relationships", "Create harmony", "Take responsibility"],
    7: ["Research and study", "Meditate", "Plan strategically"],
    8: ["Focus on business", "Manifest abundance", "Take charge"],
    9: ["Complete projects", "Let go of old patterns", "Help others"],
    11: ["Follow intuition", "Inspire others", "Spiritual growth"],
    22: ["Build large-scale projects", "Manifest dreams", "Create lasting structures"]
  };

  return baseOpportunities[essence as keyof typeof baseOpportunities] ||
         baseOpportunities[reduceToSingleDigit(essence)];
}

function getWeeklyChallenges(essence: number): string[] {
  const baseChallenges = {
    1: ["Avoid being too aggressive", "Watch ego", "Don't rush decisions"],
    2: ["Don't be oversensitive", "Avoid indecision", "Stand up for yourself"],
    3: ["Stay focused", "Avoid scattered energy", "Don't be superficial"],
    4: ["Be flexible", "Avoid rigidity", "Don't overwork"],
    5: ["Maintain focus", "Avoid impulsiveness", "Don't take unnecessary risks"],
    6: ["Don't overcommit", "Avoid perfectionism", "Balance responsibilities"],
    7: ["Don't isolate", "Avoid overthinking", "Stay grounded"],
    8: ["Watch material focus", "Avoid power struggles", "Stay ethical"],
    9: ["Let go of control", "Complete unfinished tasks", "Don't be dramatic"],
    11: ["Ground spiritual energy", "Avoid nervous tension", "Balance material/spiritual"],
    22: ["Don't overwhelm yourself", "Stay practical", "Avoid unrealistic expectations"]
  };

  return baseChallenges[essence as keyof typeof baseChallenges] ||
         baseChallenges[reduceToSingleDigit(essence)];
}

function getMonthlyTheme(essence: number, profile: ReturnType<typeof calculateNumerology>): string {
  const themes = {
    1: "Month of Leadership and New Beginnings",
    2: "Month of Cooperation and Diplomacy",
    3: "Month of Creative Expression and Joy",
    4: "Month of Building and Organization",
    5: "Month of Change and Freedom",
    6: "Month of Responsibility and Harmony",
    7: "Month of Wisdom and Inner Growth",
    8: "Month of Power and Achievement",
    9: "Month of Completion and Universal Love",
    11: "Month of Spiritual Mastery",
    22: "Month of Master Building"
  };

  return themes[essence as keyof typeof themes] || themes[reduceToSingleDigit(essence)];
}

function getMonthlyOpportunities(essence: number): string[] {
  const baseOpportunities = {
    1: [
      "Take initiative in major projects",
      "Establish leadership positions",
      "Start new ventures with confidence"
    ],
    2: [
      "Build important partnerships",
      "Focus on diplomatic solutions",
      "Develop patience and cooperation"
    ],
    3: [
      "Launch creative projects",
      "Expand social networks",
      "Express yourself authentically"
    ],
    4: [
      "Build solid foundations",
      "Organize long-term plans",
      "Establish reliable systems"
    ],
    5: [
      "Embrace progressive changes",
      "Explore new territories",
      "Break free from limitations"
    ],
    6: [
      "Focus on family harmony",
      "Take on responsibilities",
      "Create beauty and balance"
    ],
    7: [
      "Deepen spiritual understanding",
      "Research and analyze",
      "Develop expertise"
    ],
    8: [
      "Focus on material success",
      "Build power and influence",
      "Achieve financial goals"
    ],
    9: [
      "Complete major cycles",
      "Share wisdom with others",
      "Embrace universal love"
    ],
    11: [
      "Follow spiritual guidance",
      "Inspire and teach others",
      "Channel higher wisdom"
    ],
    22: [
      "Build lasting structures",
      "Manifest grand visions",
      "Create practical solutions"
    ]
  };

  return baseOpportunities[essence as keyof typeof baseOpportunities] ||
         baseOpportunities[reduceToSingleDigit(essence)];
}

function getMonthlyChallenges(essence: number): string[] {
  const baseChallenges = {
    1: [
      "Balance independence with cooperation",
      "Manage ego and pride",
      "Avoid dominating others"
    ],
    2: [
      "Overcome sensitivity and doubt",
      "Make decisions confidently",
      "Stand up for yourself"
    ],
    3: [
      "Maintain focus and discipline",
      "Avoid superficiality",
      "Channel creativity productively"
    ],
    4: [
      "Stay flexible when needed",
      "Avoid becoming too rigid",
      "Balance work and rest"
    ],
    5: [
      "Manage restless energy",
      "Make wise choices",
      "Stay committed to goals"
    ],
    6: [
      "Balance giving and receiving",
      "Avoid perfectionism",
      "Set healthy boundaries"
    ],
    7: [
      "Connect with others",
      "Stay practical",
      "Share your wisdom"
    ],
    8: [
      "Use power wisely",
      "Stay ethical in business",
      "Balance material and spiritual"
    ],
    9: [
      "Complete unfinished business",
      "Let go of attachments",
      "Avoid emotional drama"
    ],
    11: [
      "Ground spiritual energy",
      "Manage sensitivity",
      "Balance idealism with practicality"
    ],
    22: [
      "Stay focused on goals",
      "Manage stress levels",
      "Delegate when necessary"
    ]
  };

  return baseChallenges[essence as keyof typeof baseChallenges] ||
         baseChallenges[reduceToSingleDigit(essence)];
}

function getMonthlyFocusAreas(essence: number, profile: ReturnType<typeof calculateNumerology>): string[] {
  const baseFocusAreas = {
    1: [
      "Personal development and independence",
      "Leadership skills",
      "Self-confidence"
    ],
    2: [
      "Relationships and partnerships",
      "Emotional intelligence",
      "Attention to detail"
    ],
    3: [
      "Creative expression",
      "Communication",
      "Social connections"
    ],
    4: [
      "Organization and structure",
      "Practical matters",
      "Foundation building"
    ],
    5: [
      "Personal freedom",
      "Adventure and change",
      "Adaptability"
    ],
    6: [
      "Family and home",
      "Responsibility",
      "Harmony and balance"
    ],
    7: [
      "Spiritual growth",
      "Inner wisdom",
      "Technical skills"
    ],
    8: [
      "Business and finance",
      "Personal power",
      "Material goals"
    ],
    9: [
      "Completion and release",
      "Humanitarian efforts",
      "Universal understanding"
    ],
    11: [
      "Spiritual awareness",
      "Intuitive development",
      "Teaching and inspiration"
    ],
    22: [
      "Large-scale projects",
      "Practical spirituality",
      "Leadership and service"
    ]
  };

  return baseFocusAreas[essence as keyof typeof baseFocusAreas] ||
         baseFocusAreas[reduceToSingleDigit(essence)];
}

function getChineseZodiacSign(birthdate: string): string {
  const year = new Date(birthdate).getFullYear();
  const animals = [
    'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
    'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
  ];
  return animals[(year - 4) % 12];
}

function getDetailedZodiacDescription(sign: string): string {
  const descriptions = {
    'Rat': "Clever, adaptable, and ambitious. Quick-witted problem solver with strong intuition.",
    'Ox': "Honest, patient, and kind-hearted. Natural leader with strong principles.",
    'Tiger': "Brave, confident, and unpredictable. Natural leader with strong charisma.",
    'Rabbit': "Gentle, elegant, and alert. Skillful in diplomacy and building relationships.",
    'Dragon': "Energetic, fearless, and charismatic. Natural leader with strong ambition.",
    'Snake': "Enigmatic, intuitive, and wise. Excellent problem solver with deep thoughts.",
    'Horse': "Energetic, independent, and adventurous. Free spirit with strong passion.",
    'Goat': "Creative, dependable, and calm. Artistic soul with strong empathy.",
    'Monkey': "Smart, clever, and inventive. Excellent problem solver with strong curiosity.",
    'Rooster': "Honest, bright, and ambitious. Natural talent with strong confidence.",
    'Dog': "Loyal, honest, and kind. Faithful friend with strong principles.",
    'Pig': "Generous, diligent, and optimistic. Kind soul with strong determination."
  };
  return descriptions[sign as keyof typeof descriptions] || "Unknown sign";
}

function getZodiacCompatibility(sign1: string, sign2: string): {
  score: number;
  description: string;
  dynamic: string;
} {
  const compatibilityMap: Record<string, {
    best: string[];
    good: string[];
    neutral: string[];
    challenging: string[];
  }> = {
    'Rat': {
      best: ['Dragon', 'Monkey'],
      good: ['Ox', 'Snake', 'Pig'],
      neutral: ['Tiger', 'Horse', 'Goat', 'Rooster'],
      challenging: ['Rabbit', 'Dog']
    },
    'Ox': {
      best: ['Snake', 'Rooster'],
      good: ['Rat', 'Monkey'],
      neutral: ['Tiger', 'Rabbit', 'Dog', 'Pig'],
      challenging: ['Horse', 'Goat', 'Dragon']
    },
    'Tiger': {
      best: ['Horse', 'Dog'],
      good: ['Rabbit', 'Dragon'],
      neutral: ['Rat', 'Ox', 'Goat', 'Rooster', 'Pig'],
      challenging: ['Snake', 'Monkey']
    },
    'Rabbit': {
      best: ['Goat', 'Pig'],
      good: ['Tiger', 'Dog'],
      neutral: ['Ox', 'Snake', 'Horse', 'Monkey'],
      challenging: ['Rat', 'Dragon', 'Rooster']
    },
    'Dragon': {
      best: ['Rat', 'Monkey'],
      good: ['Tiger', 'Snake', 'Rooster'],
      neutral: ['Horse', 'Goat', 'Pig'],
      challenging: ['Ox', 'Rabbit', 'Dog']
    },
    'Snake': {
      best: ['Ox', 'Rooster'],
      good: ['Dragon', 'Monkey'],
      neutral: ['Rabbit', 'Horse', 'Goat', 'Pig'],
      challenging: ['Tiger', 'Dog']
    },
    'Horse': {
      best: ['Tiger', 'Dog'],
      good: ['Goat', 'Pig'],
      neutral: ['Rabbit', 'Dragon', 'Snake', 'Monkey'],
      challenging: ['Rat', 'Ox', 'Rooster']
    },
    'Goat': {
      best: ['Rabbit', 'Horse', 'Pig'],
      good: ['Tiger', 'Dragon'],
      neutral: ['Rat', 'Snake', 'Monkey'],
      challenging: ['Ox', 'Dog']
    },
    'Monkey': {
      best: ['Rat', 'Dragon'],
      good: ['Ox', 'Snake'],
      neutral: ['Rabbit', 'Horse', 'Goat', 'Rooster', 'Dog'],
      challenging: ['Tiger', 'Pig']
    },
    'Rooster': {
      best: ['Ox', 'Snake'],
      good: ['Dragon', 'Monkey'],
      neutral: ['Tiger', 'Horse', 'Goat', 'Dog', 'Pig'],
      challenging: ['Rat', 'Rabbit']
    },
    'Dog': {
      best: ['Tiger', 'Horse'],
      good: ['Rabbit', 'Pig'],
      neutral: ['Ox', 'Monkey', 'Rooster'],
      challenging: ['Rat', 'Dragon', 'Snake', 'Goat']
    },
    'Pig': {
      best: ['Rabbit', 'Goat'],
      good: ['Tiger', 'Horse', 'Dog'],
      neutral: ['Ox', 'Dragon', 'Snake', 'Rooster'],
      challenging: ['Rat', 'Monkey']
    }
  };

  let score = 60; // Default neutral score
  let description = "";
  let dynamic = "";

  if (sign1 === sign2) {
    score = 75;
    description = `Both being ${sign1}, you share many similar traits and understanding.`;
    dynamic = `You naturally understand each other's approach to life, though you may compete in similar areas.`;
  } else {
    if (compatibilityMap[sign1].best.includes(sign2)) {
      score = 95;
      description = `${sign1} and ${sign2} have excellent compatibility! These signs naturally complement and enhance each other.`;
      dynamic = "Your energies work together harmoniously, creating a strong and balanced relationship.";
    } else if (compatibilityMap[sign1].good.includes(sign2)) {
      score = 80;
      description = `${sign1} and ${sign2} have good compatibility. Your different qualities can create a balanced partnership.`;
      dynamic = "You can learn much from each other's different perspectives and approaches.";
    } else if (compatibilityMap[sign1].neutral.includes(sign2)) {
      score = 60;
      description = `${sign1} and ${sign2} have neutral compatibility. Success depends on mutual understanding and effort.`;
      dynamic = "With awareness and effort, you can build a strong relationship despite your differences.";
    } else {
      score = 40;
      description = `${sign1} and ${sign2} may face some challenges in understanding each other's approaches.`;
      dynamic = "Focus on communication and appreciation of your differences to overcome challenges.";
    }
  }

  return { score, description, dynamic };
}

function calculateYearDifferenceCompatibility(date1: string, date2: string): {
  score: number;
  description: string;
} {
  const year1 = new Date(date1).getFullYear();
  const year2 = new Date(date2).getFullYear();
  const diff = Math.abs(year1 - year2);

  // Check for exact 12-year cycle
  if (diff % 12 === 0) {
    return {
      score: 95,
      description: `Your birth years are ${diff} years apart, creating an auspicious 12-year cycle alignment. In Chinese astrology, this suggests a harmonious relationship with strong mutual understanding.`
    };
  }

  // Check for challenging 6-year cycle
  if (diff % 6 === 0) {
    return {
      score: 40,
      description: `Your birth years are ${diff} years apart (6-year cycle). In Chinese astrology, this suggests potential challenges that require extra understanding and patience.`
    };
  }

  // Calculate general compatibility based on cycle proximity
  const cycleDiff = diff % 12;
  const score = Math.max(60, 85 - (cycleDiff * 5));

  return {
    score,
    description: `Your birth years are ${diff} years apart. This creates an interesting dynamic that can work well with mutual understanding and respect.`
  };
}

function generateDynamics(profile1: ReturnType<typeof calculateNumerology>, profile2: ReturnType<typeof calculateNumerology>): string[] {
  return analyzeRelationshipDynamics(profile1, profile2);
}

function generateGrowthAreas(profile1: ReturnType<typeof calculateNumerology>, profile2: ReturnType<typeof calculateNumerology>): string[] {
  return identifyGrowthAreas(profile1, profile2);
}


function calculateCompatibility(name1: string, birthdate1: string, name2: string, birthdate2: string) {
  // Get individual numerology calculations
  const person1 = calculateNumerology(name1, birthdate1);
  const person2 = calculateNumerology(name2, birthdate2);

  // Calculate birth years
  const year1 = new Date(birthdate1).getFullYear();
  const year2 = new Date(birthdate2).getFullYear();

  // Get zodiac signs and their descriptions
  const zodiacSign1 = getChineseZodiacSign(birthdate1);
  const zodiacSign2 = getChineseZodiacSign(birthdate2);

  // Get detailed descriptions for each sign
  const zodiacDescription1 = getDetailedZodiacDescription(zodiacSign1);
  const zodiacDescription2 = getDetailedZodiacDescription(zodiacSign2);

  // Calculate zodiac compatibility
  const zodiacCompatibilityResult = getZodiacCompatibility(zodiacSign1, zodiacSign2);
  const yearDiffCompatibilityResult = calculateYearDifferenceCompatibility(birthdate1, birthdate2);

  // Calculate numerology scores
  const numerologyScore = (
    calculateNumberCompatibility(person1.lifePath, person2.lifePath) +
    calculateNumberCompatibility(person1.expression, person2.expression) +
    calculateNumberCompatibility(person1.heartDesire, person2.heartDesire)
  ) / 3;

  // Calculate weighted final score
  const finalScore = Math.round(
    (numerologyScore * 0.6) +    // Numerology has 60% weight
    (zodiacCompatibilityResult.score * 0.25) +    // Zodiac compatibility has 25% weight
    (yearDiffCompatibilityResult.score * 0.15)    // Year difference has 15% weight
  );

  return {
    score: finalScore,
    lifePathScore: calculateNumberCompatibility(person1.lifePath, person2.lifePath),
    expressionScore: calculateNumberCompatibility(person1.expression, person2.expression),
    heartDesireScore: calculateNumberCompatibility(person1.heartDesire, person2.heartDesire),
    zodiacCompatibility: {
      person1: zodiacSign1,
      person2: zodiacSign2,
      score: zodiacCompatibilityResult.score,
      description: zodiacCompatibilityResult.description,
      dynamic: zodiacCompatibilityResult.dynamic
    },
    zodiacDescription: {
      person1: zodiacDescription1,
      person2: zodiacDescription2
    },
    yearDifference: yearDiffCompatibilityResult,
    aspects: [
      ...generateCompatibilityAspects(person1, person2),
      `${name1} is a ${zodiacSign1} and ${name2} is a ${zodiacSign2} in Chinese Zodiac`,
      zodiacCompatibilityResult.description
    ],
    dynamics: [
      ...generateDynamics(person1, person2),
      zodiacCompatibilityResult.dynamic
    ],
    growthAreas: [
      ...generateGrowthAreas(person1, person2),
      zodiacCompatibilityResult.score < 60
        ? `Learn to balance your different zodiac energies (${zodiacSign1} and ${zodiacSign2})`
        : `Harness the natural harmony between your ${zodiacSign1} and ${zodiacSign2} signs`
    ],
    relationshipTypes: calculateRelationshipTypeScores(person1, person2)
  };
}

interface CompatibilityResult extends ReturnType<typeof calculateNumerology> {
  lifePathScore: number;
  expressionScore: number;
  heartDesireScore: number;
  dynamics: string[];
  growthAreas: string[];
  relationshipTypes: {
    work: {
      score: number;
      strengths: string[];
      challenges: string[];
    };
    business: {
      score: number;
      strengths: string[];
      challenges: string[];
    };
    friendship: {
      score: number;
      strengths: string[];
      challenges: string[];
    };
    family: {
      score: number;
      strengths: string[];
      challenges: string[];
    };
  };
  zodiacCompatibility: {
    person1: string;
    person2: string;
    score: number;
    description: string;
    dynamic: string;
  };
  yearDifferenceScore: number;
  zodiacDescription: {
    person1: string;
    person2: string;
  };
  yearDifference: {
    score: number;
    description: string;
  };
  aspects: string[];
}

function getWeeklyTheme(essence: number, profile: ReturnType<typeof calculateNumerology>): string {
  const themes = {
    1: "Week of New Beginnings - Perfect for starting new projects and taking initiative",
    2: "Week of Cooperation - Focus on partnerships and diplomatic solutions",
    3: "Week of Creative Expression - Ideal for artistic pursuits and communication",
    4: "Week of Foundation Building - Time to organize and establish structure",
    5: "Week of Change - Embrace new opportunities and adventure",
    6: "Week of Balance - Focus on harmony in relationships and responsibilities",
    7: "Week of Reflection - Ideal for research and spiritual growth",
    8: "Week of Manifestation - Focus on achievement and material goals",
    9: "Week of Completion - Time to finish projects and release what no longer serves",
    11: "Week of Inspiration - Heightened intuition and spiritual awareness",
    22: "Week of Master Building - Manifest your highest visions"
  };

  return themes[essence as keyof typeof themes] || themes[reduceToSingleDigit(essence)];
}

function getWeeklyOpportunities(essence: number): string[] {
  const baseOpportunities = {
    1: ["Start new projects", "Take leadership roles", "Show initiative"],
    2: ["Build partnerships", "Mediate conflicts", "Focus on details"],
    3: ["Express creativity", "Communicate ideas", "Socialize"],
    4: ["Organize systems", "Build foundations", "Create structure"],
    5: ["Embrace change", "Travel or explore", "Try new experiences"],
    6: ["Focus on relationships", "Create harmony", "Take responsibility"],
    7: ["Research and study", "Meditate", "Plan strategically"],
    8: ["Focus on business", "Manifest abundance", "Take charge"],
    9: ["Complete projects", "Let go of old patterns", "Help others"],
    11: ["Follow intuition", "Inspire others", "Spiritual growth"],
    22: ["Build large-scale projects", "Manifest dreams", "Create lasting structures"]
  };

  return baseOpportunities[essence as keyof typeof baseOpportunities] ||
         baseOpportunities[reduceToSingleDigit(essence)];
}

function getWeeklyChallenges(essence: number): string[] {
  const baseChallenges = {
    1: ["Avoid being too aggressive", "Watch ego", "Don't rush decisions"],
    2: ["Don't be oversensitive", "Avoid indecision", "Stand up for yourself"],
    3: ["Stay focused", "Avoid scattered energy", "Don't be superficial"],
    4: ["Be flexible", "Avoid rigidity", "Don't overwork"],
    5: ["Maintain focus", "Avoid impulsiveness", "Don't take unnecessary risks"],
    6: ["Don't overcommit", "Avoid perfectionism", "Balance responsibilities"],
    7: ["Don't isolate", "Avoid overthinking", "Stay grounded"],
    8: ["Watch material focus", "Avoid power struggles", "Stay ethical"],
    9: ["Let go of control", "Complete unfinished tasks", "Don't be dramatic"],
    11: ["Ground spiritual energy", "Avoid nervous tension", "Balance material/spiritual"],
    22: ["Don't overwhelm yourself", "Stay practical", "Avoid unrealistic expectations"]
  };

  return baseChallenges[essence as keyof typeof baseChallenges] ||
         baseChallenges[reduceToSingleDigit(essence)];
}

function getMonthlyTheme(essence: number, profile: ReturnType<typeof calculateNumerology>): string {
  const themes = {
    1: "Month of Leadership and New Beginnings",
    2: "Month of Cooperation and Diplomacy",
    3: "Month of Creative Expression and Joy",
    4: "Month of Building and Organization",
    5: "Month of Change and Freedom",
    6: "Month of Responsibility and Harmony",
    7: "Month of Wisdom and Inner Growth",
    8: "Month of Power and Achievement",
    9: "Month of Completion and Universal Love",
    11: "Month of Spiritual Mastery",
    22: "Month of Master Building"
  };

  return themes[essence as keyof typeof themes] || themes[reduceToSingleDigit(essence)];
}

function getMonthlyOpportunities(essence: number): string[] {
  const baseOpportunities = {
    1: [
      "Take initiative in major projects",
      "Establish leadership positions",
      "Start new ventures with confidence"
    ],
    2: [
      "Build important partnerships",
      "Focus on diplomatic solutions",
      "Develop patience and cooperation"
    ],
    3: [
      "Launch creative projects",
      "Expand social networks",
      "Express yourself authentically"
    ],
    4: [
      "Build solid foundations",
      "Organize long-term plans",
      "Establish reliable systems"
    ],
    5: [
      "Embrace progressive changes",
      "Explore new territories",
      "Break free from limitations"
    ],
    6: [
      "Focus on family harmony",
      "Take on responsibilities",
      "Create beauty and balance"
    ],
    7: [
      "Deepen spiritual understanding",
      "Research and analyze",
      "Develop expertise"
    ],
    8: [
      "Focus on material success",
      "Build power and influence",
      "Achieve financial goals"
    ],
    9: [
      "Complete major cycles",
      "Share wisdom with others",
      "Embrace universal love"
    ],
    11: [
      "Follow spiritual guidance",
      "Inspire and teach others",
      "Channel higher wisdom"
    ],
    22: [
      "Build lasting structures",
      "Manifest grand visions",
      "Create practical solutions"
    ]
  };

  return baseOpportunities[essence as keyof typeof baseOpportunities] ||
         baseOpportunities[reduceToSingleDigit(essence)];
}

function getMonthlyChallenges(essence: number): string[] {
  const baseChallenges = {
    1: [
      "Balance independence with cooperation",
      "Manage ego and pride",
      "Avoid dominating others"
    ],
    2: [
      "Overcome sensitivity and doubt",
      "Make decisions confidently",
      "Stand up for yourself"
    ],
    3: [
      "Maintain focus and discipline",
      "Avoid superficiality",
      "Channel creativity productively"
    ],
    4: [
      "Stay flexible when needed",
      "Avoid becoming too rigid",
      "Balance work and rest"
    ],
    5: [
      "Manage restless energy",
      "Make wise choices",
      "Stay committed to goals"
    ],
    6: [
      "Balance giving and receiving",
      "Avoid perfectionism",
      "Set healthy boundaries"
    ],
    7: [
      "Connect with others",
      "Stay practical",
      "Share your wisdom"
    ],
    8: [
      "Use power wisely",
      "Stay ethical in business",
      "Balance material and spiritual"
    ],
    9: [
      "Complete unfinished business",
      "Let go of attachments",
      "Avoid emotional drama"
    ],
    11: [
      "Ground spiritual energy",
      "Manage sensitivity",
      "Balance idealism with practicality"
    ],
    22: [
      "Stay focused on goals",
      "Manage stress levels",
      "Delegate when necessary"
    ]
  };

  return baseChallenges[essence as keyof typeof baseChallenges] ||
         baseChallenges[reduceToSingleDigit(essence)];
}

function getMonthlyFocusAreas(essence: number, profile: ReturnType<typeof calculateNumerology>): string[] {
  const baseFocusAreas = {
    1: [
      "Personal development and independence",
      "Leadership skills",
      "Self-confidence"
    ],
    2: [
      "Relationships and partnerships",
      "Emotional intelligence",
      "Attention to detail"
    ],
    3: [
      "Creative expression",
      "Communication",
      "Social connections"
    ],
    4: [
      "Organization and structure",
      "Practical matters",
      "Foundation building"
    ],
    5: [
      "Personal freedom",
      "Adventure and change",
      "Adaptability"
    ],
    6: [
      "Family and home",
      "Responsibility",
      "Harmony and balance"
    ],
    7: [
      "Spiritual growth",
      "Inner wisdom",
      "Technical skills"
    ],
    8: [
      "Business and finance",
      "Personal power",
      "Material goals"
    ],
    9: [
      "Completion and release",
      "Humanitarian efforts",
      "Universal understanding"
    ],
    11: [
      "Spiritual awareness",
      "Intuitive development",
      "Teaching and inspiration"
    ],
    22: [
      "Large-scale projects",
      "Practical spirituality",
      "Leadership and service"
    ]
  };

  return baseFocusAreas[essence as keyof typeof baseFocusAreas] ||
         baseFocusAreas[reduceToSingleDigit(essence)];
}

export {
  calculateNumerology,
  reduceToSingleDigit,
  calculateWeeklyForecast,
  calculateMonthlyForecast,
  calculateCompatibility,
  getBusinessStrengths,
  getBusinessChallenges,
  getFriendshipStrengths,
  getFriendshipChallenges,
  getFamilyStrengths,
  getFamilyChallenges,
  getChineseZodiacSign,
  getZodiacCompatibility,
  calculateYearDifferenceCompatibility,
  getDetailedZodiacDescription
};