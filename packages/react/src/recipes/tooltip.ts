import { defineSlotRecipe } from '@pandacss/dev';

// Port of .koi-tooltip* in reference/legacy-web/components/bundle.css and docs/spec/components/Tooltip.md.
// Base UI positions the positioner (side, 8px offset, flip near the viewport edge); the popup is the bubble.
export const tooltip = defineSlotRecipe({
  className: 'koi-tooltip',
  slots: ['positioner', 'popup'],
  base: {
    positioner: {
      // Portaled to <body>, so it has to clear the Dialog (900) to work on triggers inside one.
      zIndex: '1000',
    },
    popup: {
      boxSizing: 'border-box',
      width: 'max-content',
      maxWidth: '[240px]',
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
      '&[data-starting-style], &[data-ending-style]': { opacity: '0' },
      // Esc hides it at once.
      '&[data-instant=dismiss]': { transitionDuration: '0s' },
    },
  },
});
