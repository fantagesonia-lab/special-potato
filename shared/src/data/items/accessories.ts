import { item } from './util';
import type { Slot } from '../../types';

type R = Parameters<typeof item>[3];
type O = Parameters<typeof item>[5];
const A = (slot: Slot, kind: string) => (id: string, name: string, rarity: R, style: string, dye: Record<string, string> | undefined, o: O = {}, extra: Record<string, unknown> = {}) =>
  item(slot, id, name, rarity, { kind, style, ...extra }, { dye, ...o });

const hat = A('hat', 'hat');
const ha = A('hairAcc', 'hairacc');
const gl = A('glasses', 'glasses');
const er = A('earrings', 'earrings');
const nk = A('necklace', 'necklace');
const sc = A('scarf', 'scarf');
const bk = A('back', 'back');
const wg = A('wings', 'wings');
const bg = A('bag', 'bag');
const bt = A('belt', 'belt');
const hh = A('handheld', 'handheld');

export const HATS = [
  hat('hat_beret', 'Painter Beret', 'common', 'beret', { main: '#e8384f' }, { palette: 'jewel', shop: 'accessory_shop', collection: 'cozy_cafe' }),
  hat('hat_berry_beret', 'Strawberry Beret', 'rare', 'beret', { main: '#e8384f' }, { palette: 'candy', shop: 'sweet_boutique', collection: 'strawberry_picnic' }),
  hat('hat_witch', 'Moonspell Witch Hat', 'epic', 'witch', { main: '#34407a', accent: '#8a5ad9', trim: '#ffe156' }, { palette: 'jewel', shop: 'fairy_glade', collection: 'starlight_academy' }),
  hat('hat_cap', 'Crew Ball Cap', 'common', 'cap', { main: '#5a8cff', accent: '#fdf6ee' }, { palette: 'candy', shop: 'street_shop', collection: 'street_crew' }),
  hat('hat_beanie', 'Pom Pom Beanie', 'common', 'beanie', { main: '#ff8fb1', accent: '#fdf6ee', pom: '#ffffff' }, { palette: 'winter', shop: 'winter_lodge', collection: 'snow_bunny' }),
  hat('hat_crown', 'Royal Jelly Crown', 'legendary', 'crown', { main: '#ffd25e', gem: '#ff5c8a' }, { palette: 'jewel', shop: 'luxury_boutique' }),
  hat('hat_tiara', 'Dewdrop Tiara', 'epic', 'tiara', { main: '#e7ecff', gem: '#7fd8ff' }, { palette: 'pastel', shop: 'luxury_boutique' }),
  hat('hat_bunny', 'Bunny Ear Headband', 'uncommon', 'bunny', { main: '#ffffff', accent: '#ffc4dd' }, { palette: 'pastel', shop: 'accessory_shop', collection: 'snow_bunny' }),
  hat('hat_cat', 'Kitten Ears', 'uncommon', 'cat', { main: '#3f3540', accent: '#ff9ac1' }, { palette: 'gothic', shop: 'accessory_shop', collection: 'dream_jirai' }),
  hat('hat_fox', 'Kitsune Ears', 'rare', 'fox', { main: '#ff9a3d', accent: '#fff3e0' }, { palette: 'earth', shop: 'fairy_glade', collection: 'forest_fairy' }),
  hat('hat_tophat', 'Magician Top Hat', 'rare', 'tophat', { main: '#2b2440', accent: '#8a1c3c', trim: '#ff7aa8' }, { palette: 'gothic', shop: 'gothic_boutique', collection: 'midnight_rose' }),
  hat('hat_flowercrown', 'Wildflower Crown', 'rare', 'flowercrown', { main: '#ffc4dd', accent: '#bfe6ff', trim: '#fff3a6' }, { palette: 'pastel', shop: 'fairy_glade', collection: 'forest_fairy' }),
  hat('hat_halo', 'Golden Halo', 'legendary', 'halo', { main: '#ffe680' }, { description: 'Awarded for helping around town.' }),
  hat('hat_bucket', 'Gingham Bucket Hat', 'common', 'bucket', { main: '#fdf6ee', accent: '#ff8fb1' }, { palette: 'pastel', shop: 'accessory_shop', collection: 'strawberry_picnic' }, { pattern: true }),
  hat('hat_sunhat', 'Seabreeze Sun Hat', 'uncommon', 'sunhat', { main: '#f4e2b8', accent: '#5a8cff' }, { palette: 'earth', shop: 'beach_shack', collection: 'seaside_holiday' }),
  hat('hat_pirate', 'Captain Tricorn', 'epic', 'pirate', { main: '#2b2440', trim: '#e2b54b' }, { palette: 'gothic', shop: 'beach_shack' }),
  hat('hat_horns', 'Little Devil Horns', 'uncommon', 'horns', { main: '#4a2d5c' }, { palette: 'gothic', shop: 'gothic_boutique', collection: 'pumpkin_parade' }),
  hat('hat_bowband', 'Big Bow Headband', 'common', 'bowband', { main: '#ff8fb1', accent: '#2b2440' }, { palette: 'candy', shop: 'accessory_shop', collection: 'dream_jirai' }),
  hat('hat_headphones', 'Heartbeat Headphones', 'rare', 'headphones', { main: '#ffffff', accent: '#ff8fb1', trim: '#ff5c8a' }, { palette: 'candy', shop: 'idol_stage', collection: 'sugar_idol' }),
  hat('hat_chef', 'Pâtissier Toque', 'uncommon', 'chef', { main: '#ffffff' }, { palette: 'pastel', shop: 'basic_boutique', collection: 'cozy_cafe' }),
  hat('hat_santa', 'Jolly Stocking Cap', 'event', 'santa', { main: '#d93a4a' }, { shop: 'event_winter', price: 30, currency: 'tokens', event: 'winter' }),
  hat('hat_pumpkin', 'Pumpkin Cap', 'event', 'pumpkin', { main: '#f28c28' }, { shop: 'event_halloween', price: 35, currency: 'tokens', event: 'halloween', collection: 'pumpkin_parade' }),
  hat('hat_mushroom', 'Toadstool Cap', 'rare', 'mushroom', { main: '#e8384f' }, { palette: 'candy', shop: 'fairy_glade', collection: 'forest_fairy' }),
  hat('hat_frog', 'Froggy Hat', 'uncommon', 'frog', { main: '#7ee081' }, { palette: 'candy', shop: 'accessory_shop', collection: 'decora_pop' }),
  hat('hat_antlers', 'Woodland Antlers', 'rare', 'antlers', { main: '#a97b52' }, { palette: 'earth', shop: 'winter_lodge' }),
  hat('hat_bonnet', 'Rose Lace Bonnet', 'epic', 'bonnet', { main: '#2b2440', accent: '#6b1f3a', trim: '#ffffff' }, { palette: 'gothic', shop: 'gothic_boutique', collection: 'midnight_rose' }),
  hat('hat_veil', 'Moonflower Veil', 'legendary', 'veil', { main: '#ffffff', accent: '#ffc4dd' }, { palette: 'pastel', shop: 'luxury_boutique' }),
  hat('hat_headband', 'Brawler Headband', 'uncommon', 'headband', { main: '#d93a4a', accent: '#d93a4a' }, { palette: 'jewel', shop: 'street_shop' }),
  hat('hat_kitsune', 'Festival Fox Mask', 'rare', 'kitsune', undefined, { shop: 'beach_shack', collection: 'seaside_holiday' }),
];

