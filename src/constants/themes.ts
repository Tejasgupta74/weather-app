import { WeatherConditionCategory } from '../types/weather';
import { Phase } from '../utils/solarPosition';

export interface PaletteColors {
  sky: string;
  surface: string;
  text: string;
}

export interface ConditionTint {
  color: string;
  amount: number;
}

export interface ThemeColors {
  sky: string;
  surface: string;
  text: string;
  skyRgb: [number, number, number];
  surfaceRgb: [number, number, number];
  textRgb: [number, number, number];
}

// 4 Phase palettes using grey, blue and warm neutral tones only (no purple, no gradients)
export const PHASE_PALETTES: Record<Phase, PaletteColors> = {
  dawn: {
    sky: '#526071',
    surface: '#1A2230',
    text: '#F8FAFC',
  },
  day: {
    sky: '#38BDF8',
    surface: '#1A2230',
    text: '#F8FAFC',
  },
  dusk: {
    sky: '#3E4C5E',
    surface: '#1A2230',
    text: '#F8FAFC',
  },
  night: {
    sky: '#0F172A',
    surface: '#131B27',
    text: '#F8FAFC',
  },
};

// Condition tint map for the 7 conditions
export const CONDITION_TINTS: Record<WeatherConditionCategory, ConditionTint> = {
  clear: { color: '#38BDF8', amount: 0.0 },
  cloudy: { color: '#64748B', amount: 0.3 },
  fog: { color: '#94A3B8', amount: 0.35 },
  drizzle: { color: '#475569', amount: 0.25 },
  rain: { color: '#334155', amount: 0.35 },
  snow: { color: '#94A3B8', amount: 0.25 },
  thunderstorm: { color: '#1E293B', amount: 0.45 },
};

export function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function toHex([r, g, b]: [number, number, number]): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('')}`;
}

export function lerpColor(hexA: string, hexB: string, amount: number): string {
  const [r1, g1, b1] = parseHex(hexA);
  const [r2, g2, b2] = parseHex(hexB);
  return toHex([
    r1 + (r2 - r1) * amount,
    g1 + (g2 - g1) * amount,
    b1 + (b2 - b1) * amount,
  ]);
}

export function getLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const bright = Math.max(lum1, lum2);
  const dark = Math.min(lum1, lum2);
  return (bright + 0.05) / (dark + 0.05);
}

export function pickContrastText(surfaceHex: string): string {
  const lightText = '#F8FAFC';
  const darkText = '#0F172A';
  return getContrastRatio(lightText, surfaceHex) >= getContrastRatio(darkText, surfaceHex)
    ? lightText
    : darkText;
}

export function resolveTheme(
  condition: WeatherConditionCategory,
  phase: Phase
): ThemeColors {
  const palette = PHASE_PALETTES[phase] || PHASE_PALETTES.day;
  const tint = CONDITION_TINTS[condition] || CONDITION_TINTS.clear;

  const sky = lerpColor(palette.sky, tint.color, tint.amount);
  const surface = lerpColor(palette.surface, tint.color, tint.amount * 0.35);
  const text = pickContrastText(surface);

  return {
    sky,
    surface,
    text,
    skyRgb: parseHex(sky),
    surfaceRgb: parseHex(surface),
    textRgb: parseHex(text),
  };
}
