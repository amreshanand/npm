import { BaseEffectProps } from "../../types";

export interface CursorTrailProps extends BaseEffectProps {
  /** Trail color or color palette array for multi-colored trail. Default: '#60efff' */
  color?: string | string[];
  /** Maximum number of trail segments/points retained. Default: 25 */
  trailLength?: number;
  /** Radius of particles at the cursor tip in pixels. Default: 6 */
  particleSize?: number;
  /** Whether to render glowing blur around trail particles. Default: true */
  glow?: boolean;
  /** Glow blur radius in pixels. Default: 12 */
  glowRadius?: number;
  /** Custom glow color. Defaults to particle color. */
  glowColor?: string;
  /** Rate of trail point decay per second. Default: 1.5 */
  fadeDuration?: number;
  /** Minimum pixel movement distance before recording a new trail node. Default: 4 */
  sensitivity?: number;
  /** If true, disables the cursor trail on touch-only devices. Default: false */
  disabledOnTouch?: boolean;
  /** Render fixed across full viewport or inside parent container. Default: true */
  fullScreen?: boolean;
  /** Optional container element ref */
  containerRef?: React.RefObject<HTMLElement | null>;
}
