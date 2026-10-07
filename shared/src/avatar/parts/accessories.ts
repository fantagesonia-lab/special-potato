// Accessory generators: headwear, hair accessories, glasses, earrings, necklaces,
// scarves, back items, wings, bags, belts, handheld props, face details, makeup, auras.
// Head items are positioned from the head anchors and follow head offsets.

import { LAYER, type Part } from '../compose';
import { cap, ell, line, path, poly, rect, type Shape } from '../raster';
import { headShapes } from './body';
import { bow, diamond, flower, heart, star, strand } from './shapes';
import { darken, lighten } from '../color';
import type { GenContext } from '../registry';
import type { RenderSpec } from '../../types';
import { limbPortion } from './garments';

function offset(shapes: Shape[], dx: number, dy: number): Shape[] {
  return shapes.map((s) => {
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
  });
}

/** Helper: a part positioned relative to the head. */
function H(ctx: GenContext, layer: number, color: string, shapes: Shape[], extra: Partial<Part> = {}): Part {
  const { sk, tag } = ctx;
  return { layer, tag, color, pivot: { x: 80 + sk.head.x, y: 50 + sk.head.y }, shapes: offset(shapes, sk.head.x, sk.head.y), ...extra };
}

/** Helper: a part positioned relative to the torso. */
function B(ctx: GenContext, layer: number, color: string, shapes: Shape[], extra: Partial<Part> = {}): Part {
  const { sk, tag } = ctx;
  return { layer, tag, color, pivot: { x: 80 + sk.body.x, y: 100 + sk.body.y }, shapes: offset(shapes, sk.body.x, sk.body.y), ...extra };
}

