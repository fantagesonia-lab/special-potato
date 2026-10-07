// A tiny software rasterizer that draws aliased (pixel-exact) shapes into masks.
// Avatars are composed from these masks so every cosmetic gets the same crisp
// pixel-art outline and shading, regardless of who authored it.

export type Shape =
  | { t: 'ell'; x: number; y: number; rx: number; ry: number }
  | { t: 'poly'; pts: number[] }
  | { t: 'cap'; x1: number; y1: number; x2: number; y2: number; r1: number; r2?: number }
  | { t: 'rect'; x: number; y: number; w: number; h: number }
  | { t: 'line'; pts: number[] };

export class Mask {
  bits: Uint8Array;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  constructor(public w: number, public h: number) {
    this.bits = new Uint8Array(w * h);
    this.x0 = w; this.y0 = h; this.x1 = -1; this.y1 = -1;
  }
  get empty() { return this.x1 < 0; }
  set(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.bits[y * this.w + x] = 1;
    if (x < this.x0) this.x0 = x;
    if (x > this.x1) this.x1 = x;
    if (y < this.y0) this.y0 = y;
    if (y > this.y1) this.y1 = y;
  }
  get(x: number, y: number): boolean {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return false;
    return this.bits[y * this.w + x] === 1;
  }
  clear(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.bits[y * this.w + x] = 0;
  }
  /** Keep only pixels also present in `other`. */
  intersect(other: Mask) {
    for (let i = 0; i < this.bits.length; i++) if (!other.bits[i]) this.bits[i] = 0;
  }
  subtract(other: Mask) {
    for (let i = 0; i < this.bits.length; i++) if (other.bits[i]) this.bits[i] = 0;
  }
}

function shapeBounds(s: Shape): [number, number, number, number] {
  switch (s.t) {
    case 'ell': return [s.x - s.rx, s.y - s.ry, s.x + s.rx, s.y + s.ry];
    case 'rect': return [s.x, s.y, s.x + s.w, s.y + s.h];
    case 'cap': {
      const r = Math.max(s.r1, s.r2 ?? s.r1);
      return [Math.min(s.x1, s.x2) - r, Math.min(s.y1, s.y2) - r, Math.max(s.x1, s.x2) + r, Math.max(s.y1, s.y2) + r];
    }
    case 'poly':
    case 'line': {
      let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
      for (let i = 0; i < s.pts.length; i += 2) {
        a = Math.min(a, s.pts[i]); c = Math.max(c, s.pts[i]);
        b = Math.min(b, s.pts[i + 1]); d = Math.max(d, s.pts[i + 1]);
      }
      return [a, b, c, d];
    }
  }
}

