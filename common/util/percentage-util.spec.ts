import { describe, expect, it } from "vitest";
import { toPercentage } from "./percentage-util.ts";

describe("toPercentage function", () => {
  it("should return the correct percentage for given full and part", () => {
    const result = toPercentage(200, 50);
    expect(result).eq(25);
  });

  it("should return 100 when full equals to part", () => {
    const result = toPercentage(100, 100);
    expect(result).eq(100);
  });

  it("should return 0 when part is 0", () => {
    const result = toPercentage(100, 0);
    expect(result).eq(0);
  });

  it("should return a percentage greater than 100 if part is greater than full", () => {
    const result = toPercentage(100, 150);
    expect(result).eq(150);
  });

  it("should handle negative numbers", () => {
    const result = toPercentage(-100, -50);
    expect(result).eq(50);
  });
});
