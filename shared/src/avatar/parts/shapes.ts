// Reusable decorative shapes shared by several part generators.

import { cap, ell, path, poly, type Shape } from '../raster';

export function bow(x: number, y: number, s = 1): Shape[] {
  return [
    path('M', x, y, 'Q', x - 5 * s, y - 6 * s, x - 9 * s, y - 3 * s, 'Q', x - 10 * s, y + 2 * s, x - 7 * s, y + 4 * s, 'Q', x - 3 * s, y + 3 * s, x, y),
    path('M', x, y, 'Q', x + 5 * s, y - 6 * s, x + 9 * s, y - 3 * s, 'Q', x + 10 * s, y + 2 * s, x + 7 * s, y + 4 * s, 'Q', x + 3 * s, y + 3 * s, x, y),
    poly(x - 1 * s, y + 1, x - 4 * s, y + 8 * s, x - 1.5 * s, y + 7 * s),
    poly(x + 1 * s, y + 1, x + 4 * s, y + 8 * s, x + 1.5 * s, y + 7 * s),
  ];
}

export function bowKnot(x: number, y: number, s = 1): Shape {
  return ell(x, y + 0.5, 2 * s, 2 * s);
}

export function star(x: number, y: number, r: number, inner = 0.45, points = 5, rot = -Math.PI / 2): Shape {
  const pts: number[] = [];
  for (let i = 0; i < points * 2; i++) {
    const a = rot + (i * Math.PI) / points;
    const rr = i % 2 === 0 ? r : r * inner;
    pts.push(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  return { t: 'poly', pts };
}

export function heart(x: number, y: number, s: number): Shape[] {
  return [
    ell(x - s * 0.5, y - s * 0.2, s * 0.55, s * 0.55),
    ell(x + s * 0.5, y - s * 0.2, s * 0.55, s * 0.55),
    poly(x - s * 1.02, y, x + s * 1.02, y, x, y + s * 1.1),
  ];
}

export function flower(x: number, y: number, r: number, petals = 5): Shape[] {
  const out: Shape[] = [];
  for (let i = 0; i < petals; i++) {
    const a = (i / petals) * Math.PI * 2 - Math.PI / 2;
    out.push(ell(x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7, r * 0.55, r * 0.55));
  }
  return out;
}

export function diamond(x: number, y: number, w: number, h: number): Shape {
  return poly(x, y - h, x + w, y, x, y + h, x - w, y);
}

export function crescent(x: number, y: number, r: number): Shape[] {
  return [ell(x, y, r, r)];
}

export function strand(x0: number, y0: number, cx: number, cy: number, x1: number, y1: number, w0: number, w1 = 0.6): Shape {
  // A tapered curved strand built from short capsules.
  const pts: number[] = [];
  const steps = 8;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, u = 1 - t;
    pts.push(u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1);
  }
  const left: number[] = [], right: number[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = pts[i * 2], y = pts[i * 2 + 1];
    const nx = pts[Math.min(steps, i + 1) * 2] - pts[Math.max(0, i - 1) * 2];
    const ny = pts[Math.min(steps, i + 1) * 2 + 1] - pts[Math.max(0, i - 1) * 2 + 1];
    const len = Math.hypot(nx, ny) || 1;
    const w = w0 + (w1 - w0) * (i / steps);
    left.push(x - (ny / len) * w, y + (nx / len) * w);
    right.push(x + (ny / len) * w, y - (nx / len) * w);
  }
  const outPts = [...left];
  for (let i = right.length - 2; i >= 0; i -= 2) outPts.push(right[i], right[i + 1]);
  return { t: 'poly', pts: outPts };
}

export { cap, ell, path, poly };
