import { item } from './util';

const E = (id: string, name: string, style: string, rarity: Parameters<typeof item>[3], o: Parameters<typeof item>[5] = {}) =>
  item('eyes', id, name, rarity, { kind: 'eyes', style }, { shop: 'salon', ...o });
const M = (id: string, name: string, style: string, rarity: Parameters<typeof item>[3], o: Parameters<typeof item>[5] = {}) =>
  item('mouth', id, name, rarity, { kind: 'mouth', style }, { shop: 'salon', ...o });
const B = (id: string, name: string, style: string, o: Parameters<typeof item>[5] = {}) =>
  item('brows', id, name, 'common', { kind: 'brows', style }, { shop: 'salon', ...o });
const F = (id: string, name: string, style: string, rarity: Parameters<typeof item>[3], dye?: Record<string, string>, o: Parameters<typeof item>[5] = {}) =>
  item('faceDetail', id, name, rarity, { kind: 'facedetail', style }, { shop: 'salon', dye, ...o });

export const EYE_ITEMS = [
  E('eyes_round', 'Classic Bright Eyes', 'round', 'common', { starter: true }),
  E('eyes_gentle', 'Gentle Gaze', 'gentle', 'common', { starter: true }),
  E('eyes_sharp', 'Sharp Glance', 'sharp', 'common', { starter: true }),
  E('eyes_sparkle', 'Sparkle Shine', 'sparkle', 'uncommon'),
  E('eyes_sleepy', 'Sleepyhead', 'sleepy', 'common'),
  E('eyes_cat', 'Cat Slit', 'cat', 'rare'),
  E('eyes_droopy', 'Puppy Droop', 'droopy', 'uncommon'),
  E('eyes_star', 'Starstruck', 'star', 'epic', { collection: 'starlight_academy' }),
  E('eyes_heart', 'Lovestruck', 'heart', 'epic', { collection: 'sugar_idol' }),
  E('eyes_dot', 'Button Dots', 'dot', 'common'),
  E('eyes_lashy', 'Doll Lashes', 'lashy', 'rare', { collection: 'midnight_rose' }),
];

export const MOUTH_ITEMS = [
  M('mouth_smile', 'Little Smile', 'smile', 'common', { starter: true }),
  M('mouth_small', 'Quiet', 'small', 'common', { starter: true }),
  M('mouth_open', 'Happy Open', 'open', 'common'),
  M('mouth_grin', 'Big Grin', 'grin', 'uncommon'),
  M('mouth_cat', 'Kitty :3', 'cat', 'uncommon'),
  M('mouth_o', 'Little O', 'o', 'common'),
  M('mouth_pout', 'Pout', 'pout', 'uncommon'),
  M('mouth_tongue', 'Bleh!', 'tongue', 'rare', { collection: 'dream_jirai' }),
  M('mouth_smirk', 'Smirk', 'smirk', 'uncommon'),
  M('mouth_fang', 'Tiny Fang', 'fang', 'rare', { collection: 'pumpkin_parade' }),
  M('mouth_flat', 'Deadpan', 'flat', 'common'),
];

export const BROW_ITEMS = [
  B('brows_soft', 'Soft Arch', 'soft', { starter: true }),
  B('brows_thick', 'Bold Brows', 'thick'),
  B('brows_raised', 'Curious Lift', 'raised'),
  B('brows_sad', 'Worried Tilt', 'sad'),
  B('brows_none', 'Hidden', 'none'),
];

export const FACE_DETAIL_ITEMS = [
  F('fd_freckles', 'Sun Freckles', 'freckles', 'common', undefined, { collection: 'seaside_holiday' }),
  F('fd_bandaid', 'Brave Bandage', 'bandaid', 'common', undefined, { collection: 'street_crew' }),
  F('fd_mole', 'Beauty Mark', 'mole', 'common'),
  F('fd_heart', 'Heart Sticker', 'heart', 'uncommon', { main: '#ff5c8a' }, { palette: 'candy', collection: 'decora_pop' }),
  F('fd_stars', 'Star Stickers', 'stars', 'uncommon', { main: '#ffd34d' }, { palette: 'candy', collection: 'decora_pop' }),
  F('fd_tear', 'Painted Tear', 'tear', 'rare', { main: '#7fc8ff' }, { palette: 'candy', collection: 'dream_jirai' }),
  F('fd_whiskers', 'Kitty Whiskers', 'whiskers', 'uncommon'),
  F('fd_stickers', 'Cheek Gems', 'stickers', 'rare', { main: '#a77bff' }, { palette: 'candy' }),
  F('fd_scar', 'Battle Scar', 'scar', 'uncommon', undefined, { collection: 'moonlit_knight' }),
];

export const MAKEUP_ITEMS = [
  item('makeup', 'mk_rosy', 'Rosy Lids', 'common', { kind: 'makeup', shadow: '#ff9ac1' }, { shop: 'salon', dye: { shadow: '#ff9ac1' }, palette: 'pastel' }),
  item('makeup', 'mk_smoky', 'Smoky Night', 'uncommon', { kind: 'makeup', shadow: '#5c5470', lip: '#8a1c3c' }, { shop: 'salon', dye: { shadow: '#5c5470' }, palette: 'gothic', collection: 'midnight_rose' }),
  item('makeup', 'mk_jirai', 'Teary Pink Liner', 'rare', { kind: 'makeup', under: '#ff6b8a', shadow: '#ffb3c8' }, { shop: 'salon', dye: { under: '#ff6b8a', shadow: '#ffb3c8' }, palette: 'candy', collection: 'dream_jirai' }),
  item('makeup', 'mk_glitter', 'Starlight Glitter', 'epic', { kind: 'makeup', shadow: '#c6b0ff', glitter: true }, { shop: 'salon', dye: { shadow: '#c6b0ff' }, palette: 'pastel', collection: 'starlight_academy' }),
  item('makeup', 'mk_cherry', 'Cherry Lip', 'common', { kind: 'makeup', lip: '#e8384f' }, { shop: 'salon' }),
];
