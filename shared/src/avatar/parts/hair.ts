// Hair generator. A hairstyle is data: a back length/shape, a bang style, sidelocks and
// any number of extras (tails, buns, braids...). Every piece is built around the fixed
// skull (centre 80,65 · rx 21.5 · ry 23) and never changes the head itself.

import { mirrorX, path, poly, type Shape } from '../raster';
import { LAYER, type Part } from '../compose';
import { headShapes } from './body';
import { bow, diamond, ell, star, strand } from './shapes';
import type { Skeleton } from '../skeleton';
import type { HairColor } from '../../types';
import { darken, mix } from '../color';

export type BackLen = 'none' | 'nape' | 'chin' | 'shoulder' | 'chest' | 'waist' | 'hip' | 'knee' | 'floor';
export type BackShape = 'straight' | 'wavy' | 'curly' | 'layered' | 'hime' | 'flared';
export type Bangs = 'blunt' | 'swept' | 'parted' | 'curtain' | 'spiky' | 'messy' | 'jelly' | 'wispy' | 'slick' | 'side' | 'center' | 'none';
export type Side = 'none' | 'short' | 'chin' | 'long' | 'hime' | 'jelly' | 'curl' | 'wave';

export interface HairExtra {
  t: 'ponytail' | 'twintails' | 'drills' | 'bun' | 'spacebuns' | 'braids' | 'sidebraid' | 'ahoge' | 'sidetail'
    | 'spikes' | 'float' | 'ribbon' | 'halfup' | 'puffs' | 'flipout' | 'antenna' | 'tuft';
  len?: BackLen;
  size?: number;
  color?: 'main' | 'accent';
  side?: 'L' | 'R';
}

export interface HairSpec {
  kind: 'hair';
  back: BackLen;
  shape?: BackShape;
  bangs: Bangs;
  side?: Side;
  cap?: 'round' | 'puffy' | 'spiky' | 'tall' | 'flat';
  extras?: HairExtra[];
  hairline?: number;
}

const LEN_Y: Record<BackLen, number> = {
  none: 70, nape: 90, chin: 94, shoulder: 103, chest: 114, waist: 126, hip: 136, knee: 143, floor: 153,
};

// Fringe tip lists [x, tipY, ...] for each bang style; valleys sit between the tips.
const FRINGES: Record<Exclude<Bangs, 'none'>, { tips: number[]; valley: number; hairline?: number }> = {
  blunt: { tips: [58, 70, 63, 71.5, 68, 71, 73, 72, 78, 71.5, 83, 72, 88, 71.5, 93, 72, 98, 71, 102, 70], valley: 68 },
  swept: { tips: [58, 74, 64, 73.5, 70, 73, 76, 71, 82, 70, 88, 68, 94, 66, 100, 64, 103, 66], valley: 63 },
  parted: { tips: [57, 79, 61, 76, 66, 72, 71, 67, 76, 61, 80, 57, 84, 61, 89, 67, 94, 72, 99, 76, 103, 79], valley: 58, hairline: 56 },
  curtain: { tips: [57, 81, 61, 78, 65, 73, 69, 66, 73, 60, 80, 56, 87, 60, 91, 66, 95, 73, 99, 78, 103, 81], valley: 56, hairline: 55 },
  spiky: { tips: [57, 73, 62, 76, 67, 71, 72, 75, 77, 70, 82, 75, 87, 71, 92, 75, 97, 71, 102, 74], valley: 63 },
  messy: { tips: [57, 75, 61, 71, 65, 76, 70, 70, 75, 74, 80, 69, 85, 75, 89, 70, 94, 74, 99, 70, 103, 74], valley: 64 },
  jelly: { tips: [58, 67, 63, 67.5, 68, 67, 73, 68, 78, 67.5, 83, 68, 88, 67.5, 93, 68, 98, 67, 102, 67], valley: 65.5 },
  wispy: { tips: [58, 70, 64, 74, 70, 69, 75, 74, 80, 68, 85, 74, 90, 69, 96, 74, 102, 70], valley: 62 },
  slick: { tips: [57, 66, 60, 57, 66, 52, 73, 50, 80, 49.5, 87, 50, 94, 52, 100, 57, 103, 66], valley: 50, hairline: 50 },
  side: { tips: [57, 80, 61, 79, 66, 77, 71, 74, 76, 70, 81, 66, 87, 62, 93, 60, 99, 61, 103, 65], valley: 58 },
  center: { tips: [58, 70, 63, 69, 68, 70, 73, 72, 77, 74, 80, 76, 83, 74, 87, 72, 92, 70, 97, 69, 102, 70], valley: 62 },
};

