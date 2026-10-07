import { writeFileSync } from 'node:fs';
import { renderAvatar } from '../shared/src/avatar/index';
import type { AvatarLook, ItemDef } from '../shared/src/types';
import { encodePNG, blit } from './png';

const items: Record<string, ItemDef> = {
  h1: { id: 'h1', name: 'h', slot: 'hair', rarity: 'common', tags: [], render: { kind: 'hair', back: 'none', bangs: 'messy', side: 'short' } },
  h2: { id: 'h2', name: 'h', slot: 'hair', rarity: 'common', tags: [], render: { kind: 'hair', back: 'waist', shape: 'wavy', bangs: 'blunt', side: 'long', extras: [{ t: 'ribbon', side: 'R' }] } },
};
const out = process.argv[2] ?? 'scratch/quick.png';
const looks: AvatarLook[] = [
  { skin: 'peach', eyeColor: '#7a4a2a', hairColor: { main: '#4a3328', accent: '#d94a5a', mode: 'solid' }, equipped: { hair: 'h1' }, dyes: {} },
  { skin: 'porcelain', eyeColor: '#3f7fd9', hairColor: { main: '#f2d27a', accent: '#7fb8ff', mode: 'solid' }, equipped: { hair: 'h2' }, dyes: {} },
  { skin: 'peach', eyeColor: '#3f7fd9', hairColor: { main: '#f2d27a', accent: '#7fb8ff', mode: 'solid' }, equipped: {}, dyes: {} },
];
const S = 4, W = 160 * S * looks.length, H = 160 * S;
const img = new Uint8ClampedArray(W * H * 4).fill(255);
looks.forEach((look, i) => {
  const r = renderAvatar({ look, items });
  blit(img, W, H, r.data, 160, 160, i * 160 * S, 0, S);
});
writeFileSync(out, encodePNG(img, W, H));
console.log('wrote', out);
