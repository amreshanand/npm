/**
 * Converts a hex color string (#RGB, #RGBA, #RRGGBB, #RRGGBBAA) to rgba format with custom alpha.
 */
export function hexToRgba(hex: string, alpha = 1): string {
  let cleanHex = hex.trim().replace(/^#/, "");

  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  } else if (cleanHex.length === 4) {
    cleanHex = cleanHex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (cleanHex.length === 6 || cleanHex.length === 8) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    const a =
      cleanHex.length === 8
        ? (parseInt(cleanHex.substring(6, 8), 16) / 255) * alpha
        : alpha;
    return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, a))})`;
  }

  return hex;
}

/**
 * Parses any color format (hex, rgb, hsl, named color) into an rgba string or returns format with alpha.
 */
export function parseColor(color: string, alpha = 1): string {
  if (!color) return `rgba(255, 255, 255, ${alpha})`;
  const trimmed = color.trim();

  if (trimmed.startsWith("#")) {
    return hexToRgba(trimmed, alpha);
  }

  if (trimmed.startsWith("rgb(") && !trimmed.startsWith("rgba(")) {
    return trimmed.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
  }

  if (trimmed.startsWith("rgba(")) {
    if (alpha !== 1) {
      // Replace existing alpha
      return trimmed.replace(/,\s*[\d.]+\)$/, `, ${alpha})`);
    }
    return trimmed;
  }

  if (trimmed.startsWith("hsl(") && !trimmed.startsWith("hsla(")) {
    return trimmed.replace("hsl(", "hsla(").replace(")", `, ${alpha})`);
  }

  return trimmed;
}

/**
 * Returns a random color from a given array of colors.
 */
export function samplePalette(colors: string[]): string {
  if (!colors || colors.length === 0) {
    return "#ffffff";
  }
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
}