export function hatParts(spec: RenderSpec, ctx: GenContext): Part[] {
  const L = LAYER.headwear;
  const main = ctx.dye('main');
  const acc = ctx.dye('accent', lighten(main, 0.4));
  const s = spec.style as string;
  switch (s) {
    case 'beret':
      return [H(ctx, L, main, [ell(84, 45, 18, 6.5), path('M', 66, 46, 'Q', 84, 33, 102, 44, 'L', 100, 49, 'Q', 84, 46, 68, 50)]), H(ctx, L + 0.01, main, [rect(83, 36, 2, 3)], { shade: 0 })];
    case 'witch':
      return [
        H(ctx, L, main, [ell(80, 49, 32, 6)]),
        H(ctx, L + 0.01, main, [path('M', 63, 48, 'L', 97, 48, 'Q', 94, 30, 98, 18, 'Q', 104, 10, 112, 14, 'Q', 102, 16, 100, 26, 'Q', 99, 38, 97, 48)], { gloss: undefined }),
        H(ctx, L + 0.02, acc, [path('M', 64, 42, 'L', 96.5, 42, 'L', 97, 47, 'L', 63.5, 47)], { shade: 0 }),
        H(ctx, L + 0.03, ctx.dye('trim', '#ffd86b'), [star(90, 30, 3.2), ...[ell(77, 32, 3, 3)]], { shade: 0, cut: offset([ell(78.5, 31, 2.6, 2.6)], ctx.sk.head.x, ctx.sk.head.y) }),
      ];
    case 'cap':
      return [H(ctx, L, main, [path('M', 58, 52, 'Q', 58, 36, 80, 35, 'Q', 102, 36, 102, 52)]), H(ctx, L + 0.01, acc, [path('M', 56, 51, 'Q', 80, 47, 104, 51, 'Q', 106, 56, 100, 56, 'Q', 80, 52, 60, 56, 'Q', 54, 56, 56, 51)]), H(ctx, L + 0.02, acc, [ell(80, 36, 2, 1.5)], { shade: 0 })];
    case 'beanie':
      return [H(ctx, L, main, [path('M', 57, 52, 'Q', 56, 34, 80, 33, 'Q', 104, 34, 103, 52)], { pattern: { kind: 'stripes', color: darken(main, 0.08), every: 3 } }), H(ctx, L + 0.01, acc, [rect(56, 49, 48, 6)]), H(ctx, L + 0.02, ctx.dye('pom', '#ffffff'), [ell(80, 31, 5, 4.5)])];
    case 'crown':
      return [H(ctx, L, ctx.dye('main', '#ffd25e'), [poly(66, 46, 66, 34, 71, 40, 75, 31, 80, 39, 85, 31, 89, 40, 94, 34, 94, 46)], { gloss: { cx: 80, cy: 52, rx: 13, ry: 12, w: 0.6 } }), H(ctx, L + 0.01, ctx.dye('gem', '#ff5c8a'), [diamond(80, 43, 2, 2.5), ell(70, 43, 1.4, 1.4), ell(90, 43, 1.4, 1.4)], { shade: 0 })];
    case 'tiara':
      return [H(ctx, L, ctx.dye('main', '#e7ecff'), [path('M', 64, 52, 'Q', 80, 40, 96, 52, 'L', 94, 53, 'Q', 80, 44, 66, 53), poly(76, 47, 80, 38, 84, 47), poly(70, 49, 72, 43, 74, 48), poly(86, 48, 88, 43, 90, 49)], { gloss: { cx: 80, cy: 50, rx: 8, ry: 8, w: 0.6 } }), H(ctx, L + 0.01, ctx.dye('gem', '#7fd8ff'), [diamond(80, 44, 1.5, 2)], { shade: 0 })];
    case 'bunny':
      return [H(ctx, L, main, [path('M', 68, 46, 'Q', 60, 20, 66, 10, 'Q', 74, 14, 74, 44), path('M', 86, 44, 'Q', 88, 14, 96, 12, 'Q', 100, 22, 92, 46), path('M', 60, 52, 'Q', 80, 38, 100, 52, 'L', 98, 54, 'Q', 80, 42, 62, 54)].map((x) => x)), H(ctx, L + 0.01, acc, [path('M', 68.5, 42, 'Q', 64, 24, 67, 15, 'Q', 71.5, 18, 71.5, 41), path('M', 88.5, 41, 'Q', 90, 18, 94.5, 16, 'Q', 96, 26, 91.5, 42)], { edge: false, shade: 0 })];
    case 'cat':
      return [H(ctx, L, main, [poly(58, 50, 60, 34, 72, 44), poly(102, 50, 100, 34, 88, 44)]), H(ctx, L + 0.01, acc, [poly(61, 46, 62, 38, 68, 44), poly(99, 46, 98, 38, 92, 44)], { edge: false, shade: 0 })];
    case 'fox':
      return [H(ctx, L, main, [poly(57, 52, 56, 30, 72, 44), poly(103, 52, 104, 30, 88, 44)]), H(ctx, L + 0.01, acc, [poly(59, 47, 59, 35, 67, 44), poly(101, 47, 101, 35, 93, 44)], { edge: false, shade: 0 }), H(ctx, L + 0.02, '#ffffff', [poly(56, 30, 58.5, 30, 57, 35), poly(104, 30, 101.5, 30, 103, 35)], { edge: false, shade: 0 })];
    case 'tophat':
      return [H(ctx, L, main, [rect(68, 18, 24, 27)], { gloss: { cx: 74, cy: 40, rx: 4, ry: 20, w: 0.4 } }), H(ctx, L + 0.01, main, [ell(80, 45, 19, 4)]), H(ctx, L + 0.02, acc, [rect(68, 37, 24, 4)], { shade: 0 }), H(ctx, L + 0.03, ctx.dye('trim', '#ff7aa8'), flower(89, 38, 3.5), { shade: 0 })];
    case 'flowercrown': {
      const pts: Shape[] = [];
      const cols = [main, acc, ctx.dye('trim', '#fff3a6')];
      const parts: Part[] = [H(ctx, L - 0.01, '#6fbf6a', [path('M', 56, 56, 'Q', 80, 36, 104, 56, 'L', 103, 58, 'Q', 80, 40, 57, 58)], { shade: 0 })];
      for (let i = 0; i < 7; i++) {
        const t = i / 6, x = 57 + t * 46, y = 56 - Math.sin(t * Math.PI) * 13;
        parts.push(H(ctx, L + i * 0.001, cols[i % 3], flower(x, y, 3.6), { shade: 0 }));
        pts.push(ell(x, y, 1, 1));
      }
      parts.push(H(ctx, L + 0.02, '#ffd66b', pts, { edge: false, shade: 0 }));
      return parts;
    }
    case 'halo':
      return [H(ctx, L, ctx.dye('main', '#ffe680'), [ell(80, 31, 14, 3.8)], { cut: offset([ell(80, 31, 10, 1.8)], ctx.sk.head.x, ctx.sk.head.y), shade: 0, gloss: { cx: 80, cy: 34, rx: 12, ry: 3, w: 0.6 } })];
    case 'bucket':
      return [H(ctx, L, main, [path('M', 60, 50, 'Q', 60, 34, 80, 34, 'Q', 100, 34, 100, 50)]), H(ctx, L + 0.01, main, [path('M', 58, 48, 'L', 102, 48, 'L', 110, 56, 'Q', 80, 52, 50, 56)], { pattern: spec.pattern ? { kind: 'checks', color: acc, every: 3 } : undefined }), H(ctx, L + 0.02, acc, [rect(60, 45, 40, 3)], { shade: 0 })];
    case 'sunhat':
      return [H(ctx, L, main, [ell(80, 50, 36, 7.5)]), H(ctx, L + 0.01, main, [path('M', 63, 50, 'Q', 63, 32, 80, 32, 'Q', 97, 32, 97, 50)]), H(ctx, L + 0.02, acc, [rect(63, 44, 34, 4)], { shade: 0 }), H(ctx, L + 0.03, acc, bow(97, 46, 0.8))];
    case 'pirate':
      return [H(ctx, L, main, [path('M', 50, 50, 'Q', 56, 30, 80, 28, 'Q', 104, 30, 110, 50, 'Q', 96, 42, 80, 46, 'Q', 64, 42, 50, 50)]), H(ctx, L + 0.01, ctx.dye('trim', '#e2b54b'), [path('M', 51, 49, 'Q', 64, 41, 80, 45, 'Q', 96, 41, 109, 49, 'L', 108, 51, 'Q', 96, 44, 80, 47.5, 'Q', 64, 44, 52, 51)], { edge: false, shade: 0 }), H(ctx, L + 0.02, '#f6f1e6', [ell(80, 37, 3.5, 3), rect(78.5, 39, 3, 2)], { shade: 0 }), H(ctx, L + 0.03, '#ffffff', [strand(96, 34, 112, 22, 116, 34, 3, 0.6)], { shade: 1 })];
    case 'horns':
      return [H(ctx, L, ctx.dye('main', '#4a2d5c'), [path('M', 64, 48, 'Q', 56, 40, 58, 28, 'Q', 62, 38, 70, 44), path('M', 96, 48, 'Q', 104, 40, 102, 28, 'Q', 98, 38, 90, 44)], { gloss: { cx: 60, cy: 44, rx: 6, ry: 10, w: 0.4 } })];
    case 'bowband':
      return [H(ctx, L, acc, [path('M', 57, 56, 'Q', 80, 36, 103, 56, 'L', 101, 57, 'Q', 80, 40, 59, 57)], { shade: 0 }), H(ctx, L + 0.01, main, bow(94, 44, 1.25)), H(ctx, L + 0.02, darken(main, 0.15), [ell(94, 44.5, 2.4, 2.4)], { shade: 0 })];
    case 'headphones':
      return [H(ctx, L, ctx.dye('accent', '#3a3550'), [path('M', 56, 66, 'Q', 54, 34, 80, 32, 'Q', 106, 34, 104, 66, 'L', 101, 66, 'Q', 102, 37, 80, 35, 'Q', 58, 37, 59, 66)], { shade: 0 }), H(ctx, L + 0.01, main, [ell(56, 72, 5, 7), ell(104, 72, 5, 7)]), H(ctx, L + 0.02, ctx.dye('trim', '#ff9ac1'), [heart(56, 72, 2.2), heart(104, 72, 2.2)].flat(), { shade: 0, edge: false })];
    case 'chef':
      return [H(ctx, L, main, [ell(70, 34, 8, 7), ell(80, 30, 9, 8), ell(90, 34, 8, 7), rect(66, 36, 28, 13)])];
    case 'santa':
      return [H(ctx, L, main, [path('M', 58, 49, 'Q', 60, 30, 80, 28, 'Q', 98, 28, 108, 38, 'Q', 112, 46, 112, 54, 'Q', 104, 40, 102, 49)]), H(ctx, L + 0.01, '#ffffff', [rect(56, 46, 48, 6), ell(112, 56, 4, 4)])];
    case 'pumpkin':
      return [H(ctx, L, ctx.dye('main', '#f28c28'), [ell(70, 42, 9, 8), ell(80, 40, 9, 9), ell(90, 42, 9, 8)]), H(ctx, L + 0.01, '#4f8a3a', [poly(78, 33, 81, 33, 82, 27, 79, 27)], { shade: 0 }), H(ctx, L + 0.02, '#ffd34d', [poly(73, 41, 76, 41, 74.5, 38), poly(84, 41, 87, 41, 85.5, 38), path('M', 74, 45, 'L', 86, 45, 'L', 80, 47.5)], { edge: false, shade: 0 })];
    case 'mushroom':
      return [H(ctx, L, main, [path('M', 52, 52, 'Q', 54, 24, 80, 24, 'Q', 106, 24, 108, 52, 'Q', 80, 46, 52, 52)]), H(ctx, L + 0.01, '#ffffff', [ell(68, 36, 4, 3.4), ell(86, 32, 3.4, 2.8), ell(97, 42, 3, 2.6), ell(62, 46, 2.4, 2), ell(80, 43, 2.6, 2.2)], { edge: false, shade: 0 })];
    case 'frog':
      return [H(ctx, L, main, [path('M', 57, 52, 'Q', 56, 36, 80, 36, 'Q', 104, 36, 103, 52), ell(68, 36, 7, 6.5), ell(92, 36, 7, 6.5)]), H(ctx, L + 0.01, '#ffffff', [ell(68, 35, 4.2, 4), ell(92, 35, 4.2, 4)], { shade: 0 }), H(ctx, L + 0.02, '#2b1b2e', [ell(68.5, 35.5, 2, 2.2), ell(92.5, 35.5, 2, 2.2)], { edge: false, shade: 0 }), H(ctx, L + 0.02, '#ff9fb6', [ell(64, 44, 2.5, 1.3), ell(96, 44, 2.5, 1.3)], { edge: false, shade: 0 })];
    case 'antlers':
      return [H(ctx, L, ctx.dye('main', '#a97b52'), [path('M', 66, 46, 'Q', 60, 34, 54, 28, 'L', 56, 27, 'Q', 62, 32, 63, 30, 'L', 64, 24, 'L', 66, 25, 'L', 66, 33, 'Q', 68, 38, 70, 44), path('M', 94, 46, 'Q', 100, 34, 106, 28, 'L', 104, 27, 'Q', 98, 32, 97, 30, 'L', 96, 24, 'L', 94, 25, 'L', 94, 33, 'Q', 92, 38, 90, 44)])];
    case 'bonnet':
      return [
        H(ctx, L, main, [path('M', 54, 60, 'Q', 52, 34, 80, 32, 'Q', 108, 34, 106, 60, 'Q', 96, 44, 80, 43, 'Q', 64, 44, 54, 60)]),
        H(ctx, L + 0.01, ctx.dye('trim', '#ffffff'), [path('M', 56, 58, 'Q', 66, 42, 80, 41, 'Q', 94, 42, 104, 58, 'Q', 94, 46, 80, 45.5, 'Q', 66, 46, 56, 58)], { pattern: { kind: 'lace', color: '#f0e6f6' }, shade: 0 }),
        H(ctx, L + 0.02, acc, bow(56, 64, 0.9)),
        H(ctx, L + 0.02, acc, bow(104, 64, 0.9)),
      ];
    case 'veil':
      return [H(ctx, LAYER.hairBack - 0.1, ctx.dye('main', '#ffffff'), [path('M', 56, 46, 'Q', 80, 36, 104, 46, 'L', 116, 130, 'Q', 80, 136, 44, 130)], { alpha: 0.6, pattern: { kind: 'lace', color: '#f1e8ff' } }), H(ctx, L, acc, flower(96, 46, 4.5)), H(ctx, L + 0.01, '#ffe680', [ell(96, 46, 1.3, 1.3)], { edge: false, shade: 0 })];
    case 'headband':
      return [H(ctx, L, main, [path('M', 56, 60, 'Q', 80, 50, 104, 60, 'L', 104, 65, 'Q', 80, 55, 56, 65)], { shade: 0 }), H(ctx, L + 0.01, acc, [strand(104, 62, 114, 66, 120, 78, 2.2, 1), strand(104, 63, 112, 72, 112, 84, 2, 0.8)])];
    case 'kitsune':
      return [H(ctx, L, '#ffffff', [path('M', 92, 44, 'L', 108, 46, 'L', 110, 60, 'Q', 104, 68, 98, 64, 'L', 94, 56)], { shade: 1 }), H(ctx, L + 0.01, '#e8384f', [poly(94, 44, 97, 38, 99, 46), poly(104, 46, 108, 40, 108, 48), rect(99, 54, 4, 1), rect(103, 60, 3, 1)], { edge: false, shade: 0 })];
    case 'starclip':
    default:
      return [H(ctx, L, main, [star(98, 50, 5)], { shade: 0 })];
  }
}

