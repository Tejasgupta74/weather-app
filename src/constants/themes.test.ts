import { describe, it, expect } from 'vitest';
import {
  PHASE_PALETTES,
  CONDITION_TINTS,
  resolveTheme,
  getContrastRatio,
  lerpColor,
} from './themes';
import { WeatherConditionCategory } from '../types/weather';
import { Phase } from '../utils/solarPosition';

describe('Theme Contrast & WCAG AA Compliance', () => {
  const phases: Phase[] = ['dawn', 'day', 'dusk', 'night'];
  const conditions: WeatherConditionCategory[] = [
    'clear',
    'cloudy',
    'fog',
    'drizzle',
    'rain',
    'snow',
    'thunderstorm',
  ];

  it('guarantees WCAG AA (>= 4.5:1) body text contrast for all 28 combinations', () => {
    let combinationCount = 0;

    for (const phase of phases) {
      for (const condition of conditions) {
        combinationCount++;
        const theme = resolveTheme(condition, phase);
        const ratio = getContrastRatio(theme.text, theme.surface);

        expect(
          ratio,
          `Failed WCAG AA (4.5:1) contrast for phase="${phase}" and condition="${condition}": ratio=${ratio.toFixed(2)}:1`
        ).toBeGreaterThanOrEqual(4.5);
      }
    }

    expect(combinationCount).toBe(28);
  });

  it('guarantees WCAG AA (>= 4.5:1) for secondary text (75% opacity) across all 28 combinations', () => {
    for (const phase of phases) {
      for (const condition of conditions) {
        const theme = resolveTheme(condition, phase);
        const secondaryText = lerpColor(theme.surface, theme.text, 0.75);
        const ratio = getContrastRatio(secondaryText, theme.surface);

        expect(
          ratio,
          `Failed WCAG AA (4.5:1) secondary text contrast for phase="${phase}" and condition="${condition}": ratio=${ratio.toFixed(2)}:1`
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('lerps colors accurately', () => {
    const white = '#FFFFFF';
    const black = '#000000';
    expect(lerpColor(white, black, 0)).toBe('#ffffff');
    expect(lerpColor(white, black, 1)).toBe('#000000');
    expect(lerpColor(white, black, 0.5)).toBe('#808080');
  });

  it('ensures no purple hues in palettes or tints', () => {
    // Purple has high Red and Blue with significantly lower Green
    const isPurple = (hex: string) => {
      const num = parseInt(hex.replace('#', ''), 16);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      return r > 100 && b > 140 && g < 80 && Math.abs(r - b) < 60;
    };

    for (const phase of phases) {
      const p = PHASE_PALETTES[phase];
      expect(isPurple(p.sky)).toBe(false);
      expect(isPurple(p.surface)).toBe(false);
    }

    for (const condition of conditions) {
      const t = CONDITION_TINTS[condition];
      expect(isPurple(t.color)).toBe(false);
    }
  });
});
