import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePrefersReducedMotion } from "../src/hooks/usePrefersReducedMotion";
import { useAnimationLoop } from "../src/hooks/useAnimationLoop";
import { usePointerPosition } from "../src/hooks/usePointerPosition";

describe("usePrefersReducedMotion", () => {
  it("defaults to false when matchMedia reports false", () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });
});

describe("useAnimationLoop", () => {
  it("executes animation loop callback and cancels on unmount", () => {
    const callback = vi.fn();
    const rafSpy = vi.spyOn(window, "requestAnimationFrame");
    const cancelSpy = vi.spyOn(window, "cancelAnimationFrame");

    const { unmount } = renderHook(() =>
      useAnimationLoop(callback, { enabled: true })
    );

    expect(rafSpy).toHaveBeenCalled();

    unmount();
    expect(cancelSpy).toHaveBeenCalled();
  });

  it("does not run loop when enabled is false", () => {
    const callback = vi.fn();
    const rafSpy = vi.spyOn(window, "requestAnimationFrame");
    rafSpy.mockClear();

    renderHook(() => useAnimationLoop(callback, { enabled: false }));
    expect(callback).not.toHaveBeenCalled();
  });
});

describe("usePointerPosition", () => {
  it("tracks pointer move events", () => {
    const { result } = renderHook(() => usePointerPosition({ enabled: true }));
    expect(result.current.isActive).toBe(false);

    act(() => {
      window.dispatchEvent(
        new MouseEvent("mousemove", { clientX: 150, clientY: 250 })
      );
    });

    expect(result.current.x).toBe(150);
    expect(result.current.y).toBe(250);
    expect(result.current.isActive).toBe(true);

    act(() => {
      window.dispatchEvent(new MouseEvent("mouseleave"));
    });

    expect(result.current.isActive).toBe(false);
  });
});
