export function assertNotNull<T>(value: T | null | undefined): T {
  if (value === null || value === undefined) throw new Error("Value is null");
  return value;
}
