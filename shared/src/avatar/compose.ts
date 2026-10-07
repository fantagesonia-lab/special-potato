// Layer compositing. Part generators emit `Part`s; this module sorts them by layer,
// rasterizes them and applies the shared pixel-art treatment (edge line + shade band).

import { hexToRgb, ramp, type RGB } from './color';
import { Mask, maskOf, transformShape, type Shape } from './raster';
import { FRAME_H, FRAME_W } from './skeleton';

/**
 * Render order. Fractional values let related pieces interleave
 * (e.g. arms sit above torso clothing but below sleeves).
 */
export const LAYER = {
  backFx: 0,
  backAcc: 1,
  hairBack: 2,
  clothBack: 3,
  body: 4,
  socks: 5,
  bottom: 6,
  shoes: 7,
  undershirt: 8,
  top: 9,
  dress: 9.2,
  bottomOver: 9.5,
  jacket: 10,
  dressOverlay: 10.3,
  belt: 10.4,
  bag: 10.5,
  arms: 10.6,
  sleeves: 10.7,
  jacketSleeves: 10.8,
  hands: 10.9,
  gloves: 10.95,
  neck: 12,
  face: 13,
  faceFeature: 13.5,
  faceCosmetic: 14,
  hairFront: 15,
  glasses: 16,
  earrings: 17,
  headwear: 18,
  hairOverHat: 18.5,
  frontAcc: 19,
  handheld: 20,
  holdHand: 20.1,
  frontFx: 21,
} as const;

export type LayerName = keyof typeof LAYER;

export type PatternKind = 'stripes' | 'hstripes' | 'dots' | 'checks' | 'plaid' | 'hearts' | 'stars' | 'diamonds' | 'lace' | 'motif';

export interface Pattern {
  kind: PatternKind;
  color: string;
  every?: number;
  /** Bitmap motif for kind 'motif'. Characters map through `pal`. */
  rows?: string[];
  pal?: Record<string, string>;
}

export interface Bitmap {
  x: number;
  y: number;
  rows: string[];
  pal: Record<string, string | null>;
  flipX?: boolean;
  /** When true, (x, y) is the bitmap's centre instead of its top-left corner. */
  center?: boolean;
}

export interface Part {
  layer: number;
  /** Item id (or 'base') for bounding boxes and layer toggles in the Avatar Lab. */
  tag?: string;
  shapes?: Shape[];
  cut?: Shape[];
  clip?: Shape[];
  /** Base colour, or a per-pixel colour function (hair colour modes). */
  color?: string | ((x: number, y: number) => string);
  /** Draw a darker 1px line around the mask (default true). */
  edge?: boolean;
  /** Override line colour. */
  edgeColor?: string;
  /** Shade band width on the lower-right edges (default 2, 0 disables). */
  shade?: number;
  /** Glossy highlight arc (hair, patent shoes). */
  gloss?: { cx: number; cy: number; rx: number; ry: number; w?: number };
  /** Fill the whole mask with one ramp tone. */
  tone?: 'line' | 'shade' | 'base' | 'light';
  pattern?: Pattern;
  bitmap?: Bitmap;
  alpha?: number;
  /** Pivot for item fit transforms. */
  pivot?: { x: number; y: number };
  /** Geometry already authored in the 3/4 view (skip the turn warp). */
  noTurn?: boolean;
  /** Clip shapes are already in the 3/4 view (e.g. the head silhouette). */
  clipNoTurn?: boolean;
}

export interface ComposeOptions {
  hiddenLayers?: Set<number>;
  hiddenTags?: Set<string>;
  fits?: Record<string, { dx?: number; dy?: number; scale?: number }>;
}

export interface Composed {
  data: Uint8ClampedArray;
  w: number;
  h: number;
  bounds: Record<string, [number, number, number, number]>;
}

const rgbCache = new Map<string, RGB>();
function rgb(hex: string): RGB {
  let v = rgbCache.get(hex);
  if (!v) { v = hexToRgb(hex); rgbCache.set(hex, v); }
  return v;
}

function patternHit(p: Pattern, x: number, y: number): string | null {
  const e = p.every ?? 4;
  switch (p.kind) {
    case 'stripes': return x % e === 0 ? p.color : null;
    case 'hstripes': return y % e === 0 ? p.color : null;
    case 'dots': return x % e === 0 && y % e === 0 && ((x / e + y / e) % 2 === 0) ? p.color : null;
    case 'checks': return (Math.floor(x / e) + Math.floor(y / e)) % 2 === 0 ? p.color : null;
    case 'plaid': return x % e === 0 || y % e === 0 ? p.color : null;
    case 'diamonds': return (x + y) % e === 0 || (x - y + 1000) % e === 0 ? p.color : null;
    case 'lace': return (y % 3 === 0 && x % 2 === 0) ? p.color : null;
    case 'hearts':
    case 'stars':
    case 'motif': {
      const rows = p.rows ?? (p.kind === 'hearts' ? HEART : STAR);
      const pal = p.pal ?? { o: p.color };
      const h = rows.length, w = rows[0].length;
      const tx = e + w, ty = e + h;
      const row = Math.floor(y / ty);
      const ox = (x + (row % 2) * Math.floor(tx / 2)) % tx;
      const oy = y % ty;
      if (ox >= w || oy >= h) return null;
      const ch = rows[oy][ox];
      return ch === '.' ? null : (pal[ch] ?? p.color);
    }
  }
}

const HEART = ['o.o', 'ooo', '.o.'];
const STAR = ['.o.', 'ooo', '.o.'];

