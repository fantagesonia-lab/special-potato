// Core data types shared by the client, the server and the asset tools.

export type Currency = 'coins' | 'gems' | 'tokens';

export const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'event', 'limited', 'prestige'] as const;
export type Rarity = (typeof RARITIES)[number];

/** Every equip slot on the avatar. One item per slot. */
export const SLOTS = [
  'hair', 'eyes', 'brows', 'mouth', 'faceDetail', 'makeup',
  'top', 'jacket', 'bottom', 'dress', 'socks', 'shoes', 'gloves',
  'hat', 'hairAcc', 'earrings', 'glasses', 'necklace', 'scarf',
  'back', 'wings', 'bag', 'belt', 'handheld',
  'pet', 'mount', 'aura', 'background', 'nameplate',
] as const;
export type Slot = (typeof SLOTS)[number];

/** Slots the player must always have something in. */
export const REQUIRED_SLOTS: Slot[] = ['hair', 'eyes', 'brows', 'mouth'];

export type HairColorMode = 'solid' | 'ombre' | 'split' | 'streaks' | 'underlight' | 'tips';

export interface HairColor {
  main: string;
  accent: string;
  mode: HairColorMode;
}

export interface AvatarLook {
  skin: string;
  eyeColor: string;
  hairColor: HairColor;
  equipped: Partial<Record<Slot, string>>;
  /** Per-item dye choices: itemId -> channel -> hex. */
  dyes: Record<string, Record<string, string>>;
}

/** Placement override for an item, edited from the Avatar Lab. */
export interface ItemFit {
  dx?: number;
  dy?: number;
  scale?: number;
}

/** Render description. `kind` selects a part generator in shared/src/avatar/parts. */
export interface RenderSpec {
  kind: string;
  [param: string]: unknown;
}

export interface ItemDef {
  id: string;
  name: string;
  slot: Slot;
  rarity: Rarity;
  description?: string;
  collection?: string;
  tags: string[];
  /** Default colour for each dye channel. Channels listed here can be recoloured. */
  dye?: Record<string, string>;
  /** Palette id from data/palettes used for dyeing. */
  dyePalette?: string;
  render: RenderSpec;
  fit?: ItemFit;
  price?: number;
  currency?: Currency;
  /** Event id when the item is only obtainable during an event. */
  eventLimited?: string;
  tradable?: boolean;
  /** Owned by every new player. */
  starter?: boolean;
  /** Animated items (auras, some handhelds) declare their frame count. */
  frames?: number;
  /** Mount speed multiplier. */
  speed?: number;
  /** Shop ids that sell this item. */
  shop?: string[];
}

export interface SkinTone {
  id: string;
  name: string;
  base: string;
  shade: string;
  line: string;
  blush: string;
}

export interface Palette {
  id: string;
  name: string;
  colors: string[];
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  theme: string;
  /** Colours used for the collection's page in the collection book. */
  colors: [string, string];
  rewardBadge?: string;
}

export interface ShopDef {
  id: string;
  name: string;
  district: string;
  keeper: { name: string; look: AvatarLook; greeting: string[] };
  theme: { bg: string; panel: string; accent: string; text: string; pattern: 'dots' | 'stripes' | 'stars' | 'hearts' | 'snow' | 'leaves' | 'checks' | 'waves' };
  tagline: string;
  /** Item ids sold here. */
  items: string[];
  /** Only open during this event. */
  eventId?: string;
}

export type ObjectiveType = 'talk' | 'visit' | 'collect' | 'play' | 'buy' | 'emote' | 'equip' | 'score' | 'deliver';

export interface QuestObjective {
  type: ObjectiveType;
  target: string;
  count: number;
  label: string;
}

export interface QuestDef {
  id: string;
  name: string;
  giver: string;
  summary: string;
  dialogue: string[];
  objectives: QuestObjective[];
  rewards: Reward;
  requires?: string[];
  eventId?: string;
  repeatable?: 'daily';
}

export interface Reward {
  coins?: number;
  gems?: number;
  tokens?: number;
  exp?: number;
  items?: string[];
  badge?: string;
}

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  stat: StatKey;
  goal: number;
  reward: Reward;
}

export type StatKey =
  | 'itemsOwned' | 'friends' | 'minigamesPlayed' | 'districtsVisited' | 'eventCollections'
  | 'questsDone' | 'emotesUsed' | 'chatMessages' | 'photosTaken' | 'flowersCollected'
  | 'coinsEarned' | 'outfitsSaved' | 'level' | 'petsOwned';

export interface BadgeDef {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface EventDef {
  id: string;
  name: string;
  /** Month-day ranges (inclusive). Recurs every year. */
  start: string; // 'MM-DD'
  end: string;
  tokenName: string;
  tokenIcon: string;
  description: string;
  /** Map decoration overlay id applied while the event runs. */
  decor: string;
  shopId?: string;
  collection?: string;
  colors: [string, string];
}

export interface PlayerStats {
  [k: string]: number;
}

export interface QuestProgress {
  status: 'active' | 'complete';
  progress: number[];
  completedAt?: number;
}

export interface Outfit {
  name: string;
  look: AvatarLook;
}

export interface PlayerProfile {
  id: string;
  username: string;
  displayName: string;
  level: number;
  exp: number;
  joinedAt: number;
  status: string;
  favoriteStyle: string;
  favoriteArea: string;
  favoriteMinigame: string;
  badges: string[];
  look: AvatarLook;
  favoriteOutfit?: AvatarLook;
  collectionScore: number;
  achievements: string[];
}

/** Full private state of a player, owned by the server. */
export interface PlayerState {
  id: string;
  username: string;
  displayName: string;
  joinedAt: number;
  level: number;
  exp: number;
  coins: number;
  gems: number;
  tokens: Record<string, number>;
  look: AvatarLook;
  inventory: string[];
  wishlist: string[];
  favorites: string[];
  outfits: (Outfit | null)[];
  favoriteOutfit: number | null;
  status: string;
  favoriteStyle: string;
  favoriteArea: string;
  favoriteMinigame: string;
  badges: string[];
  achievements: string[];
  quests: Record<string, QuestProgress>;
  stats: PlayerStats;
  visited: string[];
  collected: Record<string, number>;
  friends: string[];
  friendRequests: string[];
  blocked: string[];
  lastMap: string;
  lastDaily: string;
  mutedUntil: number;
  role: 'player' | 'moderator';
}
