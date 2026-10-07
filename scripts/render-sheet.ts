// Renders every cosmetic onto the base model into a contact sheet for visual review.
// Usage: npm run render:sheet -- [slot] [out.png]
import { writeFileSync, mkdirSync } from 'node:fs';
import { renderAvatar } from '../shared/src/avatar/index';
import { renderPet } from '../shared/src/avatar/pets';
import { ALL_ITEMS, ITEMS } from '../shared/src/data/items';
import type { AvatarLook, ItemDef } from '../shared/src/types';
import { encodePNG, blit } from './png';

const slotArg = process.argv[2] && process.argv[2] !== 'all' ? process.argv[2] : undefined;
const out = process.argv[3] ?? `scratch/sheet-${slotArg ?? 'all'}.png`;
const items = ALL_ITEMS.filter((i) => !slotArg || i.slot === slotArg);

const base: AvatarLook = {
  skin: 'peach', eyeColor: '#7a4a2a',
  hairColor: { main: '#4a3328', accent: '#ff8fb1', mode: 'solid' },
  equipped: { hair: 'hair_tousled', eyes: 'eyes_round', mouth: 'mouth_smile', brows: 'brows_soft', top: 'top_tee', bottom: 'bt_jeans', shoes: 'sh_sneakers' },
  dyes: {},
};
const hairColors = ['#f2d27a', '#ff9ac1', '#4a3328', '#c6b0ff', '#2e2630', '#d9dbe8', '#ff7f6e', '#5a8cff'];

const COLS = 10, CW = 120, CH = 150, S = 1;
const rows = Math.ceil(items.length / COLS);
const W = COLS * CW * S, H = rows * CH * S;
const img = new Uint8ClampedArray(W * H * 4);
for (let i = 0; i < img.length; i += 4) { img[i] = 246; img[i + 1] = 240; img[i + 2] = 250; img[i + 3] = 255; }

items.forEach((it: ItemDef, i) => {
  const look: AvatarLook = JSON.parse(JSON.stringify(base));
  look.hairColor.main = hairColors[i % hairColors.length];
  if (it.slot === 'dress') { delete look.equipped.top; delete look.equipped.bottom; }
  if (it.slot === 'hair') look.hairColor.main = hairColors[i % hairColors.length];
  (look.equipped as Record<string, string>)[it.slot] = it.id;
  const x = (i % COLS) * CW * S, y = Math.floor(i / COLS) * CH * S;
  if (it.slot === 'pet') {
    const r = renderPet({ spec: it.render, colors: it.dye ?? {} }, 'idle', 0);
    blit(img, W, H, r.data, 160, 160, x - 20, y - 20, S);
    return;
  }
  const r = renderAvatar({ look, items: ITEMS, pose: it.slot === 'mount' && it.render.pose === 'broom' ? 'broom' : 'idle' });
  blit(img, W, H, r.data, 160, 160, x - 20, y - 12, S);
});
mkdirSync('scratch', { recursive: true });
writeFileSync(out, encodePNG(img, W, H));
console.log(`wrote ${out} (${items.length} items)`);
