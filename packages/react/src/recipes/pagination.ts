import { components as c } from '@koi/tokens/dimensions';
import { defineSlotRecipe } from '@pandacss/dev';
import { focusRing, toPx } from './dimensions';

// Port of .koi-pagination in reference/legacy-web/components/bundle.css and docs/spec/components/Pagination.md.
// Prev/next are Koi Buttons (their look comes from the button recipe); this recipe styles the row, the page
// numbers, the "…" gaps and the simple variant's "n / m" count.
export const pagination = defineSlotRecipe({
  className: 'koi-pagination',
  slots: ['root', 'pages', 'page', 'gap', 'count'],
  base: {
    root: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '3',
      flexWrap: 'wrap',
      fontFamily: 'sans',
    },
    pages: { display: 'flex', alignItems: 'center', gap: '1', m: '0', p: '0', listStyle: 'none' },
    page: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 'control-md',
      height: 'control-md',
      px: '2',
      borderWidth: '0',
      borderRadius: 'full',
      bg: 'transparent',
      color: 'text',
      textStyle: 'body',
      fontVariantNumeric: 'tabular-nums',
      cursor: 'pointer',
      userSelect: 'none',
      transitionProperty: 'background-color, color',
      transitionDuration: 'fast',
      // Same ring as Button.
      _focusVisible: focusRing,
      '&:hover:not([aria-current=page])': { bg: 'surface-muted' },
      '&[aria-current=page]': { bg: 'action', color: 'on-action', fontWeight: '700' },
    },
    gap: {
      minWidth: toPx(c.pagination.gapWidth),
      textAlign: 'center',
      color: 'text-muted',
      textStyle: 'body',
      userSelect: 'none',
    },
    count: { color: 'text', textStyle: 'body', fontVariantNumeric: 'tabular-nums' },
  },
  variants: {
    /** Follows the Buttons beside it (ShapeProvider / Button's `shape`). */
    shape: {
      pill: {},
      rounded: { page: { borderRadius: 'lg' } },
    },
  },
  defaultVariants: { shape: 'rounded' },
});
