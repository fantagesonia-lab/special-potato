// Clothing generators: tops, bottoms, dresses, jackets, socks, shoes, gloves.
// Garments are built from the body's own shapes (torso, limb capsules) widened by a
// pixel or two, so they always conform to the locked base silhouette.

import { LAYER, type Part, type Pattern } from '../compose';
import { cap, ell, path, poly, rect, type Shape } from '../raster';
import { armShape, footShape, handShape, legShape } from './body';
import { bow, heart, star, flower } from './shapes';
import { mix, darken, lighten } from '../color';
import type { GenContext } from '../registry';
import type { Skeleton, Limb } from '../skeleton';
import type { RenderSpec } from '../../types';

type Deco = { t: string; color?: string; [k: string]: unknown };

const HEM: Record<string, number> = { crop: 105, waist: 113, hip: 120, tunic: 127, long: 140 };

/** Torso-shaped garment from the shoulders down to `bottom` (frame y, before body offset). */
export function garmentTorso(sk: Skeleton, bottom: number, widen = 0.8, flare = 0): Shape {
  const x = sk.body.x, y = sk.body.y, w = widen;
  const pts: (string | number)[] = [
    'M', 70 - w + x, 91.5 + y,
    'Q', 80 + x, 89.5 + y, 90 + w + x, 91.5 + y,
    'Q', 92.5 + w + x, 92.5 + y, 92 + w + x, 97 + y,
    'L', 89.5 + w + x, 108 + y,
  ];
  const sideR = (yy: number) => (yy <= 108 ? 89.5 + w : 89.5 + w + Math.min(1.5, (yy - 108) * 0.15) + Math.max(0, yy - 113) * flare);
  pts.push('L', sideR(bottom) + x, bottom + y, 'L', 160 - sideR(bottom) + x, bottom + y);
  pts.push('L', 70.5 - w + x, 108 + y, 'L', 68 - w + x, 97 + y, 'Q', 67.5 - w + x, 92.5 + y, 70 - w + x, 91.5 + y);
  return path(...pts);
}

function limbPortion(l: Limb, from: number, to: number): Limb {
  const lerp = (t: number) => ({ x: l.a.x + (l.b.x - l.a.x) * t, y: l.a.y + (l.b.y - l.a.y) * t });
  return { a: lerp(from), b: lerp(to) };
}

function sleeveShapes(sk: Skeleton, style: string, widen = 0.9): Shape[] {
  const out: Shape[] = [];
  for (const arm of [sk.armL, sk.armR]) {
    const side = arm === sk.armL ? -1 : 1;
    switch (style) {
      case 'none': case 'off': break;
      case 'cap': out.push(armShape(limbPortion(arm, 0, 0.18), widen + 0.4)); break;
      case 'short': out.push(armShape(limbPortion(arm, 0, 0.42), widen + 0.3)); break;
      case 'puff': out.push(ell(arm.a.x + side * 1, arm.a.y + 2.5, 5.2, 4.8)); break;
      case 'long': out.push(armShape(limbPortion(arm, 0, 0.9), widen)); break;
      case 'bell': {
        out.push(armShape(limbPortion(arm, 0, 0.6), widen));
        const e = limbPortion(arm, 0.55, 0.95);
        out.push(poly(e.a.x - 3, e.a.y, e.a.x + 3, e.a.y, e.b.x + side * 3 + 4, e.b.y + 1, e.b.x + side * 3 - 5, e.b.y + 1));
        break;
      }
      case 'flare': {
        const e = limbPortion(arm, 0, 0.95);
        out.push(poly(e.a.x - 3.2, e.a.y - 1, e.a.x + 3.2, e.a.y - 1, e.b.x + 4.5, e.b.y + 1, e.b.x - 4.5, e.b.y + 1));
        break;
      }
      case 'kimono': {
        const e = limbPortion(arm, 0, 0.85);
        out.push(poly(e.a.x - 3.5, e.a.y - 1, e.a.x + 3.5, e.a.y - 1, e.b.x + side * 2 + 4, e.b.y + 6, e.b.x + side * 2 - 5, e.b.y + 6));
        break;
      }
    }
  }
  return out;
}

function cuffShapes(sk: Skeleton, style: string): Shape[] {
  if (!['long', 'bell', 'flare'].includes(style)) return [];
  return [sk.armL, sk.armR].map((arm) => {
    const e = limbPortion(arm, 0.82, 0.92);
    return cap(e.a.x, e.a.y, e.b.x, e.b.y, style === 'long' ? 3.6 : 4.4);
  });
}

function patternOf(spec: RenderSpec, ctx: GenContext): Pattern | undefined {
  const p = spec.pattern as { kind: Pattern['kind']; color?: string; every?: number; rows?: string[]; pal?: Record<string, string> } | undefined;
  if (!p) return undefined;
  return { ...p, color: p.color ? ctx.dye(p.color, p.color) : ctx.dye('accent') };
}