function fringePoints(b: Exclude<Bangs, 'none'>): number[] {
  const f = FRINGES[b];
  const t = f.tips;
  const pts: number[] = [56, 64];
  for (let i = 0; i < t.length; i += 2) {
    pts.push(t[i], t[i + 1]);
    if (i + 2 < t.length) {
      const mx = (t[i] + t[i + 2]) / 2;
      const my = Math.min(t[i + 1], t[i + 3]) - Math.max(1.5, (Math.min(t[i + 1], t[i + 3]) - f.valley) * 0.55);
      pts.push(mx, my);
    }
  }
  pts.push(104, 64);
  return pts;
}

function off(s: Shape, dx: number, dy: number): Shape {
  switch (s.t) {
    case 'ell': return { ...s, x: s.x + dx, y: s.y + dy };
    case 'rect': return { ...s, x: s.x + dx, y: s.y + dy };
    case 'cap': return { ...s, x1: s.x1 + dx, y1: s.y1 + dy, x2: s.x2 + dx, y2: s.y2 + dy };
    default: {
      const pts = s.pts.slice();
      for (let i = 0; i < pts.length; i += 2) { pts[i] += dx; pts[i + 1] += dy; }
      return { ...s, pts } as Shape;
    }
  }
}

function capShape(kind: HairSpec['cap'], hairline: number): Shape[] {
  // Dome over the skull that stops at the hairline so the face stays clear.
  const cx = 80, cy = 62.5, rx = 27.5, ry = 25.5;
  const arc: number[] = [];
  const spiky = kind === 'spiky';
  const steps = spiky ? 22 : 24;
  for (let i = 0; i <= steps; i++) {
    const a = (165 + (i / steps) * 210) * (Math.PI / 180);
    const boost = spiky && i % 2 === 1 && i > 1 && i < steps - 1 ? 3.5 + (i % 4) * 0.8 : 0;
    const tall = kind === 'tall' ? 3 * Math.max(0, -Math.sin(a)) : 0;
    const flat = kind === 'flat' ? -2 * Math.max(0, -Math.sin(a)) : 0;
    arc.push(cx + Math.cos(a) * (rx + boost), cy + Math.sin(a) * (ry + boost + tall + flat));
  }
  const pts = [...arc, 101.5, 72, 101, hairline + 3, 80, hairline, 59, hairline + 3, 58.5, 72];
  const shapes: Shape[] = [poly(...pts)];
  if (kind === 'puffy') {
    for (let i = 0; i <= 10; i++) {
      const a = (175 + i * 19) * (Math.PI / 180);
      shapes.push(ell(cx + Math.cos(a) * 26.5, cy + Math.sin(a) * 24.5, 5.5, 5));
    }
  }
  return shapes;
}

function sideShape(s: Side): Shape[] {
  switch (s) {
    case 'none': return [];
    case 'short': return [poly(55.5, 62, 62, 62, 62.5, 78, 60, 84, 56.5, 80, 55, 70)];
    case 'chin': return [poly(55.5, 62, 62.5, 62, 63, 84, 61.5, 92, 58.5, 89, 55, 78)];
    case 'long': return [path('M', 55.5, 62, 'L', 62.5, 62, 'Q', 64, 88, 63, 100, 'L', 60.5, 112, 'Q', 57, 102, 56, 92, 'Q', 54, 76, 55.5, 62)];
    case 'hime': return [poly(55, 62, 62.5, 62, 62.5, 94, 55, 94)];
    case 'jelly': return [poly(55, 62, 62.5, 62, 62.5, 84, 55, 84)];
    case 'curl': return [path('M', 55.5, 62, 'L', 62.5, 62, 'Q', 64, 84, 62, 96, 'L', 56, 96, 'Q', 54, 80, 55.5, 62), ell(59, 99, 4.2, 5)];
    case 'wave': return [path('M', 55.5, 62, 'L', 62.5, 62, 'Q', 60, 74, 63, 84, 'Q', 65, 94, 61, 104, 'Q', 58, 96, 57, 88, 'Q', 52, 78, 55.5, 62)];
  }
}