export const HAIR_ACCS = [
  ha('ha_bigbow', 'Giant Ribbon Bow', 'uncommon', 'bigbow', { main: '#ff5c8a' }, { palette: 'candy', shop: 'accessory_shop' }),
  ha('ha_backbow', 'Lolita Back Bow', 'rare', 'backbow', { main: '#2b2440' }, { palette: 'gothic', shop: 'gothic_boutique', collection: 'midnight_rose' }),
  ha('ha_twinbows', 'Twin Mini Bows', 'common', 'twinbows', { main: '#ff8fb1', accent: '#ffffff' }, { palette: 'candy', shop: 'accessory_shop', collection: 'dream_jirai' }),
  ha('ha_starclips', 'Star Clips', 'common', 'starclips', { main: '#ffe156' }, { palette: 'candy', shop: 'accessory_shop', collection: 'starlight_academy' }),
  ha('ha_heartclips', 'Heart Clips', 'common', 'heartclips', { main: '#ff5c8a' }, { palette: 'candy', shop: 'accessory_shop', collection: 'decora_pop' }),
  ha('ha_flowerclip', 'Daisy Clip', 'common', 'flowerclip', { main: '#ffffff', accent: '#ffe156' }, { palette: 'pastel', shop: 'accessory_shop', collection: 'forest_fairy' }),
  ha('ha_cherries', 'Cherry Bobbles', 'uncommon', 'cherries', { main: '#e8384f' }, { palette: 'candy', shop: 'sweet_boutique', collection: 'strawberry_picnic' }),
  ha('ha_pins', 'Criss-Cross Pins', 'common', 'pins', { main: '#ff3df0' }, { palette: 'neon', shop: 'street_shop', collection: 'decora_pop' }),
  ha('ha_butterfly', 'Butterfly Clip', 'uncommon', 'butterfly', { main: '#bfe6ff', accent: '#ffffff' }, { palette: 'pastel', shop: 'accessory_shop' }),
  ha('ha_ribbons', 'Streamer Ribbons', 'rare', 'ribbons', { main: '#8a5ad9' }, { palette: 'jewel', shop: 'idol_stage', collection: 'sugar_idol' }),
  ha('ha_pearls', 'Pearl Pins', 'uncommon', 'pearls', { main: '#fff8f0' }, { palette: 'pastel', shop: 'luxury_boutique' }),
  ha('ha_scrunchie', 'Polka Scrunchie', 'common', 'scrunchie', { main: '#5a8cff', accent: '#ffffff' }, { palette: 'candy', shop: 'basic_boutique' }),
];

