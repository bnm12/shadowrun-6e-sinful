import { describe, it, expect, vi } from "vitest";
import { countHitsAndFailures } from "../sin-check-helpers";

describe("countHitsAndFailures", () => {
  it("should return 0 hits and 0 failures for n=0", () => {
    const result = countHitsAndFailures(0);
    expect(result).toEqual({ hits: 0, failures: 0 });
  });

  it("should correctly count hits and failures", () => {
    const rolls = [1, 2, 3, 4, 5, 6];
    vi.spyOn(Math, "random").mockImplementation(() => rolls.shift()! / 6 - 0.00001);

    const result = countHitsAndFailures(6);
    expect(result).toEqual({ hits: 2, failures: 1 });

    vi.spyOn(Math, "random").mockRestore();
  });

  it("should return values within the expected range", () => {
    const result = countHitsAndFailures(100);
    expect(result.hits).toBeGreaterThanOrEqual(0);
    expect(result.hits).toBeLessThanOrEqual(100);
    expect(result.failures).toBeGreaterThanOrEqual(0);
    expect(result.failures).toBeLessThanOrEqual(100);
  });
});
