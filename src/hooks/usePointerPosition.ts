import { useState, useEffect, RefObject } from "react";
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
export function usePointerPosition(
  options: UsePointerPositionOptions = {}
): PointerState {
  const { containerRef, enabled = true } = options;
  const [pointer, setPointer] = useState<PointerState>({
    x: -9999,
    y: -9999,
    isActive: false,
    isTouch: false
  });

  useEffect(() => {
    if (!enabled) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      let isTouch = false;

      if ("touches" in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        isTouch = true;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }

      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setPointer({
          x: clientX - rect.left,
          y: clientY - rect.top,
          isActive: true,
          isTouch
        });
      } else {
        setPointer({
          x: clientX,
          y: clientY,
          isActive: true,
          isTouch
        });
      }
    };

    const handlePointerLeave = () => {
      setPointer((prev) => ({
        ...prev,
        isActive: false
      }));
    };

    const target: EventTarget = containerRef?.current || window;

    target.addEventListener("mousemove", handlePointerMove as EventListener, {
      passive: true
    });
    target.addEventListener("touchstart", handlePointerMove as EventListener, {
      passive: true
    });
    target.addEventListener("touchmove", handlePointerMove as EventListener, {
      passive: true
    });
    target.addEventListener("mouseleave", handlePointerLeave as EventListener, {
      passive: true
    });
    target.addEventListener("touchend", handlePointerLeave as EventListener, {
      passive: true
    });

    return () => {
      target.removeEventListener("mousemove", handlePointerMove as EventListener);
      target.removeEventListener("touchstart", handlePointerMove as EventListener);
      target.removeEventListener("touchmove", handlePointerMove as EventListener);
      target.removeEventListener("mouseleave", handlePointerLeave as EventListener);
      target.removeEventListener("touchend", handlePointerLeave as EventListener);
    };
  }, [containerRef, enabled]);

  return pointer;
}
