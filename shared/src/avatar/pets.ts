// Pet renderer. Pets are small companion sprites composed with the same pixel pipeline.
// They live in their own frame region (centre-bottom at 80,150) and are cropped by the client.

import { composeParts, LAYER, type Composed, type Part } from './compose';
import { ell, path, poly, rect, type Shape } from './raster';
import { darken, lighten } from './color';
import { diamond, heart, star } from './parts/shapes';
import type { RenderSpec } from '../types';

export type PetState = 'idle' | 'walk' | 'sleep' | 'happy';

export interface PetLook {
  spec: RenderSpec;
  colors: Record<string, string>;
}

const EYE_OPEN = ['kk', 'kw'];
const EYE_SHUT = ['..', 'kk'];

export function petParts(pet: PetLook, state: PetState, frame: number): Part[] {
  const s = pet.spec;
  const main = pet.colors.main ?? '#ffffff';
  const acc = pet.colors.accent ?? lighten(main, 0.4);
  const bob = state === 'walk' ? (frame % 2 ? -3 : 0) : state === 'happy' ? (frame % 2 ? -5 : 0) : state === 'sleep' ? 0 : frame % 2 ? -1 : 0;
  const y0 = 150 + bob;
  const tag = 'pet';
  const P = (layer: number, color: string, shapes: Shape[], extra: Partial<Part> = {}): Part => ({ layer, tag, color, shapes, ...extra });
  const parts: Part[] = [];
  const eyes = (x1: number, x2: number, y: number) => {
    const rows = state === 'sleep' ? EYE_SHUT : EYE_OPEN;
    parts.push({ layer: 5, tag, bitmap: { x: x1, y, rows, pal: { k: '#2b1b2e', w: '#ffffff', '.': null } } });
    parts.push({ layer: 5, tag, bitmap: { x: x2, y, rows, pal: { k: '#2b1b2e', w: '#ffffff', '.': null } } });
  };
  const cheeks = (x1: number, x2: number, y: number) => parts.push(P(5.1, '#ff9fb6', [rect(x1, y, 2, 1), rect(x2, y, 2, 1)], { edge: false, shade: 0, alpha: 0.8 }));
  switch (s.species as string) {
    case 'cat':
      parts.push(P(1, main, [path('M', 92, y0 - 6, 'Q', 102, y0 - 10, 100, y0 - 20, 'Q', 104, y0 - 10, 94, y0 - 3)]));
      parts.push(P(2, main, [ell(80, y0 - 6, 10, 7), ell(80, y0 - 16, 9.5, 8), poly(71, y0 - 20, 72, y0 - 29, 78, y0 - 23), poly(89, y0 - 20, 88, y0 - 29, 82, y0 - 23)]));
      parts.push(P(3, acc, [poly(73, y0 - 22, 73.5, y0 - 26.5, 76.5, y0 - 23.5), poly(87, y0 - 22, 86.5, y0 - 26.5, 83.5, y0 - 23.5), ell(80, y0 - 4, 5, 3)], { edge: false, shade: 0 }));
      eyes(75, 83, y0 - 17); cheeks(73, 85, y0 - 14);
      break;
    case 'dog':
      parts.push(P(2, main, [ell(80, y0 - 6, 10, 7), ell(80, y0 - 16, 9.5, 8.5)]));
      parts.push(P(3, acc, [ell(71, y0 - 15, 3.5, 6.5), ell(89, y0 - 15, 3.5, 6.5), ell(80, y0 - 12, 4, 3)]));
      parts.push(P(4, '#2b1b2e', [ell(80, y0 - 13.5, 1.5, 1)], { edge: false, shade: 0 }));
      eyes(75, 83, y0 - 18);
      break;
    case 'bunny':
      parts.push(P(2, main, [ell(80, y0 - 6, 9.5, 7), ell(80, y0 - 15, 9, 7.5), ell(75, y0 - 27, 2.8, 8), ell(85, y0 - 27, 2.8, 8)]));
      parts.push(P(3, acc, [ell(75, y0 - 27, 1.2, 5.5), ell(85, y0 - 27, 1.2, 5.5)], { edge: false, shade: 0 }));
      if (s.berry) parts.push(P(4, '#e8384f', [path('M', 85, y0 - 25, 'Q', 90, y0 - 27, 93, y0 - 24, 'Q', 92, y0 - 19, 89, y0 - 18, 'Q', 85, y0 - 20, 85, y0 - 25)]), P(4.1, '#4fb35a', [poly(86, y0 - 26, 89, y0 - 29, 92, y0 - 25)], { shade: 0 }));
      eyes(75, 83, y0 - 16); cheeks(73, 85, y0 - 13);
      break;
    case 'bear':
      parts.push(P(2, main, [ell(80, y0 - 6, 10.5, 7.5), ell(80, y0 - 16, 9.5, 8.5), ell(72, y0 - 23, 3.5, 3.5), ell(88, y0 - 23, 3.5, 3.5)]));
      parts.push(P(3, acc, [ell(80, y0 - 12.5, 3.8, 2.8), ell(80, y0 - 5, 5.5, 4)], { edge: false, shade: 0 }));
      parts.push(P(4, '#2b1b2e', [rect(79, y0 - 14, 2, 1)], { edge: false, shade: 0 }));
      eyes(75, 83, y0 - 18);
      break;
    case 'seal':
      parts.push(P(2, main, [ell(80, y0 - 8, 12, 8.5), poly(90, y0 - 4, 100, y0 - 8, 98, y0 - 1)]));
      parts.push(P(3, '#2b1b2e', [rect(79, y0 - 9, 2, 1)], { edge: false, shade: 0 }));
      eyes(74, 84, y0 - 12); cheeks(72, 86, y0 - 8);
      break;
    case 'hamster':
      parts.push(P(2, main, [ell(80, y0 - 8, 10, 8.5), ell(73, y0 - 16, 2.5, 2.5), ell(87, y0 - 16, 2.5, 2.5)]));
      parts.push(P(3, acc, [ell(80, y0 - 5, 6.5, 4.5)], { edge: false, shade: 0 }));
      eyes(75, 83, y0 - 12); cheeks(72, 86, y0 - 8);
      break;
    case 'bird':
      parts.push(P(2, main, [ell(80, y0 - 9, 8.5, 8), poly(87, y0 - 10, 93, y0 - 14, 92, y0 - 7)]));
      parts.push(P(3, acc, [poly(78, y0 - 9, 82, y0 - 9, 80, y0 - 6)], { shade: 0 }));
      parts.push(P(3, darken(main, 0.1), [ell(84, y0 - 7, 3.5, 4.5)]));
      eyes(75, 82, y0 - 13);
      break;
    case 'ghost':
      parts.push(P(2, main, [path('M', 70, y0 - 6, 'Q', 70, y0 - 26, 80, y0 - 26, 'Q', 90, y0 - 26, 90, y0 - 6, 'L', 87, y0 - 3, 'L', 84, y0 - 6, 'L', 80, y0 - 3, 'L', 76, y0 - 6, 'L', 73, y0 - 3)], { alpha: 0.9 }));
      eyes(75, 83, y0 - 17); cheeks(73, 85, y0 - 13);
      break;
    case 'cloud':
      parts.push(P(2, main, [ell(73, y0 - 10, 7, 6), ell(80, y0 - 14, 8, 7), ell(87, y0 - 10, 7, 6), ell(80, y0 - 7, 11, 5)]));
      eyes(75, 83, y0 - 13); cheeks(73, 85, y0 - 10);
      break;
    case 'star':
      parts.push(P(2, main, [star(80, y0 - 12, 12, 0.5)], { gloss: { cx: 80, cy: y0 - 8, rx: 7, ry: 7, w: 0.5 } }));
      eyes(76, 82, y0 - 14);
      break;
    case 'slime':
      parts.push(P(2, main, [path('M', 68, y0 - 1, 'Q', 68, y0 - 20, 80, y0 - 20, 'Q', 92, y0 - 20, 92, y0 - 1)], { alpha: 0.9, gloss: { cx: 80, cy: y0 - 6, rx: 8, ry: 10, w: 0.6 } }));
      if (s.crown) parts.push(P(3, '#ffd25e', [poly(75, y0 - 19, 75, y0 - 25, 77.5, y0 - 22, 80, y0 - 26, 82.5, y0 - 22, 85, y0 - 25, 85, y0 - 19)]));
      eyes(75, 83, y0 - 12); cheeks(72, 86, y0 - 9);
      break;
    case 'dragon':
      parts.push(P(1, acc, [poly(72, y0 - 16, 60, y0 - 26, 64, y0 - 12), poly(88, y0 - 16, 100, y0 - 26, 96, y0 - 12)]));
      parts.push(P(1.5, main, [path('M', 88, y0 - 4, 'Q', 100, y0 - 2, 102, y0 - 10, 'L', 98, y0 - 7, 'Q', 96, y0 - 6, 90, y0 - 7)]));
      parts.push(P(2, main, [ell(80, y0 - 7, 9.5, 7), ell(80, y0 - 17, 9, 8), poly(74, y0 - 23, 72, y0 - 30, 77, y0 - 24), poly(86, y0 - 23, 88, y0 - 30, 83, y0 - 24)]));
      parts.push(P(3, lighten(main, 0.4), [ell(80, y0 - 5, 5, 4)], { edge: false, shade: 0 }));
      eyes(75, 83, y0 - 18); cheeks(73, 85, y0 - 15);
      break;
    case 'jellyfish':
      parts.push(P(1, acc, [rect(73, y0 - 12, 1.5, 10), rect(78, y0 - 12, 1.5, 12), rect(83, y0 - 12, 1.5, 10), rect(87, y0 - 12, 1.5, 8)], { edge: false, shade: 0, alpha: 0.8 }));
      parts.push(P(2, main, [path('M', 69, y0 - 12, 'Q', 69, y0 - 28, 80, y0 - 28, 'Q', 91, y0 - 28, 91, y0 - 12)], { alpha: 0.85, gloss: { cx: 80, cy: y0 - 16, rx: 8, ry: 8, w: 0.6 } }));
      eyes(75, 83, y0 - 20);
      break;
    default:
      parts.push(P(2, main, [ell(80, y0 - 8, 9, 8)]));
      eyes(75, 83, y0 - 11);
  }
  if (state === 'sleep') parts.push(P(LAYER.frontFx, '#9fb4ff', [rect(92 + (frame % 2) * 2, y0 - 30, 4, 1), rect(95 + (frame % 2) * 2, y0 - 29, 1, 1), rect(94 + (frame % 2) * 2, y0 - 28, 1, 1), rect(92 + (frame % 2) * 2, y0 - 27, 4, 1)], { edge: false, shade: 0 }));
  if (state === 'happy') parts.push(P(LAYER.frontFx, '#ff5c8a', heart(92, y0 - 30 - (frame % 2) * 2, 3), { shade: 0 }));
  return parts;
}

export function renderPet(pet: PetLook, state: PetState, frame: number): Composed {
  return composeParts(petParts(pet, state, frame));
}

export { diamond };