export const GLASSES = [
  gl('gl_round', 'Bookworm Rounds', 'common', 'round', { main: '#6b4630', lens: '#bfe6ff' }, { palette: 'earth', shop: 'accessory_shop', collection: 'cozy_cafe' }),
  gl('gl_square', 'Study Squares', 'common', 'square', { main: '#2b2440' }, { palette: 'gothic', shop: 'accessory_shop', collection: 'starlight_academy' }),
  gl('gl_heart', 'Heart Shades', 'uncommon', 'heart', { lens: '#ff5c8a' }, { palette: 'candy', shop: 'beach_shack', collection: 'sugar_idol' }),
  gl('gl_star', 'Superstar Shades', 'rare', 'star', { lens: '#ffd34d' }, { palette: 'candy', shop: 'idol_stage' }),
  gl('gl_shades', 'Cool Shades', 'common', 'shades', { lens: '#2b2440' }, { palette: 'gothic', shop: 'street_shop', collection: 'street_crew' }),
  gl('gl_monocle', 'Gentleman Monocle', 'rare', 'monocle', { main: '#e2b54b' }, { palette: 'jewel', shop: 'luxury_boutique' }),
  gl('gl_goggles', 'Tinker Goggles', 'uncommon', 'goggles', { main: '#9b6a42', lens: '#9fe7ff', strap: '#3f3540' }, { palette: 'earth', shop: 'street_shop', collection: 'neon_byte' }),
  gl('gl_visor', 'Holo Visor', 'epic', 'visor', { lens: '#6ff7ff' }, { palette: 'neon', shop: 'street_shop', collection: 'neon_byte' }),
];

export const EARRINGS = [
  er('er_stud', 'Twinkle Studs', 'common', 'stud', { main: '#ffd25e' }, { palette: 'jewel', shop: 'accessory_shop' }),
  er('er_hoop', 'Golden Hoops', 'common', 'hoop', { main: '#ffd25e' }, { palette: 'jewel', shop: 'accessory_shop', collection: 'street_crew' }),
  er('er_drop', 'Teardrop Gems', 'uncommon', 'drop', { main: '#ffd25e', accent: '#7fd8ff' }, { palette: 'jewel', shop: 'luxury_boutique' }),
  er('er_star', 'Star Danglers', 'uncommon', 'star', { main: '#ffe156' }, { palette: 'candy', shop: 'accessory_shop', collection: 'starlight_academy' }),
  er('er_cherry', 'Cherry Earrings', 'uncommon', 'cherry', undefined, { shop: 'sweet_boutique', collection: 'strawberry_picnic' }),
  er('er_jam', 'Jam Jar Earrings', 'rare', 'jam', { accent: '#e8384f' }, { palette: 'candy', shop: 'sweet_boutique', collection: 'strawberry_picnic' }),
  er('er_pearl', 'Sea Pearl Drops', 'uncommon', 'pearl', { main: '#fff8f0' }, { palette: 'pastel', shop: 'beach_shack', collection: 'seaside_holiday' }),
  er('er_moon', 'Crescent Hooks', 'rare', 'moon', { main: '#e8ecfb' }, { palette: 'winter', shop: 'gothic_boutique', collection: 'moonlit_knight' }),
];

