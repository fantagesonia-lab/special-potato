import type { ItemDef, Slot } from '../../types';
import { HAIR } from './hair';
import { BROW_ITEMS, EYE_ITEMS, FACE_DETAIL_ITEMS, MAKEUP_ITEMS, MOUTH_ITEMS } from './face';
import { BOTTOMS, DRESSES, GLOVES, JACKETS, SHOES, SOCKS, TOPS } from './clothing';
import {
  AURAS, BACKGROUNDS, BACKS, BAGS, BELTS, EARRINGS, GLASSES, HAIR_ACCS, HANDHELDS, HATS, MOUNTS, NAMEPLATES, NECKLACES, PETS, SCARVES, WINGS,
} from './accessories';

export const ALL_ITEMS: ItemDef[] = [
  ...HAIR, ...EYE_ITEMS, ...MOUTH_ITEMS, ...BROW_ITEMS, ...FACE_DETAIL_ITEMS, ...MAKEUP_ITEMS,
  ...TOPS, ...JACKETS, ...BOTTOMS, ...DRESSES, ...SOCKS, ...SHOES, ...GLOVES,
  ...HATS, ...HAIR_ACCS, ...GLASSES, ...EARRINGS, ...NECKLACES, ...SCARVES, ...BACKS, ...WINGS, ...BAGS, ...BELTS, ...HANDHELDS,
  ...PETS, ...MOUNTS, ...AURAS, ...BACKGROUNDS, ...NAMEPLATES,
];

export const ITEMS: Record<string, ItemDef> = Object.fromEntries(ALL_ITEMS.map((i) => [i.id, i]));

export function itemsBySlot(slot: Slot): ItemDef[] {
  return ALL_ITEMS.filter((i) => i.slot === slot);
}

export const STARTER_ITEMS = ALL_ITEMS.filter((i) => i.starter).map((i) => i.id);
