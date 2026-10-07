import { item } from './util';

type R = Parameters<typeof item>[3];
type O = Parameters<typeof item>[5];
const T = (id: string, name: string, rarity: R, render: Record<string, unknown>, dye: Record<string, string>, o: O = {}) =>
  item('top', id, name, rarity, { kind: 'top', ...render }, { dye, ...o });
const J = (id: string, name: string, rarity: R, render: Record<string, unknown>, dye: Record<string, string>, o: O = {}) =>
  item('jacket', id, name, rarity, { kind: 'jacket', ...render }, { dye, ...o });
const Bt = (id: string, name: string, rarity: R, render: Record<string, unknown>, dye: Record<string, string>, o: O = {}) =>
  item('bottom', id, name, rarity, { kind: 'bottom', ...render }, { dye, ...o });
const D = (id: string, name: string, rarity: R, render: Record<string, unknown>, dye: Record<string, string>, o: O = {}) =>
  item('dress', id, name, rarity, { kind: 'dress', ...render }, { dye, ...o });

export const TOPS = [
  T('top_tee', 'Plain Day Tee', 'common', { body: 'tee', sleeves: 'short', length: 'waist' }, { main: '#fdf6ee' }, { starter: true, palette: 'pastel', shop: 'basic_boutique', collection: 'ribbon_basics' }),
  T('top_stripe_tee', 'Marina Stripe Tee', 'common', { body: 'tee', sleeves: 'short', length: 'waist', pattern: { kind: 'hstripes', every: 3 } }, { main: '#fdf6ee', accent: '#5a8cff' }, { palette: 'candy', shop: 'basic_boutique', collection: 'seaside_holiday' }),
  T('top_sailor', 'Seaside Sailor Blouse', 'uncommon', { body: 'tee', sleeves: 'puff', length: 'waist', collar: 'sailor' }, { main: '#fdf6ee', accent: '#34407a', bow: '#e8384f' }, { palette: 'jewel', shop: 'basic_boutique', collection: 'seaside_holiday' }),
  T('top_berry_knit', 'Strawberry Patch Knit', 'rare', { body: 'sweater', sleeves: 'long', length: 'waist', cuffs: true, hemTrim: true, pattern: { kind: 'motif', every: 3, rows: ['.g.', 'rrr', '.r.'], pal: { r: '#e8384f', g: '#4fb35a' } } }, { main: '#ffd9e4', trim: '#fdf6ee' }, { palette: 'pastel', shop: 'sweet_boutique', collection: 'strawberry_picnic' }),
  T('top_puff_blouse', 'Cream Puff Blouse', 'uncommon', { body: 'tee', sleeves: 'puff', length: 'waist', collar: 'peter', deco: [{ t: 'buttons' }] }, { main: '#fff3f8', trim: '#ffffff' }, { palette: 'pastel', shop: 'sweet_boutique', collection: 'cozy_cafe' }),
  T('top_hoodie', 'Marshmallow Hoodie', 'common', { body: 'hoodie', sleeves: 'long', length: 'hip', collar: 'hood', cuffs: true }, { main: '#c6b0ff', accent: '#b39cf0' }, { palette: 'pastel', shop: 'street_shop', collection: 'street_crew' }),
  T('top_crop_tank', 'Sunny Crop Tank', 'common', { body: 'crop', sleeves: 'none', length: 'waist' }, { main: '#ffe156' }, { palette: 'candy', shop: 'beach_shack' }),
  T('top_star_sweater', 'Shooting Star Sweater', 'uncommon', { body: 'sweater', sleeves: 'long', length: 'hip', cuffs: true, deco: [{ t: 'star', color: 'accent' }] }, { main: '#34407a', accent: '#ffe156', trim: '#fdf6ee' }, { palette: 'jewel', shop: 'basic_boutique', collection: 'starlight_academy' }),
  T('top_gothic_blouse', 'Nightingale Ruff Blouse', 'rare', { body: 'blouse', sleeves: 'bell', length: 'waist', collar: 'ruff', deco: [{ t: 'corset', color: 'accent' }] }, { main: '#2b2440', accent: '#6b1f3a', trim: '#e8e0f0' }, { palette: 'gothic', shop: 'gothic_boutique', collection: 'midnight_rose' }),
  T('top_idol_crop', 'Encore Bow Crop', 'rare', { body: 'crop', sleeves: 'puff', length: 'waist', collar: 'bow', hemTrim: true }, { main: '#ff8fb1', bow: '#ffffff', trim: '#ffffff' }, { palette: 'candy', shop: 'idol_stage', collection: 'sugar_idol' }),
  T('top_neon_mesh', 'Glitchwave Mesh Top', 'rare', { body: 'tee', sleeves: 'long', length: 'waist', pattern: { kind: 'plaid', every: 2 }, collar: 'turtle' }, { main: '#3a3550', accent: '#6ff7ff' }, { palette: 'neon', shop: 'street_shop', collection: 'neon_byte' }),
  T('top_fairy_bodice', 'Fernlight Bodice', 'rare', { body: 'tank', sleeves: 'cap', length: 'waist', deco: [{ t: 'corset', color: 'accent' }, { t: 'flower', color: 'trim' }] }, { main: '#c9f2c7', accent: '#6f8f4a', trim: '#ffc4dd' }, { palette: 'earth', shop: 'fairy_glade', collection: 'forest_fairy' }),
  T('top_kimono', 'Koi Pond Kimono Top', 'epic', { body: 'kimono', sleeves: 'kimono', length: 'hip' }, { main: '#ff9ac1', accent: '#34407a', trim: '#fdf6ee' }, { palette: 'jewel', shop: 'luxury_boutique', tags: ['traditional'] }),
  T('top_cuirass', 'Moonsteel Cuirass', 'epic', { body: 'armor', sleeves: 'long', length: 'hip', deco: [{ t: 'emblem', color: 'trim' }] }, { main: '#3a3550', accent: '#cfd6e6', trim: '#e2b54b' }, { palette: 'jewel', shop: 'fantasy_armory', collection: 'moonlit_knight' }),
  T('top_varsity_tee', 'Team Ribbonia Tee', 'common', { body: 'tee', sleeves: 'short', length: 'waist', deco: [{ t: 'number', color: 'accent' }, { t: 'stripe', y: 94, h: 1.5 }] }, { main: '#fdf6ee', accent: '#e8384f' }, { palette: 'candy', shop: 'street_shop', collection: 'street_crew' }),
  T('top_off_shoulder', 'Petal Off-Shoulder', 'uncommon', { body: 'blouse', sleeves: 'off', length: 'waist', hemTrim: true }, { main: '#fff3a6', trim: '#ffffff' }, { palette: 'pastel', shop: 'sweet_boutique' }),
  T('top_school', 'Academy Collared Shirt', 'common', { body: 'shirt', sleeves: 'long', length: 'waist', collar: 'collar', deco: [{ t: 'tie', color: 'accent' }] }, { main: '#fdf6ee', accent: '#34407a', trim: '#fdf6ee' }, { palette: 'jewel', shop: 'basic_boutique', collection: 'starlight_academy' }),
  T('top_turtleneck', 'Cocoa Turtleneck', 'common', { body: 'sweater', sleeves: 'long', length: 'waist', collar: 'turtle' }, { main: '#8a5236' }, { palette: 'earth', shop: 'basic_boutique', collection: 'cozy_cafe' }),
  T('top_heart_knit', 'Heartbeat Knit', 'uncommon', { body: 'sweater', sleeves: 'long', length: 'waist', pattern: { kind: 'hearts', every: 3 }, cuffs: true }, { main: '#fdf6ee', accent: '#ff5c8a', trim: '#ff8fb1' }, { palette: 'pastel', shop: 'sweet_boutique' }),
  T('top_skull_tee', 'Lil Bones Tee', 'uncommon', { body: 'tee', sleeves: 'short', length: 'waist', deco: [{ t: 'skull' }] }, { main: '#2b2440' }, { palette: 'gothic', shop: 'gothic_boutique', collection: 'dream_jirai' }),
  T('top_bunny_sweater', 'Snow Bunny Sweater', 'rare', { body: 'sweater', sleeves: 'long', length: 'hip', collar: 'turtle', pattern: { kind: 'motif', every: 4, rows: ['o.o', 'o.o', 'ooo'], pal: { o: '#ffffff' } }, cuffs: true, hemTrim: true }, { main: '#9fc4ff', trim: '#f4f1ff' }, { palette: 'winter', shop: 'winter_lodge', collection: 'snow_bunny' }),
  T('top_tube', 'Tropic Tube Top', 'common', { body: 'tube', sleeves: 'none', length: 'waist', pattern: { kind: 'dots', every: 3 } }, { main: '#3fb8b0', accent: '#fff3a6' }, { palette: 'candy', shop: 'beach_shack', collection: 'seaside_holiday' }),
  T('top_cafe_blouse', 'Latte Art Blouse', 'uncommon', { body: 'shirt', sleeves: 'puff', length: 'waist', collar: 'bow', deco: [{ t: 'placket' }, { t: 'buttons' }] }, { main: '#e8d6b0', bow: '#6b4630', trim: '#fdf6ee' }, { palette: 'earth', shop: 'basic_boutique', collection: 'cozy_cafe' }),
  T('top_jirai_blouse', 'Melancholy Frill Blouse', 'rare', { body: 'blouse', sleeves: 'puff', length: 'waist', collar: 'peter', deco: [{ t: 'bow', color: 'accent', y: 96 }, { t: 'hemlace' }] }, { main: '#ffd9e4', accent: '#2b2440', trim: '#ffffff' }, { palette: 'pastel', shop: 'gothic_boutique', collection: 'dream_jirai' }),
  T('top_pumpkin', 'Jack-o-Knit', 'event', { body: 'sweater', sleeves: 'long', length: 'hip', cuffs: true, pattern: { kind: 'hstripes', every: 4 } }, { main: '#ff9a3d', accent: '#2b2440', trim: '#2b2440' }, { shop: 'event_halloween', price: 30, currency: 'tokens', event: 'halloween', collection: 'pumpkin_parade' }),
];

