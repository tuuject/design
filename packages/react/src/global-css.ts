import { defineGlobalStyles } from '@pandacss/dev';

// Page-level defaults. Ported from the top of reference/legacy-web/components/bundle.css.
export const globalCss = defineGlobalStyles({
  body: {
    fontFamily: 'sans',
    textStyle: 'body',
    color: 'text',
    bg: 'page-bg',
    // Let the browser add CJK/Latin spacing; never type the spaces by hand.
    textAutospace: 'normal',
  },
  '@media (prefers-reduced-motion: reduce)': {
    // Spinner is left out: it slows down instead (recipes/spinner.ts).
    '*:not(.koi-spinner__svg), *::before, *::after': { animationDuration: '0.01ms !important', transitionDuration: '0.01ms !important' },
  },
});
