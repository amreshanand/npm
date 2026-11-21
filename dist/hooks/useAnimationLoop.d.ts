export interface AnimationCallbackParams {
    timestamp: number;
    deltaTime: number;
}
export interface UseAnimationLoopOptions {
    enabled?: boolean;
    pauseWhenHidden?: boolean;
}
/**
 * Manages a high-performance requestAnimationFrame loop with delta-time calculation,
 * tab visibility pausing, and automatic cleanup on unmount.
 */
export declare function useAnimationLoop(callback: (params: AnimationCallbackParams) => void, options?: UseAnimationLoopOptions): void;