export const JACKETS = [
  J('jk_berry_cardigan', 'Strawberry Cardigan', 'rare', { style: 'cardigan', length: 'hip', sleeves: 'long', buttons: true, cuffs: true }, { main: '#ff8fb1', trim: '#fdf6ee', button: '#e8384f' }, { palette: 'pastel', shop: 'sweet_boutique', collection: 'strawberry_picnic' }),
  J('jk_varsity', 'Ribbonia Varsity Jacket', 'rare', { style: 'varsity', length: 'hip', sleeves: 'long', emblem: true }, { main: '#34407a', accent: '#fdf6ee', trim: '#e8384f' }, { palette: 'jewel', shop: 'street_shop', collection: 'street_crew' }),
  J('jk_starlight_cape', 'Starlight Scholar Cape', 'epic', { style: 'cape', fur: false }, { main: '#34407a', lining: '#8a5ad9', trim: '#ffe156' }, { palette: 'jewel', shop: 'fairy_glade', collection: 'starlight_academy' }),
  J('jk_fur_coat', 'Aurora Fur Coat', 'epic', { style: 'fur', length: 'tunic', sleeves: 'long', fur: true, buttons: true }, { main: '#9fc4ff', fur: '#f4f1ff', button: '#ffe156' }, { palette: 'winter', shop: 'winter_lodge', collection: 'snow_bunny' }),
  J('jk_trench', 'Rainy Day Trench', 'uncommon', { style: 'trench', sleeves: 'long', belt: true, buttons: true }, { main: '#c9a46a', button: '#6b4630', belt: '#6b4630' }, { palette: 'earth', shop: 'luxury_boutique' }),
  J('jk_blazer', 'Prefect Blazer', 'uncommon', { style: 'blazer', length: 'hip', sleeves: 'long', emblem: true, cuffs: true }, { main: '#34407a', accent: '#ffe156', trim: '#2f4470' }, { palette: 'jewel', shop: 'basic_boutique', collection: 'starlight_academy' }),
  J('jk_bolero', 'Lace Bolero', 'uncommon', { style: 'bolero', sleeves: 'puff' }, { main: '#ffffff', trim: '#ffc4dd' }, { palette: 'pastel', shop: 'sweet_boutique' }),
  J('jk_knight_capelet', 'Moonlit Capelet', 'epic', { style: 'capelet', fur: true }, { main: '#2f4470', lining: '#24365a', trim: '#e2b54b', fur: '#f4f1ff' }, { palette: 'jewel', shop: 'fantasy_armory', collection: 'moonlit_knight' }),
  J('jk_longcoat', 'Frostbound Longcoat', 'legendary', { style: 'longcoat', sleeves: 'long', fur: true, cuffs: true, buttons: true }, { main: '#2b2440', fur: '#e8ecfb', trim: '#5a8cff', button: '#9fe7ff' }, { palette: 'gothic', shop: 'luxury_boutique', collection: 'snow_bunny' }),
  J('jk_denim', 'Patchwork Denim Jacket', 'common', { style: 'open', length: 'waist', sleeves: 'long', cuffs: true }, { main: '#6f8fc9', trim: '#4a6aa8' }, { palette: 'denim', shop: 'street_shop', collection: 'street_crew' }),
  J('jk_witch_cape', 'Bat Wing Cape', 'event', { style: 'cape' }, { main: '#2b2440', lining: '#ff9a3d', trim: '#ff9a3d' }, { shop: 'event_halloween', price: 60, currency: 'tokens', event: 'halloween', collection: 'pumpkin_parade' }),
  J('jk_neon_bomber', 'Byte Bomber', 'rare', { style: 'blazer', length: 'waist', sleeves: 'long', cuffs: true, pattern: { kind: 'stripes', every: 5 } }, { main: '#3a3550', accent: '#ff3df0', trim: '#6ff7ff' }, { palette: 'neon', shop: 'street_shop', collection: 'neon_byte' }),
];

