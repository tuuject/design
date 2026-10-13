// The headless adapter: the only file that knows which library renders the DOM (Base UI today). Recipes read
// component state and measured sizes through these names, never through the library's own data-* attributes
// or CSS variables, so supporting a second library (Kobalte, for Solid) means editing this file, not every
// recipe: widen a selector to `:is([data-checked], [data-kb-checked])`, chain a variable's fallback.
//
// Standard HTML and ARIA stay in the recipes as they are (`:disabled`, `[aria-invalid=true]`,
// `[aria-current=page]`, `[aria-pressed]`, `[aria-busy=true]`): any library has to render those.
// `scripts/check-headless.mjs` (part of `pnpm check`) fails on a data-* attribute or a foreign CSS variable
// anywhere else in the recipes. The rules are in docs/headless.md.
//
// What the recipes also rely on, which a new adapter has to provide:
// - `invalid` (and `aria-invalid`) is never set on a disabled control, so the two states never overlap.
// - `entering` is on a mounted popup, dialog or toast for its first frame and `exiting` while it closes; the
//   element stays mounted until its CSS transition ends. Recipes animate with transitions, not keyframes.
// - The tab indicator is hidden (the `hidden` attribute) until the active tab has been measured.

/** State selectors. Each is a compound selector: write `&${state.checked}`, `${state.popupOpen} > &`, `:not(${state.disabled})`. */
export const state = {
  checked: '[data-checked]',
  unchecked: '[data-unchecked]',
  /** A Progress with no value. */
  indeterminate: '[data-indeterminate]',
  /** Disabled through the library (a Field, a group, or a non-native control). Native elements use `:disabled`. */
  disabled: '[data-disabled]',
  /** Inside a Field with an error. */
  invalid: '[data-invalid]',
  /** A select trigger showing no value yet. */
  placeholder: '[data-placeholder]',
  /** A trigger whose popup is open. */
  popupOpen: '[data-popup-open]',
  /** The current tab. */
  selected: '[data-active]',
  /** The item a pointer or the arrow keys are on, in a list or menu. */
  highlighted: '[data-highlighted]',
  /** The first frame after mounting: transition from here. */
  entering: '[data-starting-style]',
  /** Closing: transition to here, then it unmounts. */
  exiting: '[data-ending-style]',
  /** A tooltip closed by Esc or a click, which skips its fade. */
  instantClose: '[data-instant=dismiss]',
  /** Which way a toast was flung. */
  swiped: {
    left: '[data-swipe-direction=left]',
    right: '[data-swipe-direction=right]',
    up: '[data-swipe-direction=up]',
    down: '[data-swipe-direction=down]',
  },
} as const;

/** Values the library measures, as `var()` expressions ready to drop into a value or a calc(). */
export const vars = {
  // A popup's positioner.
  anchorWidth: 'var(--anchor-width)',
  availableWidth: 'var(--available-width)',
  availableHeight: 'var(--available-height)',
  transformOrigin: 'var(--transform-origin)',
  // A managed toast: the heights of the newer toasts in front of it, its place among the toasts showing, and
  // how far it has been dragged. Defaults keep a toast rendered on its own in place.
  toastOffsetY: 'var(--toast-offset-y, 0px)',
  toastIndex: 'var(--toast-index, 0)',
  toastSwipeX: 'var(--toast-swipe-movement-x, 0px)',
  toastSwipeY: 'var(--toast-swipe-movement-y, 0px)',
  // The active tab's box inside the tab list, re-measured on resize.
  activeTabLeft: 'var(--active-tab-left)',
  activeTabTop: 'var(--active-tab-top)',
  activeTabWidth: 'var(--active-tab-width)',
  activeTabHeight: 'var(--active-tab-height)',
} as const;
