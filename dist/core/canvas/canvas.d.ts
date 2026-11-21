import { Dimensions } from "../../types";
/**
 * Prepares a canvas for high-DPI displays by matching backing buffer size to physical device pixels.
 */
export declare function setupCanvas(canvas: HTMLCanvasElement, width: number, height: number, dpr?: number): Dimensions;
/**
 * Efficiently clears the 2D canvas context.
 */
export declare function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number): void;
/**
 * Draws a multi-pointed star shape on the canvas context.
 */
export declare function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number): void;
