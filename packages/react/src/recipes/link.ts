import { components as c } from '@koi/tokens/dimensions';
import { defineSlotRecipe } from '@pandacss/dev';
import { focusRing, toPx } from './dimensions';

// Port of .koi-link* in reference/legacy-web/components/bundle.css and docs/spec/components/Link.md.
// The blog's dashed amber underline: a 2px dashed bottom border, not text-decoration.
// Shared with recipes/prose.ts, so a markdown link looks exactly like <Link>.
export const linkStyle = {
  color: 'link',
  textDecoration: 'none',
  borderBottomWidth: `${c.link.underline}px`,
  borderBottomStyle: 'dashed',
  borderBottomColor: 'link-border',
  // Rounds the corners of the hover tint (legacy 2px; no radius token that small).
  borderRadius: toPx(c.link.radius),
  cursor: 'pointer',
  transitionProperty: 'color, background-color, border-color',
  transitionDuration: 'fast',
  _hover: { bg: 'link-hover-bg', borderBottomColor: 'link-hover-border' },
  _focusVisible: focusRing,
} as const;

export const link = defineSlotRecipe({
  className: 'koi-link',
  slots: ['root', 'external', 'srOnly'],
  base: {
    root: linkStyle,
    // The arrow scales with the text; -1px sits it on the baseline of CJK and Latin text alike.
    external: {
      display: 'inline-flex',
      verticalAlign: '[-1px]', // koi-web-only: sits the inline arrow on the text baseline
      marginInlineStart: toPx(c.link.iconGap),
      '& > svg': { width: '[0.85em]', height: '[0.85em]' },
    },
    srOnly: { srOnly: true },
  },
});
