import { defineSlotRecipe } from '@pandacss/dev';
import { state } from './headless';
import { components as c } from '@koi/tokens/dimensions';
import { focusRing, toPx } from './dimensions';

// Port of .koi-check* in reference/legacy-web/components/bundle.css and docs/spec/components/Checkbox.md.
// DOM: <label root> <span control role=checkbox><span indicator><svg/></span></span> <input hidden/> <span text>…</span> </label>.
// The headless layer marks the control checked / disabled (plus aria-invalid); everything else reads them from there,
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
    [`&:has(> ${state.disabled})` as const]: { color: 'text-disabled', cursor: 'not-allowed' },
    // Hovering anywhere on the row darkens an unticked, enabled, valid edge.
    [`&:hover > ${state.unchecked}:not(${state.disabled}, [aria-invalid=true])` as const]: { borderColor: 'border-control-hover' },
  },
  text: { display: 'flex', flexDirection: 'column' },
  label: { textStyle: 'body' },
  description: {
    mt: '1',
    textStyle: 'small',
    color: 'text-muted',
    // The disabled control is an earlier sibling of the text column.
    [`${state.disabled} ~ * > &` as const]: { color: 'text-disabled' },
  },
} as const;

// The 16px box itself, minus its corner radius (Checkbox `sm`, Radio `full`). RadioGroup's radios share it.
export const choiceControl = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 'none',
  boxSizing: 'border-box',
  width: toPx(c.checkbox.box),
  height: toPx(c.checkbox.box),
  // Centers the 16px box on the label's 20px first line.
  mt: toPx(c.checkbox.offset),
  borderWidth: toPx(c.stroke.check),
  borderStyle: 'solid',
  borderColor: 'border-control',
  bg: 'surface',
  color: 'on-action',
  transitionProperty: 'background-color, border-color',
  transitionDuration: 'fast',
  _focusVisible: focusRing,
  [`&${state.checked}` as const]: { bg: 'control-checked', borderColor: 'control-checked' },
  // Inside a Field with an error (or with aria-invalid). A disabled control is never marked invalid (headless.ts).
  [`&[aria-invalid=true]:not(${state.checked})` as const]: { borderColor: 'error-control' },
  [`&${state.disabled}` as const]: { bg: 'surface-muted', borderColor: 'border' },
  // Beats both rules above by specificity: a disabled tick or dot keeps its fill, faded (legacy's opacity .5).
  [`&${state.checked}${state.disabled}` as const]: { bg: 'control-checked', borderColor: 'control-checked', opacity: '0.5' },
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
      [`&${state.checked}` as const]: { opacity: '1', transform: 'scale(1)' },
      '& > svg': { width: 'icon-xs', height: 'icon-xs' },
    },
  },
});