export const BOTTOMS = [
  Bt('bt_denim_shorts', 'Weekend Denim Shorts', 'common', { style: 'shorts', cuffs: true }, { main: '#6f8fc9', accent: '#9fb4d8' }, { starter: true, palette: 'denim', shop: 'basic_boutique', collection: 'ribbon_basics' }),
  Bt('bt_jeans', 'Easy Straight Jeans', 'common', { style: 'jeans', cuffs: true }, { main: '#4a6aa8', accent: '#6f8fc9' }, { starter: true, palette: 'denim', shop: 'basic_boutique', collection: 'ribbon_basics' }),
  Bt('bt_wide', 'Cloudwalk Wide Pants', 'uncommon', { style: 'wide' }, { main: '#e8d6b0' }, { palette: 'earth', shop: 'street_shop' }),
  Bt('bt_cargo', 'Utility Cargo Pants', 'uncommon', { style: 'cargo', belt: true }, { main: '#6f8f4a', accent: '#5f7f3a', belt: '#2b2440' }, { palette: 'earth', shop: 'street_shop', collection: 'street_crew' }),
  Bt('bt_joggers', 'Comfy Joggers', 'common', { style: 'joggers' }, { main: '#9a98a8', accent: '#7a788a' }, { palette: 'pastel', shop: 'basic_boutique' }),
  Bt('bt_pleated', 'Academy Pleated Skirt', 'common', { style: 'skirt', skirt: 'pleated', len: 'mini', pattern: { kind: 'plaid', every: 4 } }, { main: '#34407a', accent: '#5a8cff' }, { starter: true, palette: 'jewel', shop: 'basic_boutique', collection: 'starlight_academy' }),
  Bt('bt_picnic_skirt', 'Picnic Lace Skirt', 'rare', { style: 'skirt', skirt: 'aline', len: 'short', lace: true, pattern: { kind: 'checks', every: 2 }, band: true }, { main: '#fdf6ee', accent: '#ff8fb1', trim: '#ffffff' }, { palette: 'pastel', shop: 'sweet_boutique', collection: 'strawberry_picnic' }),
  Bt('bt_tiered', 'Meringue Tiered Skirt', 'uncommon', { style: 'skirt', skirt: 'tiered', len: 'knee' }, { main: '#ffc4dd', trim: '#fff3f8' }, { palette: 'pastel', shop: 'sweet_boutique' }),
  Bt('bt_plaid', 'Rebel Plaid Skirt', 'uncommon', { style: 'skirt', skirt: 'pleated', len: 'mini', pattern: { kind: 'plaid', every: 3 }, bow: 'side' }, { main: '#8a1c3c', accent: '#2b2440' }, { palette: 'gothic', shop: 'gothic_boutique', collection: 'dream_jirai' }),
  Bt('bt_tutu', 'Prima Tutu', 'rare', { style: 'skirt', skirt: 'tutu', len: 'micro' }, { main: '#ffc4dd', trim: '#ffffff' }, { palette: 'pastel', shop: 'idol_stage', collection: 'sugar_idol' }),
  Bt('bt_overalls', 'Sunday Overalls', 'common', { style: 'overalls', cuffs: true }, { main: '#6f8fc9', accent: '#4a6aa8' }, { palette: 'denim', shop: 'basic_boutique', collection: 'cozy_cafe' }),
  Bt('bt_shortalls', 'Strawberry Shortalls', 'uncommon', { style: 'shortalls', pattern: { kind: 'checks', every: 2 } }, { main: '#ff8fb1', accent: '#ffffff' }, { palette: 'pastel', shop: 'sweet_boutique', collection: 'strawberry_picnic' }),
  Bt('bt_hakama', 'Shrine Hakama', 'epic', { style: 'hakama' }, { main: '#d93a4a' }, { palette: 'jewel', shop: 'luxury_boutique' }),
  Bt('bt_bloomers', 'Pumpkin Bloomers', 'uncommon', { style: 'bloomers' }, { main: '#ffffff' }, { palette: 'pastel', shop: 'gothic_boutique', collection: 'midnight_rose' }),
  Bt('bt_biker', 'Racer Bike Shorts', 'common', { style: 'biker' }, { main: '#2b2440' }, { palette: 'neon', shop: 'street_shop', collection: 'neon_byte' }),
  Bt('bt_mermaid', 'Tidepool Mermaid Skirt', 'epic', { style: 'skirt', skirt: 'mermaid', len: 'floor', pattern: { kind: 'diamonds', every: 4 } }, { main: '#3fb8b0', accent: '#9df2c8' }, { palette: 'jewel', shop: 'beach_shack', collection: 'seaside_holiday' }),
  Bt('bt_knight_greaves', 'Moonsteel Legguards', 'epic', { style: 'skinny', cuffs: true }, { main: '#cfd6e6', accent: '#e2b54b' }, { palette: 'jewel', shop: 'fantasy_armory', collection: 'moonlit_knight' }),
  Bt('bt_fairy_skirt', 'Leaflet Skirt', 'rare', { style: 'skirt', skirt: 'tiered', len: 'mini' }, { main: '#6f8f4a', trim: '#c9f2c7' }, { palette: 'earth', shop: 'fairy_glade', collection: 'forest_fairy' }),
];

