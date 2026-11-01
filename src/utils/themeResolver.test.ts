import { describe, it, expect } from 'vitest';
import { resolveWeatherTheme } from './themeResolver';

describe('themeResolver', () => {
  it('resolves amber accents and lightning backdrop for thunderstorm', () => {
    const theme = resolveWeatherTheme('thunderstorm', false);
    expect(theme.accentStroke).toBe('#F59E0B');
    expect(theme.bgBase).toBe('#12141A');
  });

  it('resolves cyan and rain backdrop for rain', () => {
    const theme = resolveWeatherTheme('rain', true);
    expect(theme.accentStroke).toBe('#38BDF8');
    expect(theme.bgBase).toBe('#121820');
  });

  it('resolves icy white accents for snow', () => {
    const theme = resolveWeatherTheme('snow', true);
    expect(theme.accentStroke).toBe('#E2E8F0');
  });

  it('differentiates clear day from clear night', () => {
    const dayTheme = resolveWeatherTheme('clear', true);
    const nightTheme = resolveWeatherTheme('clear', false);

    expect(dayTheme.accentStroke).toBe('#EAB308');
    expect(dayTheme.bgBase).toBe('#2C241D');

    expect(nightTheme.bgBase).toBe('#0B0E14');
  });
});
