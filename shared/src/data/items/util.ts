import type { Currency, ItemDef, Rarity, RenderSpec, Slot } from '../../types';

/** Default coin prices per rarity. Gem and token prices are set per item. */
export const RARITY_PRICE: Record<Rarity, number> = {
  common: 120, uncommon: 260, rare: 480, epic: 900, legendary: 1800, event: 0, limited: 0, prestige: 0,
};

export interface ItemOpts {
  collection?: string;
  tags?: string[];
  dye?: Record<string, string>;
  palette?: string;
  price?: number;
  currency?: Currency;
  shop?: string | string[];
  starter?: boolean;
  event?: string;
  description?: string;
  speed?: number;
  frames?: number;
}

/** Build an item. Price falls back to the rarity table when the item is sold in a shop. */
export function item(slot: Slot, id: string, name: string, rarity: Rarity, render: RenderSpec, o: ItemOpts = {}): ItemDef {
  const shop = o.shop ? (Array.isArray(o.shop) ? o.shop : [o.shop]) : undefined;
  return {
    id, name, slot, rarity, render,
    description: o.description,
    collection: o.collection,
    tags: o.tags ?? [],
    dye: o.dye,
    dyePalette: o.palette,
    price: o.price ?? (shop ? RARITY_PRICE[rarity] : undefined),
    currency: o.currency ?? (shop ? 'coins' : undefined),
    shop,
    starter: o.starter,
    eventLimited: o.event,
    tradable: false,
    speed: o.speed,
    frames: o.frames,
  };
}
