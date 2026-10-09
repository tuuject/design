import { defineSlotRecipe } from '@pandacss/dev';

// Port of .koi-link* in reference/legacy-web/components/bundle.css and docs/spec/components/Link.md.
// The blog's dashed amber underline: a 2px dashed bottom border, not text-decoration.
export const link = defineSlotRecipe({
  className: 'koi-link',
  slots: ['root', 'external', 'srOnly'],
  base: {
    root: {
      color: 'link',
      textDecoration: 'none',
      borderBottomWidth: '2px',
      borderBottomStyle: 'dashed',
      borderBottomColor: 'link-border',
      // Rounds the corners of the hover tint (legacy 2px; no radius token that small).
      borderRadius: '[2px]',
      cursor: 'pointer',
      transitionProperty: 'color, background-color, border-color',
      transitionDuration: 'fast',
      _hover: { bg: 'link-hover-bg', borderBottomColor: 'link-hover-border' },
      _focusVisible: { outlineWidth: '2px', outlineStyle: 'solid', outlineColor: 'focus-ring', outlineOffset: '2px' },
    },
    // The arrow scales with the text; -1px sits it on the baseline of CJK and Latin text alike.
    external: {
      display: 'inline-flex',
      verticalAlign: '[-1px]',
      marginInlineStart: '[2px]',
      '& > svg': { width: '[0.85em]', height: '[0.85em]' },
    },
    srOnly: { srOnly: true },
  },
});
