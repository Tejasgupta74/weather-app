import { WeatherConditionCategory } from '../types/weather';

export interface WeatherTheme {
  bgBase: string;
  glowRight: string;
  glowLeft: string;
  horizonGradient: string;
  chassisTint: string;
  accentStroke: string;
  heroBackdrop: string;
}

export function resolveWeatherTheme(category: WeatherConditionCategory, isDay: boolean): WeatherTheme {
  if (category === 'thunderstorm') {
    return {
      bgBase: '#12141A',
      glowRight: 'rgba(245, 158, 11, 0.22)', // Amber lightning flash
      glowLeft: 'rgba(30, 41, 59, 0.45)', // Dark thunderhead slate
      horizonGradient: 'from-[#0C0E12] via-[#161820] to-transparent',
      chassisTint: 'rgba(16, 18, 24, 0.70)',
      accentStroke: '#F59E0B',
      heroBackdrop: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80',
    };
  }

  if (category === 'rain' || category === 'drizzle') {
    return {
      bgBase: '#121820',
      glowRight: 'rgba(56, 189, 248, 0.22)', // Rain cyan
      glowLeft: 'rgba(30, 58, 138, 0.30)', // Deep maritime navy
      horizonGradient: 'from-[#0A0E14] via-[#101722] to-transparent',
      chassisTint: 'rgba(14, 20, 28, 0.65)',
      accentStroke: '#38BDF8',
      heroBackdrop: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1200&q=80',
    };
  }

  if (category === 'snow') {
    return {
      bgBase: '#161E28',
      glowRight: 'rgba(226, 232, 240, 0.22)', // Ice white
      glowLeft: 'rgba(56, 189, 248, 0.18)', // Glacial cyan
      horizonGradient: 'from-[#0E141C] via-[#141C26] to-transparent',
      chassisTint: 'rgba(18, 25, 35, 0.65)',
      accentStroke: '#E2E8F0',
      heroBackdrop: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=1200&q=80',
    };
  }

  if (category === 'fog') {
    return {
      bgBase: '#171B21',
      glowRight: 'rgba(148, 163, 184, 0.22)', // Dense mist silver
      glowLeft: 'rgba(71, 85, 105, 0.30)', // Cool fog shadow
      horizonGradient: 'from-[#0F1216] via-[#15191F] to-transparent',
      chassisTint: 'rgba(19, 23, 29, 0.68)',
      accentStroke: '#94A3B8',
      heroBackdrop: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=1200&q=80',
    };
  }

  if (category === 'cloudy') {
    return {
      bgBase: isDay ? '#181C24' : '#0F1217',
      glowRight: isDay ? 'rgba(100, 116, 139, 0.25)' : 'rgba(71, 85, 105, 0.18)',
      glowLeft: isDay ? 'rgba(30, 41, 59, 0.35)' : 'rgba(15, 23, 42, 0.40)',
      horizonGradient: 'from-[#0D1015] via-[#141820] to-transparent',
      chassisTint: 'rgba(18, 22, 28, 0.65)',
      accentStroke: '#38BDF8',
      heroBackdrop: 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?auto=format&fit=crop&w=1200&q=80',
    };
  }

  // Clear Sky
  if (isDay) {
    return {
      bgBase: '#2C241D', // Warm daylight interior
      glowRight: 'rgba(234, 179, 8, 0.24)', // Golden solar glow
      glowLeft: 'rgba(56, 189, 248, 0.20)', // Sky blue fill
      horizonGradient: 'from-[#1A1510] via-[#241C15] to-transparent',
      chassisTint: 'rgba(20, 22, 28, 0.65)',
      accentStroke: '#EAB308',
      heroBackdrop: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=1200&q=80',
    };
  }

  // Clear Night
  return {
    bgBase: '#0B0E14', // Deep celestial midnight
    glowRight: 'rgba(148, 163, 184, 0.18)', // Lunar pale silver
    glowLeft: 'rgba(30, 58, 138, 0.28)', // Deep midnight navy
    horizonGradient: 'from-[#06080B] via-[#0A0D12] to-transparent',
    chassisTint: 'rgba(13, 16, 22, 0.72)',
    accentStroke: '#38BDF8',
    heroBackdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
  };
}
