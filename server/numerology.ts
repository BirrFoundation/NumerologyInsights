function getNameNumber(name: string): number {
  const nameValue = name.toLowerCase()
    .replace(/[^a-z]/g, '')
    .split('')
    .map(char => char.charCodeAt(0) - 96)
    .reduce((sum, num) => sum + num, 0);

  return reduceToSingleDigit(nameValue);
}

function getBirthNumber(date: Date): number {
  const dateStr = date.getDate().toString() +
                 (date.getMonth() + 1).toString() +
                 date.getFullYear().toString();
  
  return reduceToSingleDigit(
    dateStr.split('').reduce((sum, digit) => sum + parseInt(digit), 0)
  );
}

function reduceToSingleDigit(num: number): number {
  while (num > 9) {
    num = num.toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit), 0);
  }
  return num;
}

export function calculateNumerology(name: string, birthdate: Date) {
  return {
    lifePath: getBirthNumber(birthdate),
    destiny: getNameNumber(name),
    heartDesire: reduceToSingleDigit(
      name.toLowerCase()
        .replace(/[^aeiou]/g, '')
        .split('')
        .map(char => char.charCodeAt(0) - 96)
        .reduce((sum, num) => sum + num, 0)
    )
  };
}
