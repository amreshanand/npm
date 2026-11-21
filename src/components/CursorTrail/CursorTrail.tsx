import React, { useRef, useEffect } from "react";
import { CursorTrailProps } from "./CursorTrail.types";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useCanvasResize } from "../../hooks/useCanvasResize";
import { useAnimationLoop } from "../../hooks/useAnimationLoop";
import { clearCanvas } from "../../core/canvas/canvas";
import { distance } from "../../core/utilities/math";
import { parseColor, samplePalette } from "../../core/utilities/color";
import { validateRange, validatePositive } from "../../core/utilities/validation";

interface TrailNode {
  x: number;
  y: number;
  size: number;
  color: string;
  alpha: number;
}

export const CursorTrail: React.FC<CursorTrailProps> = ({
  color = "#60efff",
  trailLength: propTrailLength = 25,
  particleSize: propParticleSize = 6,
  glow = true,
  glowRadius = 12,
  glowColor,
  fadeDuration: propFadeDuration = 1.5,
  sensitivity: propSensitivity = 4,
  disabledOnTouch = false,
  fullScreen = true,
  containerRef,
  className,
  style,
  enabled = true,
  zIndex = 9999,
  opacity = 0.9,
  respectReducedMotion = true,
  id,
  "aria-hidden": ariaHidden = true
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nodesRef = useRef<TrailNode[]>([]);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const isTouchDeviceRef = useRef<boolean>(false);

  const trailLength = Math.round(
    validateRange(propTrailLength, 2, 100, 25, "trailLength")
  );
  const particleSize = validatePositive(propParticleSize, 6, "particleSize");
  const fadeDuration = validateRange(propFadeDuration, 0.2, 10, 1.5, "fadeDuration");
  const sensitivity = validatePositive(propSensitivity, 4, "sensitivity");

  const colors = Array.isArray(color) ? color : [color];
  const dimensions = useCanvasResize(canvasRef, { containerRef });

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (clientX: number, clientY: number) => {
      let x = clientX;
      let y = clientY;

      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect();
        x = clientX - rect.left;
        y = clientY - rect.top;
      }

      if (lastPointRef.current) {
        const dist = distance(lastPointRef.current.x, lastPointRef.current.y, x, y);
        if (dist < sensitivity) return;
      }

      lastPointRef.current = { x, y };

      const newNode: TrailNode = {
        x,
        y,
        size: particleSize,
        color: samplePalette(colors),
        alpha: 1.0
      };

      nodesRef.current.unshift(newNode);
      if (nodesRef.current.length > trailLength) {
        nodesRef.current.length = trailLength;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      isTouchDeviceRef.current = true;
      if (disabledOnTouch) return;
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const target: EventTarget = containerRef?.current || window;
    target.addEventListener("mousemove", onMouseMove as EventListener, {
      passive: true
    });
    target.addEventListener("touchmove", onTouchMove as EventListener, {
      passive: true
    });

    return () => {
      target.removeEventListener("mousemove", onMouseMove as EventListener);
      target.removeEventListener("touchmove", onTouchMove as EventListener);
    };
  }, [enabled, disabledOnTouch, containerRef, sensitivity, particleSize, trailLength, colors]);

  const shouldAnimate =
    enabled &&
    (!respectReducedMotion || !prefersReducedMotion) &&
    !(disabledOnTouch && isTouchDeviceRef.current);

  useAnimationLoop(
    ({ deltaTime }) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = dimensions;
      if (width === 0 || height === 0) return;

      clearCanvas(ctx, width, height);

      const nodes = nodesRef.current;
      if (nodes.length === 0) return;

      const decay = deltaTime * fadeDuration;
      const activeNodes: TrailNode[] = [];

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.alpha -= decay;

        if (node.alpha > 0.01) {
          const progress = 1 - i / nodes.length; // 1 at cursor tip, down to 0 at tail
          const currentRadius = node.size * progress;
          const currentAlpha = node.alpha * progress * opacity;

          if (currentRadius > 0.1 && currentAlpha > 0.01) {
            ctx.save();
            if (glow) {
              ctx.shadowBlur = glowRadius;
              ctx.shadowColor = parseColor(
                glowColor || node.color,
                currentAlpha * 0.7
              );
            }

            ctx.fillStyle = parseColor(node.color, currentAlpha);
            ctx.beginPath();
            ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            activeNodes.push(node);
          }
        }
      }

      nodesRef.current = activeNodes;
    },
    { enabled: shouldAnimate }
  );

  const containerStyle: React.CSSProperties = {
    position: fullScreen ? "fixed" : "absolute",
    top: 0,
    left: 0,
    width: fullScreen ? "100vw" : "100%",
    height: fullScreen ? "100vh" : "100%",
    pointerEvents: "none",
    zIndex,
    ...style
  };

  return (
    <canvas
      ref={canvasRef}
      id={id}
      aria-hidden={ariaHidden}
      className={className}
      style={containerStyle}
    />
  );
};
