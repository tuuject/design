import { BUTTON_COLORS, BUTTON_VARIANTS, type ButtonColor, type ButtonVariant } from '@koi/core';
import { components as c } from '@koi/tokens/dimensions';
import { defineRecipe } from '@pandacss/dev';
import { focusRing } from './dimensions';
import { state } from './headless';

// Port of .koi-btn / .koi-iconbtn in reference/legacy-web/components/bundle.css and docs/spec/components/Button.md.
// color (what the action means) and variant (how loud it is) are independent; their 5 × 4 combinations are
// compound variants generated below, so every combination uses only the per-color role tokens.

const HOVER = `&:hover:not(:disabled, ${state.disabled})` as const;

function look(c: ButtonColor, v: ButtonVariant) {
  switch (v) {
    case 'solid':
      return {
        bg: `${c}-solid` as const,
        color: `on-${c}-solid` as const,
        [HOVER]: { bg: `${c}-solid-hover` as const },
      };
    case 'soft':
      return { bg: `${c}-soft` as const, color: `on-${c}-soft` as const, [HOVER]: { bg: `${c}-soft-hover` as const } };
    case 'outline':
      return {
        bg: 'transparent',
        color: `${c}-fg` as const,
        borderColor: `${c}-edge` as const,
        [HOVER]: { bg: `${c}-soft` as const },
      };
    case 'ghost':
      return { bg: 'transparent', color: `${c}-fg` as const, [HOVER]: { bg: `${c}-soft` as const } };
  }
}

// Press ripple, done with a transition rather than an animation so a quick click still plays it in full: :active
// snaps the shadow to the edge with no transition, and on release it eases back out to 6px and fades to nothing.
// The resting shadow is fully transparent, so buttons stay flat. Its color is --koi-ripple (each color's solid).
const RIPPLE_REST = '0 0 0 6px color-mix(in oklch, var(--koi-ripple) 0%, transparent)'; // koi-web-only: a box-shadow ripple; native presses differently
const RIPPLE_PRESSED = '0 0 0 0 color-mix(in oklch, var(--koi-ripple) 45%, transparent)';
const ripple = (c: ButtonColor) => ({ '--koi-ripple': `token(colors.${c}-solid)` });
const transition = (shadow: string) =>
  ['background-color', 'color', 'border-color']
    .map((p) => `${p} token(durations.fast)`)
    .concat(`box-shadow ${shadow}`)
    .join(', ');

const empty = <K extends string>(keys: readonly K[]) =>
  Object.fromEntries(keys.map((k) => [k, {}])) as Record<K, Record<never, never>>;

export const button = defineRecipe({
  className: 'koi-btn',
  description:
    'Button and IconButton. No shadows on any variant: buttons stay flat (the press ripple fades to nothing).',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2',
    borderWidth: `${c.stroke.hairline}px`,
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
    [`&:active:not(:disabled, ${state.disabled})` as const]: {
      boxShadow: RIPPLE_PRESSED,
      transition: transition('0s'),
    },
    _focusVisible: focusRing,
    _disabled: { opacity: '0.5', cursor: 'not-allowed' },
    // Loading buttons are also disabled and keep its dimmed look; only the cursor says "busy" instead of "blocked".
    '&[aria-busy=true]:disabled': { cursor: 'progress' },
    // Direct children only: the loading Spinner's svg sets its own size.
    '& > svg': { width: 'icon', height: 'icon', flexShrink: '0' },
  },
  variants: {
    color: {
      primary: ripple('primary'),
      accent: ripple('accent'),
      secondary: ripple('secondary'),
      warning: ripple('warning'),
      error: ripple('error'),
    },
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
    iconOnly: { true: {}, false: {} },
    fullWidth: {
      true: { width: '100%' },
    },
  },
  compoundVariants: [
    ...BUTTON_COLORS.flatMap((color) =>
      BUTTON_VARIANTS.map((variant) => ({ color, variant, css: look(color, variant) })),
    ),
    // The rounded shape is the dense one (table rows, toolbars): a pill needs its 12px sides to read as a pill, a
    // rounded sm button doesn't, and side by side the extra space reads as gaps. Text buttons only: Panda emits
    // compound variants in its own order, so this can't rely on iconOnly's px 0 coming later.
    { shape: 'rounded', size: 'sm', iconOnly: false, css: { px: '2' } },
    // Panda emits variants alphabetically within one layer, so `size`'s padding would beat a plain `iconOnly`
    // variant. compound_variants is a later layer.
    { iconOnly: true, css: { px: '0', flex: 'none', aspectRatio: '1' } },
  ],
  defaultVariants: { color: 'primary', variant: 'solid', size: 'md', shape: 'pill', iconOnly: false },
});
