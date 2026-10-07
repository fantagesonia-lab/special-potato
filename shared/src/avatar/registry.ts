// Part generator registry. An item's `render.kind` names a generator here; the
// generator turns the item's data + the current pose into layered parts.
// New cosmetics are added as data; new *kinds* of cosmetic add one generator.

import type { Part } from './compose';
import type { Skeleton } from './skeleton';
import type { AvatarLook, ItemDef, RenderSpec, SkinTone } from '../types';

export interface GenContext {
  sk: Skeleton;
  item: ItemDef;
  look: AvatarLook;
  skin: SkinTone;
  tag: string;
  /** Resolve a dye channel (player choice, else item default). */
  dye: (channel: string, fallback?: string) => string;
  /** Slots that are occupied, for interactions like hats flattening hair. */
  equipped: Partial<Record<string, ItemDef>>;
  frame: number;
}

export type Generator = (spec: RenderSpec, ctx: GenContext) => Part[];

export const GENERATORS: Record<string, Generator> = {};

export function registerGenerator(kind: string, gen: Generator) {
  GENERATORS[kind] = gen;
}
