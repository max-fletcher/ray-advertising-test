export function roundTo2DP(num: number)
{
  return Math.round((num + Number.EPSILON) * 100) / 100;
}