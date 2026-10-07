// Avatar renderer entry point.
// 1. base body + skin   2. face   3. rear hair   4. clothing by layer
// 5. shoes   6. front hair   7. accessories   8. handheld   9. effects
// All placement goes through the skeleton anchors; nothing is positioned per-UI.

import { composeParts, LAYER, type ComposeOptions, type Composed, type Part } from './compose';
import { GENERATORS, type GenContext } from './registry';
import { skeleton, type Pose } from './skeleton';
import { bodyParts, handShape } from './parts/body';
import { blushParts, browParts, eyeParts, mouthParts } from './parts/face';
import { darken } from './color';
import { SKIN_BY_ID, SKIN_TONES } from '../data/skins';
import type { AvatarLook, ItemDef, Slot } from '../types';
import { mapPoint, mapShape } from './proportions';
import './parts/register';

export * from './compose';
export * from './skeleton';
export * from './raster';
export * from './color';
export * from './proportions';
export { GENERATORS, registerGenerator, type GenContext } from './registry';

export interface RenderRequest {
  look: AvatarLook;
  items: Record<string, ItemDef>;
  pose?: Pose;
  frame?: number;
  compose?: ComposeOptions;
  /** Skip pet/mount/aura/background/nameplate (they are drawn by the world). */
  bodyOnly?: boolean;
}

const WORLD_SLOTS: Slot[] = ['pet', 'mount', 'aura', 'background', 'nameplate'];

/** Resolve conflicts: a dress replaces top + bottom. */
export function effectiveEquipped(look: AvatarLook, items: Record<string, ItemDef>): Partial<Record<Slot, ItemDef>> {
  const out: Partial<Record<Slot, ItemDef>> = {};
  for (const [slot, id] of Object.entries(look.equipped)) {
    const it = id ? items[id] : undefined;
    if (it) out[slot as Slot] = it;
  }
  if (out.dress) { delete out.top; delete out.bottom; }
  return out;
}

export function buildParts(req: RenderRequest): Part[] {
  const { look, items } = req;
  const sk = skeleton(req.pose ?? 'idle', req.frame ?? 0);
  const skin = SKIN_BY_ID[look.skin] ?? SKIN_TONES[1];
  const equipped = effectiveEquipped(look, items);
  // Raised props (umbrellas, parasols) lift the holding arm when the pose leaves it free.
  if (equipped.handheld?.render.raise && (sk.pose === 'idle' || sk.pose === 'walk' || sk.pose === 'ride')) {
    const arm = sk.holdHand === 'L' ? sk.armL : sk.armR;
    arm.b = { x: arm.a.x + (sk.holdHand === 'L' ? -3 : 3), y: arm.a.y + 7 };
  }
  const parts: Part[] = [...bodyParts(skin, sk)];

  // Face (expression overrides from emotes win over the equipped style).
  const eyesItem = equipped.eyes;
  const eyeStyle = sk.eyes ?? (eyesItem?.render.style as string) ?? 'round';
  parts.push(...eyeParts(eyeStyle, look.eyeColor, skin.shade, sk, eyesItem?.id ?? 'eyes'));
  const mouthItem = equipped.mouth;
  const lip = equipped.makeup?.render.lip as string | undefined;
  parts.push(...mouthParts(sk.mouth ?? (mouthItem?.render.style as string) ?? 'smile', skin, sk, mouthItem?.id ?? 'mouth', lip));
  const browItem = equipped.brows;
  parts.push(...browParts(sk.brows ?? (browItem?.render.style as string) ?? 'soft', darken(look.hairColor.main, 0.35), sk, browItem?.id ?? 'brows'));
  parts.push(...blushParts(skin.blush, sk, !!sk.blush));

  // Plain base wear so the avatar is never bare.
  if (!equipped.top && !equipped.dress) {
    const g = GENERATORS.top;
    if (g) parts.push(...g({ kind: 'top', body: 'tee', sleeves: 'cap', length: 'waist', collar: 'round' }, ctxFor(BASE_TOP, req, sk, skin, equipped)));
  }
  if (!equipped.bottom && !equipped.dress) {
    const g = GENERATORS.bottom;
    if (g) parts.push(...g({ kind: 'bottom', style: 'shorts' }, ctxFor(BASE_BOTTOM, req, sk, skin, equipped)));
  }

  for (const [slot, item] of Object.entries(equipped) as [Slot, ItemDef][]) {
    if (slot === 'eyes' || slot === 'mouth' || slot === 'brows') continue;
    if (req.bodyOnly && WORLD_SLOTS.includes(slot)) continue;
    const gen = GENERATORS[item.render.kind];
    if (!gen) continue;
    parts.push(...gen(item.render, ctxFor(item, req, sk, skin, equipped)));
  }

  // The holding hand grips over a handheld prop.
  if (equipped.handheld) {
    const arm = sk.holdHand === 'R' ? sk.armR : sk.armL;
    const glove = equipped.gloves;
    parts.push({ layer: LAYER.holdHand, tag: 'base', color: glove ? glove.dye?.main ?? skin.base : skin.base, edgeColor: glove ? undefined : skin.line, shade: 1, shapes: [handShape(arm, 2.8)] });
  }
  return parts.map(toModelSpace);
}

/** Carry a part from template space into the measured model proportions. */
export function toModelSpace(p: Part): Part {
  const turn = !p.noTurn;
  const out: Part = { ...p };
  if (p.shapes) out.shapes = p.shapes.map((s) => mapShape(s, turn));
  if (p.cut) out.cut = p.cut.map((s) => mapShape(s, turn));
  if (p.clip) out.clip = p.clip.map((s) => mapShape(s, turn && !p.clipNoTurn));
  if (p.pivot) out.pivot = mapPoint(p.pivot, turn);
  if (p.gloss) {
    const c = mapPoint({ x: p.gloss.cx, y: p.gloss.cy }, turn);
    out.gloss = { ...p.gloss, cx: c.x, cy: c.y, rx: p.gloss.rx * 1.06, ry: p.gloss.ry * 1.06 };
  }
  if (p.bitmap) {
    const c = mapPoint({ x: p.bitmap.x, y: p.bitmap.y }, turn);
    out.bitmap = { ...p.bitmap, x: c.x, y: c.y };
  }
  return out;
}

const BASE_TOP: ItemDef = { id: 'base_top', name: 'Basic Tank', slot: 'top', rarity: 'common', tags: [], dye: { main: '#f7f4f0', accent: '#d9d2e6' }, render: { kind: 'top' } };
const BASE_BOTTOM: ItemDef = { id: 'base_bottom', name: 'Basic Shorts', slot: 'bottom', rarity: 'common', tags: [], dye: { main: '#9fb4d8', accent: '#7f93bb' }, render: { kind: 'bottom' } };

function ctxFor(item: ItemDef, req: RenderRequest, sk: GenContext['sk'], skin: GenContext['skin'], equipped: GenContext['equipped']): GenContext {
  const choice = req.look.dyes[item.id] ?? {};
  return {
    sk, item, look: req.look, skin, tag: item.id, equipped, frame: req.frame ?? 0,
    dye: (ch, fb) => choice[ch] ?? item.dye?.[ch] ?? fb ?? item.dye?.main ?? '#cccccc',
  };
}

export function renderAvatar(req: RenderRequest): Composed {
  return composeParts(buildParts(req), req.compose);
}

/** Cache key for a rendered frame. */
export function lookKey(look: AvatarLook): string {
  return JSON.stringify([look.skin, look.eyeColor, look.hairColor, look.equipped, look.dyes]);
}