export const NECKLACES = [
  nk('nk_choker', 'Heart Choker', 'common', 'choker', { main: '#2b2440', accent: '#ff5c8a' }, { palette: 'gothic', shop: 'gothic_boutique', collection: 'dream_jirai' }, { charm: 'heart' }),
  nk('nk_pendant', 'Starlight Pendant', 'rare', 'pendant', { main: '#ffd25e', accent: '#8a5ad9' }, { palette: 'jewel', shop: 'luxury_boutique', collection: 'starlight_academy' }),
  nk('nk_pearls', 'Pearl Strand', 'uncommon', 'pearls', { main: '#fff8f0' }, { palette: 'pastel', shop: 'luxury_boutique' }),
  nk('nk_bell', 'Kitty Bell Collar', 'common', 'bell', { main: '#ffd25e', band: '#e8384f' }, { palette: 'candy', shop: 'pet_shop' }),
  nk('nk_locket', 'Heart Locket', 'uncommon', 'locket', { main: '#ffd25e' }, { palette: 'jewel', shop: 'accessory_shop', collection: 'midnight_rose' }),
  nk('nk_chain', 'Silver Chain', 'common', 'chain', { main: '#d7dbe6' }, { palette: 'winter', shop: 'street_shop', collection: 'street_crew' }),
];

export const SCARVES = [
  sc('sc_wrap', 'Cozy Wrap Scarf', 'common', 'wrap', { main: '#e8384f', accent: '#fdf6ee' }, { palette: 'winter', shop: 'winter_lodge', collection: 'snow_bunny' }, { pattern: true }),
  sc('sc_long', 'Long Striped Scarf', 'uncommon', 'long', { main: '#5a8cff', accent: '#ffe156' }, { palette: 'candy', shop: 'winter_lodge', collection: 'starlight_academy' }, { pattern: true }),
  sc('sc_bandana', 'Polka Bandana', 'common', 'bandana', { main: '#d93a4a', accent: '#ffffff' }, { palette: 'candy', shop: 'street_shop', collection: 'street_crew' }),
  sc('sc_ninja', 'Shadow Mask Scarf', 'rare', 'ninja', { main: '#2b2440' }, { palette: 'gothic', shop: 'fantasy_armory' }),
  sc('sc_fluffy', 'Cloud Puff Boa', 'rare', 'fluffy', { main: '#ffc4dd' }, { palette: 'pastel', shop: 'luxury_boutique', collection: 'sugar_idol' }),
];

export const BACKS = [
  bk('bk_backpack', 'School Backpack', 'common', 'backpack', { main: '#ff8fb1', strap: '#d96a8f' }, { palette: 'candy', shop: 'basic_boutique', collection: 'starlight_academy' }),
  bk('bk_bunnypack', 'Bunny Buddy Backpack', 'rare', 'bunnypack', { main: '#ffffff', accent: '#ff9ac1', strap: '#ffc4dd' }, { palette: 'pastel', shop: 'accessory_shop', collection: 'dream_jirai' }),
  bk('bk_guitar', 'Garage Band Guitar', 'rare', 'guitar', { main: '#e8384f' }, { palette: 'jewel', shop: 'idol_stage', collection: 'street_crew' }),
  bk('bk_blanket', 'Picnic Blanket Roll', 'uncommon', 'blanket', { main: '#ffffff', accent: '#e8384f' }, { palette: 'candy', shop: 'sweet_boutique', collection: 'strawberry_picnic' }),
  bk('bk_quiver', 'Ranger Quiver', 'uncommon', 'quiver', { main: '#9b6a42' }, { palette: 'earth', shop: 'fantasy_armory', collection: 'forest_fairy' }),
  bk('bk_bigbow', 'Grand Back Bow', 'epic', 'bigbow', { main: '#ff5c8a' }, { palette: 'candy', shop: 'luxury_boutique', collection: 'sugar_idol' }),
  bk('bk_cattail', 'Kitty Tail', 'uncommon', 'tail', { main: '#3f3540', accent: '#ff9ac1' }, { palette: 'gothic', shop: 'accessory_shop', collection: 'pumpkin_parade' }),
  bk('bk_foxtail', 'Fluffy Fox Tail', 'rare', 'foxtail', { main: '#ff9a3d' }, { palette: 'earth', shop: 'fairy_glade', collection: 'forest_fairy' }),
  bk('bk_shell', 'Turtle Shell Pack', 'uncommon', 'shell', { main: '#6f8f4a', accent: '#c9f2c7' }, { palette: 'earth', shop: 'beach_shack', collection: 'seaside_holiday' }),
  bk('bk_parasol', 'Lace Parasol (Shouldered)', 'rare', 'parasolback', { main: '#2b2440', accent: '#e8e0f0' }, { palette: 'gothic', shop: 'gothic_boutique', collection: 'midnight_rose' }),
];

