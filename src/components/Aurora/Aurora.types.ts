import { BaseEffectProps } from "../../types";

export interface AuroraProps extends BaseEffectProps {
  /** Array of atmospheric color stops for the aurora curtains. Default: vibrant polar palette */
  colors?: string[];
  /** Wave movement speed multiplier. Default: 1 */
  speed?: number;
  /** Vertical amplitude/intensity of the aurora waves (0.1 to 2.0). Default: 1 */
  intensity?: number;
  /** Blur intensity in pixels applied to the aurora light curtains. Default: 40 */
  blur?: number;
  /** Number of overlapping glowing aurora wave ribbons (1 to 6). Default: 3 */
  ribbonCount?: number;
  /** Render fixed across full viewport or inside parent container. Default: true */
  fullScreen?: boolean;
  /** Optional container element ref */
  containerRef?: React.RefObject<HTMLElement | null>;
}
