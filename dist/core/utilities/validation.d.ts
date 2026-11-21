/**
 * Validates a numeric value within a specific range, falling back to a default value if invalid.
 */
export declare function validateRange(value: number | undefined, min: number, max: number, defaultValue: number, propName?: string): number;
/**
 * Validates a positive number, falling back to default if non-positive.
 */
export declare function validatePositive(value: number | undefined, defaultValue: number, propName?: string): number;
