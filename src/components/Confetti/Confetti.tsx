import React, { useRef, useEffect, useState } from "react";
import { ConfettiProps, ConfettiShape } from "./Confetti.types";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useCanvasResize } from "../../hooks/useCanvasResize";
import { useAnimationLoop } from "../../hooks/useAnimationLoop";
import { clearCanvas, drawStar } from "../../core/canvas/canvas";
import { randomRange, degToRad } from "../../core/utilities/math";
import { samplePalette, parseColor } from "../../core/utilities/color";
import { validateRange, validatePositive } from "../../core/utilities/validation";

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: ConfettiShape;
  rotation: number;
  rotationSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  alpha: number;
  drag: number;
}

const DEFAULT_COLORS = [
  "#FF595E",
  "#FFCA3A",
  "#8AC926",
  "#1982C4",
  "#6A4C93",
  "#FF924C"
];

export const Confetti: React.FC<ConfettiProps> = ({
  trigger = true,
  particleCount: propParticleCount = 150,
  duration = 3500,
  colors = DEFAULT_COLORS,
  shapes = ["square", "circle", "rectangle"],
  gravity: propGravity = 0.6,
  spread: propSpread = 70,
  velocity: propVelocity = 25,
  origin = { x: 0.5, y: 0.7 },
  recycle = false,
  onComplete,
  fullScreen = true,
  containerRef,
  className,
  style,
  enabled = true,
  zIndex = 10,
  opacity = 1,
  respectReducedMotion = true,
  id,
  "aria-hidden": ariaHidden = true
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isActive, setIsActive] = useState<boolean>(trigger);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<ConfettiParticle[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const particleCount = Math.round(
    validatePositive(propParticleCount, 150, "particleCount")
  );
  const gravity = validateRange(propGravity, 0.1, 5, 0.6, "gravity");
  const spread = validateRange(propSpread, 10, 360, 70, "spread");
  const velocity = validateRange(propVelocity, 5, 100, 25, "velocity");

  const dimensions = useCanvasResize(canvasRef, { containerRef });

  const createParticle = (originX: number, originY: number): ConfettiParticle => {
    // Launch angle centered upwards (-90 degrees) with spread cone
    const baseAngle = -Math.PI / 2;
    const spreadRad = degToRad(spread);
    const angle = baseAngle + randomRange(-spreadRad / 2, spreadRad / 2);
    const speed = randomRange(velocity * 0.5, velocity * 1.3);

    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: randomRange(6, 12),
      color: samplePalette(colors),
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: randomRange(-0.15, 0.15),
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: randomRange(0.08, 0.18),
      alpha: 1.0,
      drag: randomRange(0.96, 0.99)
    };
  };

  const spawnBurst = () => {
    const { width, height } = dimensions;
    if (width === 0 || height === 0) return;

    const originX = width * origin.x;
    const originY = height * origin.y;

    const newParticles: ConfettiParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      newParticles.push(createParticle(originX, originY));
    }
    particlesRef.current = newParticles;
    startTimeRef.current = performance.now();
    setIsActive(true);
  };

  useEffect(() => {
    if (trigger && dimensions.width > 0 && dimensions.height > 0) {
      spawnBurst();
    } else if (!trigger) {
      particlesRef.current = [];
      setIsActive(false);
    }
  }, [trigger, dimensions.width, dimensions.height]);

  const shouldAnimate =
    enabled && isActive && (!respectReducedMotion || !prefersReducedMotion);

  useAnimationLoop(
    ({ timestamp, deltaTime }) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = dimensions;
      if (width === 0 || height === 0) return;

      clearCanvas(ctx, width, height);

      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const isTimeExpired = !recycle && elapsed > duration;

      const particles = particlesRef.current;
      const timeFactor = deltaTime * 60;
      const remainingParticles: ConfettiParticle[] = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Apply drag and gravity
        p.vx *= Math.pow(p.drag, timeFactor);
        p.vy = p.vy * Math.pow(p.drag, timeFactor) + gravity * timeFactor;

        p.x += p.vx * timeFactor;
        p.y += p.vy * timeFactor;

        p.rotation += p.rotationSpeed * timeFactor;
        p.wobble += p.wobbleSpeed * timeFactor;

        // Fade out as duration approaches
        if (!recycle && elapsed > duration * 0.7) {
          const fadeProgress = (elapsed - duration * 0.7) / (duration * 0.3);
          p.alpha = Math.max(0, 1 - fadeProgress);
        }

        // Draw particle with 3D tilt
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        // Wobble simulates 3D tumbling flip
        ctx.scale(Math.cos(p.wobble), 1);

        ctx.fillStyle = parseColor(p.color, p.alpha * opacity);
        ctx.strokeStyle = parseColor(p.color, p.alpha * opacity);

        const half = p.size / 2;
        switch (p.shape) {
          case "circle":
            ctx.beginPath();
            ctx.arc(0, 0, half, 0, Math.PI * 2);
            ctx.fill();
            break;
          case "rectangle":
            ctx.fillRect(-half, -half * 0.5, p.size, p.size * 0.5);
            break;
          case "star":
            drawStar(ctx, 0, 0, 5, p.size, half * 0.5);
            ctx.fill();
            break;
          case "square":
          default:
            ctx.fillRect(-half, -half, p.size, p.size);
            break;
        }

        ctx.restore();

        // Keep active if on screen and alive
        const isOffBottom = p.y > height + 50;
        if (!isOffBottom && p.alpha > 0.01) {
          remainingParticles.push(p);
        } else if (recycle && trigger) {
          // Recycle back to origin
          const originX = width * origin.x;
          const originY = height * origin.y;
          remainingParticles.push(createParticle(originX, originY));
        }
      }

      particlesRef.current = remainingParticles;

      // Completion check
      if (
        !recycle &&
        (isTimeExpired || remainingParticles.length === 0) &&
        particles.length > 0
      ) {
        setIsActive(false);
        particlesRef.current = [];
        clearCanvas(ctx, width, height);
        onCompleteRef.current?.();
      }
    },
    { enabled: shouldAnimate }
  );

  if (!trigger && !isActive) {
    return null;
  }

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