export function hairAccParts(spec: RenderSpec, ctx: GenContext): Part[] {
  const L = LAYER.headwear - 0.5;
  const main = ctx.dye('main');
  const acc = ctx.dye('accent', lighten(main, 0.4));
  switch (spec.style as string) {
    case 'bigbow':
      return [H(ctx, L, main, bow(96, 44, 1.6)), H(ctx, L + 0.01, darken(main, 0.12), [ell(96, 44.5, 2.8, 2.8)], { shade: 0 })];
    case 'backbow':
      return [H(ctx, LAYER.hairBack + 0.3, main, bow(80, 38, 2.2)), H(ctx, LAYER.hairBack + 0.31, darken(main, 0.12), [ell(80, 38.5, 3.2, 3.2)], { shade: 0 })];
    case 'twinbows':
      return [H(ctx, L, main, [...bow(60, 50, 0.9), ...bow(100, 50, 0.9)]), H(ctx, L + 0.01, acc, [ell(60, 50.5, 1.6, 1.6), ell(100, 50.5, 1.6, 1.6)], { shade: 0 })];
    case 'starclips':
      return [H(ctx, L, main, [star(63, 56, 3.4), star(68, 51, 2.6)], { shade: 0 })];
    case 'heartclips':
      return [H(ctx, L, main, [...heart(98, 54, 2.6), ...heart(94, 49, 2)], { shade: 0 })];
    case 'flowerclip':
      return [H(ctx, L, main, flower(99, 52, 4.5), { shade: 0 }), H(ctx, L + 0.01, acc, [ell(99, 52, 1.5, 1.5)], { edge: false, shade: 0 })];
    case 'cherries':
      return [H(ctx, L, '#5aa04f', [line(62, 46, 64, 52), line(62, 46, 59, 52)], { tone: 'base', edge: false, shade: 0 }), H(ctx, L + 0.01, ctx.dye('main', '#e8384f'), [ell(64, 54, 2.5, 2.5), ell(59, 54, 2.5, 2.5)], { gloss: { cx: 61, cy: 56, rx: 2.5, ry: 2.5, w: 0.5 } })];
    case 'pins':
      return [H(ctx, L, main, [poly(60, 53, 70, 49, 70.5, 50.2, 60.5, 54.2), poly(61, 49, 70, 54, 69.4, 55, 60.4, 50.2)], { shade: 0 })];
    case 'butterfly':
      return [H(ctx, L, main, [ell(96, 48, 3.5, 3), ell(102, 48, 3.5, 3), ell(97, 53, 2.6, 2.2), ell(101, 53, 2.6, 2.2)], { shade: 0, pattern: { kind: 'dots', color: acc, every: 2 } }), H(ctx, L + 0.01, '#3a2a40', [rect(99, 46, 1, 9)], { edge: false, shade: 0 })];
    case 'ribbons':
      return [H(ctx, L, main, bow(80, 40, 1)), H(ctx, LAYER.hairBack + 0.3, main, [strand(78, 42, 70, 70, 66, 100, 1.6, 1.2), strand(82, 42, 92, 70, 96, 100, 1.6, 1.2)])];
    case 'pearls':
      return [H(ctx, L, ctx.dye('main', '#fff8f0'), [ell(62, 58, 1.6, 1.6), ell(64, 54, 1.6, 1.6), ell(67, 51, 1.6, 1.6), ell(71, 49, 1.6, 1.6)], { shade: 0, gloss: { cx: 66, cy: 56, rx: 4, ry: 4, w: 0.3 } })];
    case 'scrunchie':
    default:
      return [H(ctx, L, main, [ell(80, 40, 6, 3.5)], { pattern: { kind: 'dots', color: acc, every: 2 } })];
  }
}

