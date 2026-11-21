import React, { useRef, useEffect } from "react";
import { ParticleFieldProps } from "./ParticleField.types";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useCanvasResize } from "../../hooks/useCanvasResize";
import { useAnimationLoop } from "../../hooks/useAnimationLoop";
import { usePointerPosition } from "../../hooks/usePointerPosition";
import { clearCanvas } from "../../core/canvas/canvas";
import { randomRange } from "../../core/utilities/math";
import { parseColor } from "../../core/utilities/color";
import { validateRange, validatePositive } from "../../core/utilities/validation";

interface FieldParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  density: propDensity = 80,
  particleSize = [1.5, 3],
  speed: propSpeed = 1,
  connectionLines = true,
  connectionDistance: propConnectionDistance = 120,
  lineColor,
  lineWidth = 1,
  particleColor = "#ffffff",
  interactive = true,
  interactionRadius: propInteractionRadius = 120,
  interactionMode = "repulse",
  fullScreen = true,
  containerRef,
  className,
  style,
  enabled = true,
  zIndex = 1,
  opacity = 0.85,
  respectReducedMotion = true,
  id,
  "aria-hidden": ariaHidden = true
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = enabled && (!respectReducedMotion || !prefersReducedMotion);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<FieldParticle[]>([]);
  const pointer = usePointerPosition({ containerRef, enabled: interactive });

  const density = Math.round(validatePositive(propDensity, 80, "density"));
  const speed = validateRange(propSpeed, 0.1, 10, 1, "speed");
  const connectionDistance = validatePositive(
    propConnectionDistance,
    120,
    "connectionDistance"
  );
  const interactionRadius = validatePositive(
    propInteractionRadius,
    120,
    "interactionRadius"
  );

  const minSize = Array.isArray(particleSize) ? particleSize[0] : particleSize;
  const maxSize = Array.isArray(particleSize) ? particleSize[1] : particleSize;

  const dimensions = useCanvasResize(canvasRef, {
    containerRef,
    onResize: (dims) => {
      if (dims.width > 0 && dims.height > 0) {
        initParticles(dims.width, dims.height);
      }
    }
  });

  const initParticles = (w: number, h: number) => {
    const list: FieldParticle[] = [];
    for (let i = 0; i < density; i++) {
      list.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: randomRange(-0.8, 0.8) * speed,
        vy: randomRange(-0.8, 0.8) * speed,
        radius: randomRange(minSize, maxSize),
        alpha: randomRange(0.4, 0.9)
      });
    }
    particlesRef.current = list;
  };

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      initParticles(dimensions.width, dimensions.height);
    }
  }, [density, minSize, maxSize, speed]);

  useAnimationLoop(
    ({ deltaTime }) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = dimensions;
      if (width === 0 || height === 0) return;

      clearCanvas(ctx, width, height);

      const particles = particlesRef.current;
      const timeFactor = deltaTime * 60;
      const effectiveLineColor = lineColor || particleColor;

      // Update particle positions & interactions
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * timeFactor;
        p.y += p.vy * timeFactor;

        // Bounce off edges smoothly
        if (p.x <= 0 || p.x >= width) p.vx *= -1;
        if (p.y <= 0 || p.y >= height) p.vy *= -1;

        // Pointer interaction
        if (interactive && pointer.isActive) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < interactionRadius && dist > 0) {
            const force = (1 - dist / interactionRadius) * 2;
            if (interactionMode === "repulse") {
              p.x += (dx / dist) * force;
              p.y += (dy / dist) * force;
            } else if (interactionMode === "attract") {
              p.x -= (dx / dist) * force;
              p.y -= (dy / dist) * force;
            } else if (interactionMode === "grab") {
              // Draw line from pointer to particle
              const lineAlpha = (1 - dist / interactionRadius) * opacity;
              ctx.strokeStyle = parseColor(effectiveLineColor, lineAlpha);
              ctx.lineWidth = lineWidth;
              ctx.beginPath();
              ctx.moveTo(pointer.x, pointer.y);
              ctx.lineTo(p.x, p.y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw connection lines between nearby particles
      if (connectionLines) {
        ctx.lineWidth = lineWidth;
        const maxDistSq = connectionDistance * connectionDistance;

        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < maxDistSq) {
              const dist = Math.sqrt(distSq);
              const lineAlpha = (1 - dist / connectionDistance) * opacity * 0.45;
              ctx.strokeStyle = parseColor(effectiveLineColor, lineAlpha);
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw particle dots
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.fillStyle = parseColor(particleColor, p.alpha * opacity);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
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
