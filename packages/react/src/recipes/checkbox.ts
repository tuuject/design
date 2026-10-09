import { defineSlotRecipe } from '@pandacss/dev';

// Port of .koi-check* in reference/legacy-web/components/bundle.css and docs/spec/components/Checkbox.md.
// DOM: <label root> <span control role=checkbox><span indicator><svg/></span></span> <input hidden/> <span text>…</span> </label>.
// Base UI puts data-checked / data-disabled / aria-invalid on the control; everything else reads them from there,
// so a Field's disabled or error state styles the same as the props. State selectors don't overlap, so Panda's
// emit order doesn't matter.

// The row around the box: label, description, disabled text and hover. RadioGroup's radios share it.
export const choiceRow = {
  root: {
    display: 'inline-flex',
    alignItems: 'flex-start',
    gap: '2',
    cursor: 'pointer',
    color: 'text',
    fontFamily: 'sans',
    textStyle: 'body',
    '&:has(> [data-disabled])': { color: 'text-disabled', cursor: 'not-allowed' },
    // Hovering anywhere on the row darkens an unticked, enabled, valid edge.
    '&:hover > [data-unchecked]:not([data-disabled], [aria-invalid=true])': { borderColor: 'border-control-hover' },
  },
  text: { display: 'flex', flexDirection: 'column' },
  label: { textStyle: 'body' },
  description: {
    mt: '1',
    textStyle: 'small',
    color: 'text-muted',
    // The disabled control is an earlier sibling of the text column.
    '[data-disabled] ~ * > &': { color: 'text-disabled' },
  },
} as const;

// The 16px box itself, minus its corner radius (Checkbox `sm`, Radio `full`). RadioGroup's radios share it.
export const choiceControl = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 'none',
  boxSizing: 'border-box',
  width: '[16px]',
  height: '[16px]',
  // Centers the 16px box on the label's 20px first line.
  mt: '[2px]',
  borderWidth: '[1.5px]',
  borderStyle: 'solid',
  borderColor: 'border-control',
  bg: 'surface',
  color: 'on-action',
  transitionProperty: 'background-color, border-color',
  transitionDuration: 'fast',
  _focusVisible: { outlineWidth: '2px', outlineStyle: 'solid', outlineColor: 'focus-ring', outlineOffset: '2px' },
  '&[data-checked]': { bg: 'control-checked', borderColor: 'control-checked' },
  // Inside a Field with an error (or with aria-invalid). Base UI never marks a disabled control invalid.
  '&[aria-invalid=true]:not([data-checked])': { borderColor: 'error-control' },
  '&[data-disabled]': { bg: 'surface-muted', borderColor: 'border' },
  // Beats both rules above by specificity: a disabled tick or dot keeps its fill, faded (legacy's opacity .5).
  '&[data-checked][data-disabled]': { bg: 'control-checked', borderColor: 'control-checked', opacity: '0.5' },
} as const;

export const checkbox = defineSlotRecipe({
  className: 'koi-checkbox',
  slots: ['root', 'control', 'indicator', 'text', 'label', 'description'],
  base: {
    ...choiceRow,
    control: { ...choiceControl, borderRadius: 'sm' },
    // Kept mounted so the tick can pop in and out on the spring curve (global-css.ts stops it under reduced motion).
    indicator: {
      display: 'flex',
      opacity: '0',
      transform: 'scale(.6)',
      transition: 'opacity {durations.fast}, transform {durations.check} {easings.spring}',
      '&[data-checked]': { opacity: '1', transform: 'scale(1)' },
      '& > svg': { width: '[12px]', height: '[12px]' },
    },
  },
});
