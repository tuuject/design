import { defineSlotRecipe } from '@pandacss/dev';
import { state } from './headless';
import { components as c, space } from '@koi/tokens/dimensions';

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
      backdropFilter: 'blur(var(--blurs-panel))',
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
    title: { m: '0', pe: '8', textStyle: 'heading-2' },
    description: { m: '0', textStyle: 'body', color: 'text-muted' },
    body: { mt: '2', textStyle: 'body' },
    footer: { mt: '4', display: 'flex', gap: '2', justifyContent: 'flex-end', flexWrap: 'wrap' },
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
