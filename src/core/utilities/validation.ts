/**
 * Validates a numeric value within a specific range, falling back to a default value if invalid.
 */
export function validateRange(
  value: number | undefined,
  min: number,
  max: number,
  defaultValue: number,
  propName?: string
): number {
  if (value === undefined || typeof value !== "number" || isNaN(value)) {
    return defaultValue;
  }
  if (value < min || value > max) {
    if (process.env.NODE_ENV === "development" && propName) {
      console.warn(
        `[AtmosFX] Prop '${propName}' with value ${value} is out of bounds [${min}, ${max}]. Clamping to range.`
      );
    }
    return Math.min(Math.max(value, min), max);
  }
  return value;
}

/**
 * Validates a positive number, falling back to default if non-positive.
 */
export function validatePositive(
  value: number | undefined,
  defaultValue: number,
  propName?: string
): number {
  if (value === undefined || typeof value !== "number" || isNaN(value) || value <= 0) {
    if (process.env.NODE_ENV === "development" && propName && value !== undefined) {
      console.warn(
        `[AtmosFX] Prop '${propName}' must be a positive number. Using fallback ${defaultValue}.`
      );
    }
    return defaultValue;
  }
  return value;
}
