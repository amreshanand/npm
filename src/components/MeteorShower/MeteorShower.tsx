import React, { useRef } from "react";
import { MeteorShowerProps } from "./MeteorShower.types";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useCanvasResize } from "../../hooks/useCanvasResize";
import { useAnimationLoop } from "../../hooks/useAnimationLoop";
import { clearCanvas } from "../../core/canvas/canvas";
import { randomRange, degToRad } from "../../core/utilities/math";
import { parseColor } from "../../core/utilities/color";
import { validateRange, validatePositive } from "../../core/utilities/validation";

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  angleRad: number;
  alpha: number;
}

export const MeteorShower: React.FC<MeteorShowerProps> = ({
  frequency: propFrequency = 1.5,
  speed: propSpeed = 15,
  length = [80, 160],
  color = "#ffffff",
  trailColor,
  glow = true,
  glowRadius = 10,
  angle: propAngle = 215,
  randomizeAngle: propRandomizeAngle = 8,
  fullScreen = true,
  containerRef,
  className,
  style,
  enabled = true,
  zIndex = 1,
  opacity = 0.9,
  respectReducedMotion = true,
  id,
  "aria-hidden": ariaHidden = true
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = enabled && (!respectReducedMotion || !prefersReducedMotion);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const meteorsRef = useRef<Meteor[]>([]);
  const spawnTimerRef = useRef<number>(0);

  const frequency = validatePositive(propFrequency, 1.5, "frequency");
  const speed = validateRange(propSpeed, 2, 60, 15, "speed");
  const baseAngle = validateRange(propAngle, 0, 360, 215, "angle");
  const angleJitter = validateRange(propRandomizeAngle, 0, 45, 8, "randomizeAngle");

  const minLength = Array.isArray(length) ? length[0] : length;
  const maxLength = Array.isArray(length) ? length[1] : length;

  const dimensions = useCanvasResize(canvasRef, { containerRef });

  const spawnMeteor = (w: number, h: number): Meteor => {
    const jitteredAngle = baseAngle + randomRange(-angleJitter, angleJitter);
    const angleRad = degToRad(jitteredAngle);

    // Meteors traveling downwards and leftwards typically spawn from top or right side
    const spawnFromTop = Math.random() > 0.4;
    const startX = spawnFromTop ? Math.random() * (w * 1.3) : w + 20;
    const startY = spawnFromTop ? -20 : Math.random() * (h * 0.6);

    return {
      x: startX,
      y: startY,
      length: randomRange(minLength, maxLength),
      speed: randomRange(speed * 0.85, speed * 1.25),
      angleRad,
      alpha: randomRange(0.7, 1.0)
    };
  };

  useAnimationLoop(
    ({ deltaTime }) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { width, height } = dimensions;
      if (width === 0 || height === 0) return;

      clearCanvas(ctx, width, height);

      // Handle spawn frequency accumulator
      spawnTimerRef.current += deltaTime * frequency;
      while (spawnTimerRef.current >= 1) {
        meteorsRef.current.push(spawnMeteor(width, height));
        spawnTimerRef.current -= 1;
      }

      const meteors = meteorsRef.current;
      const timeFactor = deltaTime * 60;
      const activeMeteors: Meteor[] = [];

      for (let i = 0; i < meteors.length; i++) {
        const m = meteors[i];
        const moveDist = m.speed * timeFactor;

        m.x += Math.cos(m.angleRad) * moveDist;
        m.y += Math.sin(m.angleRad) * moveDist;

        // Tail origin behind head
        const tailX = m.x - Math.cos(m.angleRad) * m.length;
        const tailY = m.y - Math.sin(m.angleRad) * m.length;

        // Draw shooting star gradient trail
        ctx.save();
        const gradient = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        const resolvedTrail = trailColor || color;
        gradient.addColorStop(0, parseColor(resolvedTrail, 0));
        gradient.addColorStop(0.7, parseColor(resolvedTrail, m.alpha * opacity * 0.4));
        gradient.addColorStop(1, parseColor(color, m.alpha * opacity));

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.stroke();

        // Glowing head of meteor
        if (glow) {
          ctx.shadowBlur = glowRadius;
          ctx.shadowColor = parseColor(color, m.alpha * opacity);
        }
        ctx.fillStyle = parseColor(color, m.alpha * opacity);
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Check if meteor exited screen
        const isOffScreen =
          (m.x < -200 && tailX < -200) ||
          (m.y > height + 200 && tailY > height + 200) ||
          (m.x > width + 200 && tailX > width + 200);

        if (!isOffScreen) {
          activeMeteors.push(m);
        }
      }

      meteorsRef.current = activeMeteors;
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
