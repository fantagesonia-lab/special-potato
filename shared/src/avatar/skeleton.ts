import { mapPoint } from './proportions';

// The locked base model. Every measurement here was taken from the supplied model
// sheet (client/public/reference/model-sheet.jpg) with a pixel grid, then converted
// into frame pixels. Do not edit these to fit clothing: clothing fits the body.
//
// Measured ratios (skull top = 0, sole = 1):
//   chin 0.43 · eye centre 0.33 · neck 0.43–0.46 · shoulders 0.46 · waist 0.64
//   crotch 0.72 · knee 0.84 · ankle 0.95 · head width 0.40 · eye spacing 0.19
// The character is 108 px tall (skull top y=42 → sole y=150) inside a 160×160 frame.
// "L" is the viewer's left side of the sprite, "R" the viewer's right.

export const FRAME_W = 160;
export const FRAME_H = 160;
export const CX = 80;
export const SOLE_Y = 150;
export const SKULL_TOP = 42;
export const CHIN_Y = 89.5;
export const BODY_HEIGHT = SOLE_Y - SKULL_TOP;

export type Pose =
  | 'idle' | 'walk' | 'sit' | 'wave' | 'cheer' | 'dance' | 'pose' | 'sleep'
  | 'cry' | 'laugh' | 'angry' | 'blush' | 'shocked' | 'confused' | 'heart' | 'sparkle' | 'ride' | 'broom';

export interface Point { x: number; y: number }

export interface Limb {
  /** Joint at the body (shoulder or hip). */
  a: Point;
  /** End point (hand or ankle). */
  b: Point;
}

export interface Skeleton {
  pose: Pose;
  frame: number;
  /** Offset applied to head, face and everything worn on the head. */
  head: Point;
  /** Offset applied to torso. */
  body: Point;
  armL: Limb;
  armR: Limb;
  legL: Limb;
  legR: Limb;
  /** Hands that hold props use this one. */
  holdHand: 'L' | 'R';
  /** Expression overrides selected by emotes. */
  eyes?: string;
  mouth?: string;
  brows?: string;
  blush?: boolean;
  sitting: boolean;
}

/** Named anchor points of the idle base model, in frame pixels. */
export const BASE_ANCHORS = {
  head_top: { x: 80, y: 42 },
  head_center: { x: 80, y: 66 },
  forehead: { x: 80, y: 57 },
  eye_left: { x: 70, y: 77 },
  eye_right: { x: 90, y: 77 },
  ear_left: { x: 57.5, y: 76 },
  ear_right: { x: 102.5, y: 76 },
  nose: { x: 80, y: 82 },
  mouth: { x: 80, y: 85 },
  chin: { x: 80, y: CHIN_Y },
  neck: { x: 80, y: 90 },
  shoulder_left: { x: 69.5, y: 95 },
  shoulder_right: { x: 90.5, y: 95 },
  chest: { x: 80, y: 100 },
  waist: { x: 80, y: 110 },
  hip: { x: 80, y: 118 },
  hand_left: { x: 64.5, y: 114 },
  hand_right: { x: 95.5, y: 114 },
  knee_left: { x: 75.5, y: 133 },
  knee_right: { x: 84.5, y: 133 },
  foot_left: { x: 74.5, y: 147.5 },
  foot_right: { x: 85.5, y: 147.5 },
} as const;

export type AnchorName = keyof typeof BASE_ANCHORS;

const P = (x: number, y: number): Point => ({ x, y });

/** Frames per pose. Walk cycles; emotes loop between two frames. */
export const POSE_FRAMES: Record<Pose, number> = {
  idle: 2, walk: 4, sit: 1, wave: 2, cheer: 2, dance: 4, pose: 1, sleep: 2,
  cry: 2, laugh: 2, angry: 2, blush: 1, shocked: 1, confused: 1, heart: 2, sparkle: 2, ride: 2, broom: 2,
};

