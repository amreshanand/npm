# @amresh8241/atmosfx

AtmosFX provides lightweight, customizable visual effect components for React 18 and 19.

## Installation

```bash
npm install @amresh8241/atmosfx
```

## Usage

```tsx
import { Snowfall, Rain, Confetti, Aurora, ParticleField } from "@amresh8241/atmosfx";

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