/** Rasterize parts into an RGBA buffer. */
export function composeParts(parts: Part[], opts: ComposeOptions = {}): Composed {
  const W = FRAME_W, H = FRAME_H;
  const data = new Uint8ClampedArray(W * H * 4);
  const bounds: Composed['bounds'] = {};
  const ordered = parts.map((p, i) => ({ p, i })).sort((a, b) => a.p.layer - b.p.layer || a.i - b.i);

  const put = (x: number, y: number, c: RGB, a = 1) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const o = (y * W + x) * 4;
    if (a >= 1) {
      data[o] = c[0]; data[o + 1] = c[1]; data[o + 2] = c[2]; data[o + 3] = 255;
    } else {
      const da = data[o + 3] / 255;
      const oa = a + da * (1 - a);
      if (oa <= 0) return;
      data[o] = (c[0] * a + data[o] * da * (1 - a)) / oa;
      data[o + 1] = (c[1] * a + data[o + 1] * da * (1 - a)) / oa;
      data[o + 2] = (c[2] * a + data[o + 2] * da * (1 - a)) / oa;
      data[o + 3] = oa * 255;
    }
  };

  const grow = (tag: string | undefined, x0: number, y0: number, x1: number, y1: number) => {
    if (!tag) return;
    const b = bounds[tag];
    if (!b) bounds[tag] = [x0, y0, x1, y1];
    else { b[0] = Math.min(b[0], x0); b[1] = Math.min(b[1], y0); b[2] = Math.max(b[2], x1); b[3] = Math.max(b[3], y1); }
  };

  for (const { p } of ordered) {
    if (opts.hiddenLayers?.has(p.layer)) continue;
    if (p.tag && opts.hiddenTags?.has(p.tag)) continue;
    const fit = p.tag ? opts.fits?.[p.tag] : undefined;
    const pv = p.pivot ?? { x: 80, y: 96 };
    const tf = (s: Shape) => (fit ? transformShape(s, pv.x, pv.y, fit.scale ?? 1, fit.dx ?? 0, fit.dy ?? 0) : s);

    if (p.bitmap) {
      const b = p.bitmap;
      const w = b.rows[0]?.length ?? 0;
      const ox = b.center ? b.x - w / 2 : b.x, oy = b.center ? b.y - b.rows.length / 2 : b.y;
      const bx = Math.round(ox + (fit?.dx ?? 0)), by = Math.round(oy + (fit?.dy ?? 0));
      for (let r = 0; r < b.rows.length; r++) {
        for (let c = 0; c < w; c++) {
          const ch = b.rows[r][b.flipX ? w - 1 - c : c];
          const col = b.pal[ch];
          if (!col) continue;
          put(bx + c, by + r, rgb(col), p.alpha ?? 1);
        }
      }
      grow(p.tag, bx, by, bx + w, by + b.rows.length);
      continue;
    }
    if (!p.shapes?.length) continue;
    const m = maskOf(W, H, p.shapes.map(tf));
    if (p.cut?.length) m.subtract(maskOf(W, H, p.cut.map(tf)));
    if (p.clip?.length) m.intersect(maskOf(W, H, p.clip.map(tf)));
    if (m.empty) continue;
    grow(p.tag, m.x0, m.y0, m.x1 + 1, m.y1 + 1);
    paintMask(m, p, put);
  }
  return { data, w: W, h: H, bounds };
}

function paintMask(m: Mask, p: Part, put: (x: number, y: number, c: RGB, a?: number) => void) {
  const edge = p.edge !== false;
  const sw = p.shade ?? 2;
  const colorAt = typeof p.color === 'function' ? p.color : () => (p.color as string) ?? '#ff00ff';
  const edgeRamp = p.edgeColor ? rgb(p.edgeColor) : null;
  const a = p.alpha ?? 1;
  const g = p.gloss;
  for (let y = m.y0; y <= m.y1; y++) {
    for (let x = m.x0; x <= m.x1; x++) {
      if (!m.get(x, y)) continue;
      const hex = colorAt(x, y);
      const r = ramp(hex);
      if (p.tone) { put(x, y, r[p.tone], a); continue; }
      const isEdge = edge && (!m.get(x - 1, y) || !m.get(x + 1, y) || !m.get(x, y - 1) || !m.get(x, y + 1));
      if (isEdge) { put(x, y, edgeRamp ?? r.line, a); continue; }
      let c: RGB = r.base;
      if (p.pattern) {
        const ph = patternHit(p.pattern, x, y);
        if (ph) c = rgb(ph);
      }
      if (sw > 0) {
        let shaded = false;
        for (let k = 1; k <= sw + 1 && !shaded; k++) if (!m.get(x + k, y) || !m.get(x, y + k)) shaded = true;
        if (shaded) c = c === r.base ? r.shade : ramp(rgbHex(c)).shade;
      }
      if (g) {
        const ex = (x + 0.5 - g.cx) / g.rx, ey = (y + 0.5 - g.cy) / g.ry;
        const d = Math.sqrt(ex * ex + ey * ey);
        const w = (g.w ?? 1.2) / Math.min(g.rx, g.ry);
        // Two short arcs either side of the crown read as a glossy highlight.
        const ax = Math.abs(ex) / (d || 1);
        if (Math.abs(d - 1) <= w && y + 0.5 < g.cy && ax > 0.22 && ax < 0.8) c = r.light;
      }
      put(x, y, c, a);
    }
  }
}

function rgbHex(c: RGB): string {
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}