export const DRESSES = [
  D('dr_strawberry', 'Shortcake Apron Dress', 'epic', { top: { body: 'tee', sleeves: 'puff', collar: 'peter' }, skirt: { style: 'aline', len: 'knee', pattern: { kind: 'motif', every: 3, rows: ['.g.', 'rrr', '.r.'], pal: { r: '#e8384f', g: '#4fb35a' } } }, apron: true, sash: 'bow' }, { main: '#ffd9e4', trim: '#ffffff', apron: '#ffffff', sash: '#e8384f' }, { palette: 'pastel', shop: 'sweet_boutique', collection: 'strawberry_picnic' }),
  D('dr_starlight', 'Starlight Gala Gown', 'legendary', { top: { body: 'blouse', sleeves: 'off', deco: [{ t: 'gem', color: 'accent' }] }, skirt: { style: 'ballgown', len: 'floor', pattern: { kind: 'stars', every: 4 } } }, { main: '#34407a', accent: '#ffe156', trim: '#8a5ad9' }, { palette: 'jewel', shop: 'luxury_boutique', collection: 'starlight_academy' }),
  D('dr_gothic', 'Midnight Rose Lolita', 'epic', { top: { body: 'blouse', sleeves: 'bell', collar: 'ruff', deco: [{ t: 'corset', color: 'accent' }] }, skirt: { style: 'puff', len: 'knee', lace: true, frill: true } }, { main: '#2b2440', accent: '#6b1f3a', trim: '#e8e0f0' }, { palette: 'gothic', shop: 'gothic_boutique', collection: 'midnight_rose' }),
  D('dr_sweet', 'Macaron Sweet Lolita', 'epic', { top: { body: 'blouse', sleeves: 'puff', collar: 'peter', deco: [{ t: 'bow', color: 'accent', y: 96 }] }, skirt: { style: 'tiered', len: 'knee', lace: true } }, { main: '#ffc4dd', accent: '#ff8fb1', trim: '#fff3f8' }, { palette: 'pastel', shop: 'sweet_boutique' }),
  D('dr_idol', 'Encore Stage Dress', 'epic', { top: { body: 'tee', sleeves: 'puff', collar: 'bow', deco: [{ t: 'heart', color: 'accent' }] }, skirt: { style: 'tutu', len: 'mini' }, sash: 'bow' }, { main: '#ff8fb1', accent: '#ffffff', trim: '#ffe6f0', bow: '#ffffff', sash: '#ff5c8a' }, { palette: 'candy', shop: 'idol_stage', collection: 'sugar_idol' }),
  D('dr_fairy', 'Fernlight Petal Dress', 'rare', { top: { body: 'tank', sleeves: 'cap', deco: [{ t: 'flower', color: 'accent' }] }, skirt: { style: 'tiered', len: 'knee' } }, { main: '#c9f2c7', accent: '#ffc4dd', trim: '#9df2c8' }, { palette: 'earth', shop: 'fairy_glade', collection: 'forest_fairy' }),
  D('dr_sundress', 'Lemonade Sundress', 'uncommon', { top: { body: 'tank', sleeves: 'none' }, skirt: { style: 'aline', len: 'knee', pattern: { kind: 'dots', every: 3 } }, sash: true }, { main: '#ffe156', accent: '#ffffff', sash: '#ff8fb1' }, { palette: 'candy', shop: 'beach_shack', collection: 'seaside_holiday' }),
  D('dr_winter', 'Snowglobe Velvet Dress', 'rare', { top: { body: 'sweater', sleeves: 'long', collar: 'peter', cuffs: true }, skirt: { style: 'puff', len: 'knee', lace: true } }, { main: '#d93a4a', trim: '#f4f1ff' }, { palette: 'winter', shop: 'winter_lodge', collection: 'snow_bunny' }),
  D('dr_maid', 'Café Maid Uniform', 'rare', { top: { body: 'blouse', sleeves: 'puff', collar: 'peter' }, skirt: { style: 'puff', len: 'knee', lace: true }, apron: true }, { main: '#2b2440', trim: '#ffffff', apron: '#ffffff' }, { palette: 'gothic', shop: 'luxury_boutique', collection: 'cozy_cafe' }),
  D('dr_princess', 'Rosewater Ballgown', 'legendary', { top: { body: 'blouse', sleeves: 'puff', deco: [{ t: 'gem', color: 'accent' }, { t: 'corset', color: 'trim' }] }, skirt: { style: 'ballgown', len: 'floor', lace: true } }, { main: '#ffc4dd', accent: '#ff5c8a', trim: '#fff3f8' }, { palette: 'pastel', shop: 'luxury_boutique' }),
  D('dr_jirai', 'Heartache Ribbon Dress', 'epic', { top: { body: 'blouse', sleeves: 'puff', collar: 'peter', deco: [{ t: 'bow', color: 'accent', y: 96 }] }, skirt: { style: 'puff', len: 'mini', pattern: { kind: 'hearts', every: 4 }, lace: true }, sash: 'bow' }, { main: '#ffd9e4', accent: '#2b2440', trim: '#ffffff', sash: '#2b2440' }, { palette: 'pastel', shop: 'gothic_boutique', collection: 'dream_jirai' }),
  D('dr_yukata', 'Firework Yukata', 'rare', { top: { body: 'kimono', sleeves: 'kimono' }, skirt: { style: 'pencil', len: 'long', pattern: { kind: 'motif', every: 4, rows: ['.o.', 'o.o', '.o.'] } } }, { main: '#34407a', accent: '#ffe156', trim: '#fdf6ee' }, { palette: 'jewel', shop: 'beach_shack', collection: 'seaside_holiday' }),
  D('dr_decora', 'Sticker Bomb Jumper', 'rare', { top: { body: 'tee', sleeves: 'short', deco: [{ t: 'heart', color: 'accent' }] }, skirt: { style: 'aline', len: 'mini', pattern: { kind: 'stars', every: 3 } } }, { main: '#7ee081', accent: '#ff5c8a' }, { palette: 'candy', shop: 'street_shop', collection: 'decora_pop' }),
  D('dr_witch', 'Pumpkin Patch Witch Dress', 'event', { top: { body: 'blouse', sleeves: 'bell', collar: 'collar' }, skirt: { style: 'puff', len: 'knee', pattern: { kind: 'hstripes', every: 4 } }, sash: 'bow' }, { main: '#2b2440', accent: '#ff9a3d', trim: '#ff9a3d', sash: '#ff9a3d' }, { shop: 'event_halloween', price: 80, currency: 'tokens', event: 'halloween', collection: 'pumpkin_parade' }),
];