function decoParts(decos: Deco[] | undefined, ctx: GenContext, layer: number, hem: number): Part[] {
  if (!decos) return [];
  const { sk, tag } = ctx;
  const x = sk.body.x, y = sk.body.y;
  const out: Part[] = [];
  const c = (d: Deco, ch = 'accent') => ctx.dye((d.color as string) ?? ch, d.color as string);
  for (const d of decos) {
    switch (d.t) {
      case 'bow':
        out.push({ layer: layer + 0.05, tag, color: c(d), shapes: bow(80 + x, (d.y as number ?? 95) + y, (d.size as number) ?? 0.75) });
        out.push({ layer: layer + 0.06, tag, color: darken(c(d), 0.15), shade: 0, shapes: [ell(80 + x, (d.y as number ?? 95) + 0.5 + y, 1.6, 1.6)] });
        break;
      case 'buttons':
        for (let by = 97; by < hem - 2; by += 4) out.push({ layer: layer + 0.05, tag, color: c(d, 'trim'), edge: false, shade: 0, tone: 'light', shapes: [rect(79.5 + x, by + y, 1, 1)] });
        break;
      case 'placket':
        out.push({ layer: layer + 0.04, tag, color: c(d, 'trim'), shade: 0, shapes: [rect(78.5 + x, 93 + y, 3, hem - 93)] });
        break;
      case 'zip':
        out.push({ layer: layer + 0.05, tag, color: c(d, 'trim'), edge: false, shade: 0, tone: 'line', shapes: [rect(79.5 + x, 93 + y, 1, hem - 94)] });
        break;
      case 'heart':
        out.push({ layer: layer + 0.05, tag, color: c(d), shade: 0, shapes: heart(80 + x, 100 + y, (d.size as number) ?? 3.2) });
        break;
      case 'star':
        out.push({ layer: layer + 0.05, tag, color: c(d), shade: 0, shapes: [star(80 + x, 101 + y, (d.size as number) ?? 4.5)] });
        break;
      case 'flower':
        out.push({ layer: layer + 0.05, tag, color: c(d), shade: 0, shapes: flower(80 + x, 100 + y, 3.5) });
        out.push({ layer: layer + 0.06, tag, color: '#ffe680', edge: false, shade: 0, shapes: [ell(80 + x, 100 + y, 1.2, 1.2)] });
        break;
      case 'emblem':
        out.push({ layer: layer + 0.05, tag, color: c(d), shapes: [poly(80 + x, 96 + y, 85 + x, 98 + y, 84 + x, 104 + y, 80 + x, 107 + y, 76 + x, 104 + y, 75 + x, 98 + y)] });
        break;
      case 'pocket':
        out.push({ layer: layer + 0.05, tag, color: c(d, 'main'), shade: 0, shapes: [rect(83 + x, 101 + y, 5, 5)] });
        break;
      case 'tie':
        out.push({ layer: layer + 0.05, tag, color: c(d), shapes: [poly(78.5 + x, 92 + y, 81.5 + x, 92 + y, 80.8 + x, 94 + y, 82.5 + x, 104 + y, 80 + x, 107 + y, 77.5 + x, 104 + y, 79.2 + x, 94 + y)] });
        break;
      case 'stripe':
        out.push({ layer: layer + 0.04, tag, color: c(d), shade: 0, edge: false, shapes: [rect(66 + x, ((d.y as number) ?? 102) + y, 28, (d.h as number) ?? 2)], clip: [garmentTorso(sk, hem, 0.8)] });
        break;
      case 'hemlace':
        for (let lx = 68; lx <= 92; lx += 3) out.push({ layer: layer + 0.05, tag, color: c(d, 'trim'), shade: 0, edge: false, tone: 'base', shapes: [ell(lx + x, hem + y, 1.8, 1.6)] });
        break;
      case 'corset':
        out.push({ layer: layer + 0.03, tag, color: c(d), shapes: [poly(71 + x, 101 + y, 89 + x, 101 + y, 88.5 + x, 113 + y, 71.5 + x, 113 + y)] });
        for (let ly = 103; ly < 112; ly += 3) out.push({ layer: layer + 0.04, tag, color: c(d, 'trim'), edge: false, shade: 0, tone: 'light', shapes: [poly(78 + x, ly + y, 82 + x, ly + 2 + y, 82 + x, ly + 3 + y, 78 + x, ly + 1 + y)] });
        break;
      case 'chain':
        for (let cx = 72; cx <= 88; cx += 2) out.push({ layer: layer + 0.06, tag, color: '#d7dbe6', edge: false, shade: 0, tone: (cx % 4 ? 'light' : 'base'), shapes: [rect(cx + x, 108 + Math.abs(cx - 80) * -0.15 + y, 1, 1)] });
        break;
      case 'strawberry':
        out.push({ layer: layer + 0.05, tag, color: '#e8384f', shapes: [path('M', 76.5 + x, 98 + y, 'Q', 80 + x, 96 + y, 83.5 + x, 98 + y, 'Q', 83 + x, 104 + y, 80 + x, 106 + y, 'Q', 77 + x, 104 + y, 76.5 + x, 98 + y)] });
        out.push({ layer: layer + 0.06, tag, color: '#4fb35a', shade: 0, shapes: [poly(77 + x, 97 + y, 80 + x, 95 + y, 83 + x, 97 + y, 80 + x, 99 + y)] });
        break;
      case 'moon':
        out.push({ layer: layer + 0.05, tag, color: c(d), shade: 0, shapes: [ell(80 + x, 101 + y, 4, 4)], cut: [ell(82 + x, 99.5 + y, 3.5, 3.5)] });
        break;
      case 'number':
        out.push({ layer: layer + 0.05, tag, color: c(d), shade: 0, edge: false, shapes: [rect(78 + x, 97 + y, 1, 7), rect(81 + x, 97 + y, 2, 1), rect(82 + x, 97 + y, 1, 7), rect(81 + x, 103 + y, 2, 1)] });
        break;
      case 'skull':
        out.push({ layer: layer + 0.05, tag, color: '#f4f0f8', shapes: [ell(80 + x, 100 + y, 3.5, 3), rect(78 + x, 102 + y, 4, 2.5)] });
        out.push({ layer: layer + 0.06, tag, color: '#2b1b2e', edge: false, shade: 0, shapes: [rect(78 + x, 100 + y, 1, 1), rect(81 + x, 100 + y, 1, 1)] });
        break;
      case 'gem':
        out.push({ layer: layer + 0.06, tag, color: c(d), shade: 0, gloss: { cx: 80 + x, cy: 99 + y, rx: 2, ry: 2, w: 0.5 }, shapes: [poly(80 + x, 96 + y, 82.5 + x, 98.5 + y, 80 + x, 102 + y, 77.5 + x, 98.5 + y)] });
        break;
    }
  }
  return out;
}

