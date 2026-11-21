import { BaseEffectProps } from "../../types";

export type ConfettiShape = "square" | "circle" | "rectangle" | "star";

export interface ConfettiProps extends BaseEffectProps {
  /**
   * Triggers the confetti explosion when true.
   * Can be toggled or set to true to trigger once. Default: true
   */
  trigger?: boolean;
  /** Total number of confetti particles generated per burst. Default: 150 */
  particleCount?: number;
  /** Animation duration in milliseconds before burst fades out. Default: 3500 */
  duration?: number;
  /** Color palette for particles. Default: celebratory vibrant palette */
  colors?: string[];
  /** Allowed particle shapes. Default: ['square', 'circle', 'rectangle'] */
  shapes?: ConfettiShape[];
  /** Downward gravity acceleration multiplier. Default: 0.6 */
  gravity?: number;
  /** Cone spread angle of the explosion in degrees. Default: 70 */
  spread?: number;
  /** Initial burst velocity. Default: 25 */
  velocity?: number;
  /**
   * Normalized launch origin coordinates { x: 0-1, y: 0-1 }.
   * Default: { x: 0.5, y: 0.7 } (lower center)
   */
  origin?: { x: number; y: number };
  /**
   * Whether to continuously recycle particles while trigger is true,
   * or produce a single burst that runs for duration. Default: false
   */
  recycle?: boolean;
  /** Callback fired when the confetti burst has completely finished and faded out. */
  onComplete?: () => void;
  /** Render fixed across full viewport or inside parent container. Default: true */
  fullScreen?: boolean;
  /** Optional container element ref */
  containerRef?: React.RefObject<HTMLElement | null>;
}
