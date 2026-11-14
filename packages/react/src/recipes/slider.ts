import { components as c } from '@tuuject/koi-tokens/dimensions';
import { defineSlotRecipe } from '@pandacss/dev/define';
import { focusRing, toPx } from './dimensions.js';
import { state } from './headless.js';

// New component (not a legacy port): docs/spec/components/Slider.md. Base UI's Slider renders the thumb as an
// absolutely positioned div with a visually hidden <input type="range">, and positions the indicator itself.
// The thumb carries the 20px target, so the control is exactly one thumb tall and the 6px track sits centered.
export const slider = defineSlotRecipe({
  className: 'koi-slider',
  slots: ['root', 'head', 'label', 'value', 'control', 'track', 'indicator', 'thumb'],
  base: {
    root: { display: 'flex', flexDirection: 'column', gap: '2', width: '100%', fontFamily: 'sans' },
    head: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '3' },
    label: { textStyle: 'label', color: 'text', minWidth: '0', overflowWrap: 'anywhere' },
    value: {
      marginInlineStart: 'auto',
      textStyle: 'small',
      color: 'text-muted',
      fontVariantNumeric: 'tabular-nums',
    },
    control: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: toPx(c.slider.thumb),
      cursor: 'pointer',
      touchAction: 'none',
      userSelect: 'none',
      [`&${state.disabled}` as const]: { opacity: '0.5', cursor: 'not-allowed' },
    },
    track: {
      position: 'relative',
      width: '100%',
      height: toPx(c.slider.track),
      borderRadius: 'full',
      bg: 'surface-muted',
      overflow: 'hidden',
    },
    // Base UI gives the indicator its inline start and width; the fill follows the pointer with no easing, so a
    // drag never lags behind the thumb.
    indicator: { height: '100%', borderRadius: 'inherit', bg: 'control-checked' },
    thumb: {
      boxSizing: 'border-box',
      width: toPx(c.slider.thumb),
      height: toPx(c.slider.thumb),
      borderRadius: 'full',
      bg: 'surface',
      borderWidth: toPx(c.slider.thumbBorder),
      borderStyle: 'solid',
      borderColor: 'control-checked',
      // Focus lives on the nested range input, which is visually hidden; the ring goes on the visible thumb.
      '&:has(input:focus-visible)': focusRing,
      [`&${state.disabled}` as const]: { cursor: 'not-allowed' },
      // Inside a Field with an error, Base UI marks the thumb invalid.
      [`&${state.invalid}` as const]: { borderColor: 'error-control' },
    },
  },
});
