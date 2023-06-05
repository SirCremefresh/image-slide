import { describe, expect, it } from "vitest";
import { hashString } from "./hash.ts";

describe("hashString", () => {
  it("should return correct SHA-256 hash", async () => {
    const secret = "test";
    const expectedHash =
      "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08";
    const result = await hashString(secret);
    expect(result).toBe(expectedHash);
  });
});