function collarParts(kind: string | undefined, ctx: GenContext, layer: number): Part[] {
  if (!kind) return [];
  const { sk, tag } = ctx;
  const x = sk.body.x, y = sk.body.y;
  const trim = ctx.dye('trim', ctx.dye('accent'));
  switch (kind) {
    case 'sailor':
      return [
        { layer: layer + 0.02, tag, color: ctx.dye('accent'), shapes: [poly(69.5 + x, 91.5 + y, 90.5 + x, 91.5 + y, 92 + x, 97 + y, 84 + x, 98 + y, 80 + x, 103 + y, 76 + x, 98 + y, 68 + x, 97 + y)] },
        { layer: layer + 0.03, tag, color: trim === ctx.dye('accent') ? '#ffffff' : trim, edge: false, shade: 0, shapes: [poly(70 + x, 95.5 + y, 76.5 + x, 96.5 + y, 76.5 + x, 97.2 + y, 70 + x, 96.3 + y), poly(90 + x, 95.5 + y, 83.5 + x, 96.5 + y, 83.5 + x, 97.2 + y, 90 + x, 96.3 + y)] },
        { layer: layer + 0.04, tag, color: ctx.dye('bow', '#e8384f'), shapes: bow(80 + x, 99 + y, 0.6) },
      ];
    case 'peter':
      return [{ layer: layer + 0.02, tag, color: trim, shapes: [ell(76 + x, 93 + y, 4.2, 2.6), ell(84 + x, 93 + y, 4.2, 2.6)] }];
    case 'high':
    case 'turtle':
      return [{ layer: LAYER.neck - 0.1, tag, color: kind === 'high' ? trim : ctx.dye('main'), shapes: [rect(75.5 + x, 87.5 + y, 9, 6)] }];
    case 'ruff':
      return [{ layer: LAYER.neck - 0.1, tag, color: trim, shapes: [ell(74 + x, 91 + y, 3.5, 2.5), ell(80 + x, 92 + y, 3.5, 2.5), ell(86 + x, 91 + y, 3.5, 2.5)] }];
    case 'hood':
      return [{ layer: LAYER.clothBack, tag, color: ctx.dye('main'), shapes: [ell(80 + x, 89 + y, 15, 6)] }];
    case 'v':
      return [{ layer: layer + 0.02, tag, color: ctx.dye('base', ctx.skin.base), edgeColor: ctx.skin.line, shade: 0, shapes: [poly(76 + x, 91 + y, 84 + x, 91 + y, 80 + x, 99 + y)] }];
    case 'bow':
      return [
        { layer: layer + 0.04, tag, color: ctx.dye('bow', ctx.dye('accent')), shapes: bow(80 + x, 93 + y, 0.75) },
        { layer: layer + 0.05, tag, color: darken(ctx.dye('bow', ctx.dye('accent')), 0.15), shade: 0, shapes: [ell(80 + x, 93.5 + y, 1.6, 1.6)] },
      ];
    case 'collar':
      return [{ layer: layer + 0.02, tag, color: trim, shapes: [poly(73 + x, 91 + y, 80 + x, 94 + y, 75 + x, 96 + y), poly(87 + x, 91 + y, 80 + x, 94 + y, 85 + x, 96 + y)] }];
    case 'round':
    default:
      return [];
  }
}

