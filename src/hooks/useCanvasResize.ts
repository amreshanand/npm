import { useState, useEffect, useRef, RefObject } from "react";
import { setupCanvas } from "../core/canvas/canvas";
import { Dimensions } from "../types";

export interface UseCanvasResizeOptions {
  containerRef?: RefObject<HTMLElement | null>;
  onResize?: (dimensions: Dimensions) => void;
}

/**
 * Hook that keeps an HTMLCanvasElement correctly sized to either its parent container
 * or the full viewport window, handling high-DPI screens cleanly and preventing unnecessary re-renders.
 */
export function useCanvasResize(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseCanvasResizeOptions = {}
): Dimensions {
  const { containerRef, onResize } = options;
  const onResizeRef = useRef(onResize);
  onResizeRef.current = onResize;

  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
    dpr: 1
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      let width = 0;
      let height = 0;

      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        width = Math.max(1, Math.floor(rect.width));
        height = Math.max(1, Math.floor(rect.height));
      } else if (canvas.parentElement) {
        const rect = canvas.parentElement.getBoundingClientRect();
        width = Math.max(1, Math.floor(rect.width || window.innerWidth));
        height = Math.max(1, Math.floor(rect.height || window.innerHeight));
      } else {
        width = window.innerWidth || 800;
        height = window.innerHeight || 600;
      }

      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      const newDims = setupCanvas(canvas, width, height, dpr);

      setDimensions((prev) => {
        if (
          prev.width === newDims.width &&
          prev.height === newDims.height &&
          prev.dpr === newDims.dpr
        ) {
          return prev;
        }
        return newDims;
      });

      onResizeRef.current?.(newDims);
    };

    updateSize();

    let resizeObserver: ResizeObserver | null = null;
    const targetElement = containerRef?.current || canvas.parentElement;

    if (typeof ResizeObserver !== "undefined" && targetElement) {
      resizeObserver = new ResizeObserver(() => {
        updateSize();
      });
      resizeObserver.observe(targetElement);
    }

    window.addEventListener("resize", updateSize, { passive: true });

    return () => {
      window.removeEventListener("resize", updateSize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [canvasRef, containerRef]);

  return dimensions;
}
