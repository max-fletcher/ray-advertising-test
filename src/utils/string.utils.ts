export function convertToBase64(value: string): string {
  return Buffer.from(value).toString('base64');
}

export function capitalizeFirstLetter(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function findCharIndex(
  str: string,
  char: string,
  occurance: number = 1,
) {
  let count = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) {
      count++;
      if (count === occurance) return i;
    }
  }

  return -1;
}
