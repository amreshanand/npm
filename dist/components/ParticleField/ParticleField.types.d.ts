import { BaseEffectProps } from "../../types";
export type ParticleInteractionMode = "repulse" | "attract" | "grab";
export interface ParticleFieldProps extends BaseEffectProps {
    /** Total number of particles. Default: 80 */
    density?: number;
    /** Particle radius in pixels, or a [min, max] range tuple. Default: [1.5, 3] */
    particleSize?: number | [number, number];
    /** Particle drift velocity multiplier. Default: 1 */
    speed?: number;
    /** Whether to draw network connection lines between nearby particles. Default: true */
    connectionLines?: boolean;
    /** Maximum distance in pixels for drawing lines between particles. Default: 120 */
    connectionDistance?: number;
    /** Color of network connection lines. Defaults to particleColor if not specified. */
    lineColor?: string;
    /** Width of network connection lines. Default: 1 */
    lineWidth?: number;
    /** Color of particles. Default: '#ffffff' */
    particleColor?: string;
    /** Enable mouse pointer interaction (repulsion, attraction, grab lines). Default: true */
    interactive?: boolean;
    /** Mouse interaction radius in pixels. Default: 120 */
    interactionRadius?: number;
    /** Interaction behavior mode. Default: 'repulse' */
    interactionMode?: ParticleInteractionMode;
    /** Render fixed across full viewport or inside parent container. Default: true */
    fullScreen?: boolean;
    /** Optional container element ref */
    containerRef?: React.RefObject<HTMLElement | null>;
}
