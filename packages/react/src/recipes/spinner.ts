import { defineSlotRecipe } from '@pandacss/dev';

// Port of .koi-spinner in reference/legacy-web/components/bundle.css and docs/spec/components/Spinner.md.
// Draws in currentColor; size is set on the <svg> (`components.spinner` in tokens.json), as in legacy.
export const spinner = defineSlotRecipe({
  className: 'koi-spinner',
  slots: ['root', 'svg'],
  base: {
    root: { display: 'inline-flex', flexShrink: '0', color: 'inherit' },
    svg: {
      animationName: 'koi-spin',
      animationDuration: 'spin',
      animationTimingFunction: 'linear',
      animationIterationCount: 'infinite',
      // The spin is the only sign that something is still happening, so reduced motion slows it instead of
      // stopping it. global-css.ts leaves this element out of its animation kill switch.
      '@media (prefers-reduced-motion: reduce)': { animationDuration: 'spin-slow' },
    },
  },
});
