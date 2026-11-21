# AtmosFX

AtmosFX provides lightweight, customizable visual effect components for React 18 and 19.

## Components Included

- `Snowfall`: Particle snow with customizable wind drift and mouse interaction.
- `Rain`: Slanted rainfall with bottom droplet splashes.
- `Confetti`: Celebration bursts with 3D rotation, gravity, and multiple shapes.
- `Sparkles`: Twinkling stars, circles, or crosses with glow effects.
- `Aurora`: Multi-layered flowing celestial gradients.
- `CursorTrail`: Trailing pointer motion with fade and touch fallback.
- `ParticleField`: Connected interactive particle constellations.
- `MeteorShower`: Shooting stars with trails and glowing heads.

## Usage

```tsx
import { Snowfall, Rain, Confetti, Aurora, ParticleField } from "atmosfx";

export default function Example() {
  return (
    <div>
      <Snowfall count={80} speed={1.5} />
      <Aurora intensity={0.8} />
    </div>
  );
}
```

## Features

- High performance via HTML5 Canvas and `requestAnimationFrame`.
- Respects `prefers-reduced-motion` settings automatically.
- TypeScript definitions included out of the box.
- Zero runtime dependencies outside peer React.
