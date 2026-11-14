import { defineGlobalStyles } from '@pandacss/dev/define';
import { state } from './recipes/headless.js';

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
  // Icon mirroring: `Icon`'s `mirrored` (and Koi's own chevron/arrow icons) put this class on the <svg> itself, never
  // on a page or a container. `:dir(rtl)` reads the direction the drawing inherits, so it flips under `<html dir>` and
  // under a `DirectionProvider` alike. A transform is the only way: there is no logical "flip" property.
  '.koi-mirror': {
    '&:dir(rtl)': { transform: 'scaleX(-1)' },
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
