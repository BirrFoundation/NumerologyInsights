// Basic interpretations for numerology and zodiac signs

// Define zodiac types
export type ZodiacSign = 'Rat' | 'Ox' | 'Tiger' | 'Rabbit' | 'Dragon' | 'Snake' | 'Horse' | 'Sheep' | 'Monkey' | 'Rooster' | 'Dog' | 'Pig';

export type ZodiacInterp = {
  traits: string[];
  characteristics: string;
  compatibility: {
    best: string;
    worst: string;
    description: string;
  };
};

// Export basic interpretations object
export const basicInterpretations = {
  lifePath: (number: number) => {
    const meanings: Record<number, string> = {
      1: "As embodying masculine energy, You are a natural born leader, you possess strong independence and ambition.",
      2: "As embodying feminine energy, You are a natural mediator with diplomatic skills and deep sensitivity to others' needs.",
      3: "Blessed with creative energy, communication and expressive abilities, you're naturally optimistic and inspiring to others.",
      4: "You are the embodiment of stability, reliability and discipline.",
      5: "Your adventurous spirit and versatility make you highly adaptable to change.",
      6: "As a natural nurturer, you have a deep sense of responsibility and care for others specially family.",
      7: "Your analytical mind and spiritual awareness give you unique insights.",
      8: "You possess natural leadership abilities in business and material affairs.",
      9: "Your humanitarian nature and universal understanding make you a compassionate leader.",
      11: "As a master number, old soul, magnetic and charismatic personality you possess heightened intuition and spiritual awareness.",
      22: "As a master builder number, you have exceptional potential to create lasting achievements.", 
      33: "As a master number, you embody selfless love, deep compassion, and spiritual enlightenment.",
      44: "You possess extraordinary potential for discipline, stability, and grounded wisdom.",
      28: "You are a natural leader with a strong presence and the ability to command authority."
    };
    return meanings[number] || "A unique number with special significance in your life path journey";
  },

  getBasicInterpretation: (number: number, type: string) => {
    if (type === 'lifePath') return basicInterpretations.lifePath(number);
    if (type === 'destiny') return basicInterpretations.destiny(number);
    if (type === 'heartDesire') return basicInterpretations.heartDesire(number);
    if (type === 'expression') return basicInterpretations.expression(number);
    if (type === 'personality') return basicInterpretations.personality(number);
    if (type === 'birthDateNum') return basicInterpretations.birthDateNum(number);
    if (type === 'attribute') return basicInterpretations.attribute(number);
    return "Unknown interpretation type";
  },

  expression: (number: number) => {
    const meanings: Record<number, string> = {
      1: "Your expression number reveals a confident and innovative personality.",
      2: "Your expression shows a diplomatic and cooperative nature.",
      3: "You express yourself through creativity and optimism.",
      4: "Your expression manifests as practical and reliable.",
      5: "You express yourself through adaptability and change.",
      6: "Your expression shows nurturing and responsible traits.",
      7: "You express yourself through analysis and wisdom.",
      8: "Your expression manifests as powerful and successful.",
      9: "You express yourself through humanitarian service.",
      11: "Your expression reveals spiritual insight and inspiration.",
      22: "You express yourself through practical mastery.",
      33: "Your expression shows divine understanding.",
      44: "You express yourself through structured achievement.",
      28: "Your expression combines leadership with diplomacy."
    };
    return meanings[number] || "Your expression number reveals your outer personality";
  },

  personality: (number: number) => {
    const meanings: Record<number, string> = {
      1: "You present yourself as confident and independent.",
      2: "Your personality appears gentle and diplomatic.",
      3: "You come across as creative and expressive.",
      4: "Your personality appears steady and reliable.",
      5: "You present yourself as adventurous and adaptable.",
      6: "Your personality appears nurturing and responsible.",
      7: "You come across as analytical and wise.",
      8: "Your personality appears powerful and capable.",
      9: "You present yourself as compassionate and wise.",
      11: "Your personality appears spiritually aware.",
      22: "You come across as masterful and capable.",
      33: "Your personality appears enlightened and loving.",
      44: "You present yourself as structured and disciplined.",
      28: "Your personality appears as natural leadership."
    };
    return meanings[number] || "Your personality number shows how others see you";
  },

  attribute: (number: number) => {
    const meanings: Record<number, string> = {
      1: "Your core attributes are leadership and innovation.",
      2: "Your key attributes are cooperation and sensitivity.",
      3: "Your main attributes are creativity and expression.",
      4: "Your core attributes are stability and organization.",
      5: "Your key attributes are freedom and adaptability.",
      6: "Your main attributes are responsibility and care.",
      7: "Your core attributes are wisdom and analysis.",
      8: "Your key attributes are power and achievement.",
      9: "Your main attributes are compassion and wisdom.",
      11: "Your core attributes are inspiration and insight.",
      22: "Your key attributes are mastery and manifestation.",
      33: "Your main attributes are healing and teaching.",
      44: "Your core attributes are structure and discipline.",
      28: "Your key attributes are authority and influence."
    };
    return meanings[number] || "Your attribute number reveals your core strengths";
  },

  birthDateNum: (number: number) => {
    const meanings: Record<number, string> = {
      1: "Your birth date indicates natural leadership qualities.",
      2: "Your birth date shows diplomatic tendencies.",
      3: "Your birth date reveals creative talents.",
      4: "Your birth date indicates practical abilities.",
      5: "Your birth date shows adventurous nature.",
      6: "Your birth date reveals nurturing instincts.",
      7: "Your birth date indicates analytical mind.",
      8: "Your birth date shows executive abilities.",
      9: "Your birth date reveals humanitarian tendencies.",
      11: "Your birth date indicates spiritual gifts.",
      22: "Your birth date shows master builder qualities.",
      33: "Your birth date reveals healing abilities.",
      44: "Your birth date indicates disciplined nature.",
      28: "Your birth date shows natural authority."
    };
    return meanings[number] || "Your birth date number reveals inherent traits";
  },

  destiny: (number: number) => {
    const meanings: Record<number, string> = {
      1: "Your destiny calls you to be a pioneer and innovator.",
      2: "You are destined to be a peace-maker and diplomat.",
      3: "Your destiny involves creative expression and inspiring communication.",
      4: "You are destined to build lasting foundations and structures.",
      5: "Your destiny involves bringing positive change and adventure to others.",
      6: "You are destined to be a guide and nurturer.",
      7: "Your destiny involves seeking and sharing wisdom.",
      8: "You are destined for material and spiritual mastery.",
      9: "Your destiny is to serve humanity with compassion and wisdom.",
      11: "As a master number, your destiny involves spiritual leadership and inspiration.",
      22: "As a master builder number, your destiny involves creating large-scale improvements in the world.",
      33: "Your destiny is to uplift and heal through unconditional love and service.",
      44: "Your destiny is to structure and manifest significant achievements with discipline and perseverance.",
      28: "Your destiny is to be both a leader and a diplomat."
    };
    return meanings[number] || "A unique destiny number guiding you toward your life's purpose";
  },

  heartDesire: (number: number) => {
    const meanings: Record<number, string> = {
      1: "Your heart yearns for independence and leadership opportunities.",
      2: "Your heart seeks harmony and meaningful partnerships.",
      3: "Your heart yearns for creative expression and joyful connections.",
      4: "Your heart desires stability and security.",
      5: "Your heart yearns for freedom and adventure.",
      6: "Your heart seeks harmony and nurturing relationships.",
      7: "Your heart yearns for knowledge and understanding.",
      8: "Your heart seeks material success and spiritual fulfillment.",
      9: "Your heart yearns to serve humanity.",
      11: "Your heart yearns for spiritual enlightenment and inspiration.",
      22: "Your heart yearns to build a lasting legacy.",
      33: "Your heart longs to bring healing, love, and guidance to others.",
      44: "Your heart seeks to create lasting structures and achievements.",
      28: "Your heart desires both material success and spiritual growth."
    };
    return meanings[number] || "Your heart's desire reveals your deepest motivations";
  }
};

