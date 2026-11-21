import { BaseEffectProps } from "../../types";
export type SparkleShape = "star" | "circle" | "cross";
export interface SparklesProps extends BaseEffectProps {
    /** Maximum number of sparkles active at once. Default: 40 */
    density?: number;
    /** Minimum sparkle size in pixels. Default: 4 */
    minSize?: number;
    /** Maximum sparkle size in pixels. Default: 12 */
    maxSize?: number;
    /** Sparkle color or array of colors for random variation. Default: '#ffd700' */
    color?: string | string[];
    /** Whether to render atmospheric glow around sparkles. Default: true */
    glow?: boolean;
    /** Glow blur radius in pixels. Default: 8 */
    glowRadius?: number;
    /** Custom glow color. Defaults to sparkle color. */
    glowColor?: string;
    /** Twinkle speed multiplier. Default: 1 */
    speed?: number;
    /** Sparkle geometric shape. Default: 'star' */
    shape?: SparkleShape;
    /** Render fixed across full viewport or inside parent container. Default: true */
    fullScreen?: boolean;
    /** Optional container element ref */
    containerRef?: React.RefObject<HTMLElement | null>;
}
