export const defaultSite = 'https://example.com';
export const siteUrlError = 'Use a URL like https://example.com';

export function toSiteUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return defaultSite;
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  return withProtocol.replace(/\/+$/, '');
}

export function siteOrDefault(value: unknown): string {
  return typeof value === 'string' && value.trim()
    ? toSiteUrl(value)
    : defaultSite;
}

export function siteError(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  const trimmed = value.trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed) && !/^https?:\/\//i.test(trimmed))
    return siteUrlError;
  try {
    const url = new URL(toSiteUrl(trimmed));
    if (url.protocol !== 'http:' && url.protocol !== 'https:')
      return siteUrlError;
    if (!url.hostname.includes('.')) return siteUrlError;
  } catch {
    return siteUrlError;
  }
}

export function isDefaultSite(site: string): boolean {
  return toSiteUrl(site) === defaultSite;
}

export function siteHostname(site: string): string {
  return new URL(toSiteUrl(site)).hostname;
}
