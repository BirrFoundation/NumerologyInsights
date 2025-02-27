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
  const dateStr = date.getDate().toString() +
                 (date.getMonth() + 1).toString() +
                 date.getFullYear().toString();

  console.log(`Date string for calculation: ${dateStr}`);
  return reduceToSingleDigit(
    dateStr.split('').reduce((sum, digit) => sum + parseInt(digit), 0)
  );
}

function getBirthDateNumber(date: Date): number {
  // Calculate using only the day of birth
  const dayOfBirth = date.getDate();
  console.log(`Birth date number calculation using day: ${dayOfBirth}`);
  return reduceToSingleDigit(dayOfBirth);
}

function getAttributeNumber(date: Date): number {
  // Calculate using only birth date and month
  const dateStr = date.getDate().toString() + (date.getMonth() + 1).toString();
  console.log(`Attribute calculation using date and month: ${dateStr}`);
  return reduceToSingleDigit(
    dateStr.split('').reduce((sum, digit) => sum + parseInt(digit), 0)
  );
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
  while (currentNum > 9 && currentNum !== 11 && currentNum !== 22) {
    currentNum = currentNum.toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit), 0);
    console.log(`Reduced to: ${currentNum}`);
  }
  return currentNum;
}

export function calculateNumerology(name: string, birthdate: Date) {
  console.log(`\nCalculating numerology for ${name}, born ${birthdate}`);

  const lifePath = getBirthNumber(birthdate);
  const destiny = getNameNumber(name);
  const vowels = name.toLowerCase().match(/[aeiou]/g) || [];
  const heartDesire = reduceToSingleDigit(
    vowels.reduce((sum, char) => sum + (char.charCodeAt(0) - 96), 0)
  );
  const expression = getExpressionNumber(name);
  const personality = getPersonalityNumber(name);
  const attribute = getAttributeNumber(birthdate);
  const birthDateNum = getBirthDateNumber(birthdate);

  const result = {
    lifePath,
    destiny,
    heartDesire,
    expression,
    personality,
    attribute,
    birthDateNum
  };

  console.log('Final numerology results:', result);
  return result;
}

export function calculateCompatibility(
  name1: string,
  birthdate1: Date,
  name2: string,
  birthdate2: Date
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