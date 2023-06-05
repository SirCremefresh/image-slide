import { describe, expect, it } from "vitest";
import { classNames } from "./class-names.ts";

describe("classNames function", () => {
  it("should join class names", () => {
    // eslint-disable-next-line tailwindcss/no-custom-classname
    const result = classNames("class1", "class2", "class3");
    expect(result).eq("class1 class2 class3");
  });

  it("should filter out falsy values", () => {
    // eslint-disable-next-line tailwindcss/no-custom-classname
    const result = classNames("class1", false, "class3");
    expect(result).eq("class1 class3");
  });

  it("should return an empty string for no arguments", () => {
    const result = classNames();
    expect(result).eq("");
  });

  it("should return an empty string for all falsy arguments", () => {
    const result = classNames(false, false, false);
    expect(result).eq("");
  });

  it("should handle single argument", () => {
    // eslint-disable-next-line tailwindcss/no-custom-classname
    const result = classNames("class1");
    expect(result).eq("class1");
  });

  it("should handle single falsy argument", () => {
    const result = classNames(false);
    expect(result).eq("");
  });
});
