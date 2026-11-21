import { useEffect, useRef } from "react";

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
export function useAnimationLoop(
  callback: (params: AnimationCallbackParams) => void,
  options: UseAnimationLoopOptions = {}
): void {
  const { enabled = true, pauseWhenHidden = true } = options;
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const isTabHiddenRef = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled) {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      lastTimeRef.current = null;
      return;
    }

    const handleVisibilityChange = () => {
      if (pauseWhenHidden) {
        isTabHiddenRef.current = document.hidden;
        if (!document.hidden) {
          // Reset last time on resume so delta does not spike
          lastTimeRef.current = null;
        }
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    const loop = (timestamp: number) => {
      if (!isTabHiddenRef.current) {
        if (lastTimeRef.current === null) {
          lastTimeRef.current = timestamp;
        }
        // Cap max delta time at 100ms to avoid physics explosions on lag spikes
        const rawDelta = (timestamp - lastTimeRef.current) / 1000;
        const deltaTime = Math.min(rawDelta, 0.1);
        lastTimeRef.current = timestamp;

        callbackRef.current({ timestamp, deltaTime });
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      lastTimeRef.current = null;
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };
  }, [enabled, pauseWhenHidden]);
}