export function topParts(spec: RenderSpec, ctx: GenContext, layer: number = LAYER.top): Part[] {
  const { sk, tag } = ctx;
  const x = sk.body.x, y = sk.body.y;
  const body = (spec.body as string) ?? 'tee';
  const len = (spec.length as string) ?? 'waist';
  const hem = HEM[len] ?? 113;
  const main = ctx.dye('main');
  const pattern = patternOf(spec, ctx);
  const parts: Part[] = [];
  const sleeves = (spec.sleeves as string) ?? 'short';
  const torso = garmentTorso(sk, hem, body === 'sweater' || body === 'hoodie' ? 1.4 : 0.8, len === 'tunic' ? 0.5 : 0);
  const cut: Shape[] = [];
  if (body === 'tank') cut.push(poly(68 + x, 90 + y, 74 + x, 90 + y, 74 + x, 97 + y, 69 + x, 99 + y), poly(92 + x, 90 + y, 86 + x, 90 + y, 86 + x, 97 + y, 91 + x, 99 + y));
  if (body === 'tube' || sleeves === 'off') cut.push(rect(60 + x, 85 + y, 40, body === 'tube' ? 12 : 9.5));
  if (body === 'crop') cut.push(rect(60 + x, 106 + y, 40, 10));
  if (spec.collar === 'v') cut.push(poly(76.5 + x, 89 + y, 83.5 + x, 89 + y, 80 + x, 98 + y));
  parts.push({ layer, tag, color: main, pattern, shapes: [torso], cut });
  if (body === 'tank') {
    parts.push({ layer: layer + 0.01, tag, color: main, shade: 0, shapes: [rect(73 + x, 90.5 + y, 2.5, 6), rect(84.5 + x, 90.5 + y, 2.5, 6)] });
  }
  if (sleeves === 'off') {
    parts.push({ layer: LAYER.sleeves, tag, color: ctx.dye('trim', main), shapes: [ell(68 + x, 98 + y, 4.5, 3), ell(92 + x, 98 + y, 4.5, 3)] });
  }
  if (body === 'hoodie') {
    parts.push({ layer: layer + 0.02, tag, color: ctx.dye('accent', main), shade: 0, shapes: [rect(73 + x, 106 + y, 14, 5)] });
    parts.push({ layer: layer + 0.03, tag, color: '#f6f2ee', edge: false, shade: 0, shapes: [rect(77 + x, 94 + y, 1, 6), rect(82 + x, 94 + y, 1, 6)] });
  }
  if (body === 'armor') {
    parts.push({ layer: layer + 0.02, tag, color: ctx.dye('accent'), gloss: { cx: 80 + x, cy: 104 + y, rx: 9, ry: 8, w: 0.8 }, shapes: [poly(71 + x, 93 + y, 89 + x, 93 + y, 88 + x, 107 + y, 80 + x, 110 + y, 72 + x, 107 + y)] });
    parts.push({ layer: LAYER.sleeves + 0.02, tag, color: ctx.dye('accent'), gloss: { cx: 66 + x, cy: 99 + y, rx: 4, ry: 4 }, shapes: [ell(67 + x, 95 + y, 5.5, 4.2), ell(93 + x, 95 + y, 5.5, 4.2)] });
  }
  if (body === 'kimono') {
    parts.push({ layer: layer + 0.02, tag, color: ctx.dye('trim'), shade: 0, shapes: [poly(74 + x, 91 + y, 77 + x, 91 + y, 84 + x, 104 + y, 81 + x, 104 + y), poly(86 + x, 91 + y, 83 + x, 91 + y, 80.5 + x, 98 + y, 79.5 + x, 96 + y)] });
    parts.push({ layer: layer + 0.03, tag, color: ctx.dye('accent'), shapes: [rect(70.5 + x, 104 + y, 19, 6)] });
  }
  const sl = sleeveShapes(sk, sleeves);
  if (sl.length) parts.push({ layer: LAYER.sleeves, tag, color: main, pattern, shapes: sl });
  const cuffs = spec.cuffs ? cuffShapes(sk, sleeves) : [];
  if (cuffs.length) parts.push({ layer: LAYER.sleeves + 0.01, tag, color: ctx.dye('trim', ctx.dye('accent')), shade: 0, shapes: cuffs });
  if (spec.hemTrim) parts.push({ layer: layer + 0.03, tag, color: ctx.dye('trim', ctx.dye('accent')), shade: 0, shapes: [rect(69 + x, hem - 2.5 + y, 22, 2.5)], clip: [torso] });
  parts.push(...collarParts(spec.collar as string, ctx, layer));
  parts.push(...decoParts(spec.deco as Deco[], ctx, layer, hem));
  return parts;
}

const SKIRT_LEN: Record<string, number> = { micro: 119, mini: 124, short: 127, knee: 133, midi: 139, long: 145, floor: 151 };

export function skirtParts(spec: RenderSpec, ctx: GenContext, layer: number, waistY = 109.5): Part[] {
  const { sk, tag } = ctx;
  const x = sk.body.x, y = sk.body.y;
  const style = (spec.style as string) ?? 'aline';
  const by = SKIRT_LEN[(spec.len as string) ?? 'mini'] ?? 124;
  const bottom = sk.sitting ? Math.min(by, 128) : by;
  const depth = bottom - waistY;
  const main = ctx.dye(spec.channel as string ?? 'main');
  const parts: Part[] = [];
  let hw = 13 + depth * 0.32;
  if (style === 'puff' || style === 'ballgown') hw = 16 + depth * 0.5;
  if (style === 'tutu') hw = 22;
  if (style === 'pencil' || style === 'mermaid') hw = 11.5;
  if (style === 'pleated') hw = 13 + depth * 0.38;
  const top = 10;
  const pts: (string | number)[] = ['M', 80 - top + x, waistY + y, 'L', 80 + top + x, waistY + y];
  if (style === 'puff' || style === 'ballgown' || style === 'tutu') pts.push('Q', 80 + hw + 2 + x, waistY + depth * 0.3 + y, 80 + hw + x, bottom + y);
  else if (style === 'mermaid') pts.push('L', 80 + hw + x, bottom - 6 + y, 'L', 80 + hw + 5 + x, bottom + y);
  else pts.push('L', 80 + hw + x, bottom + y);
  // Hem: scalloped for frilly skirts, flat otherwise.
  const scallop = ['tiered', 'tutu', 'ballgown', 'frill', 'puff'].includes(style) || !!spec.frill;
  const right = style === 'mermaid' ? 80 + hw + 5 : 80 + hw, left = 160 - right;
  const n = Math.max(4, Math.round((right - left) / 4));
  for (let i = 1; i <= n; i++) {
    const hx = right - ((right - left) * i) / n;
    const midx = right - ((right - left) * (i - 0.5)) / n;
    if (scallop) pts.push('Q', midx + x, bottom + 3 + y, hx + x, bottom + y);
    else pts.push('L', hx + x, bottom + (i % 2 ? 0.5 : 0) + y);
  }
  if (style === 'puff' || style === 'ballgown' || style === 'tutu') pts.push('Q', 80 - hw - 2 + x, waistY + depth * 0.3 + y, 80 - top + x, waistY + y);
  else if (style === 'mermaid') pts.push('L', 80 - hw + x, bottom - 6 + y, 'L', 80 - top + x, waistY + y);
  else pts.push('L', 80 - top + x, waistY + y);
  const skirt = path(...pts);
  const pattern = patternOf(spec, ctx);
  parts.push({ layer, tag, color: main, pattern, shapes: [skirt] });
  if (style === 'pleated') {
    const lines: Shape[] = [];
    for (let i = -2; i <= 2; i++) lines.push({ t: 'line', pts: [80 + i * 4.5 + x, waistY + 3 + y, 80 + i * (4.5 + hw / 6) + x, bottom - 1 + y] });
    parts.push({ layer: layer + 0.01, tag, color: main, tone: 'shade', edge: false, shapes: lines, clip: [skirt] });
  }
  if (style === 'tiered' || style === 'ballgown') {
    for (const f of [0.38, 0.7]) {
      const ty = waistY + depth * f;
      const tw = 10 + (hw - 10) * (f + 0.12);
      const tier: (string | number)[] = ['M', 80 - tw + x, ty + y, 'L', 80 + tw + x, ty + y];
      const k = Math.max(4, Math.round((tw * 2) / 4));
      for (let i = 1; i <= k; i++) {
        const hx = 80 + tw - (tw * 2 * i) / k, mx = 80 + tw - (tw * 2 * (i - 0.5)) / k;
        tier.push('Q', mx + x, ty + 3 + y, hx + x, ty + y);
      }
      parts.push({ layer: layer + 0.02, tag, color: ctx.dye('trim', lighten(main, 0.3)), shade: 0, shapes: [path(...tier)], clip: [skirt] });
    }
  }
  if (spec.lace || style === 'tutu') {
    parts.push({ layer: layer - 0.01, tag, color: ctx.dye('trim', '#ffffff'), shade: 1, shapes: [path('M', left - 1 + x, bottom - 3 + y, 'L', right + 1 + x, bottom - 3 + y, 'L', right + 1 + x, bottom + 2.5 + y, 'L', left - 1 + x, bottom + 2.5 + y)], pattern: { kind: 'lace', color: lighten(ctx.dye('trim', '#ffffff'), 0.5) } });
  }
  if (spec.band) parts.push({ layer: layer + 0.03, tag, color: ctx.dye('accent'), shade: 0, shapes: [rect(70 + x, waistY - 0.5 + y, 20, 3)] });
  if (spec.bow) {
    parts.push({ layer: layer + 0.04, tag, color: ctx.dye('accent'), shapes: bow((spec.bow === 'side' ? 72 : 80) + x, waistY + 1 + y, 0.7) });
  }
  return parts;
}

