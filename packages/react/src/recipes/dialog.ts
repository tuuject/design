import { components as c, space } from '@tuuject/koi-tokens/dimensions';
import { defineSlotRecipe } from '@pandacss/dev/define';
import { toPx } from './dimensions.js';
import { state } from './headless.js';

// The body scrolls on its own, so it clips what it holds; this much padding keeps a control's focus ring (drawn
// outside it) visible at the body's top and bottom edges. Matching negative margins keep the spacing unchanged.
const ringRoom = c.focusRing.width + c.focusRing.offset;

// Port of .koi-dialog* in reference/legacy-web/components/bundle.css and docs/spec/components/Dialog.md.
// Backdrop and Popup transition from `state.entering` when they open and to `state.exiting` when they close.
export const dialog = defineSlotRecipe({
  className: 'koi-dialog',
  slots: ['backdrop', 'viewport', 'popup', 'title', 'description', 'body', 'footer', 'close'],
  base: {
    backdrop: {
      position: 'fixed',
      inset: '0',
      zIndex: 'dialog',
      bg: 'backdrop',
      transitionProperty: 'opacity',
      // Same 300ms as the popup, so the two open and close together.
      transitionDuration: 'dialog',
      [`&${state.entering}, &${state.exiting}` as const]: { opacity: '0' },
    },
    viewport: {
      position: 'fixed',
      inset: '0',
      zIndex: 'dialog',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: '4',
    },
    popup: {
      position: 'relative',
      width: '100%',
      maxHeight: `calc(100vh - ${2 * space[4]}px)`,
      // Only the body scrolls (below). This is a fallback for a viewport too short even for the title and footer;
      // it also clips the body's scrollbar to the rounded corners.
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '2',
      p: '6',
      bg: 'surface',
      color: 'text',
      // radius-dialog (32px) = the footer buttons' radius-lg (8px) + space-6 (24px) padding: concentric corners.
      borderRadius: 'dialog',
      boxShadow: 'float',
      outline: 'none',
      transitionProperty: 'opacity, transform',
      transitionDuration: 'dialog',
      // Grows from and shrinks to its center; it never moves.
      transformOrigin: 'center',
      [`&${state.entering}, &${state.exiting}` as const]: { opacity: '0', transform: 'scale(.96)' },
    },
    // `hyphens`: a long translated title breaks at its syllables when the page's `lang` allows it, instead of
    // splitting a compound at an arbitrary letter.
    title: { flexShrink: '0', m: '0', pe: '8', textStyle: 'heading-2', overflowWrap: 'break-word', hyphens: 'auto' },
    description: { flexShrink: '0', m: '0', textStyle: 'body', color: 'text-muted', overflowWrap: 'break-word' },
    // The scroll container: long content scrolls between a fixed title and footer. It reaches out through the
    // panel's side padding, so its scrollbar runs along the panel edge and side focus rings aren't clipped.
    body: {
      minHeight: '0',
      overflowY: 'auto',
      overscrollBehavior: 'contain',
      mx: '-6',
      px: '6',
      mt: toPx(space[2] - ringRoom),
      mb: toPx(-ringRoom),
      py: toPx(ringRoom),
      textStyle: 'body',
      overflowWrap: 'break-word',
      hyphens: 'auto',
    },
    footer: { flexShrink: '0', mt: '4', display: 'flex', gap: '2', justifyContent: 'flex-end', flexWrap: 'wrap' },
    close: { position: 'absolute', top: '4', insetInlineEnd: '4' },
  },
  variants: {
    size: {
      sm: { popup: { maxWidth: `${c.dialog.widthSm}px` } },
      md: { popup: { maxWidth: `${c.dialog.widthMd}px` } },
      lg: { popup: { maxWidth: `${c.dialog.widthLg}px` } },
    },
  },
  defaultVariants: { size: 'md' },
});