function backShape(len: BackLen, shape: BackShape): Shape[] {
  if (len === 'none') return [ell(80, 62.5, 27.5, 25.5)];
  const by = LEN_Y[len];
  const flare = Math.min(7, Math.max(0, (by - 80) * 0.09)) + (shape === 'flared' ? 4 : 0);
  const L = 53 - flare, R = 107 + flare;
  const out: Shape[] = [ell(80, 62.5, 27.5, 25.5)];
  const side: number[] = [];
  const n = 6;
  // Left side going down.
  for (let i = 0; i <= n; i++) {
    const t = i / n, y = 66 + (by - 66) * t;
    let x = 53 + (L - 53) * t;
    if (shape === 'wavy') x += Math.sin(t * Math.PI * 3) * 2;
    side.push(x, y);
  }
  // Bottom edge.
  const bottom: number[] = [];
  const tips = shape === 'layered' ? 7 : shape === 'hime' ? 1 : 5;
  if (shape === 'hime') bottom.push(L, by, R, by);
  else {
    for (let i = 0; i <= tips * 2; i++) {
      const x = L + ((R - L) * i) / (tips * 2);
      const tip = i % 2 === 0;
      let y = by + (tip ? 1 : -2.5);
      if (shape === 'layered') y = by + (tip ? 0 : -6) - Math.abs(i - tips) * 0.6;
      if (shape === 'wavy') y = by + (tip ? 0 : -2);
      bottom.push(x, y);
    }
  }
  const right: number[] = [];
  for (let i = n; i >= 0; i--) {
    const t = i / n, y = 66 + (by - 66) * t;
    let x = 107 + (R - 107) * t;
    if (shape === 'wavy') x -= Math.sin(t * Math.PI * 3) * 2;
    right.push(x, y);
  }
  out.push(poly(...side, ...bottom, ...right));
  if (shape === 'curly') {
    for (let y = 72; y <= by; y += 7) {
      const t = (y - 66) / (by - 66);
      out.push(ell(53 + (L - 53) * t - 1, y, 4, 4.2), ell(107 + (R - 107) * t + 1, y, 4, 4.2));
    }
    for (let x = L + 3; x <= R - 3; x += 7) out.push(ell(x, by - 1, 4.2, 4));
  }
  if (shape === 'flared' || len === 'nape') {
    out.push(path('M', L, by - 8, 'Q', L - 5, by - 2, L - 6, by + 1, 'Q', L - 1, by, L + 3, by - 2));
    out.push(path('M', R, by - 8, 'Q', R + 5, by - 2, R + 6, by + 1, 'Q', R + 1, by, R - 3, by - 2));
  }
  return out;
}

function tailShape(len: BackLen, side: 'L' | 'R', size = 1, low = false): Shape[] {
  const by = LEN_Y[len === 'none' ? 'chest' : len];
  const ax = 61, ay = low ? 70 : 52;
  const w = 9 * size;
  const s: Shape = path(
    'M', ax + 2, ay - 3,
    'Q', ax - w * 2.1, ay - 2, ax - w * 1.7, ay + 22,
    'Q', ax - w * 1.5, by - 12, ax - w * 0.6, by,
    'Q', ax - w * 0.7, by - 18, ax - w * 0.2, ay + 26,
    'Q', ax, ay + 10, ax + 4, ay + 4,
  );
  return [side === 'L' ? s : mirrorX(s, 80)];
}

