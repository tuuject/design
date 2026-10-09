import { defineSlotRecipe } from '@pandacss/dev';
import { choiceRow } from './checkbox';

// Port of .koi-switch* in reference/legacy-web/components/bundle.css and docs/spec/components/Switch.md.
// DOM: <label root> <button control role=switch><span thumb/></button> <span label/> </label> <input hidden/>.
// Base UI puts data-checked / data-disabled on the button and the thumb. The row is Checkbox's `choiceRow`
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
      width: '[36px]',
      height: '[20px]',
      p: '0',
      borderWidth: '0',
      borderRadius: 'full',
      appearance: 'none',
      bg: 'border-control',
      cursor: 'pointer',
      transitionProperty: 'background-color',
      transitionDuration: 'fast',
      _focusVisible: { outlineWidth: '2px', outlineStyle: 'solid', outlineColor: 'focus-ring', outlineOffset: '2px' },
      '&[data-checked]': { bg: 'control-checked' },
      // On or off, a disabled track keeps its fill, faded (legacy's opacity .5).
      '&[data-disabled]': { opacity: '0.5', cursor: 'not-allowed' },
    },
    // Slides on the spring curve; global-css.ts stops it under reduced motion (the spec says all motion stops).
    thumb: {
      position: 'absolute',
      top: '[3px]',
      left: '[3px]',
      width: '[14px]',
      height: '[14px]',
      borderRadius: 'full',
      bg: 'white',
      boxShadow: 'raised',
      transition: 'transform {durations.spring} {easings.spring}',
      '&[data-checked]': { transform: 'translateX(16px)' },
    },
  },
});
