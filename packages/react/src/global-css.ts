import { defineGlobalStyles } from '@pandacss/dev';

// Page-level defaults. Ported from the top of reference/legacy-web/components/bundle.css.
export const globalCss = defineGlobalStyles({
  // Panda's preflight sets antialiased/grayscale on html, which on macOS drops the stroke thickening and
  // leaves ChillRoundF thin. Back to the platform default.
  html: {
    WebkitFontSmoothing: 'auto',
    MozOsxFontSmoothing: 'auto',
  },
  body: {
    fontFamily: 'sans',
    textStyle: 'body',
    color: 'text',
    bg: 'page-bg',
    // Let the browser add CJK/Latin spacing; never type the spaces by hand.
    textAutospace: 'normal',
  },
  '@media (prefers-reduced-motion: reduce)': {
    // Spinner is left out: it slows down instead (recipes/spinner.ts). So is the indeterminate Progress bar: it
    // pulses in place instead of sliding (recipes/progress.ts).
    '*:not(.koi-spinner__svg, .koi-progress__indicator[data-indeterminate]), *::before, *::after': { animationDuration: '0.01ms !important', transitionDuration: '0.01ms !important' },
  },
});
