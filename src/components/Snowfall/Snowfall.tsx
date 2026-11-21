import React, { useRef, useEffect } from "react";
import { SnowfallProps } from "./Snowfall.types";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useCanvasResize } from "../../hooks/useCanvasResize";
import { useAnimationLoop } from "../../hooks/useAnimationLoop";
import { usePointerPosition } from "../../hooks/usePointerPosition";
import { clearCanvas } from "../../core/canvas/canvas";
import { randomRange } from "../../core/utilities/math";
import { validateRange, validatePositive } from "../../core/utilities/validation";
import { parseColor } from "../../core/utilities/color";

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  wobble: number;
  wobbleSpeed: number;
  alpha: number;
}

export const Snowfall: React.FC<SnowfallProps> = ({
  count: propCount = 100,
  speed: propSpeed = 1.5,
  size = [2, 5],
  color = "#ffffff",
  opacity = 0.8,
  wind = 0.5,
  interaction = false,
  interactionRadius = 100,
  pause = false,
  fullScreen = true,
  containerRef,
  className,
  style,
  enabled = true,
  zIndex = 1,
  respectReducedMotion = true,
  id,
  "aria-hidden": ariaHidden = true
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate =
    enabled && !pause && (!respectReducedMotion || !prefersReducedMotion);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const flakesRef = useRef<Snowflake[]>([]);
  const pointer = usePointerPosition({ containerRef, enabled: interaction });

  const count = Math.round(validatePositive(propCount, 100, "count"));
  const speed = validateRange(propSpeed, 0.1, 20, 1.5, "speed");
  const minSize = Array.isArray(size) ? size[0] : size;
  const maxSize = Array.isArray(size) ? size[1] : size;

  const dimensions = useCanvasResize(canvasRef, {
    containerRef,
    onResize: (dims) => {
      // Re-initialize or adjust flakes to fit new boundaries
      if (dims.width > 0 && dims.height > 0) {
        initFlakes(dims.width, dims.height);
      }
    }
  });

  const initFlakes = (w: number, h: number) => {
    const flakes: Snowflake[] = [];
    for (let i = 0; i < count; i++) {
      flakes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: randomRange(minSize, maxSize),
        speedY: randomRange(speed * 0.6, speed * 1.4),
        speedX: wind + randomRange(-0.3, 0.3),
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: randomRange(0.01, 0.03),
        alpha: randomRange(0.4, 1.0)
      });
    }
    flakesRef.current = flakes;
  };

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      initFlakes(dimensions.width, dimensions.height);
    }
  }, [count, minSize, maxSize, speed, wind]);

  useAnimationLoop(
    ({ deltaTime }) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = dimensions;
      if (width === 0 || height === 0) return;

      clearCanvas(ctx, width, height);

      const flakes = flakesRef.current;
      const baseRgba = parseColor(color, opacity);

      ctx.fillStyle = baseRgba;

      for (let i = 0; i < flakes.length; i++) {
        const flake = flakes[i];

        // Wobble oscillation
        flake.wobble += flake.wobbleSpeed;
        const wobbleOffset = Math.sin(flake.wobble) * 0.8;

        flake.y += flake.speedY * (deltaTime * 60);
        flake.x += (flake.speedX + wobbleOffset) * (deltaTime * 60);

        // Mouse interaction: push flakes away
        if (interaction && pointer.isActive) {
          const dx = flake.x - pointer.x;
          const dy = flake.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < interactionRadius && dist > 0) {
            const force = (1 - dist / interactionRadius) * 4;
            flake.x += (dx / dist) * force;
            flake.y += (dy / dist) * force;
          }
        }

        // Wrap around boundaries
        if (flake.y > height + flake.radius) {
          flake.y = -flake.radius;
          flake.x = Math.random() * width;
        } else if (flake.y < -flake.radius) {
          flake.y = height + flake.radius;
        }

        if (flake.x > width + flake.radius) {
          flake.x = -flake.radius;
        } else if (flake.x < -flake.radius) {
          flake.x = width + flake.radius;
        }

        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = parseColor(color, flake.alpha * opacity);
        ctx.fill();
      }
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
