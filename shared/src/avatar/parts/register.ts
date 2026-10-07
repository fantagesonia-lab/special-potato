// Wires every render kind to its generator.
import { registerGenerator } from '../registry';
import { hairParts, type HairSpec } from './hair';
import { bottomParts, dressParts, gloveParts, jacketParts, shoeParts, skirtParts, socksParts, topParts } from './garments';
import {
  auraPreviewParts, backParts, bagParts, beltParts, earringParts, faceDetailParts, glassesParts,
  hairAccParts, handheldParts, hatParts, makeupParts, necklaceParts, scarfParts, wingParts,
} from './accessories';
import { mountParts } from './mounts';
import { LAYER } from '../compose';

registerGenerator('hair', (spec, ctx) => hairParts(spec as unknown as HairSpec, ctx.look.hairColor, ctx.sk, ctx.tag));
registerGenerator('top', (spec, ctx) => topParts(spec, ctx));
registerGenerator('bottom', bottomParts);
registerGenerator('skirt', (spec, ctx) => skirtParts(spec, ctx, LAYER.bottom));
registerGenerator('dress', dressParts);
registerGenerator('jacket', jacketParts);
registerGenerator('socks', socksParts);
registerGenerator('shoes', shoeParts);
registerGenerator('gloves', gloveParts);
registerGenerator('hat', hatParts);
registerGenerator('hairacc', hairAccParts);
registerGenerator('glasses', glassesParts);
registerGenerator('earrings', earringParts);
registerGenerator('necklace', necklaceParts);
registerGenerator('scarf', scarfParts);
registerGenerator('back', backParts);
registerGenerator('wings', wingParts);
registerGenerator('bag', bagParts);
registerGenerator('belt', beltParts);
registerGenerator('handheld', handheldParts);
registerGenerator('facedetail', faceDetailParts);
registerGenerator('makeup', makeupParts);
registerGenerator('aura', auraPreviewParts);
registerGenerator('mount', mountParts);
// Eyes, mouths and brows are drawn by the face pass; pets, backgrounds and nameplates by the world/UI.
for (const k of ['eyes', 'mouth', 'brows', 'pet', 'background', 'nameplate']) registerGenerator(k, () => []);
