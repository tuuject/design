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

// Press ripple, done with a transition rather than an animation so a quick click still plays it in full: :active
// snaps the shadow to the edge with no transition, and on release it eases back out to 6px and fades to nothing.
// The resting shadow is fully transparent, so buttons stay flat. Its color is --koi-ripple (each color's solid).
const RIPPLE_REST = '0 0 0 6px color-mix(in oklch, var(--koi-ripple) 0%, transparent)';
const RIPPLE_PRESSED = '0 0 0 0 color-mix(in oklch, var(--koi-ripple) 45%, transparent)';
const ripple = (c: C) => ({ '--koi-ripple': `token(colors.${c}-solid)` });
const transition = (shadow: string) =>
  ['background-color', 'color', 'border-color'].map((p) => `${p} token(durations.fast)`).concat(`box-shadow ${shadow}`).join(', ');

const empty = <K extends string>(keys: readonly K[]) => Object.fromEntries(keys.map((k) => [k, {}])) as Record<K, {}>;

export const button = defineRecipe({
  className: 'koi-btn',
  description: 'Button and IconButton. No shadows on any variant: buttons stay flat (the press ripple fades to nothing).',
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
    boxShadow: RIPPLE_REST,
    transition: transition('token(durations.ripple) token(easings.out)'),
    '&:active:not(:disabled, [data-disabled])': { boxShadow: RIPPLE_PRESSED, transition: transition('0s') },
    _focusVisible: { outlineWidth: '2px', outlineStyle: 'solid', outlineColor: 'focus-ring', outlineOffset: '2px' },
    _disabled: { opacity: '0.5', cursor: 'not-allowed' },
    // Loading buttons are also disabled; this outranks _disabled's opacity (legacy: .is-loading after :disabled).
    '&[aria-busy=true]:disabled': { opacity: '0.85', cursor: 'progress' },
    // Direct children only: the loading Spinner's svg sets its own size.
    '& > svg': { width: 'icon', height: 'icon', flexShrink: '0' },
  },
  variants: {
    color: { primary: ripple('primary'), accent: ripple('accent'), secondary: ripple('secondary'), warning: ripple('warning'), error: ripple('error') },
    variant: empty(BUTTON_VARIANTS),
    size: {
      sm: { height: 'control-sm', px: '3', textStyle: 'button-sm', '& > svg': { width: 'icon-sm', height: 'icon-sm' } },
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