export const WINGS = [
  wg('wg_angel', 'Cherub Wings', 'epic', 'angel', { main: '#ffffff', accent: '#ffe6a6' }, { palette: 'pastel', shop: 'luxury_boutique', frames: 2 }),
  wg('wg_devil', 'Imp Wings', 'rare', 'devil', { main: '#3a2a4a' }, { palette: 'gothic', shop: 'gothic_boutique', collection: 'pumpkin_parade', frames: 2 }),
  wg('wg_fairy', 'Dewdrop Fairy Wings', 'rare', 'fairy', { main: '#c6f2ff' }, { palette: 'pastel', shop: 'fairy_glade', collection: 'forest_fairy', frames: 2 }),
  wg('wg_butterfly', 'Monarch Wings', 'epic', 'butterfly', { main: '#ff9a3d', accent: '#2b2440' }, { palette: 'candy', shop: 'fairy_glade', frames: 2 }),
  wg('wg_star', 'Wishing Star Wings', 'legendary', 'star', { main: '#ffe680' }, { palette: 'candy', collection: 'starlight_academy', frames: 2, description: 'Granted for completing the Starlight Academy collection.' }),
  wg('wg_crystal', 'Glacier Crystal Wings', 'legendary', 'crystal', { main: '#9fe7ff' }, { palette: 'winter', shop: 'winter_lodge', price: 120, currency: 'gems', collection: 'snow_bunny', frames: 2 }),
  wg('wg_mecha', 'Byte Thruster Wings', 'epic', 'mecha', { main: '#cfd6e6', accent: '#6ff7ff' }, { palette: 'neon', shop: 'street_shop', collection: 'neon_byte', frames: 2 }),
  wg('wg_petal', 'Sakura Petal Wings', 'event', 'petal', { main: '#ffc4dd' }, { shop: 'event_spring', price: 90, currency: 'tokens', event: 'spring', frames: 2 }),
];

export const BAGS = [
  bg('bg_shoulder', 'Everyday Shoulder Bag', 'common', 'shoulder', { main: '#c9a46a', accent: '#6b4630' }, { palette: 'earth', shop: 'accessory_shop', collection: 'cozy_cafe' }),
  bg('bg_heart', 'Patent Heart Purse', 'uncommon', 'heart', { main: '#ff5c8a', strap: '#2b2440' }, { palette: 'candy', shop: 'accessory_shop', collection: 'dream_jirai' }),
  bg('bg_basket', 'Berry Basket', 'rare', 'basket', undefined, { shop: 'sweet_boutique', collection: 'strawberry_picnic' }),
  bg('bg_tote', 'Market Tote', 'common', 'tote', { main: '#fdf6ee', accent: '#5a8cff' }, { palette: 'pastel', shop: 'basic_boutique' }, { pattern: true }),
  bg('bg_star', 'Star Pouch', 'uncommon', 'star', { main: '#ffe156', strap: '#8a5ad9' }, { palette: 'candy', shop: 'accessory_shop', collection: 'starlight_academy' }),
  bg('bg_plush', 'Bear Plush Purse', 'rare', 'plush', { main: '#c9a46a', strap: '#ff8fb1' }, { palette: 'earth', shop: 'accessory_shop', collection: 'decora_pop' }),
];

export const BELTS = [
  bt('bl_plain', 'Leather Belt', 'common', 'plain', { main: '#6b4630', buckle: '#ffd25e' }, { palette: 'earth', shop: 'basic_boutique' }),
  bt('bl_chain', 'Wallet Chain', 'common', 'chain', { main: '#d7dbe6' }, { palette: 'winter', shop: 'street_shop', collection: 'street_crew' }),
  bt('bl_sash', 'Ribbon Sash', 'uncommon', 'sash', { main: '#ff8fb1' }, { palette: 'pastel', shop: 'sweet_boutique' }),
  bt('bl_obi', 'Festival Obi', 'rare', 'obi', { main: '#ffe156', accent: '#d93a4a' }, { palette: 'jewel', shop: 'beach_shack', collection: 'seaside_holiday' }),
  bt('bl_pouch', 'Adventurer Pouch Belt', 'uncommon', 'pouch', { main: '#6b4630', accent: '#9b6a42' }, { palette: 'earth', shop: 'fantasy_armory', collection: 'moonlit_knight' }),
];