export const SOCKS = [
  item('socks', 'sk_frilly', 'Frilly Ankle Socks', 'common', { kind: 'socks', len: 'ankle', frill: true }, { dye: { main: '#ffffff', accent: '#ffc4dd' }, palette: 'pastel', shop: 'sweet_boutique' }),
  item('socks', 'sk_knee', 'School Knee Socks', 'common', { kind: 'socks', len: 'knee', band: true }, { dye: { main: '#34407a', accent: '#fdf6ee' }, palette: 'jewel', shop: 'basic_boutique', collection: 'starlight_academy' }),
  item('socks', 'sk_thigh_stripe', 'Candy Stripe Thigh-Highs', 'uncommon', { kind: 'socks', len: 'thigh', pattern: { kind: 'hstripes', every: 3 } }, { dye: { main: '#ffffff', accent: '#ff5c8a' }, palette: 'candy', shop: 'street_shop', collection: 'decora_pop' }),
  item('socks', 'sk_lace_tights', 'Moonlace Tights', 'rare', { kind: 'socks', len: 'tights', pattern: { kind: 'lace' }, sheer: true }, { dye: { main: '#2b2440', accent: '#5c5470' }, palette: 'gothic', shop: 'gothic_boutique', collection: 'midnight_rose' }),
  item('socks', 'sk_bow_knee', 'Ribbon Knee Socks', 'uncommon', { kind: 'socks', len: 'knee', bows: true }, { dye: { main: '#fff3f8', accent: '#ff8fb1' }, palette: 'pastel', shop: 'sweet_boutique', collection: 'strawberry_picnic' }),
  item('socks', 'sk_crew', 'Sporty Crew Socks', 'common', { kind: 'socks', len: 'crew', band: true }, { dye: { main: '#ffffff', accent: '#5a8cff' }, palette: 'candy', shop: 'street_shop' }),
  item('socks', 'sk_jirai', 'Pastel Bandage Socks', 'uncommon', { kind: 'socks', len: 'thigh', band: true, bows: true }, { dye: { main: '#2b2440', accent: '#ffc4dd' }, palette: 'gothic', shop: 'gothic_boutique', collection: 'dream_jirai' }),
];

