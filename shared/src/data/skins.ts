import type { SkinTone } from '../types';

export const SKIN_TONES: SkinTone[] = [
  { id: 'porcelain', name: 'Porcelain', base: '#fde9de', shade: '#f2c9bb', line: '#a8706a', blush: '#f7a5a5' },
  { id: 'peach', name: 'Peach', base: '#fddcc8', shade: '#f0b8a0', line: '#a5655a', blush: '#f59a95' },
  { id: 'honey', name: 'Honey', base: '#f3c9a1', shade: '#dea47e', line: '#8f5a44', blush: '#ec8f80' },
  { id: 'caramel', name: 'Caramel', base: '#d9a57a', shade: '#bd845d', line: '#74452f', blush: '#d97a6a' },
  { id: 'cocoa', name: 'Cocoa', base: '#a8714c', shade: '#8a5638', line: '#4f2c1d', blush: '#c46655' },
  { id: 'espresso', name: 'Espresso', base: '#7a4c33', shade: '#603a26', line: '#331d13', blush: '#a84f45' },
  { id: 'moon', name: 'Moonbeam', base: '#e8ecfb', shade: '#c7cdeb', line: '#6f6f9e', blush: '#e7a2c3' },
  { id: 'mint', name: 'Pixie Mint', base: '#d9f5e4', shade: '#b0dfc5', line: '#4f8a6d', blush: '#f2a0b0' },
];

export const SKIN_BY_ID = Object.fromEntries(SKIN_TONES.map((s) => [s.id, s]));