export function glassesParts(spec: RenderSpec, ctx: GenContext): Part[] {
  const L = LAYER.glasses;
  const main = ctx.dye('main', '#3a3046');
  const lens = ctx.dye('lens', '#bfe6ff');
  const hx = ctx.sk.head.x, hy = ctx.sk.head.y;
  const rings = (shapes: Shape[], inner: Shape[]): Part => H(ctx, L, main, shapes, { cut: offset(inner, hx, hy), shade: 0, edge: false, tone: 'base' });
  switch (spec.style as string) {
    case 'round':
      return [H(ctx, L - 0.01, lens, [ell(70, 77, 5.5, 5.5), ell(90, 77, 5.5, 5.5)], { alpha: 0.25, edge: false, shade: 0 }), rings([ell(70, 77, 6.2, 6.2), ell(90, 77, 6.2, 6.2), rect(76, 76, 8, 1)], [ell(70, 77, 5.2, 5.2), ell(90, 77, 5.2, 5.2)])];
    case 'square':
      return [H(ctx, L - 0.01, lens, [rect(64, 72, 12, 9), rect(84, 72, 12, 9)], { alpha: 0.2, edge: false, shade: 0 }), rings([rect(63, 71, 14, 11), rect(83, 71, 14, 11), rect(77, 74, 6, 1)], [rect(64, 72, 12, 9), rect(84, 72, 12, 9)])];
    case 'heart':
      return [H(ctx, L, ctx.dye('lens', '#ff5c8a'), [...heart(70, 77, 6), ...heart(90, 77, 6), rect(76, 74, 8, 1)], { alpha: 0.92, gloss: { cx: 70, cy: 80, rx: 5, ry: 5, w: 0.5 } })];
    case 'star':
      return [H(ctx, L, ctx.dye('lens', '#ffd34d'), [star(70, 77, 7.5, 0.5), star(90, 77, 7.5, 0.5), rect(76, 76, 8, 1)], { alpha: 0.92 })];
    case 'shades':
      return [H(ctx, L, ctx.dye('lens', '#2b2440'), [path('M', 62, 73, 'L', 98, 73, 'L', 97, 80, 'Q', 91, 83, 85, 80, 'L', 80, 76, 'L', 75, 80, 'Q', 69, 83, 63, 80)], { alpha: 0.95, gloss: { cx: 68, cy: 82, rx: 5, ry: 7, w: 0.5 } })];
    case 'monocle':
      return [H(ctx, L - 0.01, lens, [ell(90, 77, 5.5, 5.5)], { alpha: 0.25, edge: false, shade: 0 }), rings([ell(90, 77, 6.4, 6.4)], [ell(90, 77, 5.3, 5.3)]), H(ctx, L, ctx.dye('chain', '#e2b54b'), [line(95, 81, 99, 92, 96, 100)], { edge: false, shade: 0 })];
    case 'goggles':
      return [H(ctx, L + 1.5, ctx.dye('strap', '#3a3046'), [path('M', 56, 58, 'Q', 80, 52, 104, 58, 'L', 104, 62, 'Q', 80, 56, 56, 62)], { shade: 0 }), H(ctx, L + 1.6, main, [ell(71, 56, 7, 6), ell(89, 56, 7, 6)]), H(ctx, L + 1.7, lens, [ell(71, 56, 4.5, 4), ell(89, 56, 4.5, 4)], { gloss: { cx: 71, cy: 59, rx: 4, ry: 4, w: 0.5 }, shade: 0 })];
    case 'visor':
      return [H(ctx, L, ctx.dye('lens', '#6ff7ff'), [path('M', 57, 73, 'Q', 80, 70, 103, 73, 'L', 103, 80, 'Q', 80, 77, 57, 80)], { alpha: 0.65, gloss: { cx: 80, cy: 82, rx: 20, ry: 8, w: 0.3 } })];
    default:
      return [];
  }
}

export function earringParts(spec: RenderSpec, ctx: GenContext): Part[] {
  const L = LAYER.earrings;
  const main = ctx.dye('main', '#ffd25e');
  const acc = ctx.dye('accent', '#ff5c8a');
  // Only the near ear is visible in the 3/4 view.
  const at = (fn: (x: number) => Shape[]) => fn(102.5);
  switch (spec.style as string) {
    case 'hoop': return [H(ctx, L, main, at((x) => [ell(x, 84, 2.6, 3)]), { cut: offset(at((x) => [ell(x, 84, 1.4, 1.8)]), ctx.sk.head.x, ctx.sk.head.y), shade: 0, edge: false })];
    case 'drop': return [H(ctx, L, main, at((x) => [rect(x - 0.5, 80, 1, 3)]), { edge: false, shade: 0 }), H(ctx, L + 0.01, acc, at((x) => [diamond(x, 85, 1.8, 2.5)]), { shade: 0 })];
    case 'star': return [H(ctx, L, main, at((x) => [star(x, 83, 2.8)]), { shade: 0 })];
    case 'cherry': return [H(ctx, L, '#5aa04f', at((x) => [line(x, 80, x - 1, 84), line(x, 80, x + 2, 84)]), { edge: false, shade: 0 }), H(ctx, L + 0.01, '#e8384f', at((x) => [ell(x - 1, 85, 1.5, 1.5), ell(x + 2, 85, 1.5, 1.5)]), { shade: 0 })];
    case 'jam': return [H(ctx, L, '#f2f0f5', at((x) => [rect(x - 1.5, 81, 3, 1)]), { edge: false, shade: 0 }), H(ctx, L + 0.01, acc, at((x) => [rect(x - 2, 82, 4, 4)]), { shade: 0, gloss: { cx: x0(), cy: 86, rx: 1, ry: 1 } })];
    case 'pearl': return [H(ctx, L, ctx.dye('main', '#fff8f0'), at((x) => [ell(x, 83, 1.8, 1.8)]), { gloss: { cx: 56, cy: 84, rx: 1.5, ry: 1.5, w: 0.3 } })];
    case 'moon': return [H(ctx, L, main, at((x) => [ell(x, 84, 2.6, 2.6)]), { cut: offset(at((x) => [ell(x + 1.2, 83, 2.2, 2.2)]), ctx.sk.head.x, ctx.sk.head.y), shade: 0 })];
    case 'stud':
    default: return [H(ctx, L, main, at((x) => [ell(x, 82, 1.2, 1.2)]), { edge: false, shade: 0, tone: 'light' })];
  }
}
function x0() { return 57; }

export function necklaceParts(spec: RenderSpec, ctx: GenContext): Part[] {
  const L = LAYER.neck;
  const main = ctx.dye('main', '#ffd25e');
  const acc = ctx.dye('accent', '#ff5c8a');
  switch (spec.style as string) {
    case 'choker': return [B(ctx, L, ctx.dye('main', '#2b2440'), [rect(76.5, 89, 7, 2)], { shade: 0 }), B(ctx, L + 0.01, acc, spec.charm === 'heart' ? heart(80, 92.5, 1.6) : [diamond(80, 92.5, 1.5, 2)], { shade: 0 })];
    case 'pendant': return [B(ctx, L, main, [line(75, 91, 80, 97, 85, 91)], { edge: false, shade: 0 }), B(ctx, L + 0.01, acc, [diamond(80, 98.5, 2, 2.8)], { shade: 0, gloss: { cx: 80, cy: 100, rx: 2, ry: 2, w: 0.4 } })];
    case 'pearls': {
      const pts: Shape[] = [];
      for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push(ell(73.5 + t * 13, 91 + Math.sin(t * Math.PI) * 4, 1.1, 1.1)); }
      return [B(ctx, L, ctx.dye('main', '#fff8f0'), pts, { edge: false, shade: 0, tone: 'base' })];
    }
    case 'bell': return [B(ctx, L, ctx.dye('band', '#e8384f'), [rect(76, 89, 8, 2)], { shade: 0 }), B(ctx, L + 0.01, main, [ell(80, 93, 2.4, 2.2)], { gloss: { cx: 80, cy: 95, rx: 2, ry: 2, w: 0.4 } })];
    case 'locket': return [B(ctx, L, main, [line(75, 91, 80, 96, 85, 91)], { edge: false, shade: 0 }), B(ctx, L + 0.01, main, heart(80, 97.5, 2.4))];
    case 'chain':
    default: return [B(ctx, L, ctx.dye('main', '#d7dbe6'), [line(74, 91, 77, 95, 83, 95, 86, 91)], { edge: false, shade: 0, tone: 'light' })];
  }
}

