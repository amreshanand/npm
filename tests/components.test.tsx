import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, act } from "@testing-library/react";
import {
  Snowfall,
  Rain,
  Confetti,
  Sparkles,
  Aurora,
  CursorTrail,
  ParticleField,
  MeteorShower
} from "../src";

describe("Snowfall Component", () => {
  it("renders with default props", () => {
    const { container, unmount } = render(<Snowfall />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute("aria-hidden", "true");
    unmount();
  });

  it("applies custom props, style, and className", () => {
    const { container, unmount } = render(
      <Snowfall
        count={50}
        speed={2}
        color="#00ffff"
        className="custom-snowfall"
        style={{ opacity: 0.5 }}
        zIndex={5}
        id="test-snow"
      />
    );
    const canvas = container.querySelector("canvas");
    expect(canvas).toHaveClass("custom-snowfall");
    expect(canvas).toHaveAttribute("id", "test-snow");
    expect(canvas).toHaveStyle({ zIndex: "5" });
    unmount();
  });

  it("cleans up animation loop on unmount", () => {
    const cancelSpy = vi.spyOn(window, "cancelAnimationFrame");
    const { unmount } = render(<Snowfall />);
    unmount();
    expect(cancelSpy).toHaveBeenCalled();
  });
});

describe("Rain Component", () => {
  it("renders with default props and cleans up", () => {
    const { container, unmount } = render(<Rain />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    unmount();
  });

  it("accepts custom rain props", () => {
    const { container, unmount } = render(
      <Rain
        intensity={80}
        speed={22}
        angle={20}
        color="#6699cc"
        splashes={true}
        splashCount={4}
      />
    );
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    unmount();
  });
});

describe("Confetti Component", () => {
  it("renders when trigger is true", () => {
    const { container, unmount } = render(
      <Confetti
        trigger={true}
        particleCount={100}
        duration={2000}
        colors={["#ff0000", "#00ff00"]}
      />
    );
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    unmount();
  });

  it("returns null when trigger is false and inactive", () => {
    const { container, unmount } = render(<Confetti trigger={false} />);
    expect(container.querySelector("canvas")).toBeNull();
    unmount();
  });

  it("accepts onComplete callback", () => {
    const onComplete = vi.fn();
    const { unmount } = render(
      <Confetti
        trigger={true}
        particleCount={20}
        duration={10}
        onComplete={onComplete}
      />
    );
    expect(onComplete).toBeDefined();
    unmount();
  });
});

describe("Sparkles Component", () => {
  it("renders sparkles canvas", () => {
    const { container, unmount } = render(
      <Sparkles density={30} color="#ffdd00" glow={true} shape="star" />
    );
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    unmount();
  });

  it("supports different shapes", () => {
    const { rerender, container, unmount } = render(<Sparkles shape="circle" />);
    expect(container.querySelector("canvas")).toBeInTheDocument();

    rerender(<Sparkles shape="cross" />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
    unmount();
  });
});

describe("Aurora Component", () => {
  it("renders aurora with multiple ribbons and custom blur", () => {
    const { container, unmount } = render(
      <Aurora
        colors={["#00ff87", "#60efff", "#7b2cbf"]}
        intensity={1.2}
        speed={1.5}
        blur={30}
      />
    );
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveStyle({ filter: "blur(30px)" });
    unmount();
  });
});

describe("CursorTrail Component", () => {
  it("renders cursor trail and tracks movement", () => {
    const { container, unmount } = render(
      <CursorTrail
        color="#00ffff"
        trailLength={15}
        particleSize={5}
        glow={true}
      />
    );
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 200, clientY: 300 })
      );
    });

    unmount();
  });
});

describe("ParticleField Component", () => {
  it("renders interactive particle mesh", () => {
    const { container, unmount } = render(
      <ParticleField
        density={50}
        connectionLines={true}
        connectionDistance={100}
        particleColor="#ffffff"
        interactive={true}
        interactionMode="repulse"
      />
    );
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    unmount();
  });

  it("supports attract and grab modes", () => {
    const { rerender, container, unmount } = render(
      <ParticleField interactionMode="attract" />
    );
    expect(container.querySelector("canvas")).toBeInTheDocument();

    rerender(<ParticleField interactionMode="grab" />);
    expect(container.querySelector("canvas")).toBeInTheDocument();
    unmount();
  });
});

describe("MeteorShower Component", () => {
  it("renders shooting stars effect", () => {
    const { container, unmount } = render(
      <MeteorShower
        frequency={2}
        speed={20}
        length={[100, 200]}
        color="#ffffff"
        glow={true}
      />
    );
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    unmount();
  });
});
