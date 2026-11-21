import { BaseEffectProps } from "../../types";
export interface RainProps extends BaseEffectProps {
    /** Number of raindrops rendered simultaneously. Default: 120 */
    intensity?: number;
    /** Length of raindrops in pixels, or a [min, max] range tuple. Default: [15, 25] */
    dropLength?: number | [number, number];
    /** Falling velocity of raindrops. Default: 18 */
    speed?: number;
    /** Color of raindrops. Default: '#9ec5e8' */
    color?: string;
    /** Angle of rain in degrees (0 = vertical straight down, positive = slanted right). Default: 12 */
    angle?: number;
    /** Whether to render splashing droplets upon hitting bottom. Default: true */
    splashes?: boolean;
    /** Color of splash droplets. Defaults to raindrop color if not set. */
    splashColor?: string;
    /** Number of splash droplets per raindrop impact. Default: 3 */
    splashCount?: number;
    /** Render fixed across full viewport or inside parent container. Default: true */
    fullScreen?: boolean;
    /** Optional container element ref */
    containerRef?: React.RefObject<HTMLElement | null>;
}
