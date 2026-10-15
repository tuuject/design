import { defineSlotRecipe } from '@pandacss/dev';
import { state } from './headless';
import { components as c } from '@koi/tokens/dimensions';
import { toPx } from './dimensions';

// Port of .koi-progress in reference/legacy-web/components/bundle.css and docs/spec/components/Progress.md.
// Base UI's Progress.Root is the role="progressbar" element and wraps the whole thing (label, value and track);
// Progress.Indicator gets an inline `width: <pct>%` while the value is known and nothing while it's indeterminate.
export const progress = defineSlotRecipe({
  className: 'koi-progress',
  slots: ['root', 'head', 'label', 'value', 'track', 'indicator'],
  base: {
    root: { display: 'flex', flexDirection: 'column', gap: '2', width: '100%', fontFamily: 'sans' },
    head: { display: 'flex', justifyContent: 'space-between', gap: '3', textStyle: 'body', color: 'text' },
    label: { minWidth: '0' },
    // Pushed to the end even when there's no label.
    value: { marginInlineStart: 'auto', color: 'text-muted', fontVariantNumeric: 'tabular-nums' },
    track: {
      position: 'relative',
      overflow: 'hidden',
      height: toPx(c.progress.trackMd),
      borderRadius: 'full',
      bg: 'surface-muted',
    },
    indicator: {
      height: '100%',
      borderRadius: 'inherit',
      bg: 'control-checked',
      // Eases to new values on the spring curve (it overshoots a little). global-css.ts stops it under reduced motion.
      transitionProperty: 'width',
      transitionDuration: 'spring',
      transitionTimingFunction: 'spring',
      [`&${state.indeterminate}` as const]: {
        position: 'absolute',
        insetBlock: '0',
        // Physical, like the keyframes: the slide runs left to right in RTL too (as legacy).
        left: '0',
        width: '40%',
        animationName: 'koi-indet',
        animationDuration: 'indeterminate',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
        // The movement is the only sign that something is still happening, so reduced motion swaps the slide for
        // a full-width bar that pulses in place (as Spinner slows down instead of stopping). global-css.ts leaves
        // this element out of its animation kill switch.
        '@media (prefers-reduced-motion: reduce)': {
          width: '100%',
          animationName: 'koi-pulse',
          animationDuration: 'pulse',
        },
      },
    },
  },
  variants: {
    size: {
      sm: { track: { height: toPx(c.progress.trackSm) } },
      md: {},
      lg: { track: { height: toPx(c.progress.trackLg) } },
    },
  },
  defaultVariants: { size: 'md' },
});
