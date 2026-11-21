import { useState as lt, useEffect as et, useRef as D } from "react";
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
  const v = e.getContext("2d");
  return v && (v.setTransform(1, 0, 0, 1, 0, 0), v.scale(u, u)), { width: n, height: t, dpr: u };
}
function nt(e, n, t) {
  e.clearRect(0, 0, n, t);
}
function vt(e, n, t, l, u, v) {
  let f = Math.PI / 2 * 3;
  const w = Math.PI / l;
  e.beginPath(), e.moveTo(n, t - u);
  for (let x = 0; x < l; x++) {
    let M = n + Math.cos(f) * u, g = t + Math.sin(f) * u;
    e.lineTo(M, g), f += w, M = n + Math.cos(f) * v, g = t + Math.sin(f) * v, e.lineTo(M, g), f += w;
  }
  e.lineTo(n, t - u), e.closePath();
}
function it(e, n = {}) {
  const { containerRef: t, onResize: l } = n, [u, v] = lt({
    width: 0,
    height: 0,
    dpr: 1
  });
  return et(() => {
    const f = e.current;
    if (!f) return;
    const w = () => {
      let g = 0, C = 0;
      if (t != null && t.current) {
        const j = t.current.getBoundingClientRect();
        g = Math.max(1, Math.floor(j.width)), C = Math.max(1, Math.floor(j.height));
      } else if (f.parentElement) {
        const j = f.parentElement.getBoundingClientRect();
        g = Math.max(1, Math.floor(j.width || window.innerWidth)), C = Math.max(1, Math.floor(j.height || window.innerHeight));
      } else
        g = window.innerWidth, C = window.innerHeight;
      const q = typeof window < "u" && window.devicePixelRatio || 1, U = yt(f, g, C, q);
      v(U), l == null || l(U);
    };
    w();
    let x = null;
    const M = (t == null ? void 0 : t.current) || f.parentElement;
    return typeof ResizeObserver < "u" && M && (x = new ResizeObserver(() => {
      w();
    }), x.observe(M)), window.addEventListener("resize", w, { passive: !0 }), () => {
      window.removeEventListener("resize", w), x && x.disconnect();
    };
  }, [e, t, l]), u;
}
function at(e, n = {}) {
  const { enabled: t = !0, pauseWhenHidden: l = !0 } = n, u = D(e);
  u.current = e;
  const v = D(null), f = D(null), w = D(!1);
  et(() => {
    if (!t) {
      v.current !== null && (cancelAnimationFrame(v.current), v.current = null), f.current = null;
      return;
    }
    const x = () => {
      l && (w.current = document.hidden, document.hidden || (f.current = null));
    };
    typeof document < "u" && document.addEventListener("visibilitychange", x);
    const M = (g) => {
      if (!w.current) {
        f.current === null && (f.current = g);
        const C = (g - f.current) / 1e3, q = Math.min(C, 0.1);
        f.current = g, u.current({ timestamp: g, deltaTime: q });
      }
      v.current = requestAnimationFrame(M);
    };
    return v.current = requestAnimationFrame(M), () => {
      v.current !== null && (cancelAnimationFrame(v.current), v.current = null), f.current = null, typeof document < "u" && document.removeEventListener("visibilitychange", x);
    };
  }, [t, l]);
}
function gt(e = {}) {
  const { containerRef: n, enabled: t = !0 } = e, [l, u] = lt({
    x: -9999,
    y: -9999,
    isActive: !1,
    isTouch: !1
  });
  return et(() => {
    if (!t) return;
    const v = (x) => {
      let M = 0, g = 0, C = !1;
      if ("touches" in x) {
        if (x.touches.length === 0) return;
        M = x.touches[0].clientX, g = x.touches[0].clientY, C = !0;
      } else
        M = x.clientX, g = x.clientY;
      if (n != null && n.current) {
        const q = n.current.getBoundingClientRect();
        u({
          x: M - q.left,
          y: g - q.top,
          isActive: !0,
          isTouch: C
        });
      } else
        u({
          x: M,
          y: g,
          isActive: !0,
          isTouch: C
        });
    }, f = () => {
      u((x) => ({
        ...x,
        isActive: !1
      }));
    }, w = (n == null ? void 0 : n.current) || window;
    return w.addEventListener("mousemove", v, {
      passive: !0
    }), w.addEventListener("touchstart", v, {
      passive: !0
    }), w.addEventListener("touchmove", v, {
      passive: !0
    }), w.addEventListener("mouseleave", f, {
      passive: !0
    }), w.addEventListener("touchend", f, {
      passive: !0
    }), () => {
      w.removeEventListener("mousemove", v), w.removeEventListener("touchstart", v), w.removeEventListener("touchmove", v), w.removeEventListener("mouseleave", f), w.removeEventListener("touchend", f);
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
function xt(e, n, t, l) {
  const u = t - e, v = l - n;
  return Math.sqrt(u * u + v * v);
}
function G(e, n, t, l, u) {
  return e === void 0 || typeof e != "number" || isNaN(e) ? l : e < n || e > t ? (process.env.NODE_ENV === "development" && u && console.warn(
    `[AtmosFX] Prop '${u}' with value ${e} is out of bounds [${n}, ${t}]. Clamping to range.`
  ), Math.min(Math.max(e, n), t)) : e;
}
function tt(e, n, t) {
  return e === void 0 || typeof e != "number" || isNaN(e) || e <= 0 ? (process.env.NODE_ENV === "development" && t && e !== void 0 && console.warn(
    `[AtmosFX] Prop '${t}' must be a positive number. Using fallback ${n}.`
  ), n) : e;
}
function wt(e, n = 1) {
  let t = e.trim().replace(/^#/, "");
  if (t.length === 3 ? t = t.split("").map((l) => l + l).join("") : t.length === 4 && (t = t.split("").map((l) => l + l).join("")), t.length === 6 || t.length === 8) {
    const l = parseInt(t.substring(0, 2), 16), u = parseInt(t.substring(2, 4), 16), v = parseInt(t.substring(4, 6), 16), f = t.length === 8 ? parseInt(t.substring(6, 8), 16) / 255 * n : n;
    return `rgba(${l}, ${u}, ${v}, ${Math.max(0, Math.min(1, f))})`;
  }
  return e;
}
function N(e, n = 1) {
  if (!e) return `rgba(255, 255, 255, ${n})`;
  const t = e.trim();
  return t.startsWith("#") ? wt(t, n) : t.startsWith("rgb(") && !t.startsWith("rgba(") ? t.replace("rgb(", "rgba(").replace(")", `, ${n})`) : t.startsWith("rgba(") ? n !== 1 ? t.replace(/,\s*[\d.]+\)$/, `, ${n})`) : t : t.startsWith("hsl(") && !t.startsWith("hsla(") ? t.replace("hsl(", "hsla(").replace(")", `, ${n})`) : t;
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
  wind: v = 0.5,
  interaction: f = !1,
  interactionRadius: w = 100,
  pause: x = !1,
  fullScreen: M = !0,
  containerRef: g,
  className: C,
  style: q,
  enabled: U = !0,
  zIndex: j = 1,
  respectReducedMotion: V = !0,
  id: J,
  "aria-hidden": _ = !0
}) => {
  const Q = ot(), K = U && !x && (!V || !Q), H = D(null), I = D([]), E = gt({ containerRef: g, enabled: f }), $ = Math.round(tt(e, 100, "count")), z = G(n, 0.1, 20, 1.5, "speed"), L = Array.isArray(t) ? t[0] : t, B = Array.isArray(t) ? t[1] : t, b = it(H, {
    containerRef: g,
    onResize: (F) => {
      F.width > 0 && F.height > 0 && T(F.width, F.height);
    }
  }), T = (F, X) => {
    const m = [];
    for (let A = 0; A < $; A++)
      m.push({
        x: Math.random() * F,
        y: Math.random() * X,
        radius: k(L, B),
        speedY: k(z * 0.6, z * 1.4),
        speedX: v + k(-0.3, 0.3),
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: k(0.01, 0.03),
        alpha: k(0.4, 1)
      });
    I.current = m;
  };
  et(() => {
    b.width > 0 && b.height > 0 && T(b.width, b.height);
  }, [$, L, B, z, v]), at(
    ({ deltaTime: F }) => {
      const X = H.current;
      if (!X) return;
      const m = X.getContext("2d");
      if (!m) return;
      const { width: A, height: o } = b;
      if (A === 0 || o === 0) return;
      nt(m, A, o);
      const c = I.current, h = N(l, u);
      m.fillStyle = h;
      for (let a = 0; a < c.length; a++) {
        const r = c[a];
        r.wobble += r.wobbleSpeed;
        const P = Math.sin(r.wobble) * 0.8;
        if (r.y += r.speedY * (F * 60), r.x += (r.speedX + P) * (F * 60), f && E.isActive) {
          const s = r.x - E.x, y = r.y - E.y, i = Math.sqrt(s * s + y * y);
          if (i < w && i > 0) {
            const d = (1 - i / w) * 4;
            r.x += s / i * d, r.y += y / i * d;
          }
        }
        r.y > o + r.radius ? (r.y = -r.radius, r.x = Math.random() * A) : r.y < -r.radius && (r.y = o + r.radius), r.x > A + r.radius ? r.x = -r.radius : r.x < -r.radius && (r.x = A + r.radius), m.beginPath(), m.arc(r.x, r.y, r.radius, 0, Math.PI * 2), m.fillStyle = N(l, r.alpha * u), m.fill();
      }
    },
    { enabled: K }
  );
  const O = {
    position: M ? "fixed" : "absolute",
    top: 0,
    left: 0,
    width: M ? "100vw" : "100%",
    height: M ? "100vh" : "100%",
    pointerEvents: "none",
    zIndex: j,
    ...q
  };
  return /* @__PURE__ */ st(
    "canvas",
    {
      ref: H,
      id: J,
      "aria-hidden": _,
      className: C,
      style: O
    }
  );
}, Tt = ({
  intensity: e = 120,
  dropLength: n = [15, 25],
  speed: t = 18,
  color: l = "#9ec5e8",
  opacity: u = 0.7,
  angle: v = 12,
  splashes: f = !0,
  splashColor: w,
  splashCount: x = 3,
  fullScreen: M = !0,
  containerRef: g,
  className: C,
  style: q,
  enabled: U = !0,
  zIndex: j = 1,
  respectReducedMotion: V = !0,
  id: J,
  "aria-hidden": _ = !0
}) => {
  const Q = ot(), K = U && (!V || !Q), H = D(null), I = D([]), E = D([]), $ = Math.round(tt(e, 120, "intensity")), z = G(t, 1, 50, 18, "speed"), L = G(v, -60, 60, 12, "angle"), B = Array.isArray(n) ? n[0] : n, b = Array.isArray(n) ? n[1] : n, T = dt(L), O = Math.sin(T), F = Math.cos(T), X = it(H, {
    containerRef: g,
    onResize: (o) => {
      o.width > 0 && o.height > 0 && m(o.width, o.height);
    }
  }), m = (o, c) => {
    const h = [];
    for (let a = 0; a < $; a++)
      h.push({
        x: Math.random() * (o + 200) - 100,
        y: Math.random() * c,
        length: k(B, b),
        speed: k(z * 0.8, z * 1.2),
        alpha: k(0.4, 0.9)
      });
    I.current = h, E.current = [];
  };
  et(() => {
    X.width > 0 && X.height > 0 && m(X.width, X.height);
  }, [$, B, b, z, L]), at(
    ({ deltaTime: o }) => {
      const c = H.current;
      if (!c) return;
      const h = c.getContext("2d");
      if (!h) return;
      const { width: a, height: r } = X;
      if (a === 0 || r === 0) return;
      nt(h, a, r);
      const P = I.current, s = E.current, y = o * 60;
      h.lineWidth = 1.5;
      for (let i = 0; i < P.length; i++) {
        const d = P[i], p = d.speed * y;
        d.x += O * p, d.y += F * p;
        const S = d.x - O * d.length, W = d.y - F * d.length;
        if (h.strokeStyle = N(l, d.alpha * u), h.beginPath(), h.moveTo(d.x, d.y), h.lineTo(S, W), h.stroke(), d.y >= r) {
          if (f && s.length < 200) {
            const Y = Math.min(x, 6);
            for (let Z = 0; Z < Y; Z++)
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
      if (f && s.length > 0) {
        const i = [], d = w || l;
        for (let p = 0; p < s.length; p++) {
          const S = s[p];
          S.x += S.vx * y, S.y += S.vy * y, S.vy += 0.2 * y, S.life -= 0.05 * y, S.life > 0 && S.y <= r + 2 && (h.fillStyle = N(d, S.alpha * S.life * u), h.beginPath(), h.arc(S.x, S.y, S.radius, 0, Math.PI * 2), h.fill(), i.push(S));
        }
        E.current = i;
      }
    },
    { enabled: K }
  );
  const A = {
    position: M ? "fixed" : "absolute",
    top: 0,
    left: 0,
    width: M ? "100vw" : "100%",
    height: M ? "100vh" : "100%",
    pointerEvents: "none",
    zIndex: j,
    ...q
  };
  return /* @__PURE__ */ st(
    "canvas",
    {
      ref: H,
      id: J,
      "aria-hidden": _,
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
  gravity: v = 0.6,
  spread: f = 70,
  velocity: w = 25,
  origin: x = { x: 0.5, y: 0.7 },
  recycle: M = !1,
  onComplete: g,
  fullScreen: C = !0,
  containerRef: q,
  className: U,
  style: j,
  enabled: V = !0,
  zIndex: J = 10,
  opacity: _ = 1,
  respectReducedMotion: Q = !0,
  id: K,
  "aria-hidden": H = !0
}) => {
  const I = ot(), [E, $] = lt(e), z = D(null), L = D([]), B = D(null), b = D(g);
  b.current = g;
  const T = Math.round(
    tt(n, 150, "particleCount")
  ), O = G(v, 0.1, 5, 0.6, "gravity"), F = G(f, 10, 360, 70, "spread"), X = G(w, 5, 100, 25, "velocity"), m = it(z, { containerRef: q }), A = (a, r) => {
    const P = -Math.PI / 2, s = dt(F), y = P + k(-s / 2, s / 2), i = k(X * 0.5, X * 1.3);
    return {
      x: a,
      y: r,
      vx: Math.cos(y) * i,
      vy: Math.sin(y) * i,
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
    const { width: a, height: r } = m;
    if (a === 0 || r === 0) return;
    const P = a * x.x, s = r * x.y, y = [];
    for (let i = 0; i < T; i++)
      y.push(A(P, s));
    L.current = y, B.current = performance.now(), $(!0);
  };
  if (et(() => {
    e && m.width > 0 && m.height > 0 ? o() : e || (L.current = [], $(!1));
  }, [e, m.width, m.height]), at(
    ({ timestamp: a, deltaTime: r }) => {
      var Z;
      const P = z.current;
      if (!P) return;
      const s = P.getContext("2d");
      if (!s) return;
      const { width: y, height: i } = m;
      if (y === 0 || i === 0) return;
      nt(s, y, i), B.current === null && (B.current = a);
      const d = a - B.current, p = !M && d > t, S = L.current, W = r * 60, Y = [];
      for (let rt = 0; rt < S.length; rt++) {
        const R = S[rt];
        if (R.vx *= Math.pow(R.drag, W), R.vy = R.vy * Math.pow(R.drag, W) + O * W, R.x += R.vx * W, R.y += R.vy * W, R.rotation += R.rotationSpeed * W, R.wobble += R.wobbleSpeed * W, !M && d > t * 0.7) {
          const ht = (d - t * 0.7) / (t * 0.3);
          R.alpha = Math.max(0, 1 - ht);
        }
        s.save(), s.translate(R.x, R.y), s.rotate(R.rotation), s.scale(Math.cos(R.wobble), 1), s.fillStyle = N(R.color, R.alpha * _), s.strokeStyle = N(R.color, R.alpha * _);
        const ct = R.size / 2;
        switch (R.shape) {
          case "circle":
            s.beginPath(), s.arc(0, 0, ct, 0, Math.PI * 2), s.fill();
            break;
          case "rectangle":
            s.fillRect(-ct, -ct * 0.5, R.size, R.size * 0.5);
            break;
          case "star":
            vt(s, 0, 0, 5, R.size, ct * 0.5), s.fill();
            break;
          case "square":
          default:
            s.fillRect(-ct, -ct, R.size, R.size);
            break;
        }
        if (s.restore(), !(R.y > i + 50) && R.alpha > 0.01)
          Y.push(R);
        else if (M && e) {
          const ht = y * x.x, mt = i * x.y;
          Y.push(A(ht, mt));
        }
      }
      L.current = Y, !M && (p || Y.length === 0) && S.length > 0 && ($(!1), L.current = [], nt(s, y, i), (Z = b.current) == null || Z.call(b));
    },
    { enabled: V && E && (!Q || !I) }
  ), !e && !E)
    return null;
  const h = {
    position: C ? "fixed" : "absolute",
    top: 0,
    left: 0,
    width: C ? "100vw" : "100%",
    height: C ? "100vh" : "100%",
    pointerEvents: "none",
    zIndex: J,
    ...j
  };
  return /* @__PURE__ */ st(
    "canvas",
    {
      ref: z,
      id: K,
      "aria-hidden": H,
      className: U,
      style: h
    }
  );
}, kt = ({
  density: e = 40,
  minSize: n = 4,
  maxSize: t = 12,
  color: l = "#ffd700",
  glow: u = !0,
  glowRadius: v = 8,
  glowColor: f,
  speed: w = 1,
  shape: x = "star",
  fullScreen: M = !0,
  containerRef: g,
  className: C,
  style: q,
  enabled: U = !0,
  zIndex: j = 2,
  opacity: V = 0.9,
  respectReducedMotion: J = !0,
  id: _,
  "aria-hidden": Q = !0
}) => {
  const K = ot(), H = U && (!J || !K), I = D(null), E = D([]), $ = Math.round(tt(e, 40, "density")), z = tt(n, 4, "minSize"), L = G(t, z, 100, 12, "maxSize"), B = G(w, 0.1, 10, 1, "speed"), b = Array.isArray(l) ? l : [l], T = it(I, {
    containerRef: g,
    onResize: (m) => {
      m.width > 0 && m.height > 0 && F(m.width, m.height);
    }
  }), O = (m, A) => ({
    x: Math.random() * m,
    y: Math.random() * A,
    maxRadius: k(z, L),
    color: ut(b),
    shape: x,
    rotation: Math.random() * Math.PI,
    rotationSpeed: k(-0.04, 0.04),
    progress: Math.random(),
    // Stagger initial phases
    lifeSpeed: k(0.015, 0.035) * B
  }), F = (m, A) => {
    const o = [];
    for (let c = 0; c < $; c++)
      o.push(O(m, A));
    E.current = o;
  };
  et(() => {
    T.width > 0 && T.height > 0 && F(T.width, T.height);
  }, [$, z, L, B, x, l]), at(
    ({ deltaTime: m }) => {
      const A = I.current;
      if (!A) return;
      const o = A.getContext("2d");
      if (!o) return;
      const { width: c, height: h } = T;
      if (c === 0 || h === 0) return;
      nt(o, c, h);
      const a = E.current, r = m * 60;
      for (let P = 0; P < a.length; P++) {
        const s = a[P];
        s.progress += s.lifeSpeed * r, s.rotation += s.rotationSpeed * r, s.progress >= 1 && (Object.assign(s, O(c, h)), s.progress = 0);
        const y = Math.sin(s.progress * Math.PI), i = s.maxRadius * y, d = y * V;
        i <= 0.1 || d <= 0.01 || (o.save(), o.translate(s.x, s.y), o.rotate(s.rotation), u && (o.shadowBlur = v, o.shadowColor = N(
          f || s.color,
          d * 0.8
        )), o.fillStyle = N(s.color, d), o.strokeStyle = N(s.color, d), s.shape === "circle" ? (o.beginPath(), o.arc(0, 0, i, 0, Math.PI * 2), o.fill()) : s.shape === "cross" ? (o.lineWidth = Math.max(1, i * 0.35), o.beginPath(), o.moveTo(-i, 0), o.lineTo(i, 0), o.moveTo(0, -i), o.lineTo(0, i), o.stroke()) : (vt(o, 0, 0, 4, i, i * 0.25), o.fill()), o.restore());
      }
    },
    { enabled: H }
  );
  const X = {
    position: M ? "fixed" : "absolute",
    top: 0,
    left: 0,
    width: M ? "100vw" : "100%",
    height: M ? "100vh" : "100%",
    pointerEvents: "none",
    zIndex: j,
    ...q
  };
  return /* @__PURE__ */ st(
    "canvas",
    {
      ref: I,
      id: _,
      "aria-hidden": Q,
      className: C,
      style: X
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
], It = ({
  colors: e = At,
  speed: n = 1,
  intensity: t = 1,
  blur: l = 40,
  ribbonCount: u = 3,
  opacity: v = 0.75,
  fullScreen: f = !0,
  containerRef: w,
  className: x,
  style: M,
  enabled: g = !0,
  zIndex: C = 0,
  respectReducedMotion: q = !0,
  id: U,
  "aria-hidden": j = !0
}) => {
  const V = ot(), J = g && (!q || !V), _ = D(null), Q = D(0), K = G(n, 0.1, 10, 1, "speed"), H = G(t, 0.1, 2.5, 1, "intensity"), I = Math.round(
    G(u, 1, 6, 3, "ribbonCount")
  ), E = Math.round(tt(l, 40, "blur")), $ = it(_, { containerRef: w });
  at(
    ({ deltaTime: L }) => {
      const B = _.current;
      if (!B) return;
      const b = B.getContext("2d");
      if (!b) return;
      const { width: T, height: O } = $;
      if (T === 0 || O === 0) return;
      nt(b, T, O), Q.current += L * K * 0.6;
      const F = Q.current;
      b.save(), b.globalCompositeOperation = "lighter";
      const X = 20, m = O * 0.35, A = O * 0.22 * H;
      for (let o = 0; o < I; o++) {
        const c = e[o % e.length] || "#00FF87", h = o * Math.PI / I, a = 0.8 + o * 0.25, r = b.createLinearGradient(0, 0, 0, O);
        r.addColorStop(0, N(c, 0)), r.addColorStop(0.2, N(c, v * 0.8)), r.addColorStop(0.5, N(c, v * 0.4)), r.addColorStop(0.85, N(c, 0)), b.fillStyle = r, b.beginPath(), b.moveTo(0, O);
        for (let P = 0; P <= T + X; P += X) {
          const s = P / T, y = Math.sin(s * 3.5 + F * a + h), i = Math.cos(s * 6.2 - F * 0.7 * a + h * 1.5), d = Math.sin(s * 1.8 + F * 0.3), p = m + (y * 0.6 + i * 0.3 + d * 0.1) * A;
          b.lineTo(P, p);
        }
        b.lineTo(T, O), b.closePath(), b.fill();
      }
      b.restore();
    },
    { enabled: J }
  );
  const z = {
    position: f ? "fixed" : "absolute",
    top: 0,
    left: 0,
    width: f ? "100vw" : "100%",
    height: f ? "100vh" : "100%",
    pointerEvents: "none",
    zIndex: C,
    filter: E > 0 ? `blur(${E}px)` : void 0,
    transform: E > 0 ? "scale(1.1)" : void 0,
    // Compensate for edge clipping during blur
    ...M
  };
  return /* @__PURE__ */ st(
    "canvas",
    {
      ref: _,
      id: U,
      "aria-hidden": j,
      className: x,
      style: z
    }
  );
}, zt = ({
  color: e = "#60efff",
  trailLength: n = 25,
  particleSize: t = 6,
  glow: l = !0,
  glowRadius: u = 12,
  glowColor: v,
  fadeDuration: f = 1.5,
  sensitivity: w = 4,
  disabledOnTouch: x = !1,
  fullScreen: M = !0,
  containerRef: g,
  className: C,
  style: q,
  enabled: U = !0,
  zIndex: j = 9999,
  opacity: V = 0.9,
  respectReducedMotion: J = !0,
  id: _,
  "aria-hidden": Q = !0
}) => {
  const K = ot(), H = D(null), I = D([]), E = D(null), $ = D(!1), z = Math.round(
    G(n, 2, 100, 25, "trailLength")
  ), L = tt(t, 6, "particleSize"), B = G(f, 0.2, 10, 1.5, "fadeDuration"), b = tt(w, 4, "sensitivity"), T = Array.isArray(e) ? e : [e], O = it(H, { containerRef: g });
  et(() => {
    if (!U) return;
    const m = (h, a) => {
      let r = h, P = a;
      if (g != null && g.current) {
        const y = g.current.getBoundingClientRect();
        r = h - y.left, P = a - y.top;
      }
      if (E.current && xt(E.current.x, E.current.y, r, P) < b)
        return;
      E.current = { x: r, y: P };
      const s = {
        x: r,
        y: P,
        size: L,
        color: ut(T),
        alpha: 1
      };
      I.current.unshift(s), I.current.length > z && (I.current.length = z);
    }, A = (h) => {
      m(h.clientX, h.clientY);
    }, o = (h) => {
      $.current = !0, !x && h.touches.length > 0 && m(h.touches[0].clientX, h.touches[0].clientY);
    }, c = (g == null ? void 0 : g.current) || window;
    return c.addEventListener("mousemove", A, {
      passive: !0
    }), c.addEventListener("touchmove", o, {
      passive: !0
    }), () => {
      c.removeEventListener("mousemove", A), c.removeEventListener("touchmove", o);
    };
  }, [U, x, g, b, L, z, T]);
  const F = U && (!J || !K) && !(x && $.current);
  at(
    ({ deltaTime: m }) => {
      const A = H.current;
      if (!A) return;
      const o = A.getContext("2d");
      if (!o) return;
      const { width: c, height: h } = O;
      if (c === 0 || h === 0) return;
      nt(o, c, h);
      const a = I.current;
      if (a.length === 0) return;
      const r = m * B, P = [];
      for (let s = 0; s < a.length; s++) {
        const y = a[s];
        if (y.alpha -= r, y.alpha > 0.01) {
          const i = 1 - s / a.length, d = y.size * i, p = y.alpha * i * V;
          d > 0.1 && p > 0.01 && (o.save(), l && (o.shadowBlur = u, o.shadowColor = N(
            v || y.color,
            p * 0.7
          )), o.fillStyle = N(y.color, p), o.beginPath(), o.arc(y.x, y.y, d, 0, Math.PI * 2), o.fill(), o.restore(), P.push(y));
        }
      }
      I.current = P;
    },
    { enabled: F }
  );
  const X = {
    position: M ? "fixed" : "absolute",
    top: 0,
    left: 0,
    width: M ? "100vw" : "100%",
    height: M ? "100vh" : "100%",
    pointerEvents: "none",
    zIndex: j,
    ...q
  };
  return /* @__PURE__ */ st(
    "canvas",
    {
      ref: H,
      id: _,
      "aria-hidden": Q,
      className: C,
      style: X
    }
  );
}, Dt = ({
  density: e = 80,
  particleSize: n = [1.5, 3],
  speed: t = 1,
  connectionLines: l = !0,
  connectionDistance: u = 120,
  lineColor: v,
  lineWidth: f = 1,
  particleColor: w = "#ffffff",
  interactive: x = !0,
  interactionRadius: M = 120,
  interactionMode: g = "repulse",
  fullScreen: C = !0,
  containerRef: q,
  className: U,
  style: j,
  enabled: V = !0,
  zIndex: J = 1,
  opacity: _ = 0.85,
  respectReducedMotion: Q = !0,
  id: K,
  "aria-hidden": H = !0
}) => {
  const I = ot(), E = V && (!Q || !I), $ = D(null), z = D([]), L = gt({ containerRef: q, enabled: x }), B = Math.round(tt(e, 80, "density")), b = G(t, 0.1, 10, 1, "speed"), T = tt(
    u,
    120,
    "connectionDistance"
  ), O = tt(
    M,
    120,
    "interactionRadius"
  ), F = Array.isArray(n) ? n[0] : n, X = Array.isArray(n) ? n[1] : n, m = it($, {
    containerRef: q,
    onResize: (c) => {
      c.width > 0 && c.height > 0 && A(c.width, c.height);
    }
  }), A = (c, h) => {
    const a = [];
    for (let r = 0; r < B; r++)
      a.push({
        x: Math.random() * c,
        y: Math.random() * h,
        vx: k(-0.8, 0.8) * b,
        vy: k(-0.8, 0.8) * b,
        radius: k(F, X),
        alpha: k(0.4, 0.9)
      });
    z.current = a;
  };
  et(() => {
    m.width > 0 && m.height > 0 && A(m.width, m.height);
  }, [B, F, X, b]), at(
    ({ deltaTime: c }) => {
      const h = $.current;
      if (!h) return;
      const a = h.getContext("2d");
      if (!a) return;
      const { width: r, height: P } = m;
      if (r === 0 || P === 0) return;
      nt(a, r, P);
      const s = z.current, y = c * 60, i = v || w;
      for (let d = 0; d < s.length; d++) {
        const p = s[d];
        if (p.x += p.vx * y, p.y += p.vy * y, (p.x <= 0 || p.x >= r) && (p.vx *= -1), (p.y <= 0 || p.y >= P) && (p.vy *= -1), x && L.isActive) {
          const S = p.x - L.x, W = p.y - L.y, Y = Math.sqrt(S * S + W * W);
          if (Y < O && Y > 0) {
            const Z = (1 - Y / O) * 2;
            if (g === "repulse")
              p.x += S / Y * Z, p.y += W / Y * Z;
            else if (g === "attract")
              p.x -= S / Y * Z, p.y -= W / Y * Z;
            else if (g === "grab") {
              const rt = (1 - Y / O) * _;
              a.strokeStyle = N(i, rt), a.lineWidth = f, a.beginPath(), a.moveTo(L.x, L.y), a.lineTo(p.x, p.y), a.stroke();
            }
          }
        }
      }
      if (l) {
        a.lineWidth = f;
        const d = T * T;
        for (let p = 0; p < s.length; p++) {
          const S = s[p];
          for (let W = p + 1; W < s.length; W++) {
            const Y = s[W], Z = Y.x - S.x, rt = Y.y - S.y, R = Z * Z + rt * rt;
            if (R < d) {
              const ft = (1 - Math.sqrt(R) / T) * _ * 0.45;
              a.strokeStyle = N(i, ft), a.beginPath(), a.moveTo(S.x, S.y), a.lineTo(Y.x, Y.y), a.stroke();
            }
          }
        }
      }
      for (let d = 0; d < s.length; d++) {
        const p = s[d];
        a.fillStyle = N(w, p.alpha * _), a.beginPath(), a.arc(p.x, p.y, p.radius, 0, Math.PI * 2), a.fill();
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
    zIndex: J,
    ...j
  };
  return /* @__PURE__ */ st(
    "canvas",
    {
      ref: $,
      id: K,
      "aria-hidden": H,
      className: U,
      style: o
    }
  );
}, $t = ({
  frequency: e = 1.5,
  speed: n = 15,
  length: t = [80, 160],
  color: l = "#ffffff",
  trailColor: u,
  glow: v = !0,
  glowRadius: f = 10,
  angle: w = 215,
  randomizeAngle: x = 8,
  fullScreen: M = !0,
  containerRef: g,
  className: C,
  style: q,
  enabled: U = !0,
  zIndex: j = 1,
  opacity: V = 0.9,
  respectReducedMotion: J = !0,
  id: _,
  "aria-hidden": Q = !0
}) => {
  const K = ot(), H = U && (!J || !K), I = D(null), E = D([]), $ = D(0), z = tt(e, 1.5, "frequency"), L = G(n, 2, 60, 15, "speed"), B = G(w, 0, 360, 215, "angle"), b = G(x, 0, 45, 8, "randomizeAngle"), T = Array.isArray(t) ? t[0] : t, O = Array.isArray(t) ? t[1] : t, F = it(I, { containerRef: g }), X = (A, o) => {
    const c = B + k(-b, b), h = dt(c), a = Math.random() > 0.4, r = a ? Math.random() * (A * 1.3) : A + 20, P = a ? -20 : Math.random() * (o * 0.6);
    return {
      x: r,
      y: P,
      length: k(T, O),
      speed: k(L * 0.85, L * 1.25),
      angleRad: h,
      alpha: k(0.7, 1)
    };
  };
  at(
    ({ deltaTime: A }) => {
      const o = I.current;
      if (!o) return;
      const c = o.getContext("2d");
      if (!c) return;
      const { width: h, height: a } = F;
      if (h === 0 || a === 0) return;
      for (nt(c, h, a), $.current += A * z; $.current >= 1; )
        E.current.push(X(h, a)), $.current -= 1;
      const r = E.current, P = A * 60, s = [];
      for (let y = 0; y < r.length; y++) {
        const i = r[y], d = i.speed * P;
        i.x += Math.cos(i.angleRad) * d, i.y += Math.sin(i.angleRad) * d;
        const p = i.x - Math.cos(i.angleRad) * i.length, S = i.y - Math.sin(i.angleRad) * i.length;
        c.save();
        const W = c.createLinearGradient(p, S, i.x, i.y), Y = u || l;
        W.addColorStop(0, N(Y, 0)), W.addColorStop(0.7, N(Y, i.alpha * V * 0.4)), W.addColorStop(1, N(l, i.alpha * V)), c.strokeStyle = W, c.lineWidth = 2, c.lineCap = "round", c.beginPath(), c.moveTo(p, S), c.lineTo(i.x, i.y), c.stroke(), v && (c.shadowBlur = f, c.shadowColor = N(l, i.alpha * V)), c.fillStyle = N(l, i.alpha * V), c.beginPath(), c.arc(i.x, i.y, 1.8, 0, Math.PI * 2), c.fill(), c.restore(), i.x < -200 && p < -200 || i.y > a + 200 && S > a + 200 || i.x > h + 200 && p > h + 200 || s.push(i);
      }
      E.current = s;
    },
    { enabled: H }
  );
  const m = {
    position: M ? "fixed" : "absolute",
    top: 0,
    left: 0,
    width: M ? "100vw" : "100%",
    height: M ? "100vh" : "100%",
    pointerEvents: "none",
    zIndex: j,
    ...q
  };
  return /* @__PURE__ */ st(
    "canvas",
    {
      ref: I,
      id: _,
      "aria-hidden": Q,
      className: C,
      style: m
    }
  );
};
export {
  It as Aurora,
  Ft as Confetti,
  zt as CursorTrail,
  $t as MeteorShower,
  Dt as ParticleField,
  Tt as Rain,
  Lt as Snowfall,
  kt as Sparkles,
  Mt as clamp,
  nt as clearCanvas,
  dt as degToRad,
  xt as distance,
  vt as drawStar,
  wt as hexToRgba,
  St as lerp,
  N as parseColor,
  Et as radToDeg,
  Ct as randomInt,
  k as randomRange,
  ut as samplePalette,
  yt as setupCanvas,
  at as useAnimationLoop,
  it as useCanvasResize,
  gt as usePointerPosition,
  ot as usePrefersReducedMotion,
  tt as validatePositive,
  G as validateRange
};
//# sourceMappingURL=index.js.map
