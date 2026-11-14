import { components as c } from '@tuuject/koi-tokens/dimensions';
import { defineSlotRecipe } from '@pandacss/dev/define';
import { toPx } from './dimensions.js';

// Port of .koi-badge in reference/legacy-web/components/bundle.css and docs/spec/components/Badge.md.
export const badge = defineSlotRecipe({
  className: 'koi-badge',
  slots: ['root', 'dot'],
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '1',
      // A floor plus a content-based height: a label that doesn't fit (a translated status, a compound word) wraps
      // and the badge grows, while `align-items: stretch` in a flex row can't pull it to a sibling's height.
      minHeight: toPx(c.badge.height),
      height: 'fit-content',
      px: toPx(c.badge.paddingX),
      boxSizing: 'border-box',
      borderRadius: 'full',
      fontFamily: 'sans',
      textStyle: 'caption',
      // `anywhere`, not `break-word`: the badge is content-sized, and only `anywhere` lets one unbreakable word
      // count as shrinkable in its min-content width.
      minWidth: '0',
      whiteSpace: 'normal',
      overflowWrap: 'anywhere',
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
