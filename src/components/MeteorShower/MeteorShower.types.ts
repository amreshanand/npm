import { BaseEffectProps } from "../../types";

export interface MeteorShowerProps extends BaseEffectProps {
  /** Average number of meteors spawned per second. Default: 1.5 */
  frequency?: number;
  /** Meteor travel speed. Default: 15 */
  speed?: number;
  /** Length of meteor tail in pixels, or a [min, max] range tuple. Default: [80, 160] */
  length?: number | [number, number];
  /** Head color of the shooting star. Default: '#ffffff' */
  color?: string;
  /** Tail fade color. Defaults to semi-transparent meteor color. */
  trailColor?: string;
  /** Whether to render glow around meteor heads. Default: true */
  glow?: boolean;
  /** Glow blur radius in pixels. Default: 10 */
  glowRadius?: number;
  /** Direction angle of meteors in degrees (215 = falling top-right to bottom-left). Default: 215 */
  angle?: number;
  /** Random angle jitter range in degrees (+/-). Default: 8 */
  randomizeAngle?: number;
  /** Render fixed across full viewport or inside parent container. Default: true */
  fullScreen?: boolean;
  /** Optional container element ref */
  containerRef?: React.RefObject<HTMLElement | null>;
}
