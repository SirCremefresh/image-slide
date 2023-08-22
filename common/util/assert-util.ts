export function assertNotNullOrUndefined<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error("Value is null");
  return value;
}

export function isNullOrUndefined<T>(
  value: T | null | undefined,
): value is null | undefined {
  return value === null || value === undefined;
}
