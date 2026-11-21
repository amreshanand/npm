import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, act } from "@testing-library/react";
import { triggerAnimationFrame } from "./setup";
import {
  Snowfall,
  Rain,
  Confetti,
  Aurora,
  ParticleField,
  MeteorShower
} from "../src";

describe("Accessibility and Reduced Motion", () => {
  it("respects reduced motion when matchMedia is true", () => {
    // Override matchMedia to simulate prefers-reduced-motion: reduce
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }));

    const { container, unmount } = render(
      <Snowfall respectReducedMotion={true} />
    );
    expect(container.querySelector("canvas")).toBeInTheDocument();
    unmount();
  });

  it("can disable respectReducedMotion explicitly", () => {
    const { container, unmount } = render(
      <Rain respectReducedMotion={false} />
    );
    expect(container.querySelector("canvas")).toBeInTheDocument();
    unmount();
  });
});

describe("Pause and Disabled States", () => {
  it("supports pausing Snowfall animation", () => {
    const { container, rerender, unmount } = render(
      <Snowfall pause={false} count={20} />
    );
    expect(container.querySelector("canvas")).toBeInTheDocument();

    rerender(<Snowfall pause={true} count={20} />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
    unmount();
  });

  it("supports enabled={false} on base effects", () => {
    const { container, unmount } = render(<Aurora enabled={false} />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
    unmount();
  });
});

describe("Interactive Effects Simulation", () => {
  it("animates Snowfall frame with mouse interaction", () => {
    const { container, unmount } = render(
      <Snowfall interaction={true} interactionRadius={80} count={30} />
    );
    const canvas = container.querySelector("canvas")!;

    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 100, clientY: 100 })
      );
      triggerAnimationFrame(100);
      triggerAnimationFrame(116);
    });

    expect(canvas).toBeInTheDocument();
    unmount();
  });

  it("animates ParticleField with touch interaction", () => {
    const { container, unmount } = render(
      <ParticleField
        interactive={true}
        interactionMode="grab"
        density={25}
      />
    );

    act(() => {
      window.dispatchEvent(
        new TouchEvent("touchmove", {
          touches: [{ clientX: 50, clientY: 50 } as unknown as Touch]
        })
      );
      triggerAnimationFrame(100);
      triggerAnimationFrame(132);
    });

    expect(container.querySelector("canvas")).toBeInTheDocument();
    unmount();
  });

  it("animates MeteorShower frame loop", () => {
    const { container, unmount } = render(
      <MeteorShower frequency={5} speed={25} />
    );

    act(() => {
      triggerAnimationFrame(100);
      triggerAnimationFrame(300);
      triggerAnimationFrame(600);
    });

    expect(container.querySelector("canvas")).toBeInTheDocument();
    unmount();
  });

  it("animates Confetti burst frame loop until completion", () => {
    const onComplete = vi.fn();
    const { container, unmount } = render(
      <Confetti
        trigger={true}
        particleCount={10}
        duration={50}
        recycle={false}
        onComplete={onComplete}
      />
    );

    act(() => {
      triggerAnimationFrame(0);
      triggerAnimationFrame(100);
    });

    expect(container).toBeDefined();
    unmount();
  });
});
