import React, { useRef, useEffect } from "react";
import { SparklesProps, SparkleShape } from "./Sparkles.types";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useCanvasResize } from "../../hooks/useCanvasResize";
import { useAnimationLoop } from "../../hooks/useAnimationLoop";
import { clearCanvas, drawStar } from "../../core/canvas/canvas";
import { randomRange } from "../../core/utilities/math";
import { parseColor, samplePalette } from "../../core/utilities/color";
import { validateRange, validatePositive } from "../../core/utilities/validation";

interface SparkleParticle {
  x: number;
  y: number;
  maxRadius: number;
  color: string;
  shape: SparkleShape;
  rotation: number;
  rotationSpeed: number;
  progress: number; // 0 to 1
  lifeSpeed: number;
}

export const Sparkles: React.FC<SparklesProps> = ({
  density: propDensity = 40,
  minSize: propMinSize = 4,
  maxSize: propMaxSize = 12,
  color = "#ffd700",
  glow = true,
  glowRadius = 8,
  glowColor,
  speed: propSpeed = 1,
  shape = "star",
  fullScreen = true,
  containerRef,
  className,
  style,
  enabled = true,
  zIndex = 2,
  opacity = 0.9,
  respectReducedMotion = true,
  id,
  "aria-hidden": ariaHidden = true
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = enabled && (!respectReducedMotion || !prefersReducedMotion);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparklesRef = useRef<SparkleParticle[]>([]);

  const density = Math.round(validatePositive(propDensity, 40, "density"));
  const minSize = validatePositive(propMinSize, 4, "minSize");
  const maxSize = validateRange(propMaxSize, minSize, 100, 12, "maxSize");
  const speed = validateRange(propSpeed, 0.1, 10, 1, "speed");

  const colors = Array.isArray(color) ? color : [color];

  const dimensions = useCanvasResize(canvasRef, {
    containerRef,
    onResize: (dims) => {
      if (dims.width > 0 && dims.height > 0) {
        initSparkles(dims.width, dims.height);
      }
    }
  });

  const createSparkle = (w: number, h: number): SparkleParticle => {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      maxRadius: randomRange(minSize, maxSize),
      color: samplePalette(colors),
      shape,
      rotation: Math.random() * Math.PI,
      rotationSpeed: randomRange(-0.04, 0.04),
      progress: Math.random(), // Stagger initial phases
      lifeSpeed: randomRange(0.015, 0.035) * speed
    };
  };

  const initSparkles = (w: number, h: number) => {
    const list: SparkleParticle[] = [];
    for (let i = 0; i < density; i++) {
      list.push(createSparkle(w, h));
    }
    sparklesRef.current = list;
  };

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      initSparkles(dimensions.width, dimensions.height);
    }
  }, [density, minSize, maxSize, speed, shape, color]);

  useAnimationLoop(
    ({ deltaTime }) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = dimensions;
      if (width === 0 || height === 0) return;

      clearCanvas(ctx, width, height);

      const sparkles = sparklesRef.current;
      const timeFactor = deltaTime * 60;

      for (let i = 0; i < sparkles.length; i++) {
        const s = sparkles[i];
        s.progress += s.lifeSpeed * timeFactor;
        s.rotation += s.rotationSpeed * timeFactor;

        // Life cycle: sinusoidal scale & alpha peaking at progress = 0.5
        if (s.progress >= 1) {
          // Respawn at a new position
          Object.assign(s, createSparkle(width, height));
          s.progress = 0;
        }

        const scale = Math.sin(s.progress * Math.PI);
        const currentRadius = s.maxRadius * scale;
        const currentAlpha = scale * opacity;

        if (currentRadius <= 0.1 || currentAlpha <= 0.01) continue;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);

        if (glow) {
          ctx.shadowBlur = glowRadius;
          ctx.shadowColor = parseColor(
            glowColor || s.color,
            currentAlpha * 0.8
          );
        }

        ctx.fillStyle = parseColor(s.color, currentAlpha);
        ctx.strokeStyle = parseColor(s.color, currentAlpha);

        if (s.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
          ctx.fill();
        } else if (s.shape === "cross") {
          ctx.lineWidth = Math.max(1, currentRadius * 0.35);
          ctx.beginPath();
          ctx.moveTo(-currentRadius, 0);
          ctx.lineTo(currentRadius, 0);
          ctx.moveTo(0, -currentRadius);
          ctx.lineTo(0, currentRadius);
          ctx.stroke();
        } else {
          // 4-pointed sparkle star
          drawStar(ctx, 0, 0, 4, currentRadius, currentRadius * 0.25);
          ctx.fill();
        }

        ctx.restore();
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
