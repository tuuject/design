import { components as c } from '@koi/tokens/dimensions';
import { defineSlotRecipe } from '@pandacss/dev';
import { focusRing, toPx } from './dimensions';

// Port of .koi-link* in reference/legacy-web/components/bundle.css and docs/spec/components/Link.md.
// The blog's dashed amber underline: a 2px dashed bottom border, not text-decoration.

// Shared by both variants. Color and underline live in the variants so no utility is declared twice.
const linkBase = {
  textDecoration: 'none',
  cursor: 'pointer',
  transitionProperty: 'color, background-color, border-color',
  transitionDuration: 'fast',
  _focusVisible: focusRing,
} as const;

// The blog link: dashed underline, filled in under a soft tint on hover.
const linkUnderline = {
  color: 'link',
  borderBottomWidth: `${c.link.underline}px`,
  borderBottomStyle: 'dashed',
  borderBottomColor: 'link-border',
  // Rounds the corners of the hover tint (legacy 2px; no radius token that small).
  borderRadius: toPx(c.link.radius),
  _hover: { bg: 'link-hover-bg', borderBottomColor: 'link-hover-border' },
} as const;

// Shared with recipes/prose.ts, so a markdown link looks exactly like <Link>.
export const linkStyle = { ...linkBase, ...linkUnderline } as const;

export const link = defineSlotRecipe({
  className: 'koi-link',
  slots: ['root', 'external', 'srOnly'],
  base: {
    root: linkBase,
    // The arrow scales with the text; -1px sits it on the baseline of CJK and Latin text alike.
    external: {
      display: 'inline-flex',
      verticalAlign: '[-1px]', // koi-web-only: sits the inline arrow on the text baseline
      marginInlineStart: toPx(c.link.iconGap),
      '& > svg': { width: '[0.85em]', height: '[0.85em]' },
    },
    srOnly: { srOnly: true },
  },
  variants: {
    variant: {
      underline: { root: linkUnderline },
      // Navigation rows such as breadcrumbs: reads as secondary text until hovered, then turns brand
      // (`text-brand`, the primary text role). No underline and no tint at any state.
      plain: { root: { color: 'text-muted', _hover: { color: 'text-brand' } } },
    },
  },
  defaultVariants: { variant: 'underline' },
});