export function bottomParts(spec: RenderSpec, ctx: GenContext): Part[] {
  const { sk, tag } = ctx;
  const x = sk.body.x, y = sk.body.y;
  const style = (spec.style as string) ?? 'pants';
  const main = ctx.dye('main');
  const pattern = patternOf(spec, ctx);
  if (style === 'skirt') return skirtParts({ ...spec, style: spec.skirt ?? 'aline' }, ctx, spec.high ? LAYER.bottomOver : LAYER.bottom);
  const parts: Part[] = [];
  const frac: Record<string, number> = { shorts: 0.32, bloomers: 0.3, capri: 0.7, pants: 1, wide: 1, skinny: 1, cargo: 1, jeans: 1, joggers: 1, overalls: 1, hakama: 1, shortalls: 0.3, biker: 0.45 };
  const f = frac[style] ?? 1;
  const hipBlock = path(
    'M', 70.5 + x, 108.5 + y, 'L', 89.5 + x, 108.5 + y,
    'Q', 91.2 + x, 114 + y, 90.8 + x, 121 + y, 'L', 69.2 + x, 121 + y, 'Q', 68.8 + x, 114 + y, 70.5 + x, 108.5 + y,
  );
  const legs: Shape[] = [];
  for (const leg of [sk.legL, sk.legR]) {
    const side = leg === sk.legL ? -1 : 1;
    const l = limbPortion(leg, 0, f === 1 ? 0.97 : f);
    if (style === 'wide' || style === 'hakama') {
      legs.push(poly(l.a.x - 4.6, l.a.y, l.a.x + 4.6, l.a.y, l.b.x + 6 + side * 1.5, l.b.y + 1, l.b.x - 6 + side * 1.5, l.b.y + 1));
    } else if (style === 'bloomers') {
      legs.push(ell(l.a.x + side * 1, l.a.y + 3, 6.5, 6));
    } else if (style === 'joggers' || style === 'cargo') {
      legs.push(legShape(l, 1.2));
    } else {
      legs.push(legShape(l, style === 'skinny' ? 0.3 : 0.8));
    }
  }
  if (style === 'hakama') legs.push(poly(70 + x, 115 + y, 90 + x, 115 + y, 97 + x, 147 + y, 63 + x, 147 + y));
  parts.push({ layer: LAYER.bottom, tag, color: main, pattern, shapes: [hipBlock, ...legs] });
  if (style === 'jeans' || style === 'cargo') {
    parts.push({ layer: LAYER.bottom + 0.01, tag, color: main, tone: 'shade', edge: false, shapes: [{ t: 'line', pts: [80 + x, 110 + y, 80 + x, 119 + y] }] });
  }
  if (style === 'cargo') {
    parts.push({ layer: LAYER.bottom + 0.02, tag, color: ctx.dye('accent', main), shade: 0, shapes: [rect(sk.legL.a.x - 6, 125 + y, 4, 6), rect(sk.legR.a.x + 2, 125 + y, 4, 6)] });
  }
  if (style === 'joggers' || spec.cuffs) {
    for (const leg of [sk.legL, sk.legR]) {
      const l = limbPortion(leg, f - 0.1, f - 0.02);
      parts.push({ layer: LAYER.bottom + 0.02, tag, color: ctx.dye('accent', main), shade: 0, shapes: [legShape(l, style === 'joggers' ? 1.0 : 1.2)] });
    }
  }
  if (style === 'overalls' || style === 'shortalls') {
    parts.push({ layer: LAYER.bottomOver, tag, color: main, pattern, shapes: [poly(73 + x, 98 + y, 87 + x, 98 + y, 88 + x, 110 + y, 72 + x, 110 + y)] });
    parts.push({ layer: LAYER.bottomOver + 0.01, tag, color: main, shade: 0, shapes: [rect(72 + x, 91 + y, 2.4, 8), rect(85.6 + x, 91 + y, 2.4, 8)] });
    parts.push({ layer: LAYER.bottomOver + 0.02, tag, color: ctx.dye('accent', '#f2d26b'), edge: false, shade: 0, shapes: [rect(72.5 + x, 98 + y, 1.5, 1.5), rect(86 + x, 98 + y, 1.5, 1.5)] });
    parts.push({ layer: LAYER.bottomOver + 0.02, tag, color: ctx.dye('accent', main), shade: 0, shapes: [rect(77 + x, 101 + y, 6, 5)] });
  }
  if (spec.belt) parts.push({ layer: LAYER.belt, tag, color: ctx.dye('belt', '#5a3a2e'), shade: 0, shapes: [rect(70 + x, 108.5 + y, 20, 2.5)] });
  return parts;
}

