import { item } from './util';

// Hairstyles. Colour comes from the player's salon colour (main/accent + mode), so
// every style works with every colour treatment.
const H = (id: string, name: string, rarity: Parameters<typeof item>[3], render: Record<string, unknown>, o: Parameters<typeof item>[5] = {}) =>
  item('hair', id, name, rarity, { kind: 'hair', ...render }, { shop: 'salon', ...o });

export const HAIR = [
  H('hair_tousled', 'Tousled Wanderer', 'common', { back: 'nape', shape: 'layered', bangs: 'messy', side: 'chin', cap: 'spiky' }, { starter: true, tags: ['short', 'cool', 'spiky'] }),
  H('hair_swept', 'Swept Breeze', 'common', { back: 'nape', shape: 'layered', bangs: 'swept', side: 'short' }, { starter: true, tags: ['short', 'casual'] }),
  H('hair_long_straight', 'Silk Ribbon Straight', 'common', { back: 'waist', shape: 'straight', bangs: 'wispy', side: 'long' }, { starter: true, tags: ['long', 'straight'] }),
  H('hair_bob', 'Button Bob', 'common', { back: 'chin', shape: 'straight', bangs: 'blunt', side: 'chin' }, { starter: true, tags: ['medium', 'bob'] }),
  H('hair_pixie', 'Pixie Part', 'common', { back: 'none', bangs: 'side', side: 'short' }, { tags: ['short', 'androgynous'] }),
  H('hair_curtain', 'Curtain Call', 'uncommon', { back: 'shoulder', shape: 'layered', bangs: 'curtain', side: 'chin' }, { tags: ['medium', 'idol'] }),
  H('hair_hime', 'Moonlit Hime', 'rare', { back: 'hip', shape: 'hime', bangs: 'blunt', side: 'hime' }, { tags: ['long', 'hime', 'elegant'] }),
  H('hair_jellyfish', 'Jellyfish Drift', 'rare', { back: 'chest', shape: 'hime', bangs: 'jelly', side: 'jelly' }, { tags: ['medium', 'jellyfish', 'alt'] }),
  H('hair_wolf', 'Wolf Cut', 'uncommon', { back: 'shoulder', shape: 'flared', bangs: 'messy', side: 'short', extras: [{ t: 'flipout' }] }, { tags: ['medium', 'wolf', 'cool'] }),
  H('hair_twintails', 'Sugar Twin Tails', 'uncommon', { back: 'nape', bangs: 'blunt', side: 'short', extras: [{ t: 'twintails', len: 'hip', size: 1.1 }] }, { tags: ['twintails', 'cute', 'long'] }),
  H('hair_drills', 'Princess Ringlets', 'epic', { back: 'chin', bangs: 'parted', side: 'curl', extras: [{ t: 'drills', len: 'waist', size: 1 }] }, { tags: ['drills', 'princess', 'lolita'] }),
  H('hair_high_pony', 'Skyward Ponytail', 'uncommon', { back: 'nape', bangs: 'swept', side: 'chin', extras: [{ t: 'ponytail', len: 'waist' }] }, { tags: ['ponytail', 'sporty'] }),
  H('hair_side_pony', 'Side Swing Tail', 'uncommon', { back: 'nape', bangs: 'side', side: 'short', extras: [{ t: 'sidetail', len: 'chest', side: 'R' }] }, { tags: ['ponytail', 'y2k'] }),
  H('hair_space_buns', 'Orbit Space Buns', 'rare', { back: 'nape', bangs: 'wispy', side: 'chin', extras: [{ t: 'spacebuns' }] }, { tags: ['buns', 'cute', 'decora'] }),
  H('hair_top_bun', 'Café Top Knot', 'common', { back: 'none', bangs: 'curtain', side: 'chin', extras: [{ t: 'bun' }] }, { tags: ['bun', 'casual'] }),
  H('hair_braids', 'Meadow Braids', 'uncommon', { back: 'nape', bangs: 'blunt', side: 'none', extras: [{ t: 'braids', len: 'waist' }] }, { tags: ['braids', 'cottage'] }),
  H('hair_side_braid', 'Fernlight Side Braid', 'rare', { back: 'shoulder', shape: 'wavy', bangs: 'swept', side: 'short', extras: [{ t: 'sidebraid', len: 'waist', side: 'R' }] }, { tags: ['braid', 'fairy'], collection: 'forest_fairy' }),
  H('hair_curly_cloud', 'Cloud Nine Curls', 'rare', { back: 'chest', shape: 'curly', bangs: 'messy', side: 'curl', cap: 'puffy' }, { tags: ['curly', 'long'] }),
  H('hair_wavy', 'Seafoam Waves', 'uncommon', { back: 'waist', shape: 'wavy', bangs: 'parted', side: 'wave' }, { tags: ['wavy', 'long'], collection: 'seaside_holiday' }),
  H('hair_floor', 'Starfall Floor-Length', 'legendary', { back: 'floor', shape: 'straight', bangs: 'blunt', side: 'long', extras: [{ t: 'ahoge' }] }, { tags: ['very long', 'dramatic'] }),
  H('hair_berry_tails', 'Berry Ribbon Twin Tails', 'epic', { back: 'nape', bangs: 'blunt', side: 'chin', extras: [{ t: 'twintails', len: 'knee', size: 1.25 }, { t: 'ribbon', side: 'L', size: 0.9 }, { t: 'ribbon', side: 'R', size: 0.9 }] }, { collection: 'strawberry_picnic', tags: ['twintails', 'ribbon', 'cute'] }),
  H('hair_spiky_hero', 'Hero Spikes', 'rare', { back: 'nape', shape: 'layered', bangs: 'spiky', side: 'short', cap: 'spiky', extras: [{ t: 'spikes' }] }, { tags: ['spiky', 'fantasy', 'cool'], collection: 'moonlit_knight' }),
  H('hair_idol_puffs', 'Encore Puffs', 'epic', { back: 'chin', bangs: 'center', side: 'short', extras: [{ t: 'puffs' }, { t: 'ahoge' }] }, { tags: ['idol', 'cute'], collection: 'sugar_idol' }),
  H('hair_celestial', 'Celestial Drift', 'legendary', { back: 'knee', shape: 'wavy', bangs: 'parted', side: 'long', extras: [{ t: 'float' }, { t: 'halfup' }] }, { tags: ['magical', 'floating', 'very long'], collection: 'starlight_academy' }),
  H('hair_half_up', 'Petal Half-Up', 'uncommon', { back: 'chest', shape: 'wavy', bangs: 'curtain', side: 'long', extras: [{ t: 'halfup' }] }, { tags: ['half-up', 'elegant'] }),
  H('hair_slick', 'Night Shift Slick', 'uncommon', { back: 'nape', bangs: 'slick', side: 'none' }, { tags: ['short', 'cool'] }),
  H('hair_shag', 'Static Shag', 'uncommon', { back: 'shoulder', shape: 'layered', bangs: 'messy', side: 'chin', extras: [{ t: 'tuft' }] }, { tags: ['shaggy', 'visual kei'], collection: 'neon_byte' }),
  H('hair_antenna', 'Bug-Bop Antennae', 'rare', { back: 'chin', bangs: 'blunt', side: 'chin', extras: [{ t: 'antenna' }] }, { tags: ['cute', 'decora'], collection: 'decora_pop' }),
  H('hair_flip_bob', 'Retro Flip Bob', 'uncommon', { back: 'nape', bangs: 'blunt', side: 'chin', extras: [{ t: 'flipout' }] }, { tags: ['bob', 'y2k'] }),
  H('hair_knight_tail', 'Moonlit Low Tail', 'epic', { back: 'nape', shape: 'layered', bangs: 'side', side: 'long', extras: [{ t: 'ponytail', len: 'hip', side: 'L' }] }, { tags: ['ponytail', 'knight'], collection: 'moonlit_knight' }),
  H('hair_gothic_drills', 'Rosebud Drills', 'epic', { back: 'waist', shape: 'straight', bangs: 'blunt', side: 'hime', extras: [{ t: 'drills', len: 'waist', size: 0.9 }] }, { tags: ['gothic', 'lolita'], collection: 'midnight_rose' }),
  H('hair_jirai_tails', 'Teardrop Low Tails', 'rare', { back: 'chest', shape: 'straight', bangs: 'blunt', side: 'hime', extras: [{ t: 'twintails', len: 'chest', size: 0.9 }, { t: 'ribbon', side: 'L', size: 0.8 }, { t: 'ribbon', side: 'R', size: 0.8 }] }, { tags: ['jirai kei', 'twintails'], collection: 'dream_jirai' }),
  H('hair_snow_bob', 'Snowdrop Fluff Bob', 'rare', { back: 'chin', shape: 'curly', bangs: 'wispy', side: 'curl', cap: 'puffy' }, { tags: ['fluffy', 'winter'], collection: 'snow_bunny' }),
  H('hair_pumpkin_pigtails', 'Pumpkin Spice Pigtails', 'event', { back: 'nape', bangs: 'messy', side: 'short', extras: [{ t: 'twintails', len: 'chest', size: 0.8 }] }, { shop: 'event_halloween', price: 40, currency: 'tokens', event: 'halloween', collection: 'pumpkin_parade', tags: ['pigtails', 'halloween'] }),
];