export function scarfParts(spec: RenderSpec, ctx: GenContext): Part[] {
  const L = LAYER.neck + 0.2;
  const main = ctx.dye('main');
  const pattern = spec.pattern ? { kind: 'hstripes' as const, color: ctx.dye('accent'), every: 3 } : undefined;
  switch (spec.style as string) {
    case 'ninja':
      return [
        H(ctx, LAYER.faceCosmetic + 0.3, main, [path('M', 58, 80, 'Q', 80, 76, 102, 80, 'L', 101, 88, 'Q', 80, 96, 59, 88)], { clip: headShapes(ctx.sk), clipNoTurn: true }),
        B(ctx, L, main, [ell(80, 91, 12, 4.5)]),
        B(ctx, LAYER.backAcc, main, [strand(90, 90, 110, 84, 124, 96, 3, 1.5), strand(90, 92, 108, 98, 118, 110, 2.6, 1.2)]),
      ];
    case 'bandana':
      return [B(ctx, L, main, [poly(70, 89, 90, 89, 80, 101)], { pattern: { kind: 'dots', color: ctx.dye('accent', '#ffffff'), every: 3 } })];
    case 'fluffy':
      return [B(ctx, L, main, [ell(72, 91, 5, 4), ell(80, 92, 5.5, 4.5), ell(88, 91, 5, 4), ell(85, 99, 3.5, 4)])];
    case 'long':
      return [B(ctx, L, main, [ell(80, 91, 11.5, 4)], { pattern }), B(ctx, L + 0.01, main, [poly(83, 92, 89, 92, 90, 114, 84, 114)], { pattern }), B(ctx, L + 0.02, ctx.dye('accent'), [rect(84, 112, 6, 2)], { shade: 0 })];
    case 'wrap':
    default:
      return [B(ctx, L, main, [ell(80, 91, 11, 4)], { pattern }), B(ctx, L + 0.01, main, [poly(84, 92, 88, 92, 88, 104, 84, 103)], { pattern })];
  }
}

export function backParts(spec: RenderSpec, ctx: GenContext): Part[] {
  const L = LAYER.backAcc;
  const main = ctx.dye('main');
  const acc = ctx.dye('accent', lighten(main, 0.35));
  switch (spec.style as string) {
    case 'backpack':
      return [B(ctx, L, main, [rect(64, 94, 32, 22)]), B(ctx, LAYER.bag, ctx.dye('strap', darken(main, 0.25)), [rect(71, 92, 2.5, 14), rect(86.5, 92, 2.5, 14)], { shade: 0 })];
    case 'bunnypack':
      return [B(ctx, L, main, [ell(98, 90, 8, 7.5), path('M', 93, 86, 'Q', 90, 70, 94, 66, 'Q', 97, 72, 97, 84), path('M', 101, 84, 'Q', 104, 68, 108, 70, 'Q', 108, 80, 104, 86)]), B(ctx, L + 0.01, '#2b1b2e', [rect(95, 89, 1, 1.5), rect(100, 89, 1, 1.5)], { edge: false, shade: 0 }), B(ctx, L + 0.01, acc, [ell(97.5, 92, 1.2, 0.8)], { edge: false, shade: 0 }), B(ctx, LAYER.bag, ctx.dye('strap', '#f6c1d4'), [rect(86.5, 92, 2.5, 14)], { shade: 0 })];
    case 'guitar':
      return [B(ctx, L, main, [ell(64, 120, 8, 7), ell(67, 110, 6, 5.5)]), B(ctx, L + 0.01, '#3a2a30', [cap(70, 104, 98, 76, 1.6)], { shade: 0 }), B(ctx, L + 0.02, '#2b1b2e', [ell(66, 115, 2, 2)], { edge: false, shade: 0 })];
    case 'blanket':
      return [B(ctx, L, main, [cap(62, 118, 100, 88, 5)], { pattern: { kind: 'checks', color: acc, every: 2 } })];
    case 'quiver':
      return [B(ctx, L, main, [cap(96, 86, 72, 118, 4.5)]), B(ctx, L - 0.01, '#ffffff', [poly(98, 82, 100, 78, 102, 84), poly(94, 81, 95, 76, 98, 82)], { shade: 0 })];
    case 'bigbow':
      return [B(ctx, L, main, bow(80, 106, 2.6)), B(ctx, L + 0.01, darken(main, 0.12), [ell(80, 106.5, 4, 4)], { shade: 0 })];
    case 'tail':
      return [B(ctx, L, main, [strand(88, 118, 110, 120, 112, 100, 3, 3.5)]), B(ctx, L + 0.01, acc, [ell(112, 99, 3.2, 3.6)], { shade: 0 })];
    case 'foxtail':
      return [B(ctx, L, main, [path('M', 86, 118, 'Q', 112, 128, 116, 104, 'Q', 120, 92, 112, 86, 'Q', 112, 104, 96, 112)]), B(ctx, L + 0.01, '#ffffff', [ell(113, 89, 3.4, 4)], { shade: 0 })];
    case 'shell':
      return [B(ctx, L, main, [ell(80, 106, 15, 13)], { pattern: { kind: 'diamonds', color: acc, every: 5 } })];
    case 'parasolback':
      return [B(ctx, L, main, [path('M', 56, 90, 'Q', 80, 60, 104, 90, 'Q', 98, 88, 92, 90, 'Q', 86, 88, 80, 90, 'Q', 74, 88, 68, 90, 'Q', 62, 88, 56, 90)], { pattern: { kind: 'lace', color: acc } })];
    default:
      return [];
  }
}

