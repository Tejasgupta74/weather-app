import { useMemo, useEffect } from 'react';
import { WeatherConditionCategory } from '../types/weather';
import { Phase } from '../utils/solarPosition';
import { resolveTheme, ThemeColors } from '../constants/themes';

export function useWeatherTheme(
  condition: WeatherConditionCategory,
  phase: Phase
): ThemeColors {
  const theme = useMemo(
    () => resolveTheme(condition, phase),
    [condition, phase]
  );

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-sky', theme.skyRgb.join(' '));
    root.style.setProperty('--color-surface', theme.surfaceRgb.join(' '));
    root.style.setProperty('--color-text', theme.textRgb.join(' '));
  }, [theme]);

  return theme;
}
