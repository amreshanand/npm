import { Dimensions } from "../../types";

/**
 * Prepares a canvas for high-DPI displays by matching backing buffer size to physical device pixels.
 */
export function setupCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  dpr = window.devicePixelRatio || 1
): Dimensions {
  const effectiveDpr = Math.max(1, Math.min(dpr, 3)); // Clamp DPR between 1 and 3 to avoid GPU exhaustion
  canvas.width = Math.floor(width * effectiveDpr);
  canvas.height = Math.floor(height * effectiveDpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    ctx.scale(effectiveDpr, effectiveDpr);
  }

  return { width, height, dpr: effectiveDpr };
}

/**
 * Efficiently clears the 2D canvas context.
 */
export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): void {
  ctx.clearRect(0, 0, width, height);
}

/**
 * Draws a multi-pointed star shape on the canvas context.
 */
export function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
): void {
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < spikes; i++) {
    let x = cx + Math.cos(rot) * outerRadius;
    let y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}
