import { defineSlotRecipe, defineStyles } from '@pandacss/dev';

// Port of .koi-toast* / .koi-toaster in reference/legacy-web/components/bundle.css and docs/spec/components/Toast.md.
//
// Managed toasts (ToastProvider) are Base UI Toast.Roots, absolutely positioned in the viewport and moved into place
// with transforms: Base UI sets --toast-offset-y (heights of the newer toasts in front of this one) and --toast-index
// (its place among the toasts still showing). A closing toast's height drops to 0, so the ones behind it slide over
// on the same transition. --toast-swipe-movement-x/y follow a swipe; data-swipe-direction says where it was flung.
const shift = 'calc(var(--toast-offset-y, 0px) + var(--toast-index, 0) * token(spacing.2))';
const swipeX = 'var(--toast-swipe-movement-x, 0px)';
const swipeY = 'var(--toast-swipe-movement-y, 0px)';

function stacked(edge: 'bottom' | 'top') {
  // Bottom stacks grow upward, top stacks downward; the newest toast is the one nearest the edge.
  const sign = edge === 'bottom' ? '-' : '+';
  const y = `calc(${swipeY} ${sign} var(--koi-toast-shift))`;
  return defineStyles({
    position: 'absolute',
    ...(edge === 'bottom' ? { bottom: '0' } : { top: '0' }),
    insetInline: '0',
    width: '100%',
    maxWidth: 'none',
    // Dragging is swipe-to-dismiss, not text selection.
    userSelect: 'none',
    '--koi-toast-shift': shift,
    transform: `translateX(${swipeX}) translateY(${y})`,
    // Rises in from 12px toward the edge and 96%, on the spring curve (legacy koi-rise).
    '&[data-starting-style]': { opacity: '0', transform: `translateY(${edge === 'bottom' ? '12px' : '-12px'}) scale(.96)` },
    '&[data-ending-style]': { opacity: '0', transform: `translateY(${y}) scale(.96)` },
    // Flung away: keep going the way the swipe went.
    '&[data-ending-style][data-swipe-direction=left]': { transform: `translateX(calc(${swipeX} - 150%)) translateY(${y})` },
    '&[data-ending-style][data-swipe-direction=right]': { transform: `translateX(calc(${swipeX} + 150%)) translateY(${y})` },
    '&[data-ending-style][data-swipe-direction=up]': { transform: `translateY(calc(${y} - 150%))` },
    '&[data-ending-style][data-swipe-direction=down]': { transform: `translateY(calc(${y} + 150%))` },
  });
}

export const toast = defineSlotRecipe({
  className: 'koi-toast',
  slots: ['viewport', 'root', 'icon', 'content', 'title', 'description', 'action', 'close'],
  base: {
    // Centered, 16px from the edge; holds no layout of its own (the toasts are absolute), only hover and focus.
    viewport: {
      position: 'fixed',
      zIndex: '1000',
      insetInline: '0',
      mx: 'auto',
      width: '[360px]',
      maxWidth: 'calc(100vw - 32px)',
      outline: 'none',
    },
    root: {
      position: 'relative',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '3',
      boxSizing: 'border-box',
      width: '[360px]',
      maxWidth: 'calc(100vw - 32px)',
      p: '4',
      // No border: the shadow alone lifts it off the page.
      bg: 'surface-glass-tint',
      backdropFilter: 'blur(var(--blurs-float))',
      borderRadius: 'panel',
      boxShadow: 'float',
      color: 'text',
      fontFamily: 'sans',
      textStyle: 'body',
      // Moves on the spring curve; fades without it (the curve's overshoot would make the opacity dip near the end).
      transition: 'opacity token(durations.overlay) token(easings.out), transform token(durations.spring) token(easings.spring)',
      _focusVisible: { outlineWidth: '2px', outlineStyle: 'solid', outlineColor: 'focus-ring', outlineOffset: '2px' },
      // Leaving: a quick fade, without the spring's overshoot.
      '&[data-ending-style]': { transitionDuration: 'overlay', transitionTimingFunction: 'out' },
    },
    // 18px icon, 3px down so it centers on the title's first 24px line.
    icon: { flex: 'none', display: 'inline-flex', mt: '[3px]', '& > svg': { width: '[18px]', height: '[18px]' } },
    content: { flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '1' },
    // One step above the 14px base on purpose: a toast is only glanced at.
    title: { m: '0', textStyle: 'heading-3' },
    description: { m: '0', textStyle: 'body', color: 'text-muted' },
    action: { flex: 'none', display: 'flex', alignSelf: 'center', gap: '2' },
    // Alert's 24px round close button, aligned with the title line (legacy: top space-4, end space-3).
    close: {
      position: 'absolute',
      top: '4',
      insetInlineEnd: '3',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '[24px]',
      height: '[24px]',
      p: '0',
      borderWidth: '0',
      borderRadius: 'full',
      bg: 'transparent',
      color: 'inherit',
      cursor: 'pointer',
      transitionProperty: 'background-color',
      transitionDuration: 'fast',
      _hover: { bg: 'divider' },
      _focusVisible: { outlineWidth: '2px', outlineStyle: 'solid', outlineColor: 'focus-ring', outlineOffset: '2px' },
      '& > svg': { width: 'icon', height: 'icon' },
    },
  },
  variants: {
    tone: {
      info: { icon: { color: 'text-brand' } },
      success: { icon: { color: 'text-brand' } },
      warning: { icon: { color: 'warning-text' } },
      error: { icon: { color: 'error-text' } },
    },
    // Room on the right for the close button (legacy: padding-inline-end 44px = 12px + 24px + 8px).
    closable: {
      true: { root: { pe: '[44px]' } },
      false: {},
    },
    // static: a Toast rendered on its own. bottom / top: inside ToastProvider's viewport.
    position: {
      static: {},
      bottom: { viewport: { bottom: '4' }, root: stacked('bottom') },
      top: { viewport: { top: '4' }, root: stacked('top') },
    },
  },
  defaultVariants: { tone: 'info', closable: false, position: 'static' },
});
