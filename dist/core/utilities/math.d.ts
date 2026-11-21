/**
 * Clamps a number between a minimum and maximum value.
 */
export declare function clamp(val: number, min: number, max: number): number;
/**
 * Linear interpolation between a and b by factor t.
 */
export declare function lerp(a: number, b: number, t: number): number;
/**
 * Returns a random floating-point number between min and max.
 */
export declare function randomRange(min: number, max: number): number;
/**
 * Returns a random integer between min and max (inclusive).
 */
export declare function randomInt(min: number, max: number): number;
/**
 * Converts degrees to radians.
 */
export declare function degToRad(degrees: number): number;
/**
 * Converts radians to degrees.
 */
export declare function radToDeg(radians: number): number;
/**
 * Euclidean distance between two points.
 */
export declare function distance(x1: number, y1: number, x2: number, y2: number): number;
