/// <reference types="@rsbuild/core/types-modules" />
declare module '@koi/tokens/theme-init.js';
declare module '*.css';
interface Window {
  koiSetTheme?: (theme: 'light' | 'dark' | null) => void;
  koiSetFont?: (font: 'chill' | null) => void;
  koiSetPalette?: (palette?: string | { primary: Record<string, string>; accent: Record<string, string> } | null) => void;
}