export function dressParts(spec: RenderSpec, ctx: GenContext): Part[] {
  const top = (spec.top as RenderSpec) ?? { kind: 'top', body: 'tee', sleeves: 'puff' };
  const skirt = (spec.skirt as RenderSpec) ?? { kind: 'skirt', style: 'aline', len: 'knee' };
  const parts: Part[] = [];
  parts.push(...topParts({ ...top, length: 'waist' }, ctx, LAYER.dress));
  parts.push(...skirtParts(skirt, ctx, LAYER.dress + 0.1, 108.5));
  if (spec.sash) {
    const { sk, tag } = ctx;
    parts.push({ layer: LAYER.dress + 0.2, tag, color: ctx.dye('sash', ctx.dye('accent')), shade: 0, shapes: [rect(70 + sk.body.x, 107 + sk.body.y, 20, 3.5)] });
    if (spec.sash === 'bow') parts.push({ layer: LAYER.dress + 0.21, tag, color: ctx.dye('sash', ctx.dye('accent')), shapes: bow(80 + sk.body.x, 108.5 + sk.body.y, 0.8) });
  }
  if (spec.apron) {
    const { sk, tag } = ctx;
    const x = sk.body.x, y = sk.body.y;
    parts.push({ layer: LAYER.dressOverlay, tag, color: ctx.dye('apron', '#ffffff'), shapes: [path('M', 74 + x, 98 + y, 'L', 86 + x, 98 + y, 'L', 86 + x, 108 + y, 'L', 90 + x, 126 + y, 'Q', 80 + x, 130 + y, 70 + x, 126 + y, 'L', 74 + x, 108 + y)] });
  }
  return parts;
}

