import { defineSlotRecipe } from '@pandacss/dev';

// Port of .koi-badge in reference/legacy-web/components/bundle.css and docs/spec/components/Badge.md.
export const badge = defineSlotRecipe({
  className: 'koi-badge',
  slots: ['root', 'dot'],
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '1',
      height: '[22px]',
      px: '[10px]',
      boxSizing: 'border-box',
      borderRadius: 'full',
      fontFamily: 'sans',
      textStyle: 'caption',
      whiteSpace: 'nowrap',
    },
    dot: { flexShrink: '0', width: '[6px]', height: '[6px]', borderRadius: 'full', bg: 'currentColor' },
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
