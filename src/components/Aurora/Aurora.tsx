import React, { useRef } from "react";
import { AuroraProps } from "./Aurora.types";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useCanvasResize } from "../../hooks/useCanvasResize";
import { useAnimationLoop } from "../../hooks/useAnimationLoop";
import { clearCanvas } from "../../core/canvas/canvas";
import { parseColor } from "../../core/utilities/color";
import { validateRange, validatePositive } from "../../core/utilities/validation";

const DEFAULT_AURORA_COLORS = [
  "#00FF87", // Northern emerald green
  "#60EFFF", // Arctic cyan
  "#0061FF", // Deep polar blue
  "#7B2CBF"  // Violet glow
];

export const Aurora: React.FC<AuroraProps> = ({
  colors = DEFAULT_AURORA_COLORS,
  speed: propSpeed = 1,
  intensity: propIntensity = 1,
  blur = 40,
  ribbonCount: propRibbonCount = 3,
  opacity = 0.75,
  fullScreen = true,
  containerRef,
  className,
  style,
  enabled = true,
  zIndex = 0,
  respectReducedMotion = true,
  id,
  "aria-hidden": ariaHidden = true
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = enabled && (!respectReducedMotion || !prefersReducedMotion);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timeOffsetRef = useRef<number>(0);

  const speed = validateRange(propSpeed, 0.1, 10, 1, "speed");
  const intensity = validateRange(propIntensity, 0.1, 2.5, 1, "intensity");
  const ribbonCount = Math.round(
    validateRange(propRibbonCount, 1, 6, 3, "ribbonCount")
  );
  const clampedBlur = Math.round(validatePositive(blur, 40, "blur"));

  const dimensions = useCanvasResize(canvasRef, { containerRef });

  useAnimationLoop(
    ({ deltaTime }) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = dimensions;
      if (width === 0 || height === 0) return;

      clearCanvas(ctx, width, height);

      timeOffsetRef.current += deltaTime * speed * 0.6;
      const t = timeOffsetRef.current;

      ctx.save();
      // Additive blending creates the vibrant celestial northern lights luminescence
      ctx.globalCompositeOperation = "lighter";

      const step = 20; // Sampling resolution along the x-axis for smooth curve performance
      const baseHeight = height * 0.35;
      const waveAmplitude = height * 0.22 * intensity;

      for (let r = 0; r < ribbonCount; r++) {
        const ribbonColor = colors[r % colors.length] || "#00FF87";
        const phase = (r * Math.PI) / ribbonCount;
        const ribbonSpeedMult = 0.8 + r * 0.25;

        // Create vertical gradient for the aurora curtain
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, parseColor(ribbonColor, 0));
        gradient.addColorStop(0.2, parseColor(ribbonColor, opacity * 0.8));
        gradient.addColorStop(0.5, parseColor(ribbonColor, opacity * 0.4));
        gradient.addColorStop(0.85, parseColor(ribbonColor, 0));

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, height);

        // Generate smooth undulating undulating curtain edge
        for (let x = 0; x <= width + step; x += step) {
          const normX = x / width;
          const y1 = Math.sin(normX * 3.5 + t * ribbonSpeedMult + phase);
          const y2 = Math.cos(normX * 6.2 - t * 0.7 * ribbonSpeedMult + phase * 1.5);
          const y3 = Math.sin(normX * 1.8 + t * 0.3);

          const waveY = baseHeight + (y1 * 0.6 + y2 * 0.3 + y3 * 0.1) * waveAmplitude;
          ctx.lineTo(x, waveY);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
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
    filter: clampedBlur > 0 ? `blur(${clampedBlur}px)` : undefined,
    transform: clampedBlur > 0 ? "scale(1.1)" : undefined, // Compensate for edge clipping during blur
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
