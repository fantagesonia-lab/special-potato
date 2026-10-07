// THE MODEL SHEET TABLE.
//
// All avatar geometry (body, face, every cosmetic) is authored in a normalized
// template space. Before rasterizing, every shape passes through this landmark map,
// which carries it into the measured proportions of the reference model sheet
// (client/public/reference/model-sheet.jpg, measured with a pixel grid on four
// characters). Changing proportions therefore happens in exactly one place, and
// all cosmetics follow automatically. After approval this table is locked.
//
// Reference ratios (skull top = 0 … sole = 1), averaged over the sheet:
//   eye centre .36 · mouth .42 · chin .45 · shoulders .49 · waist .66 · crotch .76 · ankle .96
//   face width (no ears) .41 · eye 10%×11% of height · eye centres 19.5% apart

import type { Shape } from './raster';

/** [template y, model y] pairs. Monotonic. */
export const Y_LANDMARKS: [number, number][] = [
  [0, 0],
  [42, 42], // skull top
  [65, 66.5], // widest part of the skull
  [77, 80.5], // eye centre
  [89.5, 91.5], // chin
  [92, 94.5], // shoulders
  [109, 113], // waist
  [121, 124], // crotch
  [133, 136], // knee
  [145, 146.5], // ankle
  [150, 150], // sole
  [160, 160],
];

/** Horizontal scale around the centre line, by template y. */
export const X_SCALE: [number, number][] = [
  [0, 1.05],
  [89.5, 1.05], // head: face 45px wide
  [92, 1.2], // torso: ~26px across the shoulders
  [121, 1.2],
  [126, 1.15], // legs: ~10px each, chunky like the sheet
  [160, 1.15],
];

/**
 * 3/4 view. The model faces the viewer's left, like every character on the sheet.
 * Template geometry is authored facing front; this warp slides each band's surface
 * toward the left by up to `k` px at its centre line while its silhouette edges (±R)
 * stay put, which compresses the far side and widens the near side. Measured on the
 * sheet: far eye 0.18, near eye 0.68 across the face; far/near eye width ≈ 0.7.
 * [template y, k, R]
 */
export const TURN: [number, number, number][] = [
  [0, 5, 26],
  [84, 5, 26], // head
  [88, 1.5, 12], // neck sits under the chin
  [94, 3, 14], // shoulders
  [121, 3.5, 14], // torso: belt buckles land at x≈76 like the sheet
  [128, 1.5, 12], // legs
  [160, 1.5, 12],
];

const CX = 80;

function turnParams(y: number): [number, number] {
  const t = TURN;
  if (y <= t[0][0]) return [t[0][1], t[0][2]];
  for (let i = 1; i < t.length; i++) {
    if (y <= t[i][0]) {
      const f = (y - t[i - 1][0]) / (t[i][0] - t[i - 1][0]);
      return [t[i - 1][1] + f * (t[i][1] - t[i - 1][1]), t[i - 1][2] + f * (t[i][2] - t[i - 1][2])];
    }
  }
  const l = t[t.length - 1];
  return [l[1], l[2]];
}

/** Turn a template x toward the 3/4 view (template space in, template space out). */
export function turnX(x: number, y: number): number {
  const [k, R] = turnParams(y);
  const u = (x - CX) / R;
  if (u <= -1 || u >= 1) return x;
  return x - k * (1 - u * u);
}

/** Local horizontal stretch of the turn (for radii). */
function turnScale(x: number, y: number): number {
  const [k, R] = turnParams(y);
  const u = (x - CX) / R;
  if (u <= -1 || u >= 1) return 1;
  return 1 + (2 * k * u) / R;
}

function interp(table: [number, number][], v: number): number {
  if (v <= table[0][0]) return table[0][1] + (v - table[0][0]);
  for (let i = 1; i < table.length; i++) {
    const [a0, b0] = table[i - 1], [a1, b1] = table[i];
    if (v <= a1) return b0 + ((v - a0) / (a1 - a0)) * (b1 - b0);
  }
  const [a, b] = table[table.length - 1];
  return b + (v - a);
}

