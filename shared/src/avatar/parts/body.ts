// The base body: head, neck, torso, arms, legs, feet. Geometry is fixed by the
// skeleton measurements; poses only move limbs and offset head/torso.

import { LAYER, type Part } from '../compose';
import { cap, ell, path, poly, type Shape } from '../raster';
import { type Skeleton } from '../skeleton';
import { fromModel } from '../proportions';
import type { SkinTone } from '../../types';

/**
 * Head silhouette in 3/4 view, traced from the model sheet in model coordinates:
 * skull dome, face front on the left (cheek x≈59), chin left of centre (77, 91.8),
 * jaw rising to the near ear on the right. Converted to template space so the
 * proportion map returns it exactly; parts using it are marked noTurn.
 */
const HEAD_MODEL = {
  dome: { x: 80.5, y: 66.5, rx: 22.5, ry: 24.5 },
  face: [
    'M', 58, 64,
    'L', 58.2, 74,
    'L', 59, 80,
    'Q', 60.5, 87, 67.5, 90,
    'Q', 72.5, 92, 77, 91.8,
    'Q', 84, 91.6, 91, 88.6,
    'Q', 98, 85, 101.5, 78,
    'L', 103, 64,
  ] as (string | number)[],
  ear: { x: 101.2, y: 79, rx: 3.3, ry: 5 },
  cheekShade: ['M', 59.6, 82, 'Q', 61.5, 88, 68.5, 90.6, 'Q', 63.5, 87.5, 61, 82] as (string | number)[],
  jawShade: ['M', 84, 91.2, 'Q', 93, 89, 100, 81.5, 'Q', 94, 87, 84, 90] as (string | number)[],
};

/** Convert a model-space shape (3/4 authored) into template space, then offset by the head pose. */
export function fromModelShape(s: Shape, dx = 0, dy = 0): Shape {
  switch (s.t) {
    case 'ell': {
      const [x, y] = fromModel(s.x, s.y);
      const [, top] = fromModel(s.x, s.y - s.ry);
      const [, bot] = fromModel(s.x, s.y + s.ry);
      const [lx] = fromModel(s.x - s.rx, s.y);
      return { t: 'ell', x: x + dx, y: y + dy, rx: x - lx, ry: (bot - top) / 2 };
    }
    case 'poly':
    case 'line': {
      const pts = s.pts.slice();
      for (let i = 0; i < pts.length; i += 2) {
        const [x, y] = fromModel(pts[i], pts[i + 1]);
        pts[i] = x + dx; pts[i + 1] = y + dy;
      }
      return { ...s, pts } as Shape;
    }
    default:
      return s;
  }
}

export function headShapes(sk: Skeleton): Shape[] {
  const d = HEAD_MODEL.dome;
  return [
    fromModelShape(ell(d.x, d.y, d.rx, d.ry), sk.head.x, sk.head.y),
    fromModelShape(path(...HEAD_MODEL.face), sk.head.x, sk.head.y),
  ];
}

/** Region inside the face, used to clip face cosmetics and hair shadows (already 3/4). */
export function faceClip(sk: Skeleton): Shape[] {
  return headShapes(sk);
}

export function torsoShape(sk: Skeleton, widen = 0): Shape {
  const x = sk.body.x, y = sk.body.y;
  const w = widen;
  return path(
    'M', 70.5 - w + x, 92 + y,
    'Q', 80 + x, 90 + y, 89.5 + w + x, 92 + y,
    'Q', 92 + w + x, 93 + y, 91.5 + w + x, 97 + y,
    'L', 89 + w + x, 109 + y,
    'Q', 90.5 + w + x, 114 + y, 90.5 + w + x, 119 + y,
    'L', 69.5 - w + x, 119 + y,
    'Q', 69.5 - w + x, 114 + y, 71 - w + x, 109 + y,
    'L', 68.5 - w + x, 97 + y,
    'Q', 68 - w + x, 93 + y, 70.5 - w + x, 92 + y,
  );
}

