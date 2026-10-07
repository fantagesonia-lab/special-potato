// Face features in 3/4 view, hand-placed pixel bitmaps traced from the model sheet.
//
// The model faces the viewer's left. The NEAR eye (viewer's right) is authored
// 13×10 with its inner corner (toward the nose) on the left and the lash flick on
// the outer right. The FAR eye is the mirrored near eye compressed to 9 columns,
// sitting right against the front cheek, exactly like the sheet. Catch-lights ('W')
// stay upper-left on both eyes so they share one light source.
// Everything here is positioned in measured model coordinates (noTurn).

import { darken, lighten, mix, ramp, rgbToHex } from '../color';
import { LAYER, type Part } from '../compose';
import { fromModel } from '../proportions';
import type { Skeleton } from '../skeleton';

export interface EyeBitmap {
  /** Near eye, 13 columns. */
  rows: string[];
  /** Explicit far eye (winks); otherwise derived from `rows`. */
  far?: string[];
  noHighlights?: boolean;
}

/** Measured feature positions (model space). */
export const FACE_MODEL = {
  nearEye: { x: 85.5, y: 78.8 },
  farEye: { x: 65.4, y: 81.6 },
  mouth: { x: 75.4, y: 88.6 },
  nearBrow: { x: 85.5, y: 71.6 },
  farBrow: { x: 65, y: 74.2 },
  nearBlush: { x: 93, y: 84.6 },
  farBlush: { x: 61.6, y: 85.6 },
};

// Legend: K lash · k thin line · I iris dark · i iris · j iris light · P pupil · W catch-light
//         s sclera · l lower lid (skin shade) · t tear
export const EYES: Record<string, EyeBitmap> = {
  round: { rows: [
    '...KKKKKKKKKK',
    '.KKKKKKKKKKKK',
    'KKKIIIIIIIKKK',
    'ssIWWIIIIIIkK',
    'ssIWWPPPPIIk.',
    '.sIIPPPPPIik.',
    '.siiPPPPPiik.',
    '.siiijjjiiik.',
    '..kijjjjjjk..',
    '...lllllll...',
  ] },
  sparkle: { rows: [
    '...KKKKKKKKKK',
    '.KKKKKKKKKKKK',
    'KKKIIIIIIWKKK',
    'ssIWWIIIWWIkK',
    'ssIWWPPPPWIk.',
    '.sIIPPPPPIik.',
    '.siiPPPPWiik.',
    '.sWiijjjiiik.',
    '..kijjjjjjk..',
    '...lllllll...',
  ] },
  gentle: { rows: [
    '.............',
    '...KKKKKKKKK.',
    '.KKKKKKKKKKKK',
    'KKIIIIIIIIIKK',
    'ssIWWPPPPIIk.',
    '.sIWPPPPPIik.',
    '.siiPPPPPiik.',
    '.siiijjjiiik.',
    '..kijjjjjjk..',
    '...lllllll...',
  ] },
  sleepy: { rows: [
    '.............',
    '.............',
    '.............',
    '.............',
    '.KKKKKKKKKKKK',
    'KKKKKKKKKKKK.',
    'ssIIPPPPPIik.',
    '.siiPPPPPiik.',
    '..kijjjjjjk..',
    '...lllllll...',
  ] },
  sharp: { rows: [
    '.............',
    '...........KK',
    '.....KKKKKKKK',
    '.KKKKKKKKKKK.',
    'KKIIIIIIIIk..',
    'ssIWWPPPPik..',
    '.sIWPPPPPik..',
    '.siiijjjik...',
    '..kkjjjjk....',
    '....llll.....',
  ] },
  cat: { rows: [
    '...KKKKKKKKKK',
    '.KKKKKKKKKKKK',
    'KKKIIIIIIIKKK',
    'ssIWWIIPIIIkK',
    'ssIWWIIPIIIk.',
    '.sIIiIIPIIik.',
    '.siiiIIPIiik.',
    '.siiijjPjiik.',
    '..kijjjjjjk..',
    '...lllllll...',
  ] },
  droopy: { rows: [
    '.............',
    '..KKKKKKK....',
    '.KKKKKKKKKKK.',
    'KKKIIIIIIIKKK',
    'ssIWWPPPPIIkK',
    '.sIWPPPPPIik.',
    '.siiPPPPPiik.',
    '.siiijjjiiik.',
    '..kijjjjjjk..',
    '..lllllllll..',
  ] },
  star: { rows: [
    '...KKKKKKKKKK',
    '.KKKKKKKKKKKK',
    'KKKIIIIIIIKKK',
    'ssIWWIIjIIIkK',
    'ssIWWIjjjIIk.',
    '.sIjjjjjjjik.',
    '.siiijjjiiik.',
    '.siijiiijiik.',
    '..kijjjjjjk..',
    '...lllllll...',
  ] },
  heart: { rows: [
    '...KKKKKKKKKK',
    '.KKKKKKKKKKKK',
    'KKKIIIIIIIKKK',
    'ssIWjjIjjIIkK',
    'ssIjjjjjjjIk.',
    '.sIjjjjjjjik.',
    '.siijjjjjiik.',
    '.siiijjjiiik.',
    '..kiiijiiik..',
    '...lllllll...',
  ] },
  dot: { rows: [
    '.............',
    '.............',
    '.............',
    '....KKKKK....',
    '...KKKKKKK...',
    '....PPPPP....',
    '...PWWPPPP...',
    '...PWPPPPP...',
    '....PPPPP....',
    '.............',
  ] },
  lashy: { rows: [
    '..KKKKKKKKK.K',
    '.KKKKKKKKKKKK',
    'KKKIIIIIIIKKK',
    'ssIWWIIIIIIkK',
    'ssIWWPPPPIIkK',
    '.sIIPPPPPIik.',
    '.siiPPPPPiik.',
    '.siiijjjiiik.',
    '..kijjjjjjk..',
    '..lKlKlKlKl..',
  ] },
  happy: { rows: [
    '.............',
    '.............',
    '.............',
    '.....KKK.....',
    '...KKK.KKK...',
    '..KK.....KK..',
    '.KK.......KK.',
    '.K.........K.',
    '.............',
    '.............',
  ], noHighlights: true },
  closed: { rows: [
    '.............',
    '.............',
    '.............',
    '.............',
    '.............',
    '.K.........K.',
    '.KK.......KK.',
    '..KKK...KKK..',
    '....KKKKK....',
    '.............',
  ], noHighlights: true },
  wink: {
    rows: [
      '.............',
      '.............',
      '.............',
      '..........KK.',
      '.......KKK...',
      '....KKK......',
      '.......KKK...',
      '..........KK.',
      '.............',
      '.............',
    ],
    far: [
      '..KKKKKKK',
      'KKKKKKKKK',
      'KKIIIIIKK',
      'kWWIIIIIs',
      '.kWWPPPIs',
      '.kiPPPPIs',
      '.kiPPPPis',
      '.kiiijjis',
      '..kjjjjk.',
      '...llll..',
    ],
    noHighlights: true,
  },
  teary: { rows: [
    '.............',
    '...KKKKKKKKKK',
    '.KKKKKKKKKKKK',
    'KKKIIIIIIIKKK',
    'ssIWWPPPPWIkK',
    'ssIWPPPPPIik.',
    '.tiiPPPPPiit.',
    '.tjjjjjjjjjt.',
    '..ttjjjjjtt..',
    '...tlllllt...',
  ] },
  shocked: { rows: [
    '...KKKKKKKKKK',
    '.KKKKKKKKKKKK',
    'KsssssssssskK',
    'ssssIIIIsssk.',
    'sssIIPPIIssk.',
    '.ssIIPPIIssk.',
    '.sssIIIIsssk.',
    '.ssssssssssk.',
    '..kkkkkkkkk..',
    '.............',
  ], noHighlights: true },
  angry: { rows: [
    '.............',
    '...........KK',
    '.......KKKKK.',
    '..KKKKKKKKKKK',
    '.KKKIIIIIIIKK',
    'ssIWWPPPPIIk.',
    '.sIWPPPPPIik.',
    '.siiPPPPPiik.',
    '..kijjjjjjk..',
    '...lllllll...',
  ] },
};