export function wingParts(spec: RenderSpec, ctx: GenContext): Part[] {
  const L = LAYER.backAcc - 0.2;
  const main = ctx.dye('main', '#ffffff');
  const acc = ctx.dye('accent', lighten(main, 0.4));
  const flap = ctx.frame % 2 === 1 ? -2 : 0;
  const mirror = (shapes: Shape[]) => [...shapes, ...shapes.map((s) => mirrorShape(s))];
  const W = (shapes: Shape[], color: string, extra: Partial<Part> = {}) => B(ctx, L, color, offset(mirror(shapes), 0, flap), extra);
  switch (spec.style as string) {
    case 'angel': {
      const feathers: Shape[] = [];
      for (let i = 0; i < 4; i++) feathers.push(ell(62 - i * 6, 96 - i * 3 + i * i * 0.6, 7 - i * 0.5, 12 - i * 1.5));
      return [W(feathers, main), W([ell(66, 100, 5, 8)], acc, { edge: false, shade: 0, alpha: 0.6 })];
    }
    case 'devil':
    case 'bat':
      return [W([path('M', 70, 96, 'Q', 52, 76, 36, 84, 'Q', 42, 92, 40, 102, 'Q', 46, 98, 50, 108, 'Q', 56, 102, 62, 110)], ctx.dye('main', '#3a2a4a'))];
    case 'fairy':
      return [W([ell(58, 88, 14, 9), ell(62, 106, 9, 6)], ctx.dye('main', '#c6f2ff'), { alpha: 0.6, gloss: { cx: 56, cy: 92, rx: 10, ry: 6, w: 0.5 } })];
    case 'butterfly':
      return [W([ell(56, 88, 14, 12), ell(62, 108, 9, 8)], main, { pattern: { kind: 'dots', color: acc, every: 3 } })];
    case 'star':
      return [W([star(56, 90, 11, 0.5), star(64, 110, 6, 0.5)], ctx.dye('main', '#ffe680'), { gloss: { cx: 56, cy: 95, rx: 8, ry: 8, w: 0.5 } })];
    case 'crystal':
      return [W([diamond(58, 88, 5, 13), diamond(48, 96, 4, 10), diamond(62, 106, 3.5, 8)], ctx.dye('main', '#9fe7ff'), { alpha: 0.85, gloss: { cx: 56, cy: 92, rx: 5, ry: 8, w: 0.4 } })];
    case 'mecha':
      return [W([poly(68, 94, 44, 80, 40, 86, 60, 100), poly(68, 100, 42, 98, 42, 104, 62, 106), poly(68, 104, 50, 114, 54, 118, 66, 110)], ctx.dye('main', '#cfd6e6')), W([rect(44, 82, 3, 2), rect(44, 100, 3, 2)], ctx.dye('accent', '#6ff7ff'), { edge: false, shade: 0 })];
    case 'petal':
      return [W([ell(58, 90, 13, 8), ell(54, 102, 10, 6), ell(60, 112, 7, 4)], ctx.dye('main', '#ffc4dd'), { gloss: { cx: 56, cy: 94, rx: 10, ry: 6, w: 0.4 } })];
    default:
      return [];
  }
}

function mirrorShape(s: Shape, axis = 80): Shape {
  const m = 2 * axis;
  switch (s.t) {
    case 'ell': return { ...s, x: m - s.x };
    case 'rect': return { ...s, x: m - s.x - s.w };
    case 'cap': return { ...s, x1: m - s.x1, x2: m - s.x2 };
    default: {
      const pts = s.pts.slice();
      for (let i = 0; i < pts.length; i += 2) pts[i] = m - pts[i];
      return { ...s, pts } as Shape;
    }
  }
}

function unoffset(s: Shape, dx: number, dy: number): Shape {
  return offset([s], -dx, -dy)[0];
}

export function bagParts(spec: RenderSpec, ctx: GenContext): Part[] {
  const L = LAYER.bag;
  const main = ctx.dye('main');
  const strap = ctx.dye('strap', darken(main, 0.3));
  const acc = ctx.dye('accent', lighten(main, 0.4));
  const strapPart = B(ctx, L, strap, [line(88, 92, 72, 112), line(89, 92, 73, 112)], { edge: false, shade: 0, tone: 'base' });
  switch (spec.style as string) {
    case 'heart': return [strapPart, B(ctx, L + 0.01, main, heart(68, 116, 5), { gloss: { cx: 66, cy: 118, rx: 3, ry: 3, w: 0.5 } })];
    case 'basket': return [B(ctx, L, '#b88552', [path('M', 66, 108, 'Q', 66, 98, 72, 98, 'Q', 78, 98, 78, 108)], { cut: offset([path('M', 68, 108, 'Q', 68, 100, 72, 100, 'Q', 76, 100, 76, 108)], ctx.sk.body.x, ctx.sk.body.y), shade: 0 }), B(ctx, L + 0.01, '#d9a46a', [poly(64, 108, 80, 108, 78, 118, 66, 118)], { pattern: { kind: 'plaid', color: '#b88552', every: 2 } }), B(ctx, L + 0.02, '#e8384f', [ell(69, 107, 2, 2), ell(74, 107, 2, 2)], { shade: 0 })];
    case 'tote': return [strapPart, B(ctx, L + 0.01, main, [rect(62, 108, 13, 14)], { pattern: spec.pattern ? { kind: 'stripes', color: acc, every: 3 } : undefined })];
    case 'star': return [strapPart, B(ctx, L + 0.01, main, [star(68, 116, 6.5)], { gloss: { cx: 68, cy: 118, rx: 4, ry: 4, w: 0.4 } })];
    case 'plush': return [strapPart, B(ctx, L + 0.01, main, [ell(68, 117, 6, 5.5), ell(63.5, 112, 2.2, 2.2), ell(72.5, 112, 2.2, 2.2)]), B(ctx, L + 0.02, '#2b1b2e', [rect(66, 116, 1, 1), rect(69, 116, 1, 1)], { edge: false, shade: 0 })];
    case 'shoulder':
    default: return [strapPart, B(ctx, L + 0.01, main, [path('M', 62, 112, 'L', 74, 112, 'L', 74, 120, 'Q', 68, 122, 62, 120)]), B(ctx, L + 0.02, acc, [rect(67, 112, 2, 3)], { shade: 0 })];
  }
}

export function beltParts(spec: RenderSpec, ctx: GenContext): Part[] {
  const L = LAYER.belt;
  const main = ctx.dye('main');
  switch (spec.style as string) {
    case 'chain': return [B(ctx, L, ctx.dye('main', '#d7dbe6'), [line(70, 110, 76, 113, 84, 113, 90, 110)], { edge: false, shade: 0, tone: 'light' })];
    case 'sash': return [B(ctx, L, main, [rect(70, 108, 20, 4)], { shade: 0 }), B(ctx, L + 0.01, main, bow(74, 110, 0.75))];
    case 'obi': return [B(ctx, L, main, [rect(70, 104, 20, 8)]), B(ctx, L + 0.01, ctx.dye('accent'), [rect(70, 107, 20, 1.5)], { edge: false, shade: 0 })];
    case 'pouch': return [B(ctx, L, ctx.dye('main', '#6b4630'), [rect(70, 109, 20, 2.5)], { shade: 0 }), B(ctx, L + 0.01, ctx.dye('accent', '#8a5a3a'), [rect(84, 110, 6, 6)])];
    default: return [B(ctx, L, main, [rect(70, 109, 20, 2.5)], { shade: 0 }), B(ctx, L + 0.01, ctx.dye('buckle', '#ffd25e'), [rect(78.5, 108.5, 3, 3.5)], { shade: 0, edge: false })];
  }
}

