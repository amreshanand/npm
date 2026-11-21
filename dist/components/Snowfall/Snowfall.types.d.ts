import { BaseEffectProps } from "../../types";
export interface SnowfallProps extends BaseEffectProps {
    /** Total number of snowflakes. Default: 100 */
    count?: number;
    /** Falling speed multiplier. Default: 1.5 */
    speed?: number;
    /** Size of snowflakes in pixels, or a [min, max] range tuple. Default: [2, 5] */
    size?: number | [number, number];
    /** Color of the snow. Default: '#ffffff' */
    color?: string;
    /** Horizontal wind drift velocity. Positive = right, negative = left. Default: 0.5 */
    wind?: number;
    /** Enable mouse repulsion interaction. Default: false */
    interaction?: boolean;
    /** Radius of mouse interaction circle in pixels. Default: 100 */
    interactionRadius?: number;
    /** Pause the snow animation without unmounting. Default: false */
    pause?: boolean;
    /** Render fixed across full viewport or inside parent container. Default: true */
    fullScreen?: boolean;
    /** Optional container element ref */
    containerRef?: React.RefObject<HTMLElement | null>;
}