export const HANDHELDS = [
  hh('hh_wand', 'Twinkle Wand', 'uncommon', 'wand', { main: '#ffe156', stick: '#f6f0ff' }, { palette: 'candy', shop: 'fairy_glade', collection: 'starlight_academy' }),
  hh('hh_staff', 'Moonstone Staff', 'epic', 'staff', { main: '#8a5ad9', trim: '#ffd25e', stick: '#f6f0ff' }, { palette: 'jewel', shop: 'fantasy_armory', collection: 'starlight_academy' }),
  hh('hh_umbrella', 'Raindrop Umbrella', 'common', 'umbrella', { main: '#5a8cff', accent: '#ffffff' }, { palette: 'candy', shop: 'basic_boutique' }, { pattern: true, raise: true }),
  hh('hh_parasol', 'Lace Parasol', 'rare', 'parasol', { main: '#fff3f8', accent: '#ffc4dd' }, { palette: 'pastel', shop: 'luxury_boutique', collection: 'midnight_rose' }, { raise: true }),
  hh('hh_icecream', 'Double Scoop Cone', 'common', 'icecream', { main: '#ffc4dd', accent: '#c9f2c7' }, { palette: 'pastel', shop: 'beach_shack', collection: 'seaside_holiday' }),
  hh('hh_boba', 'Brown Sugar Boba', 'common', 'boba', { main: '#e8d6b0', accent: '#ff8fb1' }, { palette: 'earth', shop: 'basic_boutique', collection: 'cozy_cafe' }),
  hh('hh_balloon', 'Heart Balloon', 'uncommon', 'balloon', { main: '#ff5c8a' }, { palette: 'candy', shop: 'accessory_shop', collection: 'decora_pop' }, { shape: 'heart' }),
  hh('hh_lollipop', 'Swirl Lollipop', 'common', 'lollipop', { main: '#ff8fb1', accent: '#ffffff' }, { palette: 'candy', shop: 'sweet_boutique', collection: 'decora_pop' }),
  hh('hh_mic', 'Ribbon Idol Mic', 'rare', 'mic', { main: '#ffc4dd', accent: '#ff5c8a', stick: '#ffffff' }, { palette: 'candy', shop: 'idol_stage', collection: 'sugar_idol' }),
  hh('hh_bouquet', 'Posy Bouquet', 'uncommon', 'bouquet', { main: '#ffc4dd', accent: '#fff3a6' }, { palette: 'pastel', shop: 'fairy_glade', collection: 'forest_fairy' }),
  hh('hh_book', 'Spellbook', 'uncommon', 'book', { main: '#8a3ad9', accent: '#ffe156' }, { palette: 'jewel', shop: 'basic_boutique', collection: 'starlight_academy' }),
  hh('hh_sword', 'Moonlit Blade', 'epic', 'sword', { main: '#e2b54b', accent: '#34407a', blade: '#e9eef8' }, { palette: 'jewel', shop: 'fantasy_armory', collection: 'moonlit_knight' }),
  hh('hh_lantern', 'Paper Lantern', 'uncommon', 'lantern', { main: '#ff7f6e' }, { palette: 'candy', shop: 'beach_shack', collection: 'seaside_holiday' }),
  hh('hh_fan', 'Folding Fan', 'common', 'fan', { main: '#ffffff', accent: '#d93a4a' }, { palette: 'jewel', shop: 'luxury_boutique' }),
  hh('hh_plush', 'Bedtime Bear', 'common', 'plush', { main: '#c9a46a', accent: '#f4e2c8' }, { palette: 'earth', shop: 'pet_shop', collection: 'cozy_cafe' }),
  hh('hh_bubbles', 'Bubble Wand', 'uncommon', 'bubblewand', { main: '#bfe6ff' }, { palette: 'pastel', shop: 'beach_shack' }),
  hh('hh_camera', 'Instant Camera', 'rare', 'camera', { main: '#fdf6ee', accent: '#ff8fb1' }, { palette: 'pastel', shop: 'photo_booth' }),
  hh('hh_berry_basket', 'Strawberry Basket', 'rare', 'basket', { main: '#e8384f' }, { palette: 'candy', shop: 'sweet_boutique', collection: 'strawberry_picnic' }),
  hh('hh_scythe', 'Candy Scythe', 'event', 'scythe', { main: '#ff9a3d' }, { shop: 'event_halloween', price: 70, currency: 'tokens', event: 'halloween', collection: 'pumpkin_parade' }),
  hh('hh_phone', 'Flip Phone', 'common', 'phone', { main: '#c6b0ff' }, { palette: 'neon', shop: 'street_shop', collection: 'neon_byte' }),
];

const pet = (id: string, name: string, rarity: R, species: string, dye: Record<string, string>, o: O = {}, extra: Record<string, unknown> = {}) =>
  item('pet', id, name, rarity, { kind: 'pet', species, ...extra }, { dye, shop: o.shop ?? 'pet_shop', ...o });

