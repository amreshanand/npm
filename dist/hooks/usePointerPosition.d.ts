import { RefObject } from "react";
import { Point } from "../types";
export interface UsePointerPositionOptions {
    containerRef?: RefObject<HTMLElement | null>;
    enabled?: boolean;
}
export interface PointerState extends Point {
    isActive: boolean;
    isTouch: boolean;
}
/**
 * High-performance hook for tracking pointer / touch positions relative to a container or window.
 */
export declare function usePointerPosition(options?: UsePointerPositionOptions): PointerState;