export function jacketParts(spec: RenderSpec, ctx: GenContext): Part[] {
  const { sk, tag } = ctx;
  const x = sk.body.x, y = sk.body.y;
  const style = (spec.style as string) ?? 'open';
  const main = ctx.dye('main');
  const trim = ctx.dye('trim', ctx.dye('accent', main));
  const hem = HEM[(spec.length as string) ?? 'hip'] ?? 120;
  const parts: Part[] = [];
  const pattern = patternOf(spec, ctx);
  if (style === 'cape' || style === 'capelet') {
    const by = style === 'cape' ? 140 : 108;
    parts.push({ layer: LAYER.clothBack, tag, color: ctx.dye('lining', darken(main, 0.15)), shapes: [path('M', 69 + x, 91 + y, 'L', 91 + x, 91 + y, 'Q', 100 + x, by - 20 + y, 104 + x, by + y, 'Q', 80 + x, by + 4 + y, 56 + x, by + y, 'Q', 60 + x, by - 20 + y, 69 + x, 91 + y)] });
    parts.push({ layer: LAYER.jacket, tag, color: main, pattern, shapes: [path('M', 68 + x, 91 + y, 'L', 92 + x, 91 + y, 'Q', 96 + x, 96 + y, 96 + x, 101 + y, 'Q', 88 + x, 104 + y, 80 + x, 101 + y, 'Q', 72 + x, 104 + y, 64 + x, 101 + y, 'Q', 64 + x, 96 + y, 68 + x, 91 + y)] });
    parts.push({ layer: LAYER.jacket + 0.02, tag, color: trim, gloss: { cx: 80 + x, cy: 96 + y, rx: 2, ry: 2 }, shapes: [ell(80 + x, 95 + y, 2.2, 2.2)] });
    if (spec.fur) parts.push({ layer: LAYER.jacket + 0.03, tag, color: ctx.dye('fur', '#f4f1ff'), shapes: [ell(70 + x, 92 + y, 5, 3.5), ell(76 + x, 91 + y, 4, 3), ell(84 + x, 91 + y, 4, 3), ell(90 + x, 92 + y, 5, 3.5)] });
    return parts;
  }
  const flare = style === 'longcoat' || style === 'trench' ? 0.45 : 0;
  const bottom = style === 'bolero' ? 101 : style === 'longcoat' || style === 'trench' ? 141 : hem;
  // Two front panels leave the top visible down the middle.
  const opening = style === 'blazer' || style === 'varsity' || style === 'open' || style === 'cardigan' || style === 'fur' || style === 'longcoat' || style === 'trench' || style === 'bolero' ? 4.5 : 0;
  const full = garmentTorso(sk, bottom, 1.6, flare);
  const gap = opening > 0 ? [poly(80 - opening / 2 + x, 91 + y, 80 + opening / 2 + x, 91 + y, 80 + opening + x, bottom + 1 + y, 80 - opening + x, bottom + 1 + y)] : [];
  parts.push({ layer: LAYER.jacket, tag, color: main, pattern, shapes: [full], cut: gap });
  if (style === 'longcoat' || style === 'trench') {
    parts.push({ layer: LAYER.clothBack, tag, color: darken(main, 0.12), shapes: [poly(68 + x, 112 + y, 92 + x, 112 + y, 96 + x, 141 + y, 64 + x, 141 + y)] });
  }
  // Lapels / trim along the opening.
  if (opening) {
    parts.push({ layer: LAYER.jacket + 0.01, tag, color: trim, shade: 0, shapes: [poly(80 - opening / 2 - 2.5 + x, 91 + y, 80 - opening / 2 + x, 91 + y, 80 - opening * 0.8 + x, 104 + y, 80 - opening - 2 + x, 100 + y), poly(80 + opening / 2 + 2.5 + x, 91 + y, 80 + opening / 2 + x, 91 + y, 80 + opening * 0.8 + x, 104 + y, 80 + opening + 2 + x, 100 + y)] });
  }
  const sl = sleeveShapes(sk, (spec.sleeves as string) ?? 'long', 1.4);
  if (sl.length) parts.push({ layer: LAYER.jacketSleeves, tag, color: main, pattern, shapes: sl });
  if (style === 'varsity') {
    parts.push({ layer: LAYER.jacketSleeves + 0.01, tag, color: ctx.dye('accent'), shapes: [sk.armL, sk.armR].map((a) => armShape(limbPortion(a, 0.1, 0.9), 1.5)) });
    parts.push({ layer: LAYER.jacket + 0.02, tag, color: ctx.dye('trim'), shade: 0, shapes: [rect(69 + x, bottom - 3 + y, 22, 3)] });
  }
  if (style === 'fur' || spec.fur) {
    const fur = ctx.dye('fur', '#f4f1ff');
    parts.push({ layer: LAYER.jacket + 0.04, tag, color: fur, shapes: [ell(70 + x, 92 + y, 5.5, 4), ell(75 + x, 95 + y, 3.6, 3.6), ell(85 + x, 95 + y, 3.6, 3.6), ell(90 + x, 92 + y, 5.5, 4), ell(76 + x, 100 + y, 2.6, 3), ell(84 + x, 100 + y, 2.6, 3)] });
    parts.push({ layer: LAYER.jacketSleeves + 0.02, tag, color: fur, shapes: [sk.armL, sk.armR].map((a) => { const c = limbPortion(a, 0.84, 0.9); return ell(c.b.x, c.b.y, 4.6, 3.2); }) });
  }
  if (spec.cuffs) parts.push({ layer: LAYER.jacketSleeves + 0.01, tag, color: trim, shade: 0, shapes: cuffShapes(sk, 'long') });
  if (spec.buttons) {
    for (let by = 98; by < bottom - 3; by += 5) parts.push({ layer: LAYER.jacket + 0.05, tag, color: ctx.dye('button', '#f2d26b'), edge: false, shade: 0, shapes: [rect(80 - opening - 2 + x, by + y, 1, 1), rect(80 + opening + 1 + x, by + y, 1, 1)] });
  }
  if (spec.hood) parts.push({ layer: LAYER.clothBack, tag, color: main, shapes: [ell(80 + x, 89 + y, 15, 6)] });
  if (spec.belt) parts.push({ layer: LAYER.jacket + 0.06, tag, color: ctx.dye('belt', darken(main, 0.3)), shade: 0, shapes: [rect(69.5 + x, 109 + y, 21, 2.5)] });
  if (spec.emblem) parts.push({ layer: LAYER.jacket + 0.06, tag, color: ctx.dye('accent'), shade: 0, shapes: [star(86 + x, 99 + y, 2.5)] });
  return parts;
}

export function socksParts(spec: RenderSpec, ctx: GenContext): Part[] {
  const { sk, tag } = ctx;
  const len = (spec.len as string) ?? 'knee';
  const from = { ankle: 0.85, crew: 0.7, knee: 0.45, thigh: 0.12, tights: 0 }[len] ?? 0.45;
  const main = ctx.dye('main');
  const pattern = patternOf(spec, ctx);
  const shapes: Shape[] = [];
  for (const leg of [sk.legL, sk.legR]) shapes.push(legShape(limbPortion(leg, from, 1), 0.25), footShape(leg, leg === sk.legL ? -1 : 1));
  if (len === 'tights') shapes.push(poly(70 + sk.body.x, 109 + sk.body.y, 90 + sk.body.x, 109 + sk.body.y, 90 + sk.body.x, 121 + sk.body.y, 70 + sk.body.x, 121 + sk.body.y));
  const parts: Part[] = [{ layer: LAYER.socks, tag, color: main, pattern, shapes, alpha: spec.sheer ? 0.7 : 1 }];
  if (spec.frill || spec.band) {
    const bands = [sk.legL, sk.legR].map((leg) => { const l = limbPortion(leg, from, from + 0.06); return legShape(l, spec.frill ? 1.1 : 0.5); });
    parts.push({ layer: LAYER.socks + 0.01, tag, color: ctx.dye('accent', '#ffffff'), shade: 0, shapes: bands });
  }
  if (spec.bows) {
    for (const leg of [sk.legL, sk.legR]) {
      const l = limbPortion(leg, from, 1);
      parts.push({ layer: LAYER.socks + 0.02, tag, color: ctx.dye('accent'), shapes: bow(l.a.x, l.a.y + 1, 0.45) });
    }
  }
  return parts;
}