export const PETS = [
  pet('pet_cat', 'Mochi the Kitten', 'common', 'cat', { main: '#fdf6ee', accent: '#ff9ac1' }, { palette: 'pastel', description: 'Naps in sunbeams. Judges your outfits.' }),
  pet('pet_dog', 'Biscuit the Pup', 'common', 'dog', { main: '#e8c48a', accent: '#a97b52' }, { palette: 'earth' }),
  pet('pet_berry_bunny', 'Strawberry Bunny', 'epic', 'bunny', { main: '#ffffff', accent: '#ffb3c8' }, { palette: 'pastel', shop: 'sweet_boutique', collection: 'strawberry_picnic' }, { berry: true }),
  pet('pet_bear', 'Honey Cub', 'uncommon', 'bear', { main: '#a97b52', accent: '#e8c48a' }, { palette: 'earth' }),
  pet('pet_seal', 'Snowball Seal', 'rare', 'seal', { main: '#e8ecfb' }, { palette: 'winter', shop: 'winter_lodge', collection: 'snow_bunny' }),
  pet('pet_hamster', 'Peanut Hamster', 'common', 'hamster', { main: '#ffcf8a', accent: '#fff3e0' }, { palette: 'earth' }),
  pet('pet_bird', 'Bluebell Birdie', 'uncommon', 'bird', { main: '#7fb8ff', accent: '#ffb347' }, { palette: 'candy' }),
  pet('pet_ghost', 'Boo-Boo Ghost', 'event', 'ghost', { main: '#f4f1ff' }, { shop: 'event_halloween', price: 100, currency: 'tokens', event: 'halloween', collection: 'pumpkin_parade' }),
  pet('pet_cloud', 'Nimbus Cloudlet', 'rare', 'cloud', { main: '#ffffff' }, { palette: 'pastel', shop: 'fairy_glade' }),
  pet('pet_star', 'Twink the Star', 'epic', 'star', { main: '#ffe680' }, { palette: 'candy', shop: 'fairy_glade', collection: 'starlight_academy' }),
  pet('pet_slime', 'King Gumdrop Slime', 'rare', 'slime', { main: '#9df2c8' }, { palette: 'candy' }, { crown: true }),
  pet('pet_dragon', 'Ember Whelp', 'legendary', 'dragon', { main: '#ff7f6e', accent: '#ffe156' }, { palette: 'jewel', price: 150, currency: 'gems', collection: 'moonlit_knight' }),
  pet('pet_jelly', 'Drifty Jellyfish', 'rare', 'jellyfish', { main: '#c6b0ff', accent: '#ffc4dd' }, { palette: 'pastel', shop: 'beach_shack', collection: 'seaside_holiday' }),
];

const mount = (id: string, name: string, rarity: R, style: string, dye: Record<string, string>, speed: number, o: O = {}, extra: Record<string, unknown> = {}) =>
  item('mount', id, name, rarity, { kind: 'mount', style, ...extra }, { dye, speed, shop: o.shop ?? 'board_shop', frames: 2, ...o });

export const MOUNTS = [
  mount('mt_hoverboard', 'Classic Hoverboard', 'uncommon', 'hoverboard', { main: '#5a8cff', accent: '#ffe156', glow: '#7ff6ff' }, 1.5, { palette: 'candy', description: 'The board that started it all.' }),
  mount('mt_skateboard', 'Sticker Skateboard', 'common', 'skateboard', { main: '#ff8fb1', accent: '#ffe156' }, 1.35, { palette: 'candy', collection: 'street_crew' }),
  mount('mt_cloud', 'Daydream Cloud', 'epic', 'cloud', { main: '#ffffff', accent: '#ffc4dd' }, 1.45, { palette: 'pastel', shop: 'fairy_glade' }),
  mount('mt_carpet', 'Bazaar Flying Carpet', 'epic', 'carpet', { main: '#d93a4a', accent: '#ffe156', fringe: '#ffd25e' }, 1.6, { palette: 'jewel' }),
  mount('mt_star', 'Shooting Star Ride', 'legendary', 'star', { main: '#ffe680' }, 1.75, { palette: 'candy', price: 200, currency: 'gems', collection: 'starlight_academy' }),
  mount('mt_scooter', 'Pastel Kick Scooter', 'common', 'scooter', { main: '#9df2c8', accent: '#ff8fb1' }, 1.3, { palette: 'pastel' }),
  mount('mt_broom', 'Midnight Broomstick', 'rare', 'broom', { main: '#9b6a42', accent: '#8a5ad9' }, 1.55, { palette: 'gothic', shop: 'fairy_glade', collection: 'pumpkin_parade' }, { pose: 'broom' }),
  mount('mt_plushbear', 'Giant Plush Bear', 'epic', 'plushbear', { main: '#c9a46a', accent: '#f4e2c8' }, 1.25, { palette: 'earth', collection: 'decora_pop' }, { pose: 'broom' }),
  mount('mt_heartcar', 'Sweetheart Cruiser', 'epic', 'heartcar', { main: '#ff5c8a' }, 1.5, { shop: 'event_valentine', price: 120, currency: 'tokens', event: 'valentine' }),
  mount('mt_crystal', 'Prism Glider', 'rare', 'crystal', { main: '#c9b6ff', glow: '#c9b6ff' }, 1.55, { palette: 'winter', shop: 'winter_lodge' }),
];

