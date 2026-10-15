import { defineSlotRecipe } from '@pandacss/dev';
import { state } from './headless';
import { components as c } from '@koi/tokens/dimensions';
import { toPx } from './dimensions';

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
