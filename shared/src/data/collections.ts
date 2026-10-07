import type { Collection } from '../types';

export const COLLECTIONS: Collection[] = [
  { id: 'ribbon_basics', name: 'Ribbonia Basics', description: 'The comfy staples every newcomer gets to know.', theme: 'casual', colors: ['#fdf6ee', '#9fb4d8'] },
  { id: 'strawberry_picnic', name: 'Strawberry Shortcake Picnic', description: 'Gingham, lace and berries for a sunny afternoon on the hill.', theme: 'sweet', colors: ['#ffd9e4', '#e8384f'], rewardBadge: 'badge_berry' },
  { id: 'starlight_academy', name: 'Starlight Academy', description: 'Uniforms and spellcraft from the school above the clouds.', theme: 'celestial', colors: ['#34407a', '#ffe680'], rewardBadge: 'badge_star' },
  { id: 'midnight_rose', name: 'Midnight Rose', description: 'Gothic lolita finery, black lace and velvet roses.', theme: 'gothic', colors: ['#2b2440', '#6b1f3a'], rewardBadge: 'badge_rose' },
  { id: 'sugar_idol', name: 'Sugar Pop Idol', description: 'Stage-ready bows, mics and hearts for your debut.', theme: 'idol', colors: ['#ff8fb1', '#ffffff'], rewardBadge: 'badge_idol' },
  { id: 'neon_byte', name: 'Neon Byte', description: 'Cyber Y2K gear straight out of a dial-up dream.', theme: 'cyber', colors: ['#1f1a2a', '#6ff7ff'] },
  { id: 'forest_fairy', name: 'Fernlight Fairy', description: 'Petals, leaves and dewdrops from the enchanted forest.', theme: 'fairy', colors: ['#c9f2c7', '#6f8f4a'] },
  { id: 'seaside_holiday', name: 'Seaside Holiday', description: 'Sun hats, seashells and festival yukata on the boardwalk.', theme: 'summer', colors: ['#bfe6ff', '#3fb8b0'] },
  { id: 'snow_bunny', name: 'Snow Bunny Lodge', description: 'Fluffy, frosty, cocoa-scented winter fashion.', theme: 'winter', colors: ['#cfe3ff', '#f4f1ff'] },
  { id: 'street_crew', name: 'Downtown Street Crew', description: 'Varsity jackets, cargo and chains from the rooftops of downtown.', theme: 'street', colors: ['#34407a', '#e8384f'] },
  { id: 'moonlit_knight', name: 'Moonlit Knight', description: 'Silver armour and capes for heroes of the night.', theme: 'fantasy', colors: ['#2f4470', '#cfd6e6'] },
  { id: 'cozy_cafe', name: 'Cozy Café', description: 'Latte-coloured knits, aprons and loafers.', theme: 'casual', colors: ['#e8d6b0', '#6b4630'] },
  { id: 'dream_jirai', name: 'Jirai Dreamer', description: 'Pink-and-black ribbons, heart chokers and teary liner.', theme: 'jirai kei', colors: ['#ffd9e4', '#2b2440'] },
  { id: 'decora_pop', name: 'Decora Pop', description: 'More clips. More stickers. More colour.', theme: 'decora', colors: ['#7ee081', '#ff5c8a'] },
  { id: 'pumpkin_parade', name: 'Pumpkin Parade', description: 'Halloween event collection. Trick or treat!', theme: 'halloween', colors: ['#2b2440', '#ff9a3d'], rewardBadge: 'badge_pumpkin' },
];

export const COLLECTION_BY_ID = Object.fromEntries(COLLECTIONS.map((c) => [c.id, c]));
