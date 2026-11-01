import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryCache } from './cache';

describe('MemoryCache', () => {
  let cache: MemoryCache;

  beforeEach(() => {
    cache = new MemoryCache();
  });

  it('stores and retrieves cached values', () => {
    cache.set('key1', { temp: 22 }, 1000);
    expect(cache.get('key1')).toEqual({ temp: 22 });
  });

  it('returns null for missing keys', () => {
    expect(cache.get('missing')).toBeNull();
  });

  it('expires items after TTL', () => {
    vi.useFakeTimers();
    cache.set('key1', 'value1', 500);

    expect(cache.get('key1')).toBe('value1');

    vi.advanceTimersByTime(501);
    expect(cache.get('key1')).toBeNull();
    vi.useRealTimers();
  });

  it('clears all items', () => {
    cache.set('k1', 'v1');
    cache.set('k2', 'v2');
    cache.clear();
    expect(cache.get('k1')).toBeNull();
    expect(cache.get('k2')).toBeNull();
  });
});
