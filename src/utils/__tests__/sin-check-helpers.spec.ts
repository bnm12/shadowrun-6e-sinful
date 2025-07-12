import { describe, it, expect, vi } from "vitest";
import { countHitsAndFailures, checkSin } from "../sin-check-helpers";

describe("checkSin", () => {
  it('should return "burned" if hits - sinRating >= 2', () => {
    vi.spyOn(Math, "random").mockReturnValue(5 / 6 - 0.00001);
    const result = checkSin(0, 1);
    expect(result).toBe("burned");
    vi.spyOn(Math, "random").mockRestore();
  });

  it('should return "flagged" if hits - sinRating === 1', () => {
    vi.spyOn(Math, "random").mockReturnValue(5 / 6 - 0.00001);
    const result = checkSin(1, 1);
    expect(result).toBe("flagged");
    vi.spyOn(Math, "random").mockRestore();
  });

  it('should return "blip" if hits - sinRating === 0', () => {
    vi.spyOn(Math, "random").mockReturnValue(5 / 6 - 0.00001);
    const result = checkSin(2, 1);
    expect(result).toBe("blip");
    vi.spyOn(Math, "random").mockRestore();
  });

  it('should return "success" if hits - sinRating < 0', () => {
    vi.spyOn(Math, "random").mockReturnValue(1 / 6 - 0.00001);
    const result = checkSin(1, 1);
    expect(result).toBe("success");
    vi.spyOn(Math, "random").mockRestore();
  });
});

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
