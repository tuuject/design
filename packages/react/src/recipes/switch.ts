import { defineSlotRecipe } from '@pandacss/dev';
import { state } from './headless';
import { choiceRow } from './checkbox';
import { components as c } from '@koi/tokens/dimensions';
import { focusRing, toPx } from './dimensions';

// Port of .koi-switch* in reference/legacy-web/components/bundle.css and docs/spec/components/Switch.md.
// DOM: <label root> <button control role=switch><span thumb/></button> <span label/> </label> <input hidden/>.
// The headless layer marks the button and the thumb checked / disabled. The row is Checkbox's `choiceRow`
// (the 20px track is exactly one label line tall, so it lines up like the 16px box does).
export const switchRecipe = defineSlotRecipe({
  className: 'koi-switch',
  slots: ['root', 'control', 'thumb', 'label'],
  base: {
    // choiceRow's hover rule recolors an unchecked edge; the track has no border, so it does nothing here.
    root: choiceRow.root,
    label: choiceRow.label,
    control: {
      position: 'relative',
      flex: 'none',
      boxSizing: 'border-box',
      width: toPx(c.switch.trackWidth),
      height: toPx(c.switch.trackHeight),
      p: '0',
      borderWidth: '0',
      borderRadius: 'full',
      appearance: 'none',
      bg: 'border-control',
      cursor: 'pointer',
      transitionProperty: 'background-color',
      transitionDuration: 'fast',
      _focusVisible: focusRing,
      [`&${state.checked}` as const]: { bg: 'control-checked' },
      // On or off, a disabled track keeps its fill, faded (legacy's opacity .5).
      [`&${state.disabled}` as const]: { opacity: '0.5', cursor: 'not-allowed' },
    },
    // Slides on the spring curve; global-css.ts stops it under reduced motion (the spec says all motion stops).
    thumb: {
      position: 'absolute',
      top: toPx(c.switch.thumbInset),
      left: toPx(c.switch.thumbInset),
      width: toPx(c.switch.thumb),
      height: toPx(c.switch.thumb),
      borderRadius: 'full',
      bg: 'white',
      boxShadow: 'raised',
      transition: 'transform {durations.spring} {easings.spring}',
      [`&${state.checked}` as const]: { transform: `translateX(${c.switch.trackWidth - c.switch.thumb - 2 * c.switch.thumbInset}px)` },
    },
  },
});