// Chinese Zodiac interpretations
export const zodiacInterpretations: Record<ZodiacSign, ZodiacInterp> = {
  'Rat': {
    traits: ['Frugal', 'ambitious', 'honest', 'charming', 'critical'],
    characteristics: 'Ambitious, candid, competitive and congenial, Rats are natural leaders. They have strong interpersonal skills and can easily connect with others.',
    compatibility: {
      best: 'Dragon, Monkey',
      worst: 'Horse',
      description: 'Rats form meaningful relationships with Dragons and Monkeys who complement their ambitious nature.'
    }
  },
  'Ox': {
    traits: ['Perseverant', 'patient', 'hardworking', 'determined', 'stubborn'],
    characteristics: 'The Ox is a pillar of strength in their communities, recognized for their diligence, dependability, and honesty.',
    compatibility: {
      best: 'Snake, Rooster',
      worst: 'Sheep',
      description: 'Forms excellent partnerships with Snake and Rooster.'
    }
  },
  'Tiger': {
    traits: ['Courageous', 'candid', 'confident', 'adventurous', 'sensitive'],
    characteristics: 'Tigers embody courage, leadership, and independence. They face challenges head-on with unwavering determination.',
    compatibility: {
      best: 'Horse, Dog',
      worst: 'Monkey',
      description: 'Tigers find their strongest connections with Horses and Dogs, who match their adventurous spirit.'
    }
  },
  'Rabbit': {
    traits: ['Gentle', 'intelligent', 'loving', 'articulate', 'lucky'],
    characteristics: 'Rabbits possess grace, intelligence, and a caring nature. They excel in creating harmonious environments.',
    compatibility: {
      best: 'Sheep, Dog',
      worst: 'Rooster',
      description: 'Rabbits harmonize wonderfully with Sheep and Dogs, creating peaceful and supportive relationships.'
    }
  },
  'Dragon': {
    traits: ['Strong', 'independent', 'fortunate', 'ambitious', 'confident'],
    characteristics: 'Dragons are natural leaders with charisma and strength. They inspire others with their confidence and vision.',
    compatibility: {
      best: 'Rat, Monkey',
      worst: 'Dog',
      description: 'Dragons find their best matches with Rats and Monkeys, who appreciate their strength and ambition.'
    }
  },
  'Snake': {
    traits: ['Ambitious', 'wise', 'intense', 'determined', 'enigmatic'],
    characteristics: 'Snakes possess wisdom, charm, and deep intuition. They excel in complex situations requiring careful thought.',
    compatibility: {
      best: 'Dragon, Rooster',
      worst: 'Pig',
      description: 'Snakes connect deeply with Dragons and Roosters, sharing their wisdom and determination.'
    }
  },
  'Horse': {
    traits: ['Energetic', 'free', 'popular', 'positive', 'animated'],
    characteristics: 'Horses embody freedom, energy, and adventure. They bring enthusiasm and positivity to all endeavors.',
    compatibility: {
      best: 'Tiger, Sheep',
      worst: 'Rat',
      description: 'Horses find their perfect matches with Tigers and Sheep, who understand their need for freedom.'
    }
  },
  'Sheep': {
    traits: ['Kind', 'patient', 'persuasive', 'gentle', 'calm'],
    characteristics: 'Sheep are gentle souls with artistic sensibilities and deep empathy. They create peaceful environments.',
    compatibility: {
      best: 'Rabbit, Horse',
      worst: 'Ox',
      description: 'Sheep form harmonious bonds with Rabbits and Horses, who appreciate their gentle nature.'
    }
  },
  'Monkey': {
    traits: ['Intelligent', 'influential', 'curious', 'passionate', 'sharp'],
    characteristics: 'Monkeys are clever, innovative, and adaptable. They excel in finding creative solutions.',
    compatibility: {
      best: 'Rat, Dragon',
      worst: 'Tiger',
      description: 'Monkeys share a special bond with Rats and Dragons, matching their intelligence and wit.'
    }
  },
  'Rooster': {
    traits: ['Empathetic', 'creative', 'reliable', 'consistent', 'observant'],
    characteristics: 'Roosters are diligent, precise, and confident. They bring order and reliability to any situation.',
    compatibility: {
      best: 'Ox, Snake',
      worst: 'Rabbit',
      description: 'Roosters connect well with Oxen and Snakes, sharing their dedication to hard work.'
    }
  },
  'Dog': {
    traits: ['Loyal', 'honest', 'generous', 'playful', 'lovely'],
    characteristics: 'Dogs exemplify loyalty, honesty, and justice. They form deep and lasting bonds with others.',
    compatibility: {
      best: 'Tiger, Rabbit',
      worst: 'Dragon',
      description: 'Dogs find their perfect matches with Tigers and Rabbits, who value their loyalty and honesty.'
    }
  },
  'Pig': {
    traits: ['Happy', 'generous', 'logical', 'loving', 'compassionate'],
    characteristics: 'Pigs are kind-hearted, sincere, and optimistic. They bring joy and generosity to relationships.',
    compatibility: {
      best: 'Tiger, Rabbit',
      worst: 'Snake',
      description: 'Pigs have wonderful relationships with Tigers and Rabbits, who appreciate their generous nature.'
    }
  }
};