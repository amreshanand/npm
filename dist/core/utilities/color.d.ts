/**
 * Converts a hex color string (#RGB, #RGBA, #RRGGBB, #RRGGBBAA) to rgba format with custom alpha.
 */
export declare function hexToRgba(hex: string, alpha?: number): string;
/**
 * Parses any color format (hex, rgb, hsl, named color) into an rgba string or returns format with alpha.
 */
export declare function parseColor(color: string, alpha?: number): string;
/**
 * Returns a random color from a given array of colors.
 */
export declare function samplePalette(colors: string[]): string;