function drillShape(len: BackLen, side: 'L' | 'R', size = 1): Shape[] {
  const by = LEN_Y[len === 'none' ? 'chest' : len];
  const out: Shape[] = [];
  let y = 60, x = 54, r = 7 * size;
  while (y < by - 2) {
    out.push(ell(x, y, r, r * 0.78));
    y += r * 1.25;
    x += 0.4;
    r = Math.max(3.4, r - 0.45);
  }
  out.push(path('M', 61, 52, 'Q', 52, 52, 50, 60, 'L', 58, 62));
  return side === 'L' ? out : out.map((s) => mirrorX(s, 80));
}

function braidChain(x0: number, y0: number, x1: number, y1: number, r = 3.2): Shape[] {
  const out: Shape[] = [];
  const n = Math.max(2, Math.round(Math.hypot(x1 - x0, y1 - y0) / (r * 1.5)));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const rr = r * (1 - t * 0.25);
    out.push(ell(x0 + (x1 - x0) * t + (i % 2 ? 0.6 : -0.6), y0 + (y1 - y0) * t, rr, rr * 0.85));
  }
  return out;
}

export function hairColorFn(hc: HairColor, top: number, bottom: number, layer: 'front' | 'back', hx: number) {
  const { main, accent, mode } = hc;
  switch (mode) {
    case 'solid': return () => main;
    case 'split': return (x: number) => (x < 80 + hx ? main : accent);
    case 'underlight': return () => (layer === 'back' ? accent : main);
    case 'streaks': return (x: number, y: number) => {
      // Two face-framing streaks that drift outward as they fall.
      const rx = x - hx - (y - top) * 0.12;
      return (rx >= 60 && rx <= 64) || (rx >= 88 && rx <= 91) ? accent : main;
    };
    case 'ombre':
    case 'tips': {
      const start = mode === 'ombre' ? top + (bottom - top) * 0.45 : top + (bottom - top) * 0.72;
      const mid = mix(main, accent, 0.5);
      return (x: number, y: number) => {
        if (y < start) return main;
        if (y < start + 3) return (x + y) % 2 === 0 ? mid : main;
        if (y < start + 6) return mid;
        if (y < start + 8) return (x + y) % 2 === 0 ? accent : mid;
        return accent;
      };
    }
  }
}

