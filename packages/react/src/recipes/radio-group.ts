import { components as c } from '@koi/tokens/dimensions';
import { defineSlotRecipe } from '@pandacss/dev';
import { choiceControl, choiceRow } from './checkbox';
import { toPx } from './dimensions';
import { state } from './headless';

// Port of .koi-radio* / .koi-radios in reference/legacy-web/components/bundle.css and docs/spec/components/RadioGroup.md.
// DOM: <div root role=radiogroup> <label item> <span control role=radio><span indicator/></span> <input hidden/> <span text>…</span> </label>… </div>.
// The row and the 16px control are Checkbox's (`choiceRow`, `choiceControl`), so both read the
// checked / disabled / aria-invalid state off the control the same way; only the radius and the dot differ.
export const radioGroup = defineSlotRecipe({
  className: 'koi-radio-group',
  slots: ['root', 'item', 'control', 'indicator', 'text', 'label', 'description'],
  base: {
    root: { display: 'flex', flexDirection: 'column', gap: '3' },
    item: choiceRow.root,
    text: choiceRow.text,
    label: choiceRow.label,
    description: choiceRow.description,
    control: { ...choiceControl, borderRadius: 'full' },
    // Kept mounted so the dot can spring in and out (global-css.ts stops it under reduced motion).
    indicator: {
      width: toPx(c.radio.dot),
      height: toPx(c.radio.dot),
      borderRadius: 'full',
      bg: 'on-action',
      transform: 'scale(0)',
      transition: 'transform {durations.check} {easings.spring}',
      [`&${state.checked}` as const]: { transform: 'scale(1)' },
    },
  },
  variants: {
    orientation: {
      vertical: {},
      horizontal: { root: { flexDirection: 'row', flexWrap: 'wrap', gap: '6' } },
    },
  },
  defaultVariants: { orientation: 'vertical' },
});
