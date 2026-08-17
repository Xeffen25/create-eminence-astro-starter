// wrangler@latest pins workerd as 1.YYYYMMDD.x; that middle number is the
// newest compatibility date the generated project can actually run.
const WRANGLER_PACKUMENT = 'https://registry.npmjs.org/wrangler/latest';
const WORKERD_DATE = /(?:^|\.)(\d{4})(\d{2})(\d{2})(?:\.|$)/;

export function todaysCompatibilityDate(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

export function compatibilityDateFromWorkerdVersion(version: string) {
  const match = version.match(WORKERD_DATE);
  if (!match) return;
  return `${match[1]}-${match[2]}-${match[3]}`;
}

export function clampCompatibilityDate(date: string, today: string) {
  return date > today ? today : date;
}

type NpmPackage = {
  dependencies?: Record<string, string>;
};

export async function latestWranglerCompatibilityDate({
  fetch: fetcher = fetch,
  now = new Date(),
}: {
  fetch?: typeof fetch;
  now?: Date;
} = {}) {
  const today = todaysCompatibilityDate(now);
  try {
    const response = await fetcher(WRANGLER_PACKUMENT, {
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return today;
    const pkg = (await response.json()) as NpmPackage;
    const version = pkg.dependencies?.workerd ?? pkg.dependencies?.miniflare;
    const date = version
      ? compatibilityDateFromWorkerdVersion(version)
      : undefined;
    return date ? clampCompatibilityDate(date, today) : today;
  } catch {
    return today;
  }
}
