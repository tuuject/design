import { components as c } from '@koi/tokens/dimensions';

// Sizes come from tokens.json, through @koi/tokens/dimensions: `components` for a component's own sizes, the
// size / spacing / radius tokens by name ('control-md', 'icon', '3') for shared ones. Native reads the same numbers,
// so a size written here as a literal would drift between platforms. scripts/check-raw-sizes.mjs enforces it.

/** A dimension number as a Panda arbitrary value: toPx(16) → '[16px]'. */
export const toPx = <N extends number>(n: N) => `[${n}px]` as const;

/** The keyboard focus outline every focusable part draws. */
export const focusRing = {
  outlineWidth: `${c.focusRing.width}px`,
  outlineStyle: 'solid',
  outlineColor: 'focus-ring',
  outlineOffset: `${c.focusRing.offset}px`,
} as const;