const S = (id: string, name: string, rarity: R, render: Record<string, unknown>, dye: Record<string, string>, o: O = {}) =>
  item('shoes', id, name, rarity, { kind: 'shoes', ...render }, { dye, palette: 'pastel', ...o });

export const SHOES = [
  S('sh_sneakers', 'Everyday Sneakers', 'common', { style: 'sneaker' }, { main: '#fdf6ee', accent: '#ff8fb1' }, { starter: true, shop: 'basic_boutique', collection: 'ribbon_basics' }),
  S('sh_maryjane', 'Polished Mary Janes', 'common', { style: 'maryjane', shiny: true }, { main: '#3f3540' }, { shop: 'sweet_boutique', palette: 'gothic' }),
  S('sh_platform_boots', 'Thunder Platform Boots', 'rare', { style: 'combat', laces: true }, { main: '#2b2440', accent: '#ff3df0', sole: '#1f1a2a' }, { shop: 'street_shop', palette: 'neon', collection: 'neon_byte' }),
  S('sh_tall_boots', 'Knightwalk Tall Boots', 'rare', { style: 'tallboot', shiny: true }, { main: '#3a3550', sole: '#2b2440' }, { shop: 'fantasy_armory', palette: 'gothic', collection: 'moonlit_knight' }),
  S('sh_rainboots', 'Puddle Jumper Boots', 'common', { style: 'rainboot', shiny: true }, { main: '#ffe156' }, { shop: 'basic_boutique', palette: 'candy' }),
  S('sh_sandals', 'Shell Sandals', 'common', { style: 'sandal' }, { main: '#c9a46a', sole: '#e8d6b0' }, { shop: 'beach_shack', palette: 'earth', collection: 'seaside_holiday' }),
  S('sh_heels', 'Starlit Heels', 'epic', { style: 'heel', shiny: true, bow: true }, { main: '#34407a', accent: '#ffe156' }, { shop: 'luxury_boutique', palette: 'jewel', collection: 'starlight_academy' }),
  S('sh_loafers', 'Library Loafers', 'common', { style: 'loafer', shiny: true }, { main: '#6b4630' }, { shop: 'basic_boutique', palette: 'earth', collection: 'cozy_cafe' }),
  S('sh_combat', 'Stomp Combat Boots', 'uncommon', { style: 'combat', laces: true }, { main: '#3f3540', accent: '#e8e0f0' }, { shop: 'street_shop', palette: 'gothic', collection: 'street_crew' }),
  S('sh_snowboots', 'Fluffy Snow Boots', 'rare', { style: 'boot', fluff: true }, { main: '#f4f1ff', fur: '#ffffff', sole: '#9fc4ff' }, { shop: 'winter_lodge', palette: 'winter', collection: 'snow_bunny' }),
  S('sh_skates', 'Retro Roller Skates', 'epic', { style: 'skate', laces: true }, { main: '#ffffff', accent: '#ff8fb1' }, { shop: 'street_shop', palette: 'candy', collection: 'decora_pop' }),
  S('sh_geta', 'Lantern Geta', 'uncommon', { style: 'geta' }, { main: '#d93a4a', sole: '#c9a46a' }, { shop: 'beach_shack', palette: 'jewel' }),
  S('sh_winged', 'Zephyr Winged Sneakers', 'legendary', { style: 'sneaker', wings: true }, { main: '#fdf6ee', accent: '#6fe0ff' }, { shop: 'fairy_glade', palette: 'pastel' }),
  S('sh_berry_platform', 'Strawberry Platform Shoes', 'rare', { style: 'platform', bow: true }, { main: '#e8384f', accent: '#ffffff', sole: '#fdf6ee' }, { shop: 'sweet_boutique', palette: 'candy', collection: 'strawberry_picnic' }),
  S('sh_lolita', 'Rosebud Lolita Platforms', 'epic', { style: 'platform', bow: true, shiny: true }, { main: '#2b2440', accent: '#6b1f3a', sole: '#1f1a2a' }, { shop: 'gothic_boutique', palette: 'gothic', collection: 'midnight_rose' }),
  S('sh_fairy', 'Acorn Cap Booties', 'uncommon', { style: 'boot' }, { main: '#9b6a42', sole: '#6b4630' }, { shop: 'fairy_glade', palette: 'earth', collection: 'forest_fairy' }),
  S('sh_idol', 'Spotlight Ribbon Boots', 'epic', { style: 'boot', bow: true, shiny: true }, { main: '#ffffff', accent: '#ff5c8a' }, { shop: 'idol_stage', palette: 'candy', collection: 'sugar_idol' }),
];

