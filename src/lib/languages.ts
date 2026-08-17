import type { Language } from '../types.js';

export const languageLabels: Record<Language, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  it: 'Italiano',
  ca: 'Català',
  de: 'Deutsch',
};

export const languageFlagFiles: Record<Language, string> = {
  es: 'es',
  en: 'gb',
  fr: 'fr',
  it: 'it',
  ca: 'ca',
  de: 'de',
};

export const skipToContent: Record<Language, string> = {
  en: 'Skip to main content',
  es: 'Saltar al contenido principal',
  fr: 'Aller au contenu principal',
  it: 'Vai al contenuto principale',
  ca: 'Salta al contingut principal',
  de: 'Zum Hauptinhalt springen',
};

export const siteDescriptions: Record<Language, string> = {
  en: 'An Astro site.',
  es: 'Un sitio de Astro.',
  fr: 'Un site Astro.',
  it: 'Un sito Astro.',
  ca: "Un lloc web d'Astro.",
  de: 'Eine Astro-Website.',
};