export function handheldParts(spec: RenderSpec, ctx: GenContext): Part[] {
  const L = LAYER.handheld;
  const { sk, tag } = ctx;
  const arm = sk.holdHand === 'R' ? sk.armR : sk.armL;
  const hx = arm.b.x, hy = arm.b.y + 1.5;
  const main = ctx.dye('main');
  const acc = ctx.dye('accent', lighten(main, 0.4));
  // Props are authored extending to the right of the hand; held in the left hand they mirror outward.
  const flip = sk.holdHand === 'L';
  const fl = (shapes: Shape[]) => (flip ? shapes.map((s) => mirrorShape(s, 0)) : shapes);
  const P = (layer: number, color: string, shapes: Shape[], extra: Partial<Part> = {}): Part => ({
    layer, tag, color, pivot: { x: hx, y: hy }, shapes: offset(fl(shapes), hx, hy), ...extra,
    cut: extra.cut ? offset(fl(extra.cut.map((c) => unoffset(c, hx, hy))), hx, hy) : undefined,
    // Gloss centres are authored relative to the hand as well.
    gloss: extra.gloss ? { ...extra.gloss, cx: hx + (flip ? -extra.gloss.cx : extra.gloss.cx), cy: hy + extra.gloss.cy } : undefined,
  });
  switch (spec.style as string) {
    case 'wand': return [P(L, ctx.dye('stick', '#f6f0ff'), [cap(0, 4, 4, -14, 1)], { shade: 0 }), P(L + 0.01, main, [star(5, -17, 5.5)], { gloss: { cx: 5, cy: -15, rx: 3, ry: 3, w: 0.5 } })];
    case 'staff': return [P(L, ctx.dye('stick', '#8a5a3a'), [cap(1, 24, -2, -50, 1.4)], { shade: 0 }), P(L + 0.01, ctx.dye('trim', '#ffd25e'), [ell(-2, -53, 5, 5), poly(-2, -60, 0, -64, -4, -64)], { cut: offset([ell(-2, -53, 3.2, 3.2)], hx, hy), shade: 0 }), P(L + 0.02, main, [ell(-2, -53, 3.4, 3.4)], { gloss: { cx: -2, cy: -52, rx: 2, ry: 2, w: 0.5 }, shade: 0 })];
    case 'umbrella': return [P(L, '#4a3a4a', [cap(0, 6, 4, -56, 0.8)], { edge: false, shade: 0 }), P(L + 0.01, main, [path('M', -18, -52, 'Q', 4, -78, 26, -52, 'Q', 21.5, -55, 17, -52, 'Q', 12.5, -55, 8, -52, 'Q', 3.5, -55, -1, -52, 'Q', -5.5, -55, -10, -52, 'Q', -14, -55, -18, -52)], { pattern: spec.pattern ? { kind: 'dots', color: acc, every: 3 } : undefined })];
    case 'parasol': return [P(L, '#f6f0ff', [cap(0, 6, 4, -54, 0.8)], { edge: false, shade: 0 }), P(L + 0.01, main, [path('M', -16, -50, 'Q', 4, -74, 24, -50, 'Q', 19.5, -53, 15, -50, 'Q', 10.5, -53, 6, -50, 'Q', 1.5, -53, -3, -50, 'Q', -7.5, -53, -12, -50, 'Q', -14, -53, -16, -50)], { pattern: { kind: 'lace', color: acc } }), P(L + 0.02, acc, [rect(-16, -51, 40, 2)], { edge: false, shade: 0, alpha: 0.8 })];
    case 'icecream': return [P(L, '#e3a35d', [poly(-3, -2, 3, -2, 0, 7)], { pattern: { kind: 'diamonds', color: '#c47f3c', every: 3 } }), P(L + 0.01, main, [ell(0, -4, 4, 3.5)]), P(L + 0.02, acc, [ell(0, -9, 3.4, 3)]), P(L + 0.03, '#e8384f', [ell(0, -13, 1.5, 1.5)], { shade: 0 })];
    case 'boba': return [P(L, ctx.dye('cup', '#f8f2ff'), [poly(-4, -10, 4, -10, 3, 4, -3, 4)], { alpha: 0.9 }), P(L + 0.01, main, [poly(-3.5, -6, 3.5, -6, 2.8, 3, -2.8, 3)], { shade: 0 }), P(L + 0.02, '#3a2430', [ell(-1.5, 1.5, 0.9, 0.9), ell(1, 0.5, 0.9, 0.9), ell(0, 2.3, 0.9, 0.9)], { edge: false, shade: 0 }), P(L + 0.03, acc, [cap(1, -10, 3, -17, 0.8)], { edge: false, shade: 0 })];
    case 'balloon': return [P(L, '#ffffff', [line(0, 0, 3, -24, 8, -50)], { edge: false, shade: 0, tone: 'shade' }), P(L + 0.01, main, spec.shape === 'heart' ? heart(9, -58, 8) : [ell(9, -58, 8, 9.5)])];
    case 'lollipop': return [P(L, '#ffffff', [cap(0, 4, 0, -10, 0.8)], { shade: 0 }), P(L + 0.01, main, [ell(0, -14, 5.5, 5.5)], { pattern: { kind: 'diamonds', color: acc, every: 3 } })];
    case 'mic': return [P(L, ctx.dye('stick', '#f6f0ff'), [cap(0, 5, 0, -6, 1.6)]), P(L + 0.01, main, [ell(0, -9, 3.6, 3.6)], { pattern: { kind: 'plaid', color: darken(main, 0.15), every: 2 } }), P(L + 0.02, acc, bow(0, -5, 0.45))];
    case 'bouquet': return [P(L, '#6fbf6a', [poly(-2, 0, 2, 0, 1, 8, -1, 8)], { shade: 0 }), P(L + 0.01, '#f6f0ff', [poly(-6, -4, 6, -4, 2, 3, -2, 3)]), P(L + 0.02, main, [...flower(-3, -7, 3), ...flower(3, -8, 3)], { shade: 0 }), P(L + 0.03, acc, flower(0, -11, 3), { shade: 0 })];
    case 'book': return [P(L, main, [rect(-5, -6, 10, 12)]), P(L + 0.01, acc, [rect(-3, -3, 6, 2)], { shade: 0 }), P(L + 0.01, '#f8f2e8', [rect(4, -5, 1, 10)], { edge: false, shade: 0 })];
    case 'sword': return [P(L, ctx.dye('blade', '#e9eef8'), [cap(4, 1.5, 33, 15, 2.4, 1.2)], { shade: 1 }), P(L + 0.01, main, [cap(2, -4.5, -1, 6, 1.4)], { shade: 0 }), P(L + 0.01, acc, [cap(-1, -1, -6, -4, 1.4)], { shade: 0 })];
    case 'lantern': return [P(L, '#4a3a4a', [line(0, 0, 0, 6)], { edge: false, shade: 0 }), P(L + 0.01, main, [ell(0, 12, 5, 6)], { gloss: { cx: 0, cy: 14, rx: 3, ry: 4, w: 0.6 } }), P(L + 0.02, '#ffe680', [ell(0, 12, 2, 2.5)], { edge: false, shade: 0, alpha: 0.9 })];
    case 'fan': return [P(L, main, [path('M', 0, 0, 'L', -12, -10, 'Q', 0, -18, 12, -10)], { pattern: { kind: 'stripes', color: acc, every: 2 } })];
    case 'plush': return [P(L, main, [ell(0, -2, 6, 6), ell(-5, -7, 2.5, 2.5), ell(5, -7, 2.5, 2.5), ell(0, 6, 5, 4)]), P(L + 0.01, '#2b1b2e', [rect(-2, -3, 1, 1), rect(2, -3, 1, 1)], { edge: false, shade: 0 }), P(L + 0.01, acc, [ell(0, -0.5, 1.5, 1)], { edge: false, shade: 0 })];
    case 'bubblewand': return [P(L, main, [cap(0, 4, 0, -10, 0.8)], { shade: 0 }), P(L + 0.01, main, [ell(0, -13, 3, 3)], { cut: offset([ell(0, -13, 2, 2)], hx, hy), edge: false, shade: 0 }), P(L + 0.02, '#cfefff', [ell(6, -20, 3, 3), ell(10, -27, 2, 2), ell(3, -28, 1.5, 1.5)], { alpha: 0.6, edge: false, shade: 0, gloss: { cx: 6, cy: -18, rx: 2, ry: 2, w: 0.4 } })];
    case 'camera': return [P(L, main, [rect(-6, -5, 12, 8)]), P(L + 0.01, '#2b2440', [ell(0, -1, 2.6, 2.6)], { gloss: { cx: -1, cy: 0, rx: 2, ry: 2, w: 0.4 } }), P(L + 0.01, acc, [rect(-5, -7, 3, 2)], { shade: 0 })];
    case 'basket': return [P(L, '#b88552', [path('M', -6, -2, 'Q', 0, -14, 6, -2)], { cut: offset([path('M', -4, -2, 'Q', 0, -11, 4, -2)], hx, hy), shade: 0 }), P(L + 0.01, '#d9a46a', [poly(-7, -2, 7, -2, 5, 7, -5, 7)], { pattern: { kind: 'plaid', color: '#b88552', every: 2 } }), P(L + 0.02, main, [ell(-3, -2.5, 2, 2), ell(1, -3, 2, 2), ell(4.5, -2, 1.8, 1.8)], { shade: 0 })];
    case 'scythe': return [P(L, '#4a3a4a', [cap(0, 16, 0, -46, 1.2)], { shade: 0 }), P(L + 0.01, main, [path('M', 0, -46, 'Q', 18, -50, 24, -36, 'Q', 16, -44, 0, -42)])];
    case 'phone': return [P(L, main, [rect(-2.5, -6, 5, 9)]), P(L + 0.01, '#bfe6ff', [rect(-1.5, -5, 3, 6)], { edge: false, shade: 0 })];
    default: return [];
  }
}

