import { defineRecipe } from '@pandacss/dev';

// Port of .koi-btn / .koi-iconbtn in reference/legacy-web/components/bundle.css and docs/spec/components/Button.md.
// color (what the action means) and variant (how loud it is) are independent; their 5 × 4 combinations are
// compound variants generated below, so every combination uses only the per-color role tokens.

export const BUTTON_COLORS = ['primary', 'accent', 'secondary', 'warning', 'error'] as const;
export const BUTTON_VARIANTS = ['solid', 'soft', 'outline', 'ghost'] as const;
type C = (typeof BUTTON_COLORS)[number];

const HOVER = '&:hover:not(:disabled, [data-disabled])';

function look(c: C, v: (typeof BUTTON_VARIANTS)[number]) {
  switch (v) {
    case 'solid':
      return { bg: `${c}-solid` as const, color: `on-${c}-solid` as const, [HOVER]: { bg: `${c}-solid-hover` as const } };
    case 'soft':
      return { bg: `${c}-soft` as const, color: `on-${c}-soft` as const, [HOVER]: { bg: `${c}-soft-hover` as const } };
    case 'outline':
      return { bg: 'transparent', color: `${c}-fg` as const, borderColor: `${c}-edge` as const, [HOVER]: { bg: `${c}-soft` as const } };
    case 'ghost':
      return { bg: 'transparent', color: `${c}-fg` as const, [HOVER]: { bg: `${c}-soft` as const } };
  }
}

const empty = <K extends string>(keys: readonly K[]) => Object.fromEntries(keys.map((k) => [k, {}])) as Record<K, {}>;

export const button = defineRecipe({
  className: 'koi-btn',
  description: 'Button and IconButton. No shadows on any variant: buttons stay flat.',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    borderRadius: 'full',
    fontFamily: 'sans',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    transitionProperty: 'background-color, color, border-color',
    transitionDuration: 'fast',
    _focusVisible: { outlineWidth: '2px', outlineStyle: 'solid', outlineColor: 'focus-ring', outlineOffset: '2px' },
    _disabled: { opacity: '0.5', cursor: 'not-allowed' },
    // Loading buttons are also disabled; this outranks _disabled's opacity (legacy: .is-loading after :disabled).
    '&[aria-busy=true]:disabled': { opacity: '0.85', cursor: 'progress' },
    '& svg': { width: 'icon', height: 'icon', flexShrink: '0' },
  },
  variants: {
    color: empty(BUTTON_COLORS),
    variant: empty(BUTTON_VARIANTS),
    size: {
      sm: { height: 'control-sm', px: '3', textStyle: 'button-sm', '& svg': { width: 'icon-sm', height: 'icon-sm' } },
      md: { height: 'control-md', px: '4', textStyle: 'button' },
      lg: { height: 'control-lg', px: '5', textStyle: 'button' },
    },
    shape: {
      pill: { borderRadius: 'full' },
      rounded: { borderRadius: 'lg' },
    },
    /** Square, icon-only (IconButton). Width follows the size's height. Styled in compoundVariants below. */
    iconOnly: { true: {} },
    fullWidth: {
      true: { width: '100%' },
    },
  },
  compoundVariants: [
    ...BUTTON_COLORS.flatMap((color) => BUTTON_VARIANTS.map((variant) => ({ color, variant, css: look(color, variant) }))),
    // Panda emits variants alphabetically within one layer, so `size`'s padding would beat a plain `iconOnly`
    // variant. compound_variants is a later layer.
    { iconOnly: true, css: { px: '0', flex: 'none', aspectRatio: '1' } },
  ],
  defaultVariants: { color: 'primary', variant: 'solid', size: 'md', shape: 'pill' },
});
