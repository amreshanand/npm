import { RefObject } from "react";
import { Dimensions } from "../types";
export interface UseCanvasResizeOptions {
    containerRef?: RefObject<HTMLElement | null>;
    onResize?: (dimensions: Dimensions) => void;
}
/**
 * Hook that keeps an HTMLCanvasElement correctly sized to either its parent container
 * or the full viewport window, handling high-DPI screens cleanly and preventing unnecessary re-renders.
 */
export declare function useCanvasResize(canvasRef: RefObject<HTMLCanvasElement | null>, options?: UseCanvasResizeOptions): Dimensions;
