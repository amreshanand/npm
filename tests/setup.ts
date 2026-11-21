import "@testing-library/jest-dom";

// Mock HTMLCanvasElement and CanvasRenderingContext2D for test environment
class MockCanvasRenderingContext2D {
  canvas: HTMLCanvasElement;
  fillStyle: string | CanvasGradient | CanvasPattern = "#000000";
  strokeStyle: string | CanvasGradient | CanvasPattern = "#000000";
  lineWidth = 1;
  globalAlpha = 1;
  globalCompositeOperation = "source-over";
  shadowBlur = 0;
  shadowColor = "transparent";

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  clearRect = vi.fn();
  fillRect = vi.fn();
  strokeRect = vi.fn();
  beginPath = vi.fn();
  closePath = vi.fn();
  moveTo = vi.fn();
  lineTo = vi.fn();
  arc = vi.fn();
  fill = vi.fn();
  stroke = vi.fn();
  save = vi.fn();
  restore = vi.fn();
  scale = vi.fn();
  rotate = vi.fn();
  translate = vi.fn();
  transform = vi.fn();
  setTransform = vi.fn();
  resetTransform = vi.fn();
  createLinearGradient = vi.fn(() => ({
    addColorStop: vi.fn()
  }));
  createRadialGradient = vi.fn(() => ({
    addColorStop: vi.fn()
  }));
  bezierCurveTo = vi.fn();
  quadraticCurveTo = vi.fn();
}

Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  value: function (contextId: string) {
    if (contextId === "2d") {
      if (!this.__mockContext) {
        this.__mockContext = new MockCanvasRenderingContext2D(this);
      }
      return this.__mockContext;
    }
    return null;
  },
  configurable: true
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
};

// Mock matchMedia for prefers-reduced-motion
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});