export function hairParts(spec: HairSpec, hc: HairColor, sk: Skeleton, tag: string): Part[] {
  const hx = sk.head.x, hy = sk.head.y;
  const move = (s: Shape) => off(s, hx, hy);
  const parts: Part[] = [];
  const shape = spec.shape ?? 'straight';
  const bangs = spec.bangs;
  const hairline = spec.hairline ?? (bangs === 'none' ? 52 : FRINGES[bangs].hairline ?? 60);
  const extras = spec.extras ?? [];
  let bottom = LEN_Y[spec.back];
  for (const e of extras) if (e.len) bottom = Math.max(bottom, LEN_Y[e.len]);
  const topY = 40 + hy;
  const front = hairColorFn(hc, topY, bottom + hy, 'front', hx);
  const back = hairColorFn(hc, topY, bottom + hy, 'back', hx);
  const accentFn = () => hc.accent;
  const pivot = { x: 80 + hx, y: 64 + hy };

  // ---- back hair ----
  parts.push({ layer: LAYER.hairBack, tag, pivot, color: back, shapes: backShape(spec.back, shape).map(move) });

  for (const e of extras) {
    const color = e.color === 'accent' ? accentFn : back;
    const len = e.len ?? 'chest';
    switch (e.t) {
      case 'ponytail': {
        const by = LEN_Y[len];
        const s = path('M', 92, 50, 'Q', 116, 40, 114, 66, 'Q', 112, by - 14, 104, by, 'Q', 106, by - 20, 100, 70, 'Q', 96, 60, 90, 56);
        parts.push({ layer: LAYER.hairBack + 0.1, tag, pivot, color, shapes: [move(e.side === 'L' ? mirrorX(s, 80) : s)] });
        parts.push({ layer: LAYER.hairBack + 0.2, tag, pivot, color: () => hc.accent, shade: 0, shapes: [move(e.side === 'L' ? ell(68, 47, 3, 3.5) : ell(92, 47, 3, 3.5))] });
        break;
      }
      case 'twintails':
        parts.push({ layer: LAYER.hairBack + 0.1, tag, pivot, color, shapes: [...tailShape(len, 'L', e.size), ...tailShape(len, 'R', e.size)].map(move) });
        parts.push({ layer: LAYER.hairFront + 0.3, tag, pivot, color: () => hc.accent, shade: 0, shapes: [ell(61, 52, 3, 3.6), ell(99, 52, 3, 3.6)].map(move) });
        break;
      case 'drills':
        parts.push({ layer: LAYER.hairBack + 0.1, tag, pivot, color, shapes: [...drillShape(len, 'L', e.size), ...drillShape(len, 'R', e.size)].map(move) });
        break;
      case 'sidetail': {
        const sd = e.side ?? 'L';
        parts.push({ layer: LAYER.hairBack + 0.1, tag, pivot, color, shapes: tailShape(len, sd, e.size ?? 1.1).map(move) });
        parts.push({ layer: LAYER.hairFront + 0.3, tag, pivot, color: () => hc.accent, shade: 0, shapes: [move(sd === 'L' ? ell(61, 52, 3, 3.6) : ell(99, 52, 3, 3.6))] });
        break;
      }
      case 'bun':
        parts.push({ layer: LAYER.hairBack + 0.2, tag, pivot, color: e.color === 'accent' ? accentFn : front, shapes: [move(ell(80, 39, 9 * (e.size ?? 1), 7.5 * (e.size ?? 1)))] });
        break;
      case 'halfup':
        parts.push({ layer: LAYER.hairBack + 0.2, tag, pivot, color: front, shapes: [move(ell(80, 41, 6.5, 5.5))] });
        break;
      case 'spacebuns':
        parts.push({ layer: LAYER.hairBack + 0.2, tag, pivot, color: e.color === 'accent' ? accentFn : front, shapes: [ell(61, 45, 7.5, 7), ell(99, 45, 7.5, 7)].map(move) });
        parts.push({ layer: LAYER.hairBack + 0.25, tag, pivot, color: front, tone: 'line', edge: false, shapes: [ell(61, 45, 1, 1), ell(99, 45, 1, 1)].map(move) });
        break;
      case 'puffs':
        parts.push({ layer: LAYER.hairBack + 0.2, tag, pivot, color: front, shapes: [ell(56, 50, 9, 9), ell(104, 50, 9, 9), ell(53, 58, 6, 6), ell(107, 58, 6, 6)].map(move) });
        break;
      case 'braids':
        parts.push({ layer: LAYER.hairFront + 0.1, tag, pivot, color: front, shapes: [...braidChain(59, 80, 58, LEN_Y[len]), ...braidChain(101, 80, 102, LEN_Y[len])].map(move) });
        parts.push({ layer: LAYER.hairFront + 0.15, tag, pivot, color: () => hc.accent, shade: 0, shapes: [ell(58, LEN_Y[len] + 2, 2.5, 2), ell(102, LEN_Y[len] + 2, 2.5, 2)].map(move) });
        break;
      case 'sidebraid':
        parts.push({ layer: LAYER.hairFront + 0.1, tag, pivot, color: front, shapes: braidChain(e.side === 'R' ? 101 : 59, 78, e.side === 'R' ? 99 : 61, LEN_Y[len], 3.6).map(move) });
        break;
      case 'ahoge':
        parts.push({ layer: LAYER.hairFront + 0.05, tag, pivot, color: front, shapes: [move(strand(80, 42, 79, 30, 88, 31, 1.8, 0.5))] });
        break;
      case 'antenna':
        parts.push({ layer: LAYER.hairFront + 0.05, tag, pivot, color: front, shapes: [move(strand(76, 42, 70, 30, 66, 33, 1.6, 0.5)), move(strand(84, 42, 90, 30, 94, 33, 1.6, 0.5))] });
        break;
      case 'tuft':
        parts.push({ layer: LAYER.hairFront + 0.05, tag, pivot, color: front, shapes: [move(poly(72, 44, 78, 30, 82, 42)), move(poly(80, 42, 88, 31, 89, 44))] });
        break;
      case 'spikes':
        parts.push({ layer: LAYER.hairBack + 0.1, tag, pivot, color: back, shapes: [poly(56, 56, 44, 50, 54, 66), poly(104, 56, 116, 50, 106, 66), poly(56, 74, 46, 82, 58, 80), poly(104, 74, 114, 82, 102, 80), poly(62, 46, 54, 34, 70, 42), poly(98, 46, 106, 34, 90, 42)].map(move) });
        break;
      case 'flipout':
        parts.push({ layer: LAYER.hairBack + 0.1, tag, pivot, color: back, shapes: [path('M', 56, 88, 'Q', 50, 96, 45, 95, 'Q', 52, 92, 54, 84), path('M', 104, 88, 'Q', 110, 96, 115, 95, 'Q', 108, 92, 106, 84)].map(move) });
        break;
      case 'float': {
        const shapes = [diamond(48, 58, 2.5, 5), diamond(112, 62, 2.5, 5), star(46, 80, 4), star(114, 86, 3.5), diamond(52, 100, 2, 4), diamond(108, 106, 2, 4)];
        parts.push({ layer: LAYER.hairBack - 0.2, tag, pivot, color: () => hc.accent, alpha: 0.85, shade: 0, shapes: shapes.map(move) });
        break;
      }
      case 'ribbon': {
        const at = e.side === 'L' ? { x: 60, y: 49 } : e.side === 'R' ? { x: 100, y: 49 } : { x: 80, y: 40 };
        parts.push({ layer: LAYER.hairFront + 0.4, tag, pivot, color: () => hc.accent, shapes: bow(at.x, at.y, e.size ?? 1).map(move) });
        parts.push({ layer: LAYER.hairFront + 0.41, tag, pivot, color: () => darken(hc.accent, 0.1), shapes: [move(ell(at.x, at.y + 0.5, 2, 2))] });
        break;
      }
    }
  }

  // ---- front hair: cap + bangs + sidelocks, as one silhouette ----
  const frontShapes: Shape[] = [...capShape(spec.cap ?? 'round', hairline)];
  let bangPoly: Shape | null = null;
  if (bangs !== 'none') {
    bangPoly = poly(...fringePoints(bangs), 104, 52, 92, 44, 80, 42, 68, 44, 56, 52);
    frontShapes.push(bangPoly);
  }
  const sideShapes = sideShape(spec.side ?? 'short');
  frontShapes.push(...sideShapes, ...sideShapes.map((s) => mirrorX(s, 80)));
  parts.push({
    layer: LAYER.hairFront, tag, pivot, color: front,
    gloss: { cx: 80 + hx, cy: 66 + hy, rx: 21, ry: 19.5, w: 1.1 },
    shapes: frontShapes.map(move),
  });

  // Strand lines from the crown toward each fringe tip give the bangs definition.
  if (bangs !== 'none' && bangs !== 'slick') {
    const t = FRINGES[bangs].tips;
    const lines: Shape[] = [];
    for (let i = 2; i < t.length - 2; i += 4) {
      const x = t[i], y = t[i + 1];
      lines.push(strand(80 + (x - 80) * 0.35, 50, 80 + (x - 80) * 0.8, (50 + y) / 2, x, y - 2.5, 0.55, 0.4));
    }
    parts.push({ layer: LAYER.hairFront + 0.02, tag, pivot, color: front, tone: 'shade', edge: false, shapes: lines.map(move) });
  }

  // Shadow cast by the bangs onto the forehead.
  if (bangPoly) {
    parts.push({
      layer: LAYER.face + 0.02, tag, pivot, color: '#000000', alpha: 0.13, edge: false, shade: 0, tone: 'base',
      shapes: [move(off(bangPoly, 0, 2.5))], clip: headShapes(sk), clipNoTurn: true,
    });
  }
  return parts;
}