export function faceDetailParts(spec: RenderSpec, ctx: GenContext): Part[] {
  const L = LAYER.faceCosmetic;
  const { sk, tag } = ctx;
  const hx = sk.head.x, hy = sk.head.y;
  const bm = (x: number, y: number, rows: string[], pal: Record<string, string>, alpha = 1): Part => ({ layer: L, tag, alpha, bitmap: { x: x + hx, y: y + hy, rows, pal: { ...pal, '.': null } } });
  const main = ctx.dye('main', '#ff5c8a');
  switch (spec.style as string) {
    case 'freckles': return [bm(63, 82, ['f.f', '.f.'], { f: darken(ctx.skin.shade, 0.15) }), bm(94, 82, ['f.f', '.f.'], { f: darken(ctx.skin.shade, 0.15) })];
    case 'bandaid': return [bm(92, 81, ['.bbbb.', 'bbpbbb', '.bbbb.'], { b: '#f3d0a6', p: '#e2ad85' })];
    case 'mole': return [bm(85, 86, ['m'], { m: darken(ctx.skin.line, 0.2) })];
    case 'heart': return [bm(93, 82, ['h.h', 'hhh', '.h.'], { h: main })];
    case 'stars': return [bm(94, 81, ['.s.', 'sss', '.s.'], { s: ctx.dye('main', '#ffd34d') }), bm(62, 83, ['s'], { s: ctx.dye('main', '#ffd34d') })];
    case 'tear': return [bm(73, 83, ['t', 't'], { t: ctx.dye('main', '#7fc8ff') })];
    case 'whiskers': return [bm(59, 82, ['www.', '....', 'www.'], { w: ctx.skin.line }, 0.8), bm(98, 82, ['.www', '....', '.www'], { w: ctx.skin.line }, 0.8)];
    case 'stickers': return [bm(62, 81, ['.oo.', 'oooo', '.oo.'], { o: main }, 0.85), bm(95, 81, ['.oo.', 'oooo', '.oo.'], { o: main }, 0.85)];
    case 'scar': return [bm(91, 79, ['s..', '.s.', '..s', '.s.'], { s: ctx.skin.line })];
    case 'glitter': return [bm(64, 80, ['g...g', '..g..'], { g: '#ffffff' }), bm(91, 80, ['g...g', '..g..'], { g: '#ffffff' })];
    default: return [];
  }
}

export function makeupParts(spec: RenderSpec, ctx: GenContext): Part[] {
  const { sk, tag } = ctx;
  const hx = sk.head.x, hy = sk.head.y;
  const parts: Part[] = [];
  if (spec.shadow) {
    const c = ctx.dye('shadow', spec.shadow as string);
    parts.push({ layer: LAYER.faceFeature - 0.01, tag, alpha: 0.55, bitmap: { x: 65 + hx, y: 70 + hy, rows: ['.sssssss.', 'sssssssss'], pal: { s: c, '.': null } } });
    parts.push({ layer: LAYER.faceFeature - 0.01, tag, alpha: 0.55, bitmap: { x: 85 + hx, y: 70 + hy, rows: ['.sssssss.', 'sssssssss'], pal: { s: c, '.': null } } });
  }
  if (spec.under) {
    const c = ctx.dye('under', spec.under as string);
    parts.push({ layer: LAYER.faceFeature + 0.02, tag, alpha: 0.8, bitmap: { x: 66 + hx, y: 82 + hy, rows: ['.uuuuuu.', '..uuuu..'], pal: { u: c, '.': null } } });
    parts.push({ layer: LAYER.faceFeature + 0.02, tag, alpha: 0.8, bitmap: { x: 86 + hx, y: 82 + hy, rows: ['.uuuuuu.', '..uuuu..'], pal: { u: c, '.': null } } });
  }
  if (spec.glitter) parts.push(...faceDetailParts({ kind: 'facedetail', style: 'glitter' }, ctx));
  return parts;
}

export function auraPreviewParts(spec: RenderSpec, ctx: GenContext): Part[] {
  // Static sparkle hint in the avatar frame; the world adds animated particles.
  const colors = (spec.colors as string[]) ?? ['#ffe680'];
  const f = ctx.frame % 2;
  const pts: [number, number][] = f ? [[52, 70], [110, 92], [58, 128], [104, 54]] : [[50, 92], [108, 70], [104, 126], [58, 52]];
  return pts.map(([x, y], i) => ({
    layer: i % 2 ? LAYER.frontFx : LAYER.backFx, tag: ctx.tag, color: colors[i % colors.length], shade: 0, alpha: 0.9,
    shapes: [spec.particle === 'heart' ? heart(x, y, 3) : spec.particle === 'snow' ? [diamond(x, y, 2.5, 2.5), rect(x - 3.5, y - 0.5, 7, 1), rect(x - 0.5, y - 3.5, 1, 7)] : [star(x, y, 3.5, 0.4, 4)]].flat(),
  }));
}

export { limbPortion };
