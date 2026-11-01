import { describe, it, expect } from 'vitest';
import {
  toFahrenheit,
  toMph,
  formatTemperature,
  formatWindSpeed,
  getWindDirectionCardinal,
} from './unitConversion';

describe('unitConversion', () => {
  it('converts Celsius to Fahrenheit correctly', () => {
    expect(toFahrenheit(0)).toBe(32);
    expect(toFahrenheit(20)).toBe(68);
    expect(toFahrenheit(100)).toBe(212);
    expect(toFahrenheit(-10)).toBe(14);
  });

  it('converts km/h to mph correctly', () => {
    expect(toMph(0)).toBe(0);
    expect(toMph(100)).toBe(62);
  });

  it('formats temperature according to unit system', () => {
    expect(formatTemperature(21.4, 'metric')).toBe('21°');
    expect(formatTemperature(21.4, 'imperial')).toBe('71°');
  });

  it('formats wind speed according to unit system', () => {
    expect(formatWindSpeed(15, 'metric')).toBe('15 km/h');
    expect(formatWindSpeed(15, 'imperial')).toBe('9 mph');
  });

  it('computes wind direction cardinal correctly', () => {
    expect(getWindDirectionCardinal(0)).toBe('N');
    expect(getWindDirectionCardinal(45)).toBe('NE');
    expect(getWindDirectionCardinal(90)).toBe('E');
    expect(getWindDirectionCardinal(180)).toBe('S');
    expect(getWindDirectionCardinal(270)).toBe('W');
    expect(getWindDirectionCardinal(359)).toBe('N');
  });
});
