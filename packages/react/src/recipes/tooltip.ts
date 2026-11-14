import { components as c } from '@tuuject/koi-tokens/dimensions';
import { defineSlotRecipe } from '@pandacss/dev/define';
import { toPx } from './dimensions.js';
import { state } from './headless.js';

// Port of .koi-tooltip* in reference/legacy-web/components/bundle.css and docs/spec/components/Tooltip.md.
// Base UI positions the positioner (side, 8px offset, flip near the viewport edge); the popup is the bubble.
export const tooltip = defineSlotRecipe({
  className: 'koi-tooltip',
  slots: ['positioner', 'popup'],
  base: {
    positioner: {
      // Portaled to <body>, so it has to clear the Dialog layer to work on triggers inside one.
      zIndex: 'tooltip',
    },
    popup: {
      boxSizing: 'border-box',
      width: 'max-content',
      maxWidth: toPx(c.tooltip.maxWidth),
      px: '2',
      py: '1',
      borderRadius: 'lg',
      bg: 'tooltip-bg',
      color: 'tooltip-text',
      fontFamily: 'sans',
      textStyle: 'small',
      overflowWrap: 'break-word',
      // Hyphenation needs the page's `lang`; a 240px bubble holding a German compound hyphenates instead of breaking
      // mid-word with no marker.
      hyphens: 'auto',
      outline: 'none',
      // Overlays fade (legacy koi-fade, 150ms ease-out); a tooltip doesn't move.
      transitionProperty: 'opacity',
      transitionDuration: 'fast',
      transitionTimingFunction: 'out',
      [`&${state.entering}, &${state.exiting}` as const]: { opacity: '0' },
      // Esc hides it at once.
      [`&${state.instantClose}` as const]: { transitionDuration: '0s' },
    },
  },
});
