import { components as c } from '@tuuject/koi-tokens/dimensions';
import { defineSlotRecipe } from '@pandacss/dev/define';
import { toPx } from './dimensions.js';
import { state } from './headless.js';

// An edge-anchored panel on the same backdrop as Dialog (docs/spec/components/Drawer.md). Base UI's Dialog
// supplies the focus trap, Esc, scroll lock and focus return; only the geometry and the slide are Drawer's.
// The slide is `overlay` (200ms) on `out`: a spring's overshoot would pull the panel off the edge it's anchored
// to and show a gap behind it.
export const drawer = defineSlotRecipe({
  className: 'koi-drawer',
  slots: ['backdrop', 'viewport', 'popup', 'title', 'description', 'body', 'footer', 'close'],
  base: {
    backdrop: {
      position: 'fixed',
      inset: '0',
      zIndex: 'dialog',
      bg: 'backdrop',
      transitionProperty: 'opacity',
      transitionDuration: 'overlay',
      [`&${state.entering}, &${state.exiting}` as const]: { opacity: '0' },
    },
    viewport: {
      position: 'fixed',
      inset: '0',
      zIndex: 'dialog',
      display: 'flex',
    },
    popup: {
      position: 'relative',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '2',
      p: '3',
      bg: 'surface',
      color: 'text',
      fontFamily: 'sans',
      textStyle: 'body',
      boxShadow: 'float',
      outline: 'none',
      transitionProperty: 'transform',
      transitionDuration: 'overlay',
      transitionTimingFunction: 'out',
    },
    title: { m: '0', pe: '8', textStyle: 'heading-3', overflowWrap: 'break-word', hyphens: 'auto' },
    description: { m: '0', textStyle: 'body', color: 'text-muted', overflowWrap: 'break-word' },
    body: {
      flex: '1',
      minHeight: '0',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      overscrollBehavior: 'contain',
    },
    footer: { flex: 'none', display: 'flex', gap: '2', justifyContent: 'flex-end', flexWrap: 'wrap' },
    close: { position: 'absolute', top: '3', insetInlineEnd: '3' },
  },
  variants: {
    // `left` / `right` are physical screen edges (a panel pinned to one side whatever the language); `start` / `end`
    // are the inline edges, so they swap in RTL. A slide can't be logical, so the logical sides carry a `:dir(rtl)`
    // rule with the opposite sign; the physical ones translate the same way in both directions.
    side: {
      // koi-physical: `left` names a physical screen edge, unlike `start`.
      left: {
        viewport: { justifyContent: 'left' }, // koi-physical: a physical edge, so the row packs left in RTL too
        popup: {
          width: '100%',
          maxWidth: toPx(c.drawer.width),
          height: '100%',
          borderRightWidth: `${c.stroke.hairline}px`, // koi-physical: a left panel's inner edge is its right one
          borderRightStyle: 'solid', // koi-physical: same edge
          borderRightColor: 'divider', // koi-physical: same edge
          [`&${state.entering}, &${state.exiting}` as const]: { transform: 'translateX(-100%)' },
        },
      },
      // koi-physical: `right` names a physical screen edge, unlike `end`.
      right: {
        viewport: { justifyContent: 'right' }, // koi-physical: a physical edge, so the row packs right in RTL too
        popup: {
          width: '100%',
          maxWidth: toPx(c.drawer.width),
          height: '100%',
          borderLeftWidth: `${c.stroke.hairline}px`, // koi-physical: a right panel's inner edge is its left one
          borderLeftStyle: 'solid', // koi-physical: same edge
          borderLeftColor: 'divider', // koi-physical: same edge
          [`&${state.entering}, &${state.exiting}` as const]: { transform: 'translateX(100%)' },
        },
      },
      start: {
        viewport: { justifyContent: 'flex-start' },
        popup: {
          width: '100%',
          maxWidth: toPx(c.drawer.width),
          height: '100%',
          borderInlineEndWidth: `${c.stroke.hairline}px`,
          borderInlineEndStyle: 'solid',
          borderInlineEndColor: 'divider',
          [`&${state.entering}, &${state.exiting}` as const]: { transform: 'translateX(-100%)' },
          [`&:dir(rtl)${state.entering}, &:dir(rtl)${state.exiting}` as const]: { transform: 'translateX(100%)' },
        },
      },
      end: {
        viewport: { justifyContent: 'flex-end' },
        popup: {
          width: '100%',
          maxWidth: toPx(c.drawer.width),
          height: '100%',
          borderInlineStartWidth: `${c.stroke.hairline}px`,
          borderInlineStartStyle: 'solid',
          borderInlineStartColor: 'divider',
          [`&${state.entering}, &${state.exiting}` as const]: { transform: 'translateX(100%)' },
          [`&:dir(rtl)${state.entering}, &:dir(rtl)${state.exiting}` as const]: { transform: 'translateX(-100%)' },
        },
      },
      top: {
        viewport: { flexDirection: 'column', justifyContent: 'flex-start' },
        popup: {
          width: '100%',
          maxHeight: '80%',
          borderBottomWidth: `${c.stroke.hairline}px`,
          borderBottomStyle: 'solid',
          borderBottomColor: 'divider',
          [`&${state.entering}, &${state.exiting}` as const]: { transform: 'translateY(-100%)' },
        },
      },
      bottom: {
        viewport: { flexDirection: 'column', justifyContent: 'flex-end' },
        popup: {
          width: '100%',
          maxHeight: '80%',
          borderTopWidth: `${c.stroke.hairline}px`,
          borderTopStyle: 'solid',
          borderTopColor: 'divider',
          [`&${state.entering}, &${state.exiting}` as const]: { transform: 'translateY(100%)' },
        },
      },
    },
    // A title that only screen readers get: the content already starts with its own header.
    hideTitle: {
      true: { title: { srOnly: true } },
    },
  },
  defaultVariants: { side: 'left' }, // koi-physical: the documented default is the left screen edge; `start`/`end` are opt-in
});
