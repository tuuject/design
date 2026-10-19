import { components as c } from '@koi/tokens/dimensions';
import { defineSlotRecipe } from '@pandacss/dev';
import { toPx } from './dimensions';

// Port of .koi-badge in reference/legacy-web/components/bundle.css and docs/spec/components/Badge.md.
export const badge = defineSlotRecipe({
  className: 'koi-badge',
  slots: ['root', 'dot'],
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '1',
      height: toPx(c.badge.height),
      px: toPx(c.badge.paddingX),
      boxSizing: 'border-box',
      borderRadius: 'full',
      fontFamily: 'sans',
      textStyle: 'caption',
      whiteSpace: 'nowrap',
    },
    dot: {
      flexShrink: '0',
      width: toPx(c.badge.dot),
      height: toPx(c.badge.dot),
      borderRadius: 'full',
      bg: 'currentColor',
    },
  },
  variants: {
    tone: {
      neutral: { root: { bg: 'surface-muted', color: 'text' } },
      primary: { root: { bg: 'action-subtle', color: 'on-action-subtle' } },
      accent: { root: { bg: 'highlight', color: 'on-highlight' } },
      warning: { root: { bg: 'warning-surface', color: 'warning-text' } },
      error: { root: { bg: 'error-surface', color: 'error-text' } },
      solid: { root: { bg: 'action', color: 'on-action' } },
    },
  },
  defaultVariants: { tone: 'neutral' },
});
