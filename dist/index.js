import { useState as lt, useEffect as et, useRef as z } from "react";
import { jsx as st } from "react/jsx-runtime";
const pt = "(prefers-reduced-motion: reduce)";
function ot() {
  const [e, n] = lt(() => typeof window > "u" || !window.matchMedia ? !1 : window.matchMedia(pt).matches);
  return et(() => {
    if (typeof window > "u" || !window.matchMedia)
      return;
    const t = window.matchMedia(pt), l = (u) => {
      n(u.matches);
    };
    return t.addEventListener ? t.addEventListener("change", l) : t.addListener(l), () => {
      t.removeEventListener ? t.removeEventListener("change", l) : t.removeListener(l);
    };
  }, []), e;
}
function yt(e, n, t, l = window.devicePixelRatio || 1) {
  const u = Math.max(1, Math.min(l, 3));
  e.width = Math.floor(n * u), e.height = Math.floor(t * u), e.style.width = `${n}px`, e.style.height = `${t}px`;
  const p = e.getContext("2d");
  return p && (p.setTransform(1, 0, 0, 1, 0, 0), p.scale(u, u)), { width: n, height: t, dpr: u };
}
function nt(e, n, t) {
  e.clearRect(0, 0, n, t);
}
function gt(e, n, t, l, u, p) {
  let y = Math.PI / 2 * 3;
  const x = Math.PI / l;
  e.beginPath(), e.moveTo(n, t - u);
  for (let w = 0; w < l; w++) {
    let m = n + Math.cos(y) * u, M = t + Math.sin(y) * u;
    e.lineTo(m, M), y += x, m = n + Math.cos(y) * p, M = t + Math.sin(y) * p, e.lineTo(m, M), y += x;
  }
  e.lineTo(n, t - u), e.closePath();
}
function it(e, n = {}) {
  const { containerRef: t, onResize: l } = n, u = z(l);
  u.current = l;
  const [p, y] = lt({
    width: 0,
    height: 0,
    dpr: 1
  });
  return et(() => {
    const x = e.current;
    if (!x) return;
    const w = () => {
      var U;
      let C = 0, I = 0;
      if (t != null && t.current) {
        const D = t.current.getBoundingClientRect();
        C = Math.max(1, Math.floor(D.width)), I = Math.max(1, Math.floor(D.height));
      } else if (x.parentElement) {
        const D = x.parentElement.getBoundingClientRect();
        C = Math.max(1, Math.floor(D.width || window.innerWidth)), I = Math.max(1, Math.floor(D.height || window.innerHeight));
      } else
        C = window.innerWidth || 800, I = window.innerHeight || 600;
      const G = typeof window < "u" && window.devicePixelRatio || 1, H = yt(x, C, I, G);
      y((D) => D.width === H.width && D.height === H.height && D.dpr === H.dpr ? D : H), (U = u.current) == null || U.call(u, H);
    };
    w();
    let m = null;
    const M = (t == null ? void 0 : t.current) || x.parentElement;
    return typeof ResizeObserver < "u" && M && (m = new ResizeObserver(() => {
      w();
    }), m.observe(M)), window.addEventListener("resize", w, { passive: !0 }), () => {
      window.removeEventListener("resize", w), m && m.disconnect();
    };
  }, [e, t]), p;
}
function at(e, n = {}) {
  const { enabled: t = !0, pauseWhenHidden: l = !0 } = n, u = z(e);
  u.current = e;
  const p = z(null), y = z(null), x = z(!1);
  et(() => {
    if (!t) {
      p.current !== null && (cancelAnimationFrame(p.current), p.current = null), y.current = null;
      return;
    }
    const w = () => {
      l && (x.current = document.hidden, document.hidden || (y.current = null));
    };
    typeof document < "u" && document.addEventListener("visibilitychange", w);
    const m = (M) => {
      if (!x.current) {
        y.current === null && (y.current = M);
        const C = (M - y.current) / 1e3, I = Math.min(C, 0.1);
        y.current = M, u.current({ timestamp: M, deltaTime: I });
      }
      p.current = requestAnimationFrame(m);
    };
    return p.current = requestAnimationFrame(m), () => {
      p.current !== null && (cancelAnimationFrame(p.current), p.current = null), y.current = null, typeof document < "u" && document.removeEventListener("visibilitychange", w);
    };
  }, [t, l]);
}
function vt(e = {}) {
  const { containerRef: n, enabled: t = !0 } = e, [l, u] = lt({
    x: -9999,
    y: -9999,
    isActive: !1,
    isTouch: !1
  });
  return et(() => {
    if (!t) return;
    const p = (w) => {
      let m = 0, M = 0, C = !1;
      if ("touches" in w) {
        if (w.touches.length === 0) return;
        m = w.touches[0].clientX, M = w.touches[0].clientY, C = !0;
      } else
        m = w.clientX, M = w.clientY;
      if (n != null && n.current) {
        const I = n.current.getBoundingClientRect();
        u({
          x: m - I.left,
          y: M - I.top,
          isActive: !0,
          isTouch: C
        });
      } else
        u({
          x: m,
          y: M,
          isActive: !0,
          isTouch: C
        });
    }, y = () => {
      u((w) => ({
        ...w,
        isActive: !1
      }));
    }, x = (n == null ? void 0 : n.current) || window;
    return x.addEventListener("mousemove", p, {
      passive: !0
    }), x.addEventListener("touchstart", p, {
      passive: !0
    }), x.addEventListener("touchmove", p, {
      passive: !0
    }), x.addEventListener("mouseleave", y, {
      passive: !0
    }), x.addEventListener("touchend", y, {
      passive: !0
    }), () => {
      x.removeEventListener("mousemove", p), x.removeEventListener("touchstart", p), x.removeEventListener("touchmove", p), x.removeEventListener("mouseleave", y), x.removeEventListener("touchend", y);
    };
  }, [n, t]), l;
}
function Mt(e, n, t) {
  return Math.min(Math.max(e, n), t);
}
function St(e, n, t) {
  return e + (n - e) * Mt(t, 0, 1);
}
function k(e, n) {
  return Math.random() * (n - e) + e;
}
function Ct(e, n) {
  const t = Math.ceil(e), l = Math.floor(n);
  return Math.floor(Math.random() * (l - t + 1)) + t;
}
function dt(e) {
  return e * Math.PI / 180;
}
function Et(e) {
  return e * 180 / Math.PI;
}
function wt(e, n, t, l) {
  const u = t - e, p = l - n;
  return Math.sqrt(u * u + p * p);
}
function Q(e, n, t, l, u) {
  return e === void 0 || typeof e != "number" || isNaN(e) ? l : e < n || e > t ? (process.env.NODE_ENV === "development" && u && console.warn(
    `[AtmosFX] Prop '${u}' with value ${e} is out of bounds [${n}, ${t}]. Clamping to range.`
  ), Math.min(Math.max(e, n), t)) : e;
}
function tt(e, n, t) {
  return e === void 0 || typeof e != "number" || isNaN(e) || e <= 0 ? (process.env.NODE_ENV === "development" && t && e !== void 0 && console.warn(
    `[AtmosFX] Prop '${t}' must be a positive number. Using fallback ${n}.`
  ), n) : e;
}
function xt(e, n = 1) {
  let t = e.trim().replace(/^#/, "");
  if (t.length === 3 ? t = t.split("").map((l) => l + l).join("") : t.length === 4 && (t = t.split("").map((l) => l + l).join("")), t.length === 6 || t.length === 8) {
    const l = parseInt(t.substring(0, 2), 16), u = parseInt(t.substring(2, 4), 16), p = parseInt(t.substring(4, 6), 16), y = t.length === 8 ? parseInt(t.substring(6, 8), 16) / 255 * n : n;
    return `rgba(${l}, ${u}, ${p}, ${Math.max(0, Math.min(1, y))})`;
  }
  return e;
}
function j(e, n = 1) {
  if (!e) return `rgba(255, 255, 255, ${n})`;
  const t = e.trim();
  return t.startsWith("#") ? xt(t, n) : t.startsWith("rgb(") && !t.startsWith("rgba(") ? t.replace("rgb(", "rgba(").replace(")", `, ${n})`) : t.startsWith("rgba(") ? n !== 1 ? t.replace(/,\s*[\d.]+\)$/, `, ${n})`) : t : t.startsWith("hsl(") && !t.startsWith("hsla(") ? t.replace("hsl(", "hsla(").replace(")", `, ${n})`) : t;
}
function ut(e) {
  if (!e || e.length === 0)
    return "#ffffff";
  const n = Math.floor(Math.random() * e.length);
  return e[n];
}
const Lt = ({
  count: e = 100,
  speed: n = 1.5,
  size: t = [2, 5],
  color: l = "#ffffff",
  opacity: u = 0.8,
  wind: p = 0.5,
  interaction: y = !1,
  interactionRadius: x = 100,
  pause: w = !1,
  fullScreen: m = !0,
  containerRef: M,
  className: C,
  style: I,
  enabled: G = !0,
  zIndex: H = 1,
  respectReducedMotion: U = !0,
  id: D,
  "aria-hidden": V = !0
}) => {
  const J = ot(), K = G && !w && (!U || !J), _ = z(null), $ = z([]), E = vt({ containerRef: M, enabled: y }), X = Math.round(tt(e, 100, "count")), O = Q(n, 0.1, 20, 1.5, "speed"), L = Array.isArray(t) ? t[0] : t, W = Array.isArray(t) ? t[1] : t, b = it(_, {
    containerRef: M,
    onResize: (F) => {
      F.width > 0 && F.height > 0 && T(F.width, F.height);
    }
  }), T = (F, B) => {
    const g = [];
    for (let A = 0; A < X; A++)
      g.push({
        x: Math.random() * F,
        y: Math.random() * B,
        radius: k(L, W),
        speedY: k(O * 0.6, O * 1.4),
        speedX: p + k(-0.3, 0.3),
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: k(0.01, 0.03),
        alpha: k(0.4, 1)
      });
    $.current = g;
  };
  et(() => {
    b.width > 0 && b.height > 0 && T(b.width, b.height);
  }, [X, L, W, O, p]), at(
    ({ deltaTime: F }) => {
      const B = _.current;
      if (!B) return;
      const g = B.getContext("2d");
      if (!g) return;
      const { width: A, height: o } = b;
      if (A === 0 || o === 0) return;
      nt(g, A, o);
      const c = $.current, h = j(l, u);
      g.fillStyle = h;
      for (let a = 0; a < c.length; a++) {
        const r = c[a];
        r.wobble += r.wobbleSpeed;
        const P = Math.sin(r.wobble) * 0.8;
        if (r.y += r.speedY * (F * 60), r.x += (r.speedX + P) * (F * 60), y && E.isActive) {
          const s = r.x - E.x, v = r.y - E.y, i = Math.sqrt(s * s + v * v);
          if (i < x && i > 0) {
            const d = (1 - i / x) * 4;
            r.x += s / i * d, r.y += v / i * d;
          }
        }
        r.y > o + r.radius ? (r.y = -r.radius, r.x = Math.random() * A) : r.y < -r.radius && (r.y = o + r.radius), r.x > A + r.radius ? r.x = -r.radius : r.x < -r.radius && (r.x = A + r.radius), g.beginPath(), g.arc(r.x, r.y, r.radius, 0, Math.PI * 2), g.fillStyle = j(l, r.alpha * u), g.fill();
      }
    },
    { enabled: K }
  );
  const q = {
    position: m ? "fixed" : "absolute",
    top: 0,
    left: 0,
    width: m ? "100vw" : "100%",
    height: m ? "100vh" : "100%",
    pointerEvents: "none",
    zIndex: H,
    ...I
  };
  return /* @__PURE__ */ st(
    "canvas",
    {
      ref: _,
      id: D,
      "aria-hidden": V,
      className: C,
      style: q
    }
  );
}, Tt = ({
  intensity: e = 120,
  dropLength: n = [15, 25],
  speed: t = 18,
  color: l = "#9ec5e8",
  opacity: u = 0.7,
  angle: p = 12,
  splashes: y = !0,
  splashColor: x,
  splashCount: w = 3,
  fullScreen: m = !0,
  containerRef: M,
  className: C,
  style: I,
  enabled: G = !0,
  zIndex: H = 1,
  respectReducedMotion: U = !0,
  id: D,
  "aria-hidden": V = !0
}) => {
  const J = ot(), K = G && (!U || !J), _ = z(null), $ = z([]), E = z([]), X = Math.round(tt(e, 120, "intensity")), O = Q(t, 1, 50, 18, "speed"), L = Q(p, -60, 60, 12, "angle"), W = Array.isArray(n) ? n[0] : n, b = Array.isArray(n) ? n[1] : n, T = dt(L), q = Math.sin(T), F = Math.cos(T), B = it(_, {
    containerRef: M,
    onResize: (o) => {
      o.width > 0 && o.height > 0 && g(o.width, o.height);
    }
  }), g = (o, c) => {
    const h = [];
    for (let a = 0; a < X; a++)
      h.push({
        x: Math.random() * (o + 200) - 100,
        y: Math.random() * c,
        length: k(W, b),
        speed: k(O * 0.8, O * 1.2),
        alpha: k(0.4, 0.9)
      });
    $.current = h, E.current = [];
  };
  et(() => {
    B.width > 0 && B.height > 0 && g(B.width, B.height);
  }, [X, W, b, O, L]), at(
    ({ deltaTime: o }) => {
      const c = _.current;
      if (!c) return;
      const h = c.getContext("2d");
      if (!h) return;
      const { width: a, height: r } = B;
      if (a === 0 || r === 0) return;
      nt(h, a, r);
      const P = $.current, s = E.current, v = o * 60;
      h.lineWidth = 1.5;
      for (let i = 0; i < P.length; i++) {
        const d = P[i], f = d.speed * v;
        d.x += q * f, d.y += F * f;
        const S = d.x - q * d.length, Y = d.y - F * d.length;
        if (h.strokeStyle = j(l, d.alpha * u), h.beginPath(), h.moveTo(d.x, d.y), h.lineTo(S, Y), h.stroke(), d.y >= r) {
          if (y && s.length < 200) {
            const N = Math.min(w, 6);
            for (let Z = 0; Z < N; Z++)
              s.push({
                x: d.x,
                y: r - 1,
                vx: k(-2.5, 2.5),
                vy: k(-1.5, -4),
                radius: k(0.8, 1.8),
                alpha: d.alpha,
                life: 1
              });
          }
          d.y = -d.length - Math.random() * 50, d.x = Math.random() * (a + 200) - 100;
        }
        d.x > a + 100 ? d.x = -100 : d.x < -100 && (d.x = a + 100);
      }
      if (y && s.length > 0) {
        const i = [], d = x || l;
        for (let f = 0; f < s.length; f++) {
          const S = s[f];
          S.x += S.vx * v, S.y += S.vy * v, S.vy += 0.2 * v, S.life -= 0.05 * v, S.life > 0 && S.y <= r + 2 && (h.fillStyle = j(d, S.alpha * S.life * u), h.beginPath(), h.arc(S.x, S.y, S.radius, 0, Math.PI * 2), h.fill(), i.push(S));
        }
        E.current = i;
      }
    },
    { enabled: K }
  );
  const A = {
    position: m ? "fixed" : "absolute",
    top: 0,
    left: 0,
    width: m ? "100vw" : "100%",
    height: m ? "100vh" : "100%",
    pointerEvents: "none",
    zIndex: H,
    ...I
  };
  return /* @__PURE__ */ st(
    "canvas",
    {
      ref: _,
      id: D,
      "aria-hidden": V,
      className: C,
      style: A
    }
  );
}, bt = [
  "#FF595E",
  "#FFCA3A",
  "#8AC926",
  "#1982C4",
  "#6A4C93",
  "#FF924C"
], Ft = ({
  trigger: e = !0,
  particleCount: n = 150,
  duration: t = 3500,
  colors: l = bt,
  shapes: u = ["square", "circle", "rectangle"],
  gravity: p = 0.6,
  spread: y = 70,
  velocity: x = 25,
  origin: w = { x: 0.5, y: 0.7 },
  recycle: m = !1,
  onComplete: M,
  fullScreen: C = !0,
  containerRef: I,
  className: G,
  style: H,
  enabled: U = !0,
  zIndex: D = 10,
  opacity: V = 1,
  respectReducedMotion: J = !0,
  id: K,
  "aria-hidden": _ = !0
}) => {
  const $ = ot(), [E, X] = lt(e), O = z(null), L = z([]), W = z(null), b = z(M);
  b.current = M;
  const T = Math.round(
    tt(n, 150, "particleCount")
  ), q = Q(p, 0.1, 5, 0.6, "gravity"), F = Q(y, 10, 360, 70, "spread"), B = Q(x, 5, 100, 25, "velocity"), g = it(O, { containerRef: I }), A = (a, r) => {
    const P = -Math.PI / 2, s = dt(F), v = P + k(-s / 2, s / 2), i = k(B * 0.5, B * 1.3);
    return {
      x: a,
      y: r,
      vx: Math.cos(v) * i,
      vy: Math.sin(v) * i,
      size: k(6, 12),
      color: ut(l),
      shape: u[Math.floor(Math.random() * u.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: k(-0.15, 0.15),
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: k(0.08, 0.18),
      alpha: 1,
      drag: k(0.96, 0.99)
    };
  }, o = () => {
    const { width: a, height: r } = g;
    if (a === 0 || r === 0) return;
    const P = a * w.x, s = r * w.y, v = [];
    for (let i = 0; i < T; i++)
      v.push(A(P, s));
    L.current = v, W.current = performance.now(), X(!0);
  };
  if (et(() => {
    e && g.width > 0 && g.height > 0 ? o() : e || (L.current = [], X(!1));
  }, [e, g.width, g.height]), at(
    ({ timestamp: a, deltaTime: r }) => {
      var Z;
      const P = O.current;
      if (!P) return;
      const s = P.getContext("2d");
      if (!s) return;
      const { width: v, height: i } = g;
      if (v === 0 || i === 0) return;
      nt(s, v, i), W.current === null && (W.current = a);
      const d = a - W.current, f = !m && d > t, S = L.current, Y = r * 60, N = [];
      for (let rt = 0; rt < S.length; rt++) {
        const R = S[rt];
        if (R.vx *= Math.pow(R.drag, Y), R.vy = R.vy * Math.pow(R.drag, Y) + q * Y, R.x += R.vx * Y, R.y += R.vy * Y, R.rotation += R.rotationSpeed * Y, R.wobble += R.wobbleSpeed * Y, !m && d > t * 0.7) {
          const ht = (d - t * 0.7) / (t * 0.3);
          R.alpha = Math.max(0, 1 - ht);
        }
        s.save(), s.translate(R.x, R.y), s.rotate(R.rotation), s.scale(Math.cos(R.wobble), 1), s.fillStyle = j(R.color, R.alpha * V), s.strokeStyle = j(R.color, R.alpha * V);
        const ct = R.size / 2;
        switch (R.shape) {
          case "circle":
            s.beginPath(), s.arc(0, 0, ct, 0, Math.PI * 2), s.fill();
            break;
          case "rectangle":
            s.fillRect(-ct, -ct * 0.5, R.size, R.size * 0.5);
            break;
          case "star":
            gt(s, 0, 0, 5, R.size, ct * 0.5), s.fill();
            break;
          case "square":
          default:
            s.fillRect(-ct, -ct, R.size, R.size);
            break;
        }
        if (s.restore(), !(R.y > i + 50) && R.alpha > 0.01)
          N.push(R);
        else if (m && e) {
          const ht = v * w.x, mt = i * w.y;
          N.push(A(ht, mt));
        }
      }
      L.current = N, !m && (f || N.length === 0) && S.length > 0 && (X(!1), L.current = [], nt(s, v, i), (Z = b.current) == null || Z.call(b));
    },
    { enabled: U && E && (!J || !$) }
  ), !e && !E)
    return null;
  const h = {
    position: C ? "fixed" : "absolute",
    top: 0,
    left: 0,
    width: C ? "100vw" : "100%",
    height: C ? "100vh" : "100%",
    pointerEvents: "none",
    zIndex: D,
    ...H
  };
  return /* @__PURE__ */ st(
    "canvas",
    {
      ref: O,
      id: K,
      "aria-hidden": _,
      className: G,
      style: h
    }
  );
}, kt = ({
  density: e = 40,
  minSize: n = 4,
  maxSize: t = 12,
  color: l = "#ffd700",
  glow: u = !0,
  glowRadius: p = 8,
  glowColor: y,
  speed: x = 1,
  shape: w = "star",
  fullScreen: m = !0,
  containerRef: M,
  className: C,
  style: I,
  enabled: G = !0,
  zIndex: H = 2,
  opacity: U = 0.9,
  respectReducedMotion: D = !0,
  id: V,
  "aria-hidden": J = !0
}) => {
  const K = ot(), _ = G && (!D || !K), $ = z(null), E = z([]), X = Math.round(tt(e, 40, "density")), O = tt(n, 4, "minSize"), L = Q(t, O, 100, 12, "maxSize"), W = Q(x, 0.1, 10, 1, "speed"), b = Array.isArray(l) ? l : [l], T = it($, {
    containerRef: M,
    onResize: (g) => {
      g.width > 0 && g.height > 0 && F(g.width, g.height);
    }
  }), q = (g, A) => ({
    x: Math.random() * g,
    y: Math.random() * A,
    maxRadius: k(O, L),
    color: ut(b),
    shape: w,
    rotation: Math.random() * Math.PI,
    rotationSpeed: k(-0.04, 0.04),
    progress: Math.random(),
    // Stagger initial phases
    lifeSpeed: k(0.015, 0.035) * W
  }), F = (g, A) => {
    const o = [];
    for (let c = 0; c < X; c++)
      o.push(q(g, A));
    E.current = o;
  };
  et(() => {
    T.width > 0 && T.height > 0 && F(T.width, T.height);
  }, [X, O, L, W, w, l]), at(
    ({ deltaTime: g }) => {
      const A = $.current;
      if (!A) return;
      const o = A.getContext("2d");
      if (!o) return;
      const { width: c, height: h } = T;
      if (c === 0 || h === 0) return;
      nt(o, c, h);
      const a = E.current, r = g * 60;
      for (let P = 0; P < a.length; P++) {
        const s = a[P];
        s.progress += s.lifeSpeed * r, s.rotation += s.rotationSpeed * r, s.progress >= 1 && (Object.assign(s, q(c, h)), s.progress = 0);
        const v = Math.sin(s.progress * Math.PI), i = s.maxRadius * v, d = v * U;
        i <= 0.1 || d <= 0.01 || (o.save(), o.translate(s.x, s.y), o.rotate(s.rotation), u && (o.shadowBlur = p, o.shadowColor = j(
          y || s.color,
          d * 0.8
        )), o.fillStyle = j(s.color, d), o.strokeStyle = j(s.color, d), s.shape === "circle" ? (o.beginPath(), o.arc(0, 0, i, 0, Math.PI * 2), o.fill()) : s.shape === "cross" ? (o.lineWidth = Math.max(1, i * 0.35), o.beginPath(), o.moveTo(-i, 0), o.lineTo(i, 0), o.moveTo(0, -i), o.lineTo(0, i), o.stroke()) : (gt(o, 0, 0, 4, i, i * 0.25), o.fill()), o.restore());
      }
    },
    { enabled: _ }
  );
  const B = {
    position: m ? "fixed" : "absolute",
    top: 0,
    left: 0,
    width: m ? "100vw" : "100%",
    height: m ? "100vh" : "100%",
    pointerEvents: "none",
    zIndex: H,
    ...I
  };
  return /* @__PURE__ */ st(
    "canvas",
    {
      ref: $,
      id: V,
      "aria-hidden": J,
      className: C,
      style: B
    }
  );
}, At = [
  "#00FF87",
  // Northern emerald green
  "#60EFFF",
  // Arctic cyan
  "#0061FF",
  // Deep polar blue
  "#7B2CBF"
  // Violet glow
], zt = ({
  colors: e = At,
  speed: n = 1,
  intensity: t = 1,
  blur: l = 40,
  ribbonCount: u = 3,
  opacity: p = 0.75,
  fullScreen: y = !0,
  containerRef: x,
  className: w,
  style: m,
  enabled: M = !0,
  zIndex: C = 0,
  respectReducedMotion: I = !0,
  id: G,
  "aria-hidden": H = !0
}) => {
  const U = ot(), D = M && (!I || !U), V = z(null), J = z(0), K = Q(n, 0.1, 10, 1, "speed"), _ = Q(t, 0.1, 2.5, 1, "intensity"), $ = Math.round(
    Q(u, 1, 6, 3, "ribbonCount")
  ), E = Math.round(tt(l, 40, "blur")), X = it(V, { containerRef: x });
  at(
    ({ deltaTime: L }) => {
      const W = V.current;
      if (!W) return;
      const b = W.getContext("2d");
      if (!b) return;
      const { width: T, height: q } = X;
      if (T === 0 || q === 0) return;
      nt(b, T, q), J.current += L * K * 0.6;
      const F = J.current;
      b.save(), b.globalCompositeOperation = "lighter";
      const B = 20, g = q * 0.35, A = q * 0.22 * _;
      for (let o = 0; o < $; o++) {
        const c = e[o % e.length] || "#00FF87", h = o * Math.PI / $, a = 0.8 + o * 0.25, r = b.createLinearGradient(0, 0, 0, q);
        r.addColorStop(0, j(c, 0)), r.addColorStop(0.2, j(c, p * 0.8)), r.addColorStop(0.5, j(c, p * 0.4)), r.addColorStop(0.85, j(c, 0)), b.fillStyle = r, b.beginPath(), b.moveTo(0, q);
        for (let P = 0; P <= T + B; P += B) {
          const s = P / T, v = Math.sin(s * 3.5 + F * a + h), i = Math.cos(s * 6.2 - F * 0.7 * a + h * 1.5), d = Math.sin(s * 1.8 + F * 0.3), f = g + (v * 0.6 + i * 0.3 + d * 0.1) * A;
          b.lineTo(P, f);
        }
        b.lineTo(T, q), b.closePath(), b.fill();
      }
      b.restore();
    },
    { enabled: D }
  );
  const O = {
    position: y ? "fixed" : "absolute",
    top: 0,
    left: 0,
    width: y ? "100vw" : "100%",
    height: y ? "100vh" : "100%",
    pointerEvents: "none",
    zIndex: C,
    filter: E > 0 ? `blur(${E}px)` : void 0,
    transform: E > 0 ? "scale(1.1)" : void 0,
    // Compensate for edge clipping during blur
    ...m
  };
  return /* @__PURE__ */ st(
    "canvas",
    {
      ref: V,
      id: G,
      "aria-hidden": H,
      className: w,
      style: O
    }
  );
}, It = ({
  color: e = "#60efff",
  trailLength: n = 25,
  particleSize: t = 6,
  glow: l = !0,
  glowRadius: u = 12,
  glowColor: p,
  fadeDuration: y = 1.5,
  sensitivity: x = 4,
  disabledOnTouch: w = !1,
  fullScreen: m = !0,
  containerRef: M,
  className: C,
  style: I,
  enabled: G = !0,
  zIndex: H = 9999,
  opacity: U = 0.9,
  respectReducedMotion: D = !0,
  id: V,
  "aria-hidden": J = !0
}) => {
  const K = ot(), _ = z(null), $ = z([]), E = z(null), X = z(!1), O = Math.round(
    Q(n, 2, 100, 25, "trailLength")
  ), L = tt(t, 6, "particleSize"), W = Q(y, 0.2, 10, 1.5, "fadeDuration"), b = tt(x, 4, "sensitivity"), T = Array.isArray(e) ? e : [e], q = it(_, { containerRef: M });
  et(() => {
    if (!G) return;
    const g = (h, a) => {
      let r = h, P = a;
      if (M != null && M.current) {
        const v = M.current.getBoundingClientRect();
        r = h - v.left, P = a - v.top;
      }
      if (E.current && wt(E.current.x, E.current.y, r, P) < b)
        return;
      E.current = { x: r, y: P };
      const s = {
        x: r,
        y: P,
        size: L,
        color: ut(T),
        alpha: 1
      };
      $.current.unshift(s), $.current.length > O && ($.current.length = O);
    }, A = (h) => {
      g(h.clientX, h.clientY);
    }, o = (h) => {
      X.current = !0, !w && h.touches.length > 0 && g(h.touches[0].clientX, h.touches[0].clientY);
    }, c = (M == null ? void 0 : M.current) || window;
    return c.addEventListener("mousemove", A, {
      passive: !0
    }), c.addEventListener("touchmove", o, {
      passive: !0
    }), () => {
      c.removeEventListener("mousemove", A), c.removeEventListener("touchmove", o);
    };
  }, [G, w, M, b, L, O, T]);
  const F = G && (!D || !K) && !(w && X.current);
  at(
    ({ deltaTime: g }) => {
      const A = _.current;
      if (!A) return;
      const o = A.getContext("2d");
      if (!o) return;
      const { width: c, height: h } = q;
      if (c === 0 || h === 0) return;
      nt(o, c, h);
      const a = $.current;
      if (a.length === 0) return;
      const r = g * W, P = [];
      for (let s = 0; s < a.length; s++) {
        const v = a[s];
        if (v.alpha -= r, v.alpha > 0.01) {
          const i = 1 - s / a.length, d = v.size * i, f = v.alpha * i * U;
          d > 0.1 && f > 0.01 && (o.save(), l && (o.shadowBlur = u, o.shadowColor = j(
            p || v.color,
            f * 0.7
          )), o.fillStyle = j(v.color, f), o.beginPath(), o.arc(v.x, v.y, d, 0, Math.PI * 2), o.fill(), o.restore(), P.push(v));
        }
      }
      $.current = P;
    },
    { enabled: F }
  );
  const B = {
    position: m ? "fixed" : "absolute",
    top: 0,
    left: 0,
    width: m ? "100vw" : "100%",
    height: m ? "100vh" : "100%",
    pointerEvents: "none",
    zIndex: H,
    ...I
  };
  return /* @__PURE__ */ st(
    "canvas",
    {
      ref: _,
      id: V,
      "aria-hidden": J,
      className: C,
      style: B
    }
  );
}, Dt = ({
  density: e = 80,
  particleSize: n = [1.5, 3],
  speed: t = 1,
  connectionLines: l = !0,
  connectionDistance: u = 120,
  lineColor: p,
  lineWidth: y = 1,
  particleColor: x = "#ffffff",
  interactive: w = !0,
  interactionRadius: m = 120,
  interactionMode: M = "repulse",
  fullScreen: C = !0,
  containerRef: I,
  className: G,
  style: H,
  enabled: U = !0,
  zIndex: D = 1,
  opacity: V = 0.85,
  respectReducedMotion: J = !0,
  id: K,
  "aria-hidden": _ = !0
}) => {
  const $ = ot(), E = U && (!J || !$), X = z(null), O = z([]), L = vt({ containerRef: I, enabled: w }), W = Math.round(tt(e, 80, "density")), b = Q(t, 0.1, 10, 1, "speed"), T = tt(
    u,
    120,
    "connectionDistance"
  ), q = tt(
    m,
    120,
    "interactionRadius"
  ), F = Array.isArray(n) ? n[0] : n, B = Array.isArray(n) ? n[1] : n, g = it(X, {
    containerRef: I,
    onResize: (c) => {
      c.width > 0 && c.height > 0 && A(c.width, c.height);
    }
  }), A = (c, h) => {
    const a = [];
    for (let r = 0; r < W; r++)
      a.push({
        x: Math.random() * c,
        y: Math.random() * h,
        vx: k(-0.8, 0.8) * b,
        vy: k(-0.8, 0.8) * b,
        radius: k(F, B),
        alpha: k(0.4, 0.9)
      });
    O.current = a;
  };
  et(() => {
    g.width > 0 && g.height > 0 && A(g.width, g.height);
  }, [W, F, B, b]), at(
    ({ deltaTime: c }) => {
      const h = X.current;
      if (!h) return;
      const a = h.getContext("2d");
      if (!a) return;
      const { width: r, height: P } = g;
      if (r === 0 || P === 0) return;
      nt(a, r, P);
      const s = O.current, v = c * 60, i = p || x;
      for (let d = 0; d < s.length; d++) {
        const f = s[d];
        if (f.x += f.vx * v, f.y += f.vy * v, (f.x <= 0 || f.x >= r) && (f.vx *= -1), (f.y <= 0 || f.y >= P) && (f.vy *= -1), w && L.isActive) {
          const S = f.x - L.x, Y = f.y - L.y, N = Math.sqrt(S * S + Y * Y);
          if (N < q && N > 0) {
            const Z = (1 - N / q) * 2;
            if (M === "repulse")
              f.x += S / N * Z, f.y += Y / N * Z;
            else if (M === "attract")
              f.x -= S / N * Z, f.y -= Y / N * Z;
            else if (M === "grab") {
              const rt = (1 - N / q) * V;
              a.strokeStyle = j(i, rt), a.lineWidth = y, a.beginPath(), a.moveTo(L.x, L.y), a.lineTo(f.x, f.y), a.stroke();
            }
          }
        }
      }
      if (l) {
        a.lineWidth = y;
        const d = T * T;
        for (let f = 0; f < s.length; f++) {
          const S = s[f];
          for (let Y = f + 1; Y < s.length; Y++) {
            const N = s[Y], Z = N.x - S.x, rt = N.y - S.y, R = Z * Z + rt * rt;
            if (R < d) {
              const ft = (1 - Math.sqrt(R) / T) * V * 0.45;
              a.strokeStyle = j(i, ft), a.beginPath(), a.moveTo(S.x, S.y), a.lineTo(N.x, N.y), a.stroke();
            }
          }
        }
      }
      for (let d = 0; d < s.length; d++) {
        const f = s[d];
        a.fillStyle = j(x, f.alpha * V), a.beginPath(), a.arc(f.x, f.y, f.radius, 0, Math.PI * 2), a.fill();
      }
    },
    { enabled: E }
  );
  const o = {
    position: C ? "fixed" : "absolute",
    top: 0,
    left: 0,
    width: C ? "100vw" : "100%",
    height: C ? "100vh" : "100%",
    pointerEvents: "none",
    zIndex: D,
    ...H
  };
  return /* @__PURE__ */ st(
    "canvas",
    {
      ref: X,
      id: K,
      "aria-hidden": _,
      className: G,
      style: o
    }
  );
}, $t = ({
  frequency: e = 1.5,
  speed: n = 15,
  length: t = [80, 160],
  color: l = "#ffffff",
  trailColor: u,
  glow: p = !0,
  glowRadius: y = 10,
  angle: x = 215,
  randomizeAngle: w = 8,
  fullScreen: m = !0,
  containerRef: M,
  className: C,
  style: I,
  enabled: G = !0,
  zIndex: H = 1,
  opacity: U = 0.9,
  respectReducedMotion: D = !0,
  id: V,
  "aria-hidden": J = !0
}) => {
  const K = ot(), _ = G && (!D || !K), $ = z(null), E = z([]), X = z(0), O = tt(e, 1.5, "frequency"), L = Q(n, 2, 60, 15, "speed"), W = Q(x, 0, 360, 215, "angle"), b = Q(w, 0, 45, 8, "randomizeAngle"), T = Array.isArray(t) ? t[0] : t, q = Array.isArray(t) ? t[1] : t, F = it($, { containerRef: M }), B = (A, o) => {
    const c = W + k(-b, b), h = dt(c), a = Math.random() > 0.4, r = a ? Math.random() * (A * 1.3) : A + 20, P = a ? -20 : Math.random() * (o * 0.6);
    return {
      x: r,
      y: P,
      length: k(T, q),
      speed: k(L * 0.85, L * 1.25),
      angleRad: h,
      alpha: k(0.7, 1)
    };
  };
  at(
    ({ deltaTime: A }) => {
      const o = $.current;
      if (!o) return;
      const c = o.getContext("2d");
      if (!c) return;
      const { width: h, height: a } = F;
      if (h === 0 || a === 0) return;
      for (nt(c, h, a), X.current += A * O; X.current >= 1; )
        E.current.push(B(h, a)), X.current -= 1;
      const r = E.current, P = A * 60, s = [];
      for (let v = 0; v < r.length; v++) {
        const i = r[v], d = i.speed * P;
        i.x += Math.cos(i.angleRad) * d, i.y += Math.sin(i.angleRad) * d;
        const f = i.x - Math.cos(i.angleRad) * i.length, S = i.y - Math.sin(i.angleRad) * i.length;
        c.save();
        const Y = c.createLinearGradient(f, S, i.x, i.y), N = u || l;
        Y.addColorStop(0, j(N, 0)), Y.addColorStop(0.7, j(N, i.alpha * U * 0.4)), Y.addColorStop(1, j(l, i.alpha * U)), c.strokeStyle = Y, c.lineWidth = 2, c.lineCap = "round", c.beginPath(), c.moveTo(f, S), c.lineTo(i.x, i.y), c.stroke(), p && (c.shadowBlur = y, c.shadowColor = j(l, i.alpha * U)), c.fillStyle = j(l, i.alpha * U), c.beginPath(), c.arc(i.x, i.y, 1.8, 0, Math.PI * 2), c.fill(), c.restore(), i.x < -200 && f < -200 || i.y > a + 200 && S > a + 200 || i.x > h + 200 && f > h + 200 || s.push(i);
      }
      E.current = s;
    },
    { enabled: _ }
  );
  const g = {
    position: m ? "fixed" : "absolute",
    top: 0,
    left: 0,
    width: m ? "100vw" : "100%",
    height: m ? "100vh" : "100%",
    pointerEvents: "none",
    zIndex: H,
    ...I
  };
  return /* @__PURE__ */ st(
    "canvas",
    {
      ref: $,
      id: V,
      "aria-hidden": J,
      className: C,
      style: g
    }
  );
};
export {
  zt as Aurora,
  Ft as Confetti,
  It as CursorTrail,
  $t as MeteorShower,
  Dt as ParticleField,
  Tt as Rain,
  Lt as Snowfall,
  kt as Sparkles,
  Mt as clamp,
  nt as clearCanvas,
  dt as degToRad,
  wt as distance,
  gt as drawStar,
  xt as hexToRgba,
  St as lerp,
  j as parseColor,
  Et as radToDeg,
  Ct as randomInt,
  k as randomRange,
  ut as samplePalette,
  yt as setupCanvas,
  at as useAnimationLoop,
  it as useCanvasResize,
  vt as usePointerPosition,
  ot as usePrefersReducedMotion,
  tt as validatePositive,
  Q as validateRange
};
//# sourceMappingURL=index.js.map
