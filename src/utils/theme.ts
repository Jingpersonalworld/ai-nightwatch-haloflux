/**
 * Canvas-side design tokens for the cool-white neumorphic theme.
 * Mirrors the CSS custom properties in src/styles/tokens.css — change both together.
 *
 * Two tiers per hue:
 *  - `*Fx`   saturated, for strokes / fills / glows drawn on the light surface
 *  - `*Deep` darker, text-safe (>= 4.5:1 on the surface) for any glyphs drawn on canvas
 */
export type RGB = readonly [number, number, number];

export const THEME = {
  surface: '#e6ebf2',
  surfaceHi: '#eef2f8',
  well: '#dce3ec',
  shadowDark: 'rgba(163,177,198,0.70)',
  shadowLight: 'rgba(255,255,255,0.95)',

  ink: [30, 41, 56] as RGB,
  inkSoft: [63, 80, 104] as RGB,
  dim: [74, 90, 113] as RGB,

  blueFx: [37, 99, 235] as RGB,
  blueDeep: [26, 86, 194] as RGB,
  redFx: [255, 33, 87] as RGB,
  redDeep: [192, 20, 63] as RGB,
  violetFx: [124, 77, 255] as RGB,
  violetDeep: [91, 56, 184] as RGB,
  tealFx: [10, 143, 143] as RGB,
  tealDeep: [0, 102, 102] as RGB,
  amberFx: [254, 153, 0] as RGB,
  amberDeep: [143, 82, 0] as RGB,
  greenFx: [0, 166, 61] as RGB,
  greenDeep: [0, 112, 43] as RGB,

  // appended for the canvas engine (SSH_BRUTE strike colour, matches --pink in tokens.css)
  pinkFx: [226, 64, 138] as RGB,
  pinkDeep: [163, 29, 92] as RGB,
} as const;

export const rgbStr = (c: RGB) => `${c[0]},${c[1]},${c[2]}`;
export const rgbaOf = (c: RGB, a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