/** The sheet's irises are 11 rows tall: repeat the mid-iris row of open eyes. */
for (const e of Object.values(EYES)) {
  if (!e.noHighlights) e.rows = [...e.rows.slice(0, 7), e.rows[6], ...e.rows.slice(7)];
}

/** Columns of the mirrored near eye kept for the far eye (13 → 9, edges preserved). */
const FAR_KEEP = [0, 1, 2, 4, 6, 8, 10, 11, 12];

function compress(rows: string[]): string[] {
  return rows.map((r) => FAR_KEEP.map((i) => r[i] ?? '.').join(''));
}
function mirror(rows: string[]): string[] {
  return rows.map((r) => r.split('').reverse().join(''));
}

/** The far eye: mirrored (inner corner toward the nose on its right) and compressed. */
export function farEyeRows(bm: EyeBitmap): string[] {
  if (bm.far) return bm.far;
  return compress(mirror(bm.rows)).map((r) => r.replace(/W/g, 'i'));
}

/** Catch-lights for the far eye stay upper-left: taken from the unmirrored near eye. */
function farHighlights(bm: EyeBitmap): string[] {
  return compress(bm.rows.map((r) => r.replace(/[^W]/g, '.')));
}

function at(p: { x: number; y: number }, sk: Skeleton) {
  const [x, y] = fromModel(p.x, p.y);
  return { x: x + sk.head.x, y: y + sk.head.y };
}

