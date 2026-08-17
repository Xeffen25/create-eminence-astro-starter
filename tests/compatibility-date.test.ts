import { describe, expect, it } from 'vitest';
import {
  clampCompatibilityDate,
  compatibilityDateFromWorkerdVersion,
  latestWranglerCompatibilityDate,
  todaysCompatibilityDate,
} from '../src/lib/compatibility-date.js';

function jsonResponse(body: unknown, ok = true) {
  return {
    ok,
    json: async () => body,
  } as Response;
}

describe('compatibility date', () => {
  it('formats today as YYYY-MM-DD in UTC', () =>
    expect(todaysCompatibilityDate(new Date('2026-08-17T23:00:00Z'))).toBe(
      '2026-08-17',
    ));
  it('reads the date encoded in a workerd version', () =>
    expect(compatibilityDateFromWorkerdVersion('1.20260811.1')).toBe(
      '2026-08-11',
    ));
  it('reads the date encoded in a miniflare version', () =>
    expect(compatibilityDateFromWorkerdVersion('5.20260811.1-alpha')).toBe(
      '2026-08-11',
    ));
  it('returns undefined for versions without a date', () =>
    expect(compatibilityDateFromWorkerdVersion('4.123.0')).toBeUndefined());
  it('does not use a workerd date after today', () =>
    expect(clampCompatibilityDate('2026-08-17', '2026-08-11')).toBe(
      '2026-08-11',
    ));
  it('uses wrangler latest workerd when that date is not after today', async () => {
    const date = await latestWranglerCompatibilityDate({
      now: new Date('2026-08-17T12:00:00Z'),
      fetch: async () =>
        jsonResponse({
          dependencies: { workerd: '1.20260811.1' },
        }),
    });
    expect(date).toBe('2026-08-11');
  });
  it('clamps a newer workerd date to today', async () => {
    const date = await latestWranglerCompatibilityDate({
      now: new Date('2026-08-10T12:00:00Z'),
      fetch: async () =>
        jsonResponse({
          dependencies: { workerd: '1.20260811.1' },
        }),
    });
    expect(date).toBe('2026-08-10');
  });
  it('falls back to miniflare when workerd is missing', async () => {
    const date = await latestWranglerCompatibilityDate({
      now: new Date('2026-08-17T12:00:00Z'),
      fetch: async () =>
        jsonResponse({
          dependencies: { miniflare: '5.20260811.1-alpha' },
        }),
    });
    expect(date).toBe('2026-08-11');
  });
  it('falls back to today when the registry is unavailable', async () => {
    const date = await latestWranglerCompatibilityDate({
      now: new Date('2026-08-17T12:00:00Z'),
      fetch: async () => {
        throw new Error('network');
      },
    });
    expect(date).toBe('2026-08-17');
  });
  it('falls back to today when the registry response is not ok', async () => {
    const date = await latestWranglerCompatibilityDate({
      now: new Date('2026-08-17T12:00:00Z'),
      fetch: async () => jsonResponse({}, false),
    });
    expect(date).toBe('2026-08-17');
  });
});
