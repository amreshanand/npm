import React, { useRef, useEffect } from "react";
import { RainProps } from "./Rain.types";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useCanvasResize } from "../../hooks/useCanvasResize";
import { useAnimationLoop } from "../../hooks/useAnimationLoop";
import { clearCanvas } from "../../core/canvas/canvas";
import { randomRange, degToRad } from "../../core/utilities/math";
import { validateRange, validatePositive } from "../../core/utilities/validation";
import { parseColor } from "../../core/utilities/color";

interface Raindrop {
  x: number;
  y: number;
  length: number;
  speed: number;
  alpha: number;
}

interface SplashParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  life: number;
}

export const Rain: React.FC<RainProps> = ({
  intensity: propIntensity = 120,
  dropLength = [15, 25],
  speed: propSpeed = 18,
  color = "#9ec5e8",
  opacity = 0.7,
  angle: propAngle = 12,
  splashes = true,
  splashColor,
  splashCount = 3,
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
  const shouldAnimate = enabled && (!respectReducedMotion || !prefersReducedMotion);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dropsRef = useRef<Raindrop[]>([]);
  const splashesRef = useRef<SplashParticle[]>([]);

  const intensity = Math.round(validatePositive(propIntensity, 120, "intensity"));
  const speed = validateRange(propSpeed, 1, 50, 18, "speed");
  const angle = validateRange(propAngle, -60, 60, 12, "angle");
  const minLength = Array.isArray(dropLength) ? dropLength[0] : dropLength;
  const maxLength = Array.isArray(dropLength) ? dropLength[1] : dropLength;

  const rad = degToRad(angle);
  const sinAngle = Math.sin(rad);
  const cosAngle = Math.cos(rad);

  const dimensions = useCanvasResize(canvasRef, {
    containerRef,
    onResize: (dims) => {
      if (dims.width > 0 && dims.height > 0) {
        initDrops(dims.width, dims.height);
      }
    }
  });

  const initDrops = (w: number, h: number) => {
    const drops: Raindrop[] = [];
    for (let i = 0; i < intensity; i++) {
      drops.push({
        x: Math.random() * (w + 200) - 100,
        y: Math.random() * h,
        length: randomRange(minLength, maxLength),
        speed: randomRange(speed * 0.8, speed * 1.2),
        alpha: randomRange(0.4, 0.9)
      });
    }
    dropsRef.current = drops;
    splashesRef.current = [];
  };

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      initDrops(dimensions.width, dimensions.height);
    }
  }, [intensity, minLength, maxLength, speed, angle]);

  useAnimationLoop(
    ({ deltaTime }) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = dimensions;
      if (width === 0 || height === 0) return;

      clearCanvas(ctx, width, height);

      const drops = dropsRef.current;
      const splashParticles = splashesRef.current;
      const timeFactor = deltaTime * 60;

      // Draw and update drops
      ctx.lineWidth = 1.5;
      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        const moveDist = drop.speed * timeFactor;
        drop.x += sinAngle * moveDist;
        drop.y += cosAngle * moveDist;

        // Tail endpoint
        const endX = drop.x - sinAngle * drop.length;
        const endY = drop.y - cosAngle * drop.length;

        ctx.strokeStyle = parseColor(color, drop.alpha * opacity);
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Check if drop hit bottom
        if (drop.y >= height) {
          // Trigger splashes
          if (splashes && splashParticles.length < 200) {
            const actualSplashCount = Math.min(splashCount, 6);
            for (let s = 0; s < actualSplashCount; s++) {
              splashParticles.push({
                x: drop.x,
                y: height - 1,
                vx: randomRange(-2.5, 2.5),
                vy: randomRange(-1.5, -4),
                radius: randomRange(0.8, 1.8),
                alpha: drop.alpha,
                life: 1.0
              });
            }
          }

          // Respawn drop from top
          drop.y = -drop.length - Math.random() * 50;
          drop.x = Math.random() * (width + 200) - 100;
        }

        // Horizontal wrapping if blown off screen
        if (drop.x > width + 100) {
          drop.x = -100;
        } else if (drop.x < -100) {
          drop.x = width + 100;
        }
      }

      // Update and draw splashes
      if (splashes && splashParticles.length > 0) {
        const activeSplashes: SplashParticle[] = [];
        const splashColorVal = splashColor || color;

        for (let i = 0; i < splashParticles.length; i++) {
          const sp = splashParticles[i];
          sp.x += sp.vx * timeFactor;
          sp.y += sp.vy * timeFactor;
          sp.vy += 0.2 * timeFactor; // gravity
          sp.life -= 0.05 * timeFactor;

          if (sp.life > 0 && sp.y <= height + 2) {
            ctx.fillStyle = parseColor(splashColorVal, sp.alpha * sp.life * opacity);
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
            ctx.fill();
            activeSplashes.push(sp);
          }
        }
        splashesRef.current = activeSplashes;
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
