// Minimal PNG encoder (RGBA, no dependencies) used by the asset tools.
import { deflateSync } from 'node:zlib';

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Uint8Array): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, 'ascii'), Buffer.from(data)]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}

export function encodePNG(rgba: Uint8ClampedArray | Uint8Array, w: number, h: number): Buffer {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    Buffer.from(rgba.buffer, rgba.byteOffset + y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', new Uint8Array()),
  ]);
}

/** Paste a source RGBA image into a destination at (dx,dy), scaled by an integer factor. */
export function blit(dst: Uint8ClampedArray, dw: number, dh: number, src: Uint8ClampedArray, sw: number, sh: number, dx: number, dy: number, scale = 1, bg?: [number, number, number]) {
  for (let y = 0; y < sh * scale; y++) {
    for (let x = 0; x < sw * scale; x++) {
      const tx = dx + x, ty = dy + y;
      if (tx < 0 || ty < 0 || tx >= dw || ty >= dh) continue;
      const so = (Math.floor(y / scale) * sw + Math.floor(x / scale)) * 4;
      const a = src[so + 3] / 255;
      const o = (ty * dw + tx) * 4;
      if (a === 0) { if (bg) { dst[o] = bg[0]; dst[o + 1] = bg[1]; dst[o + 2] = bg[2]; dst[o + 3] = 255; } continue; }
      dst[o] = src[so] * a + dst[o] * (1 - a);
      dst[o + 1] = src[so + 1] * a + dst[o + 1] * (1 - a);
      dst[o + 2] = src[so + 2] * a + dst[o + 2] * (1 - a);
      dst[o + 3] = 255;
    }
  }
}