function interpScale(v: number): number {
  const t = X_SCALE;
  if (v <= t[0][0]) return t[0][1];
  for (let i = 1; i < t.length; i++) {
    if (v <= t[i][0]) return t[i - 1][1] + ((v - t[i - 1][0]) / (t[i][0] - t[i - 1][0])) * (t[i][1] - t[i - 1][1]);
  }
  return t[t.length - 1][1];
}

export function mapY(y: number): number { return interp(Y_LANDMARKS, y); }
const Y_INVERSE: [number, number][] = Y_LANDMARKS.map(([a, b]) => [b, a]);
export function unmapY(y: number): number { return interp(Y_INVERSE, y); }
/** Model space → template space (no turn). Used to author 3/4 features directly in measured coordinates. */
export function fromModel(x: number, y: number): [number, number] {
  const ty = unmapY(y);
  return [CX + (x - CX) / interpScale(ty), ty];
}
export function mapX(x: number, y: number): number { return CX + (x - CX) * interpScale(y); }
export function mapPoint(p: { x: number; y: number }, turn = true): { x: number; y: number } {
  const x = turn ? turnX(p.x, p.y) : p.x;
  return { x: mapX(x, p.y), y: mapY(p.y) };
}
function slopeY(y: number, r: number): number {
  return (mapY(y + r) - mapY(y - r)) / (2 * r || 1);
}

export function mapShape(s: Shape, turn = true): Shape {
  const tx = (x: number, y: number) => (turn ? turnX(x, y) : x);
  const ts = (x: number, y: number) => (turn ? turnScale(x, y) : 1);
  switch (s.t) {
    case 'ell': {
      const sx = interpScale(s.y) * ts(s.x, s.y);
      return { t: 'ell', x: mapX(tx(s.x, s.y), s.y), y: mapY(s.y), rx: s.rx * sx, ry: s.ry * slopeY(s.y, s.ry) };
    }
    case 'rect': {
      // Rects become polygons so the turn can skew them.
      const ym = s.y + s.h / 2;
      const pts = [s.x, s.y, s.x + s.w, s.y, s.x + s.w, s.y + s.h, s.x, s.y + s.h];
      if (!turn) {
        const x0 = mapX(s.x, ym), x1 = mapX(s.x + s.w, ym);
        return { t: 'rect', x: x0, y: mapY(s.y), w: Math.max(0.5, x1 - x0), h: Math.max(0.5, mapY(s.y + s.h) - mapY(s.y)) };
      }
      for (let i = 0; i < pts.length; i += 2) { const x = pts[i], y = pts[i + 1]; pts[i] = mapX(tx(x, y), y); pts[i + 1] = mapY(y); }
      // Tiny rects (buttons, studs) keep at least one pixel.
      if (s.w < 1.5 || s.h < 1.5) {
        const cx = (pts[0] + pts[2]) / 2, cy = (pts[1] + pts[5]) / 2;
        return { t: 'rect', x: cx - Math.max(0.5, s.w * interpScale(ym)) / 2, y: cy - Math.max(0.5, s.h) / 2, w: Math.max(0.5, s.w * interpScale(ym)), h: Math.max(0.5, mapY(s.y + s.h) - mapY(s.y)) };
      }
      return { t: 'poly', pts };
    }
    case 'cap':
      return {
        t: 'cap',
        x1: mapX(tx(s.x1, s.y1), s.y1), y1: mapY(s.y1), x2: mapX(tx(s.x2, s.y2), s.y2), y2: mapY(s.y2),
        r1: s.r1 * interpScale(s.y1), r2: (s.r2 ?? s.r1) * interpScale(s.y2),
      };
    case 'poly':
    case 'line': {
      const pts = s.pts.slice();
      for (let i = 0; i < pts.length; i += 2) {
        const x = pts[i], y = pts[i + 1];
        pts[i] = mapX(tx(x, y), y);
        pts[i + 1] = mapY(y);
      }
      return { t: s.t, pts } as Shape;
    }
  }
}