function pointInPoly(px: number, py: number, pts: number[]): boolean {
  let inside = false;
  const n = pts.length / 2;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = pts[i * 2], yi = pts[i * 2 + 1], xj = pts[j * 2], yj = pts[j * 2 + 1];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function capContains(s: Extract<Shape, { t: 'cap' }>, px: number, py: number): boolean {
  const dx = s.x2 - s.x1, dy = s.y2 - s.y1;
  const len2 = dx * dx + dy * dy;
  let t = len2 === 0 ? 0 : ((px - s.x1) * dx + (py - s.y1) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  const cx = s.x1 + dx * t, cy = s.y1 + dy * t;
  const r = s.r1 + ((s.r2 ?? s.r1) - s.r1) * t;
  const ex = px - cx, ey = py - cy;
  return ex * ex + ey * ey <= r * r;
}

function drawLine(m: Mask, x0: number, y0: number, x1: number, y1: number) {
  x0 = Math.floor(x0); y0 = Math.floor(y0); x1 = Math.floor(x1); y1 = Math.floor(y1);
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    m.set(x0, y0);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

/** Rasterize a shape into the mask, sampling at pixel centres. */
export function rasterize(m: Mask, s: Shape) {
  if (s.t === 'line') {
    for (let i = 0; i + 3 < s.pts.length; i += 2) drawLine(m, s.pts[i], s.pts[i + 1], s.pts[i + 2], s.pts[i + 3]);
    return;
  }
  const [a, b, c, d] = shapeBounds(s);
  const xs = Math.max(0, Math.floor(a) - 1), xe = Math.min(m.w - 1, Math.ceil(c) + 1);
  const ys = Math.max(0, Math.floor(b) - 1), ye = Math.min(m.h - 1, Math.ceil(d) + 1);
  for (let y = ys; y <= ye; y++) {
    const py = y + 0.5;
    for (let x = xs; x <= xe; x++) {
      const px = x + 0.5;
      let hit = false;
      switch (s.t) {
        case 'ell': {
          const ex = (px - s.x) / s.rx, ey = (py - s.y) / s.ry;
          hit = ex * ex + ey * ey <= 1;
          break;
        }
        case 'rect': hit = px >= s.x && px < s.x + s.w && py >= s.y && py < s.y + s.h; break;
        case 'cap': hit = capContains(s, px, py); break;
        case 'poly': hit = pointInPoly(px, py, s.pts); break;
      }
      if (hit) m.set(x, y);
    }
  }
}

export function maskOf(w: number, h: number, shapes: Shape[]): Mask {
  const m = new Mask(w, h);
  for (const s of shapes) rasterize(m, s);
  return m;
}

export function transformShape(s: Shape, px: number, py: number, scale: number, dx: number, dy: number, flip = false): Shape {
  const X = (x: number) => {
    const v = px + (x - px) * scale + dx;
    return flip ? 2 * px - v + 2 * dx : v;
  };
  const Y = (y: number) => py + (y - py) * scale + dy;
  switch (s.t) {
    case 'ell': return { t: 'ell', x: X(s.x), y: Y(s.y), rx: s.rx * scale, ry: s.ry * scale };
    case 'rect': {
      const x0 = X(s.x), x1 = X(s.x + s.w);
      return { t: 'rect', x: Math.min(x0, x1), y: Y(s.y), w: Math.abs(x1 - x0), h: s.h * scale };
    }
    case 'cap': return { t: 'cap', x1: X(s.x1), y1: Y(s.y1), x2: X(s.x2), y2: Y(s.y2), r1: s.r1 * scale, r2: (s.r2 ?? s.r1) * scale };
    case 'poly':
    case 'line': {
      const pts = s.pts.slice();
      for (let i = 0; i < pts.length; i += 2) { pts[i] = X(pts[i]); pts[i + 1] = Y(pts[i + 1]); }
      return { t: s.t, pts } as Shape;
    }
  }
}

// ---------- geometry helpers for part authors ----------

export const ell = (x: number, y: number, rx: number, ry = rx): Shape => ({ t: 'ell', x, y, rx, ry });
export const rect = (x: number, y: number, w: number, h: number): Shape => ({ t: 'rect', x, y, w, h });
export const cap = (x1: number, y1: number, x2: number, y2: number, r1: number, r2 = r1): Shape => ({ t: 'cap', x1, y1, x2, y2, r1, r2 });
export const poly = (...pts: number[]): Shape => ({ t: 'poly', pts });
export const line = (...pts: number[]): Shape => ({ t: 'line', pts });

/** Quadratic bezier flattened into points (excluding the start point). */
export function quad(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, steps = 6): number[] {
  const out: number[] = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps, u = 1 - t;
    out.push(u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1);
  }
  return out;
}

/** Build a polygon from a pen path: ['M',x,y,'L',x,y,'Q',cx,cy,x,y]. */
export function path(...cmds: (string | number)[]): Shape {
  const pts: number[] = [];
  let i = 0, cx = 0, cy = 0;
  while (i < cmds.length) {
    const c = cmds[i++];
    if (c === 'M' || c === 'L') {
      cx = cmds[i++] as number; cy = cmds[i++] as number;
      pts.push(cx, cy);
    } else if (c === 'Q') {
      const qx = cmds[i++] as number, qy = cmds[i++] as number, x = cmds[i++] as number, y = cmds[i++] as number;
      pts.push(...quad(cx, cy, qx, qy, x, y));
      cx = x; cy = y;
    }
  }
  return { t: 'poly', pts };
}

/** Mirror a polygon horizontally around x = axis. */
export function mirrorX(s: Shape, axis: number): Shape {
  return transformShape(s, axis, 0, 1, 0, 0, true);
}
