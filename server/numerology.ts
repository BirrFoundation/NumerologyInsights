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

  const result = {
    lifePath,
    destiny,
    heartDesire,
    expression,
    personality
  };

  console.log('Final numerology results:', result);
  return result;
}