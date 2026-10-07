// Colour helpers. Pixel-art shading uses hue-shifted ramps instead of plain darkening:
// shadows lean toward purple/blue and highlights toward warm yellow, which keeps
// sprites lively at small sizes (and matches the reference sheet's palette treatment).

export type RGB = [number, number, number];

export function hexToRgb(hex: string): RGB {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHex([r, g, b]: RGB): string {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}

export function rgbToHsl([r, g, b]: RGB): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h * 60, s, l];
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

/** Rotate a hue toward a target hue by up to `amount` degrees. */
function shiftHue(h: number, target: number, amount: number): number {
  let d = ((target - h + 540) % 360) - 180;
  if (Math.abs(d) < amount) return target;
  return h + Math.sign(d) * amount;
}

export interface Ramp {
  line: RGB;
  shade: RGB;
  base: RGB;
  light: RGB;
}

const rampCache = new Map<string, Ramp>();

export function ramp(hex: string): Ramp {
  const hit = rampCache.get(hex);
  if (hit) return hit;
  const base = hexToRgb(hex);
  const [h, s, l] = rgbToHsl(base);
  const shadeHue = s < 0.08 ? 250 : shiftHue(h, 260, 14);
  const lightHue = s < 0.08 ? h : shiftHue(h, 55, 10);
  const shadeSat = s < 0.08 ? 0.12 : Math.min(1, s * 1.05 + 0.05);
  const shade = hslToRgb(shadeHue, shadeSat, l * 0.8 - 0.02);
  const line = hslToRgb(s < 0.08 ? 255 : shiftHue(h, 265, 22), Math.min(1, (s < 0.08 ? 0.15 : s) * 0.9 + 0.1), Math.max(0.1, l * 0.42));
  const light = hslToRgb(lightHue, s, Math.min(0.97, l + (1 - l) * 0.45));
  const r: Ramp = { line, shade, base, light };
  rampCache.set(hex, r);
  return r;
}

export function mix(a: string, b: string, t: number): string {
  const A = hexToRgb(a), B = hexToRgb(b);
  return rgbToHex([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]);
}

export function lighten(hex: string, amt: number): string {
  const [h, s, l] = rgbToHsl(hexToRgb(hex));
  return rgbToHex(hslToRgb(h, s, l + (1 - l) * amt));
}

export function darken(hex: string, amt: number): string {
  const [h, s, l] = rgbToHsl(hexToRgb(hex));
  return rgbToHex(hslToRgb(h, s, l * (1 - amt)));
}
