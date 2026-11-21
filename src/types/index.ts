import React from "react";

export interface BaseEffectProps {
  /** Additional CSS class names */
  className?: string;
  /** Inline CSS styles */
  style?: React.CSSProperties;
  /** Whether the effect is active. Defaults to true. */
  enabled?: boolean;
  /** Z-index layer for the effect. Defaults to 0 or appropriate level. */
  zIndex?: number;
  /** Overall opacity multiplier between 0 and 1. Defaults to 1. */
  opacity?: number;
  /**
   * If true, honors the user's OS preference for reduced motion
   * by stopping or drastically reducing animations. Defaults to true.
   */
  respectReducedMotion?: boolean;
  /** HTML ID attribute */
  id?: string;
  /** Accessibility aria-hidden attribute. Defaults to true for decorative FX. */
  "aria-hidden"?: boolean | "true" | "false";
}

export interface Dimensions {
  width: number;
  height: number;
  dpr: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Vector2D {
  x: number;
  y: number;
}