export function eyeParts(style: string, eyeColor: string, skinShade: string, sk: Skeleton, tag: string, lashColor = '#2b1b2e'): Part[] {
  const bm = EYES[style] ?? EYES.round;
  const r = ramp(eyeColor);
  const pal: Record<string, string | null> = {
    K: lashColor,
    k: rgbToHex(r.line),
    I: rgbToHex(r.line),
    i: eyeColor,
    j: lighten(eyeColor, 0.45),
    P: darken(rgbToHex(r.line), 0.45),
    W: '#ffffff',
    s: '#fbf6fb',
    l: skinShade,
    t: '#a9dcff',
    '.': null,
  };
  const near = at(FACE_MODEL.nearEye, sk), far = at(FACE_MODEL.farEye, sk);
  const parts: Part[] = [
    { layer: LAYER.faceFeature, tag, noTurn: true, bitmap: { x: near.x, y: near.y, rows: bm.rows, pal, center: true } },
    { layer: LAYER.faceFeature, tag, noTurn: true, bitmap: { x: far.x, y: far.y, rows: farEyeRows(bm), pal, center: true } },
  ];
  if (!bm.noHighlights && !bm.far) {
    parts.push({ layer: LAYER.faceFeature + 0.01, tag, noTurn: true, bitmap: { x: far.x, y: far.y, rows: farHighlights(bm), pal: { W: '#ffffff', '.': null }, center: true } });
  }
  return parts;
}

export const MOUTHS: Record<string, string[]> = {
  smile: ['k..k', '.kk.'],
  small: ['.kk'],
  open: ['kkkk', 'kmmk', '.kr.'],
  grin: ['kkkkk', 'kwwwk', '.kmk.'],
  laugh: ['kkkkkk', 'kwwwwk', 'kmmmmk', '.krrk.', '..kk..'],
  cat: ['k.k.k', '.k.k.'],
  o: ['.kk.', 'kmmk', '.kk.'],
  frown: ['.kk.', 'k..k'],
  wobble: ['.k.k', 'k.k.'],
  pout: ['.kk', 'krk', '.kk'],
  tongue: ['kkkk', '.krr', '..r.'],
  smirk: ['...k', 'kkk.'],
  fang: ['kkkk', '.w..'],
  flat: ['kkk'],
};

export const BROWS: Record<string, string[]> = {
  soft: ['..kkkk.', '.k....k'],
  angry: ['kk.....', '..kkkkk'],
  sad: ['.....kk', 'kkkkk..'],
  raised: ['.kkkkk.', 'k.....k'],
  thick: ['.kkkkkk', 'kkkkkk.'],
  none: [''],
};

export function mouthParts(style: string, skin: { line: string; shade: string }, sk: Skeleton, tag: string, lip?: string): Part[] {
  const rows = MOUTHS[style] ?? MOUTHS.smile;
  const pal = { k: lip ? darken(lip, 0.25) : skin.line, m: '#7a2b3a', w: '#ffffff', r: '#e9707f', '.': null };
  const p = at(FACE_MODEL.mouth, sk);
  return [{ layer: LAYER.faceFeature, tag, noTurn: true, bitmap: { x: p.x, y: p.y, rows, pal, center: true } }];
}

export function browParts(style: string, color: string, sk: Skeleton, tag: string): Part[] {
  const rows = BROWS[style] ?? BROWS.soft;
  if (!rows[0]) return [];
  const pal = { k: color, '.': null };
  const n = at(FACE_MODEL.nearBrow, sk), f = at(FACE_MODEL.farBrow, sk);
  const farRows = mirror(rows).map((r) => [0, 2, 4, 5, 6].map((i) => r[i] ?? '.').join(''));
  return [
    { layer: LAYER.faceFeature, tag, noTurn: true, bitmap: { x: n.x, y: n.y, rows, pal, center: true } },
    { layer: LAYER.faceFeature, tag, noTurn: true, bitmap: { x: f.x, y: f.y, rows: farRows, pal, center: true } },
  ];
}

export function blushParts(color: string, sk: Skeleton, strong: boolean, tag = 'blush'): Part[] {
  const nearRows = strong ? ['.b.b.b', 'b.b.b.'] : ['bbbbb'];
  const farRows = strong ? ['.b.b', 'b.b.'] : ['bbb'];
  const c = strong ? mix(color, '#ff4f7a', 0.4) : color;
  const n = at(FACE_MODEL.nearBlush, sk), f = at(FACE_MODEL.farBlush, sk);
  return [
    { layer: LAYER.faceCosmetic, tag, noTurn: true, alpha: strong ? 0.9 : 0.5, bitmap: { x: n.x, y: n.y, rows: nearRows, pal: { b: c, '.': null }, center: true } },
    { layer: LAYER.faceCosmetic, tag, noTurn: true, alpha: strong ? 0.9 : 0.5, bitmap: { x: f.x, y: f.y, rows: farRows, pal: { b: c, '.': null }, center: true } },
  ];
}
