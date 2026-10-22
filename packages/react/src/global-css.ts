import { defineGlobalStyles } from '@pandacss/dev';
import { state } from './recipes/headless';

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
  // WebKit/Blink draw spin buttons inside number inputs that ignore Koi's input styling and crowd the text.
  'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
    appearance: 'none',
    margin: 0,
  },
  '@media (prefers-reduced-motion: reduce)': {
    // Spinner is left out: it slows down instead (recipes/spinner.ts). So is the indeterminate Progress bar: it
    // pulses in place instead of sliding (recipes/progress.ts).
    [`*:not(.koi-spinner__svg, .koi-progress__indicator${state.indeterminate}), *::before, *::after` as const]: {
      animationDuration: '0.01ms !important',
      transitionDuration: '0.01ms !important',
    },
  },
});