export function legShape(l: Skeleton['legL'], widen = 0): Shape {
  return cap(l.a.x, l.a.y, l.b.x, l.b.y, 4.4 + widen, 3.9 + widen);
}

export function armShape(l: Skeleton['armL'], widen = 0): Shape {
  return cap(l.a.x, l.a.y, l.b.x, l.b.y, 3.3 + widen, 2.9 + widen);
}

export function handShape(l: Skeleton['armL'], r = 3.2): Shape {
  return ell(l.b.x, l.b.y + 1.5, r, r + 0.3);
}

/** Feet point toward the facing side (left) in the 3/4 view. */
export function footShape(l: Skeleton['legL'], side: -1 | 1): Shape {
  return ell(l.b.x - 1.4 + side * 0.3, l.b.y + 2.5, 4.8, 2.8);
}

export function bodyParts(skin: SkinTone, sk: Skeleton): Part[] {
  const tag = 'base';
  const parts: Part[] = [];
  // Torso, neck, legs and feet as one silhouette so the joins have no seams.
  parts.push({
    layer: LAYER.body, tag, color: skin.base, edgeColor: skin.line, shade: 1,
    shapes: [
      torsoShape(sk),
      poly(76.5 + sk.body.x, 86 + sk.head.y, 83.5 + sk.body.x, 86 + sk.head.y, 83.5 + sk.body.x, 94 + sk.body.y, 76.5 + sk.body.x, 94 + sk.body.y),
      legShape(sk.legL), legShape(sk.legR),
      footShape(sk.legL, -1), footShape(sk.legR, 1),
    ],
  });
  // Neck shadow under the chin.
  parts.push({ layer: LAYER.body + 0.01, tag, color: skin.shade, edge: false, shade: 0, tone: 'base', shapes: [poly(77.5 + sk.head.x, 89 + sk.head.y, 82.5 + sk.head.x, 89 + sk.head.y, 82.5 + sk.head.x, 92 + sk.head.y, 77.5 + sk.head.x, 92 + sk.head.y)] });
  // Arms and hands sit above torso clothing so poses read clearly.
  parts.push({ layer: LAYER.arms, tag, color: skin.base, edgeColor: skin.line, shade: 1, shapes: [armShape(sk.armL), armShape(sk.armR)] });
  parts.push({ layer: LAYER.hands, tag, color: skin.base, edgeColor: skin.line, shade: 0, shapes: [handShape(sk.armL), handShape(sk.armR)] });
  // Near ear (the far ear is hidden in 3/4), then the head. Both authored in model space.
  const hx = sk.head.x, hy = sk.head.y;
  const E = HEAD_MODEL.ear;
  parts.push({ layer: LAYER.face - 0.01, tag, noTurn: true, color: skin.base, edgeColor: skin.line, shade: 1, shapes: [fromModelShape(ell(E.x, E.y, E.rx, E.ry), hx, hy)] });
  parts.push({ layer: LAYER.face - 0.005, tag, noTurn: true, color: skin.shade, edge: false, shade: 0, tone: 'base', shapes: [fromModelShape(ell(E.x + 0.3, E.y + 0.5, 1.2, 2.6), hx, hy)] });
  parts.push({ layer: LAYER.face, tag, noTurn: true, color: skin.base, edgeColor: skin.line, shade: 0, shapes: headShapes(sk) });
  // Soft shading along the front cheek and under the jaw.
  parts.push({ layer: LAYER.face + 0.01, tag, noTurn: true, clipNoTurn: true, color: skin.shade, edge: false, shade: 0, tone: 'base', shapes: [fromModelShape(path(...HEAD_MODEL.cheekShade), hx, hy), fromModelShape(path(...HEAD_MODEL.jawShade), hx, hy)], clip: headShapes(sk) });
  // Nose: a single soft pixel just left of the face centre line.
  const [nx, ny] = fromModel(72.5, 84.5);
  parts.push({ layer: LAYER.faceFeature, tag, noTurn: true, bitmap: { x: nx + hx, y: ny + hy, rows: ['n'], pal: { n: skin.shade } } });
  return parts;
}
