import { defineSlotRecipe } from '@pandacss/dev';
import { choiceControl, choiceRow } from './checkbox';

// Port of .koi-radio* / .koi-radios in reference/legacy-web/components/bundle.css and docs/spec/components/RadioGroup.md.
// DOM: <div root role=radiogroup> <label item> <span control role=radio><span indicator/></span> <input hidden/> <span text>…</span> </label>… </div>.
// The row and the 16px control are Checkbox's (`choiceRow`, `choiceControl`), so both read Base UI's
// data-checked / data-disabled / aria-invalid off the control the same way; only the radius and the dot differ.
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
      width: '[6px]',
      height: '[6px]',
      borderRadius: 'full',
      bg: 'on-action',
      transform: 'scale(0)',
      transition: 'transform {durations.check} {easings.spring}',
      '&[data-checked]': { transform: 'scale(1)' },
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
