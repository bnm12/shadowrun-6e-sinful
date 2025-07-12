/**
 * Generates a given number of random dice rolls (1-6) and counts the
 * hits (5s and 6s) and failures (1s).
 *
 * @param n The number of dice to roll.
 * @returns An object containing the number of hits and failures.
 */
export function countHitsAndFailures(n: number): { hits: number; failures: number } {
  let hits = 0;
  let failures = 0;

  for (let i = 0; i < n; i++) {
    const roll = Math.floor(Math.random() * 6) + 1;
    if (roll >= 5) {
      hits++;
    } else if (roll === 1) {
      failures++;
    }
  }

  return { hits, failures };
}