export function shoeParts(spec: RenderSpec, ctx: GenContext): Part[] {
  const { sk, tag } = ctx;
  const style = (spec.style as string) ?? 'sneaker';
  const main = ctx.dye('main');
  const sole = ctx.dye('sole', style === 'sneaker' ? '#f6f3f0' : darken(main, 0.45));
  const parts: Part[] = [];
  const bodies: Shape[] = [], soles: Shape[] = [], accents: Shape[] = [], shafts: Shape[] = [];
  const shaftFrac = { boot: 0.68, tallboot: 0.3, rainboot: 0.55, combat: 0.62, skate: 0.6, cowboy: 0.55, lacecup: 0.7 }[style as 'boot'];
  for (const leg of [sk.legL, sk.legR]) {
    const side = leg === sk.legL ? -1 : 1;
    const fx = leg.b.x - 1.4 + side * 0.3, fy = leg.b.y + 2.6; // toes point toward the facing side
    const platform = style === 'platform' || style === 'geta' ? 2.5 : style === 'combat' ? 1 : 0;
    bodies.push(ell(fx, fy - 0.2, 5.3, 3.5));
    if (style !== 'sandal' && style !== 'geta') bodies.push(cap(leg.b.x, leg.b.y - 1.5, fx, fy - 1, 3.9));
    if (shaftFrac !== undefined) shafts.push(legShape(limbPortion(leg, shaftFrac, 0.98), 0.75));
    if (style === 'heel') soles.push(rect(fx - side * 3.5 - 1, fy + 1.5, 2, 2.5));
    soles.push(rect(fx - 5.2, fy + 1.6, 10.4, 1.4 + platform));
    if (style === 'maryjane') accents.push(rect(leg.b.x - 3.5, fy - 3, 7, 1.2));
    if (style === 'sneaker') accents.push(rect(fx - 1 + side * -1, fy - 2.5, 3, 1));
    if (style === 'sandal') accents.push(rect(fx - 4, fy - 1.8, 8, 1.2), rect(leg.b.x - 1, leg.b.y - 3, 2, 3));
    if (style === 'skate') accents.push(rect(fx - 4.5, fy + 3, 2.4, 2.4), rect(fx + 2.1, fy + 3, 2.4, 2.4));
  }
  if (style === 'sandal') {
    parts.push({ layer: LAYER.shoes, tag, color: sole, shade: 0, shapes: soles });
    parts.push({ layer: LAYER.shoes + 0.01, tag, color: main, shade: 0, shapes: accents });
    return parts;
  }
  parts.push({ layer: LAYER.shoes, tag, color: main, gloss: spec.shiny ? { cx: 80, cy: 152, rx: 8, ry: 6, w: 0.6 } : undefined, shapes: [...bodies, ...shafts], pattern: patternOf(spec, ctx) });
  parts.push({ layer: LAYER.shoes + 0.01, tag, color: sole, shade: 0, shapes: soles });
  if (accents.length) parts.push({ layer: LAYER.shoes + 0.02, tag, color: style === 'skate' ? '#fdf2a8' : ctx.dye('accent', '#ffffff'), shade: 0, shapes: accents });
  if (spec.bow) {
    for (const leg of [sk.legL, sk.legR]) parts.push({ layer: LAYER.shoes + 0.03, tag, color: ctx.dye('accent'), shapes: bow(leg.b.x, leg.b.y + 1, 0.42) });
  }
  if (spec.fluff || style === 'tallboot' && spec.fur) {
    const f = shaftFrac ?? 0.85;
    parts.push({ layer: LAYER.shoes + 0.03, tag, color: ctx.dye('fur', '#fbf6ff'), shapes: [sk.legL, sk.legR].map((leg) => { const l = limbPortion(leg, f, f + 0.05); return ell(l.a.x, l.a.y + 1, 5.4, 2.6); }) });
  }
  if (spec.wings) {
    parts.push({ layer: LAYER.shoes + 0.04, tag, color: '#ffffff', shapes: [sk.legL, sk.legR].map((leg) => { const side = leg === sk.legL ? -1 : 1; return poly(leg.b.x + side * 4, leg.b.y, leg.b.x + side * 10, leg.b.y - 5, leg.b.x + side * 8, leg.b.y + 1, leg.b.x + side * 5, leg.b.y + 3); }) });
  }
  if (spec.laces) {
    for (const leg of [sk.legL, sk.legR]) {
      const l = limbPortion(leg, shaftFrac ?? 0.85, 1);
      for (let t = 0.15; t < 0.95; t += 0.25) {
        const px = l.a.x + (l.b.x - l.a.x) * t, py = l.a.y + (l.b.y - l.a.y) * t;
        parts.push({ layer: LAYER.shoes + 0.03, tag, color: ctx.dye('accent', '#ffffff'), edge: false, shade: 0, shapes: [rect(px - 1.5, py, 3, 1)] });
      }
    }
  }
  return parts;
}

export function gloveParts(spec: RenderSpec, ctx: GenContext): Part[] {
  const { sk, tag } = ctx;
  const len = (spec.len as string) ?? 'short';
  const main = ctx.dye('main');
  const shapes: Shape[] = [];
  for (const arm of [sk.armL, sk.armR]) {
    shapes.push(handShape(arm, 3.4));
    if (len === 'long') shapes.push(armShape(limbPortion(arm, 0.45, 1), 0.35));
    if (len === 'short') shapes.push(armShape(limbPortion(arm, 0.8, 1), 0.4));
  }
  const parts: Part[] = [{ layer: LAYER.gloves, tag, color: main, alpha: spec.lace ? 0.85 : 1, pattern: spec.lace ? { kind: 'lace', color: lighten(main, 0.4) } : undefined, shapes }];
  if (spec.cuff) {
    parts.push({ layer: LAYER.gloves + 0.01, tag, color: ctx.dye('accent', '#ffffff'), shade: 0, shapes: [sk.armL, sk.armR].map((arm) => { const l = limbPortion(arm, len === 'long' ? 0.42 : 0.76, len === 'long' ? 0.5 : 0.84); return armShape(l, 1); }) });
  }
  return parts;
}

export { limbPortion, mix };
