/// <reference types="vite/client" />
declare module '@tuuject/koi-tokens/theme-init.js';
interface Window {
  koiSetTheme?: (theme: 'light' | 'dark' | null) => void;
  koiSetFont?: (font: 'chill' | null) => void;
  koiSetPalette?: (
    palette?: string | { primary: Record<string, string>; accent: Record<string, string> } | null,
  ) => void;
}
