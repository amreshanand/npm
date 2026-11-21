import { describe, it, expect } from "vitest";
import {
  clamp,
  lerp,
  randomRange,
  randomInt,
  degToRad,
  radToDeg,
  distance
} from "../src/core/utilities/math";
import { hexToRgba, parseColor, samplePalette } from "../src/core/utilities/color";
import { validateRange, validatePositive } from "../src/core/utilities/validation";
import { setupCanvas, clearCanvas, drawStar } from "../src/core/canvas/canvas";

describe("Math Utilities", () => {
  it("clamps values between min and max", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("lerps between two numbers", () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(10, 20, 0)).toBe(10);
    expect(lerp(10, 20, 1)).toBe(20);
  });

  it("generates random numbers in range", () => {
    for (let i = 0; i < 50; i++) {
      const val = randomRange(5, 10);
      expect(val).toBeGreaterThanOrEqual(5);
      expect(val).toBeLessThanOrEqual(10);
    }
  });

  it("generates random integers in range", () => {
    for (let i = 0; i < 50; i++) {
      const val = randomInt(2, 6);
      expect(Number.isInteger(val)).toBe(true);
      expect(val).toBeGreaterThanOrEqual(2);
      expect(val).toBeLessThanOrEqual(6);
    }
  });

  it("converts degrees to radians and back", () => {
    expect(degToRad(180)).toBeCloseTo(Math.PI);
    expect(radToDeg(Math.PI)).toBeCloseTo(180);
  });

  it("calculates Euclidean distance", () => {
    expect(distance(0, 0, 3, 4)).toBe(5);
    expect(distance(1, 1, 1, 1)).toBe(0);
  });
});

describe("Color Utilities", () => {
  it("converts hex to rgba", () => {
    expect(hexToRgba("#ffffff", 0.5)).toBe("rgba(255, 255, 255, 0.5)");
    expect(hexToRgba("#fff", 1)).toBe("rgba(255, 255, 255, 1)");
    expect(hexToRgba("#000000")).toBe("rgba(0, 0, 0, 1)");
  });

  it("parses rgb and rgba strings with alpha", () => {
    expect(parseColor("rgb(100, 150, 200)", 0.8)).toBe("rgba(100, 150, 200, 0.8)");
    expect(parseColor("rgba(100, 150, 200, 1)", 0.5)).toBe("rgba(100, 150, 200, 0.5)");
    expect(parseColor("#ff0000", 0.6)).toBe("rgba(255, 0, 0, 0.6)");
  });

  it("samples palette safely", () => {
    const palette = ["#ff0000", "#00ff00", "#0000ff"];
    const sampled = samplePalette(palette);
    expect(palette).toContain(sampled);
    expect(samplePalette([])).toBe("#ffffff");
  });
});

describe("Validation Utilities", () => {
  it("validates range with fallbacks and clamping", () => {
    expect(validateRange(5, 0, 10, 2)).toBe(5);
    expect(validateRange(undefined, 0, 10, 4)).toBe(4);
    expect(validateRange(15, 0, 10, 4)).toBe(10);
    expect(validateRange(-5, 0, 10, 4)).toBe(0);
  });

  it("validates positive numbers", () => {
    expect(validatePositive(10, 5)).toBe(10);
    expect(validatePositive(-1, 5)).toBe(5);
    expect(validatePositive(0, 5)).toBe(5);
    expect(validatePositive(undefined, 5)).toBe(5);
  });
});

describe("Canvas Utilities", () => {
  it("sets up canvas backing store and scale", () => {
    const canvas = document.createElement("canvas");
    const dims = setupCanvas(canvas, 800, 600, 2);
    expect(dims.width).toBe(800);
    expect(dims.height).toBe(600);
    expect(canvas.width).toBe(1600);
    expect(canvas.height).toBe(1200);
  });

  it("clears canvas context", () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    clearCanvas(ctx, 400, 300);
    expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 400, 300);
  });

  it("draws star paths without error", () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    drawStar(ctx, 50, 50, 5, 20, 10);
    expect(ctx.beginPath).toHaveBeenCalled();
    expect(ctx.closePath).toHaveBeenCalled();
  });
});