export const GLOVES = [
  item('gloves', 'gl_lace', 'Lace Tea Gloves', 'uncommon', { kind: 'gloves', len: 'short', lace: true }, { dye: { main: '#ffffff' }, palette: 'pastel', shop: 'luxury_boutique' }),
  item('gloves', 'gl_mittens', 'Bunny Mittens', 'common', { kind: 'gloves', len: 'short', cuff: true }, { dye: { main: '#ffc4dd', accent: '#ffffff' }, palette: 'winter', shop: 'winter_lodge', collection: 'snow_bunny' }),
  item('gloves', 'gl_fingerless', 'Fingerless Grip Gloves', 'common', { kind: 'gloves', len: 'short' }, { dye: { main: '#2b2440' }, palette: 'gothic', shop: 'street_shop', collection: 'street_crew' }),
  item('gloves', 'gl_opera', 'Opera Evening Gloves', 'rare', { kind: 'gloves', len: 'long' }, { dye: { main: '#2b2440' }, palette: 'gothic', shop: 'gothic_boutique', collection: 'midnight_rose' }),
  item('gloves', 'gl_gauntlet', 'Moonsteel Gauntlets', 'epic', { kind: 'gloves', len: 'long', cuff: true }, { dye: { main: '#cfd6e6', accent: '#e2b54b' }, palette: 'jewel', shop: 'fantasy_armory', collection: 'moonlit_knight' }),
];
