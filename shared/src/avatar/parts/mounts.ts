// Mounts / movement items drawn inside the avatar frame around the feet.
// The avatar keeps its exact proportions; mounts only add parts and pick a pose.

import { LAYER, type Part } from '../compose';
import { ell, path, poly, rect, type Shape } from '../raster';
import { darken, lighten } from '../color';
import { diamond, star, heart } from './shapes';
import type { GenContext } from '../registry';
import type { RenderSpec } from '../../types';
import type { Pose } from '../skeleton';

export function mountPose(spec: RenderSpec | undefined, moving: boolean): Pose | null {
  if (!spec) return null;
  if (spec.pose === 'broom') return 'broom';
  return moving ? 'ride' : 'ride';
}

export function mountParts(spec: RenderSpec, ctx: GenContext): Part[] {
  const { tag, frame } = ctx;
  const bob = frame % 2 === 1 ? -1 : 0;
  const main = ctx.dye('main');
  const acc = ctx.dye('accent', lighten(main, 0.4));
  const P = (layer: number, color: string, shapes: Shape[], extra: Partial<Part> = {}): Part => ({ layer, tag, color, shapes: shapes.map((s) => shift(s, bob)), ...extra });
  const under = LAYER.backFx + 0.5;
  switch (spec.style as string) {
    case 'hoverboard':
      return [
        P(LAYER.backFx, ctx.dye('glow', '#7ff6ff'), [ell(80, 158, 18, 2)], { alpha: 0.5, edge: false, shade: 0 }),
        P(under, main, [ell(80, 153, 23, 4)], { gloss: { cx: 80, cy: 156, rx: 18, ry: 3, w: 0.5 } }),
        P(under + 0.01, acc, [rect(62, 153, 36, 1)], { edge: false, shade: 0 }),
      ];
    case 'skateboard':
      return [
        P(under, main, [path('M', 56, 151, 'L', 104, 151, 'Q', 109, 151, 109, 148, 'L', 110, 154, 'L', 50, 154, 'L', 51, 148, 'Q', 51, 151, 56, 151)], { pattern: { kind: 'stripes', color: acc, every: 6 } }),
        P(under + 0.01, '#3a3046', [ell(62, 156.5, 2.5, 2.5), ell(98, 156.5, 2.5, 2.5)], { shade: 0 }),
      ];
    case 'cloud':
      return [
        P(LAYER.frontAcc, main, [ell(66, 151, 9, 6), ell(80, 153, 11, 6), ell(94, 151, 9, 6), ell(74, 147, 7, 5), ell(88, 147, 7, 5)], { shade: 2 }),
        P(LAYER.frontAcc + 0.01, ctx.dye('accent', '#ffc4dd'), [ell(68, 152, 2, 1), ell(92, 152, 2, 1)], { edge: false, shade: 0, alpha: 0.8 }),
      ];
    case 'carpet':
      return [
        P(under, main, [poly(50, 150, 106, 150, 112, 156, 56, 156)], { pattern: { kind: 'diamonds', color: acc, every: 4 } }),
        P(under - 0.01, ctx.dye('fringe', '#ffd25e'), [rect(48, 149, 3, 1), rect(47, 151, 3, 1), rect(110, 155, 3, 1), rect(111, 157, 3, 1)], { edge: false, shade: 0 }),
      ];
    case 'star':
      return [
        P(LAYER.backFx, '#fff6b0', [ell(80, 157, 16, 2.5)], { alpha: 0.5, edge: false, shade: 0 }),
        P(under, main, [star(80, 153, 15, 0.55)].map((s) => squash(s, 153, 0.35)), { gloss: { cx: 80, cy: 156, rx: 10, ry: 3, w: 0.5 } }),
      ];
    case 'scooter':
      return [
        P(under, main, [rect(60, 151, 40, 3)]),
        P(under + 0.01, '#3a3046', [ell(60, 156, 3, 3), ell(100, 156, 3, 3)], { shade: 0 }),
        P(LAYER.frontAcc, main, [rect(98, 112, 2, 40)], { shade: 0 }),
        P(LAYER.frontAcc + 0.01, acc, [rect(93, 111, 12, 2.5)], { shade: 0 }),
      ];
    case 'broom':
      return [
        P(LAYER.bottom + 0.5, ctx.dye('stick', '#9b6a42'), [poly(46, 127, 116, 123, 116, 125.5, 46, 129.5)]),
        P(LAYER.bottom + 0.51, ctx.dye('bristle', '#e6c26a'), [path('M', 48, 125, 'L', 36, 119, 'L', 32, 128, 'L', 36, 136, 'L', 48, 131)], { pattern: { kind: 'stripes', color: darken(ctx.dye('bristle', '#e6c26a'), 0.2), every: 2 } }),
        P(LAYER.bottom + 0.52, ctx.dye('accent', '#e8384f'), [rect(46, 124.5, 3, 7)], { shade: 0 }),
      ];
    case 'plushbear':
      return [
        P(LAYER.backAcc + 0.5, main, [ell(80, 140, 30, 14), ell(58, 152, 7, 6), ell(102, 152, 7, 6)]),
        P(LAYER.frontAcc, main, [ell(110, 128, 11, 10), ell(103, 119, 4, 4), ell(117, 119, 4, 4)]),
        P(LAYER.frontAcc + 0.01, acc, [ell(110, 131, 4.5, 3.5)], { shade: 0 }),
        P(LAYER.frontAcc + 0.02, '#2b1b2e', [rect(106, 126, 1.5, 2), rect(113, 126, 1.5, 2), rect(109.5, 130, 1.5, 1)], { edge: false, shade: 0 }),
      ];
    case 'heartcar':
      return [
        P(under, main, [heart(80, 146, 16)].flat().map((s) => squash(s, 148, 0.55)), { gloss: { cx: 74, cy: 146, rx: 10, ry: 4, w: 0.5 } }),
        P(LAYER.frontAcc, main, [path('M', 58, 140, 'Q', 80, 148, 102, 140, 'L', 100, 154, 'Q', 80, 158, 60, 154)]),
        P(LAYER.frontAcc + 0.01, '#ffffff', [ell(66, 156, 3, 3), ell(94, 156, 3, 3)]),
      ];
    case 'crystal':
      return [
        P(LAYER.backFx, ctx.dye('glow', '#c9b6ff'), [ell(80, 158, 18, 2)], { alpha: 0.5, edge: false, shade: 0 }),
        P(under, main, [diamond(80, 153, 24, 4)], { alpha: 0.9, gloss: { cx: 80, cy: 156, rx: 18, ry: 3, w: 0.4 } }),
      ];
    default:
      return [];
  }
}

function shift(s: Shape, dy: number): Shape {
  if (!dy) return s;
  switch (s.t) {
    case 'ell': return { ...s, y: s.y + dy };
    case 'rect': return { ...s, y: s.y + dy };
    case 'cap': return { ...s, y1: s.y1 + dy, y2: s.y2 + dy };
    default: return { ...s, pts: s.pts.map((v, i) => (i % 2 ? v + dy : v)) } as Shape;
  }
}

function squash(s: Shape, cy: number, k: number): Shape {
  switch (s.t) {
    case 'ell': return { ...s, y: cy + (s.y - cy) * k, ry: s.ry * k };
    case 'poly': return { ...s, pts: s.pts.map((v, i) => (i % 2 ? cy + (v - cy) * k : v)) };
    default: return s;
  }
}