const aura = (id: string, name: string, rarity: R, particle: string, colors: string[], o: O = {}) =>
  item('aura', id, name, rarity, { kind: 'aura', particle, colors }, { shop: o.shop ?? 'luxury_boutique', frames: 2, ...o });

export const AURAS = [
  aura('au_sparkle', 'Glimmer Aura', 'rare', 'sparkle', ['#ffe680', '#ffffff']),
  aura('au_hearts', 'Lovesick Aura', 'epic', 'heart', ['#ff5c8a', '#ffc4dd'], { collection: 'sugar_idol' }),
  aura('au_snow', 'Snowfall Aura', 'epic', 'snow', ['#ffffff', '#cfe3ff'], { shop: 'winter_lodge', collection: 'snow_bunny' }),
  aura('au_petals', 'Blossom Breeze', 'epic', 'petal', ['#ffc4dd', '#ffffff'], { shop: 'fairy_glade', collection: 'forest_fairy' }),
  aura('au_notes', 'Melody Aura', 'rare', 'note', ['#8a5ad9', '#5a8cff'], { shop: 'idol_stage', collection: 'sugar_idol' }),
  aura('au_bubbles', 'Bubble Float', 'uncommon', 'bubble', ['#bfe6ff', '#ffffff'], { shop: 'beach_shack', collection: 'seaside_holiday' }),
  aura('au_stars', 'Constellation Aura', 'legendary', 'star', ['#ffe680', '#c6b0ff'], { price: 160, currency: 'gems', collection: 'starlight_academy' }),
  aura('au_bats', 'Bat Flurry', 'event', 'bat', ['#3a2a4a', '#ff9a3d'], { shop: 'event_halloween', price: 90, currency: 'tokens', event: 'halloween', collection: 'pumpkin_parade' }),
];

const scene = (id: string, name: string, rarity: R, sceneId: string, o: O = {}) =>
  item('background', id, name, rarity, { kind: 'background', scene: sceneId }, { shop: o.shop ?? 'photo_booth', ...o });

export const BACKGROUNDS = [
  scene('bgd_plaza', 'Plaza Postcard', 'common', 'plaza', { starter: true }),
  scene('bgd_sakura', 'Sakura Lane', 'uncommon', 'sakura'),
  scene('bgd_starry', 'Starry Rooftop', 'rare', 'starry'),
  scene('bgd_sunset', 'Beach Sunset', 'uncommon', 'sunset'),
  scene('bgd_candy', 'Candy Land', 'rare', 'candy'),
  scene('bgd_snowglobe', 'Snow Globe', 'rare', 'snowglobe'),
  scene('bgd_neon', 'Neon Alley', 'rare', 'neon'),
  scene('bgd_stage', 'Idol Stage', 'epic', 'stage'),
];

const plate = (id: string, name: string, rarity: R, style: string, colors: [string, string, string], o: O = {}) =>
  item('nameplate', id, name, rarity, { kind: 'nameplate', style, colors }, { shop: o.shop ?? 'accessory_shop', ...o });

export const NAMEPLATES = [
  plate('np_basic', 'Classic Tag', 'common', 'basic', ['#ffffff', '#3a3046', '#c9b6ff'], { starter: true }),
  plate('np_berry', 'Strawberry Tag', 'uncommon', 'berry', ['#ffd9e4', '#8a1c3c', '#e8384f'], { collection: 'strawberry_picnic' }),
  plate('np_star', 'Starlight Tag', 'rare', 'star', ['#34407a', '#ffe680', '#8a5ad9'], { collection: 'starlight_academy' }),
  plate('np_gothic', 'Rose Lace Tag', 'rare', 'gothic', ['#2b2440', '#ffd9e4', '#6b1f3a'], { collection: 'midnight_rose' }),
  plate('np_neon', 'Glitch Tag', 'rare', 'neon', ['#1f1a2a', '#6ff7ff', '#ff3df0'], { collection: 'neon_byte' }),
  plate('np_gold', 'Gilded Tag', 'legendary', 'gold', ['#fff3c4', '#6b4a12', '#e2b54b'], { price: 80, currency: 'gems' }),
];
