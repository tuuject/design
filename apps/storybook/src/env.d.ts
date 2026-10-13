/// <reference types="vite/client" />
declare module '@koi/tokens/theme-init.js';
interface Window {
  koiSetTheme?: (theme: 'light' | 'dark' | null) => void;
  koiSetFont?: (font: 'chill' | null) => void;
  /** A built-in palette id, or a custom `{ primary, accent }` of 11-step scales; nothing resets to the default. */
  koiSetPalette?: (palette?: string | { primary: Record<string, string>; accent: Record<string, string> } | null) => void;
}
