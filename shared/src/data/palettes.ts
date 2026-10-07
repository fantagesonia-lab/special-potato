import type { Palette } from '../types';

// Dye palettes keep recolours on-model: every swatch was picked to shade well with the
// pixel ramp (no pure black/white, which lose their line/shade tones).
export const PALETTES: Palette[] = [
  { id: 'pastel', name: 'Pastel Parlor', colors: ['#ffc4dd', '#ffd9b8', '#fff3a6', '#c9f2c7', '#bfe6ff', '#d8c9ff', '#f6e7ff', '#fdf6ee'] },
  { id: 'candy', name: 'Candy Shop', colors: ['#ff5c8a', '#ff8fb1', '#ffb347', '#ffe156', '#7ee081', '#5ec8ff', '#a77bff', '#f08cff'] },
  { id: 'gothic', name: 'Midnight', colors: ['#2b2440', '#4a2d5c', '#6b1f3a', '#3a3550', '#5c5470', '#8a1c3c', '#1f3a4a', '#e8e0f0'] },
  { id: 'earth', name: 'Forest Floor', colors: ['#6b4630', '#9b6a42', '#c9a46a', '#6f8f4a', '#4f6b3a', '#b85c38', '#e8d6b0', '#8a7a6a'] },
  { id: 'neon', name: 'Neon Byte', colors: ['#6ff7ff', '#ff3df0', '#b6ff3d', '#ffe23d', '#7a5cff', '#ff6b3d', '#3a3550', '#f2f2ff'] },
  { id: 'jewel', name: 'Jewel Box', colors: ['#e8384f', '#2f6fd9', '#1fa37a', '#8a3ad9', '#e2b54b', '#d94a9a', '#1f8ab8', '#4a2d5c'] },
  { id: 'winter', name: 'Snow Lodge', colors: ['#f4f1ff', '#cfe3ff', '#9fc4ff', '#e8384f', '#2f6f5a', '#c9b6ff', '#ffe6f0', '#8a9ab8'] },
  { id: 'denim', name: 'Denim & Co.', colors: ['#6f8fc9', '#4a6aa8', '#9fb4d8', '#2f4470', '#c9d6ec', '#3a3550', '#a8a8b8', '#e8e0d0'] },
];

export const PALETTE_BY_ID = Object.fromEntries(PALETTES.map((p) => [p.id, p]));

export const HAIR_COLORS: { id: string; name: string; hex: string; group: 'natural' | 'fantasy' }[] = [
  { id: 'black', name: 'Black', hex: '#2e2630', group: 'natural' },
  { id: 'softblack', name: 'Soft Black', hex: '#3f3540', group: 'natural' },
  { id: 'espresso', name: 'Espresso', hex: '#4a3328', group: 'natural' },
  { id: 'chocolate', name: 'Chocolate', hex: '#6b4630', group: 'natural' },
  { id: 'chestnut', name: 'Chestnut', hex: '#8a5236', group: 'natural' },
  { id: 'auburn', name: 'Auburn', hex: '#9b3f2e', group: 'natural' },
  { id: 'copper', name: 'Copper', hex: '#c46a3a', group: 'natural' },
  { id: 'honey', name: 'Honey', hex: '#d9a05a', group: 'natural' },
  { id: 'blonde', name: 'Blonde', hex: '#f2d27a', group: 'natural' },
  { id: 'platinum', name: 'Platinum', hex: '#f4ecd8', group: 'natural' },
  { id: 'silver', name: 'Silver', hex: '#d9dbe8', group: 'natural' },
  { id: 'gray', name: 'Gray', hex: '#9a98a8', group: 'natural' },
  { id: 'pink', name: 'Pink', hex: '#ff9ac1', group: 'fantasy' },
  { id: 'peach', name: 'Peach', hex: '#ffbf9a', group: 'fantasy' },
  { id: 'coral', name: 'Coral', hex: '#ff7f6e', group: 'fantasy' },
  { id: 'red', name: 'Red', hex: '#d93a4a', group: 'fantasy' },
  { id: 'orange', name: 'Orange', hex: '#ff9a3d', group: 'fantasy' },
  { id: 'yellow', name: 'Yellow', hex: '#ffe066', group: 'fantasy' },
  { id: 'mint', name: 'Mint', hex: '#9df2c8', group: 'fantasy' },
  { id: 'green', name: 'Green', hex: '#5fbf6a', group: 'fantasy' },
  { id: 'teal', name: 'Teal', hex: '#3fb8b0', group: 'fantasy' },
  { id: 'cyan', name: 'Cyan', hex: '#6fe0ff', group: 'fantasy' },
  { id: 'blue', name: 'Blue', hex: '#5a8cff', group: 'fantasy' },
  { id: 'navy', name: 'Navy', hex: '#34407a', group: 'fantasy' },
  { id: 'lavender', name: 'Lavender', hex: '#c6b0ff', group: 'fantasy' },
  { id: 'purple', name: 'Purple', hex: '#8a5ad9', group: 'fantasy' },
  { id: 'magenta', name: 'Magenta', hex: '#e04aa8', group: 'fantasy' },
];

export const EYE_COLORS = ['#7a4a2a', '#a0602a', '#3f7fd9', '#4fa3c9', '#3fa36a', '#8a5ad9', '#d94a5a', '#e2b54b', '#5c5470', '#e04aa8', '#2f6f5a', '#6fd0ff'];

export const HAIR_MODES = ['solid', 'ombre', 'split', 'streaks', 'underlight', 'tips'] as const;