export function skeleton(pose: Pose = 'idle', frame = 0): Skeleton {
  const f = frame % POSE_FRAMES[pose];
  const s: Skeleton = {
    pose, frame: f,
    head: P(0, 0), body: P(0, 0),
    armL: { a: P(69.5, 95), b: P(64.5, 112) },
    armR: { a: P(90.5, 95), b: P(95.5, 112) },
    legL: { a: P(75, 117), b: P(75, 145) },
    legR: { a: P(85, 117), b: P(85, 145) },
    // Props are held in the front (viewer-left) hand, as on the model sheet.
    holdHand: 'L',
    sitting: false,
  };
  const shiftUpper = (dx: number, dy: number) => {
    s.head = P(s.head.x + dx, s.head.y + dy);
    s.body = P(s.body.x + dx, s.body.y + dy);
    for (const l of [s.armL, s.armR]) { l.a = P(l.a.x + dx, l.a.y + dy); l.b = P(l.b.x + dx, l.b.y + dy); }
    for (const l of [s.legL, s.legR]) l.a = P(l.a.x + dx, l.a.y + dy);
  };

  switch (pose) {
    case 'idle':
    case 'ride':
      if (f === 1) { s.head = P(0, 1); }
      break;
    case 'walk': {
      // Front-view walk: alternate lifting each foot, bob the upper body, swing arms.
      const lift = [0, 2, 0, 2][f];
      if (f === 1) { s.legL.b = P(75, 145 - lift); }
      if (f === 3) { s.legR.b = P(85, 145 - lift); }
      if (f === 1 || f === 3) shiftUpper(0, -1);
      const swing = [0, 1.5, 0, -1.5][f];
      s.armL.b = P(s.armL.b.x - swing * 0.6, s.armL.b.y - Math.abs(swing) * 0.4);
      s.armR.b = P(s.armR.b.x - swing * 0.6, s.armR.b.y - Math.abs(swing) * 0.4);
      break;
    }
    case 'sit':
    case 'broom':
      shiftUpper(0, 9);
      s.sitting = true;
      s.legL = { a: P(75, 126), b: P(72, 145) };
      s.legR = { a: P(85, 126), b: P(88, 145) };
      s.armL.b = P(67, s.armL.a.y + 15);
      s.armR.b = P(93, s.armR.a.y + 15);
      if (pose === 'broom' && f === 1) shiftUpper(0, -1);
      break;
    case 'wave':
      s.armR = { a: s.armR.a, b: f === 0 ? P(101, 81) : P(98, 79) };
      s.mouth = 'open';
      break;
    case 'cheer':
      s.armL = { a: s.armL.a, b: P(60, 79 - f) };
      s.armR = { a: s.armR.a, b: P(100, 79 - f) };
      s.eyes = 'happy'; s.mouth = 'open';
      if (f === 1) shiftUpper(0, -2);
      break;
    case 'dance': {
      const side = f % 2 === 0 ? -1 : 1;
      shiftUpper(side, f === 1 || f === 3 ? -1 : 0);
      s.armL = { a: s.armL.a, b: side < 0 ? P(61, 82) : P(63, 108) };
      s.armR = { a: s.armR.a, b: side > 0 ? P(99, 82) : P(97, 108) };
      s.eyes = 'happy'; s.mouth = 'grin';
      break;
    }
    case 'pose':
      s.armR = { a: s.armR.a, b: P(97, 84) };
      s.armL = { a: s.armL.a, b: P(67, 109) };
      s.eyes = 'wink'; s.mouth = 'grin';
      break;
    case 'sleep':
      s.eyes = 'closed'; s.mouth = 'small';
      if (f === 1) shiftUpper(0, 1);
      break;
    case 'cry':
      s.eyes = 'teary'; s.mouth = 'wobble'; s.brows = 'sad';
      s.armL.b = P(70, 92 + f); s.armR.b = P(90, 92 + f);
      break;
    case 'laugh':
      s.eyes = 'happy'; s.mouth = 'laugh';
      if (f === 1) shiftUpper(0, -1);
      break;
    case 'angry':
      s.eyes = 'angry'; s.mouth = 'frown'; s.brows = 'angry';
      s.armL.b = P(67, 110 - f); s.armR.b = P(93, 110 - f);
      break;
    case 'blush':
      s.blush = true; s.eyes = 'happy'; s.mouth = 'small';
      break;
    case 'shocked':
      s.eyes = 'shocked'; s.mouth = 'o'; s.brows = 'raised';
      shiftUpper(0, -1);
      break;
    case 'confused':
      s.mouth = 'wobble'; s.brows = 'raised';
      s.armR = { a: s.armR.a, b: P(99, 86) };
      break;
    case 'heart':
      s.eyes = 'happy'; s.mouth = 'cat'; s.blush = true;
      s.armL = { a: s.armL.a, b: P(74, 101) };
      s.armR = { a: s.armR.a, b: P(86, 101) };
      break;
    case 'sparkle':
      s.eyes = 'sparkle'; s.mouth = 'open';
      if (f === 1) shiftUpper(0, -1);
      break;
  }
  return s;
}

/** Resolve a named anchor in model space (what renderers and UI should use). */
export function anchor(sk: Skeleton, name: AnchorName): Point {
  return mapPoint(templateAnchor(sk, name));
}

/** Anchor in template space (head anchors move with the head, hands with the arms). */
export function templateAnchor(sk: Skeleton, name: AnchorName): Point {
  const a = BASE_ANCHORS[name];
  switch (name) {
    case 'hand_left': return { x: sk.armL.b.x, y: sk.armL.b.y + 2 };
    case 'hand_right': return { x: sk.armR.b.x, y: sk.armR.b.y + 2 };
    case 'shoulder_left': return sk.armL.a;
    case 'shoulder_right': return sk.armR.a;
    case 'foot_left': return { x: sk.legL.b.x, y: sk.legL.b.y + 2.5 };
    case 'foot_right': return { x: sk.legR.b.x, y: sk.legR.b.y + 2.5 };
    case 'knee_left': return { x: (sk.legL.a.x + sk.legL.b.x) / 2, y: (sk.legL.a.y + sk.legL.b.y) / 2 };
    case 'knee_right': return { x: (sk.legR.a.x + sk.legR.b.x) / 2, y: (sk.legR.a.y + sk.legR.b.y) / 2 };
    case 'head_top': case 'head_center': case 'forehead': case 'eye_left': case 'eye_right':
    case 'ear_left': case 'ear_right': case 'nose': case 'mouth': case 'chin':
      return { x: a.x + sk.head.x, y: a.y + sk.head.y };
    default:
      return { x: a.x + sk.body.x, y: a.y + sk.body.y };
  }
}

export const ANCHOR_NAMES = Object.keys(BASE_ANCHORS) as AnchorName[];
