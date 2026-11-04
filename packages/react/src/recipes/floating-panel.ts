import { components as c } from '@tuuject/koi-tokens/dimensions';
import { defineSlotRecipe } from '@pandacss/dev/define';
import { toPx } from './dimensions.js';
import { state, vars } from './headless.js';

// The panel Menu and Popover share: Menu draws rows in it, Popover draws its own content. Same look as
// SelectPanel's panel (docs/spec/components/Menu.md), so every floating list in Koi reads the same.
// Popup, header and body transition from `state.entering` when they open and to `state.exiting` when they close.
export const floatingPanel = defineSlotRecipe({
  className: 'koi-floating-panel',
  slots: [
    'positioner',
    'popup',
    'header',
    'body',
    'footer',
    'group',
    'groupLabel',
    'separator',
    'item',
    'itemIcon',
    'itemText',
    'itemEnd',
  ],
  base: {
    positioner: {
      // Portaled to <body>: above a Dialog, below a Tooltip (the `layer` tokens).
      zIndex: 'popup',
      outline: 'none',
    },
    popup: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      minWidth: toPx(c.floatingPanel.minWidth),
      maxWidth: toPx(c.floatingPanel.maxWidth),
      maxHeight: `min(${c.floatingPanel.maxHeight}px, ${vars.availableHeight})`,
      overflow: 'hidden',
      p: '1',
      bg: 'surface',
      borderWidth: `${c.stroke.hairline}px`,
      borderStyle: 'solid',
      borderColor: 'border',
      borderRadius: 'xl',
      boxShadow: 'float',
      color: 'text',
      fontFamily: 'sans',
      textStyle: 'body',
      outline: 'none',
      // Pops from the trigger on the spring; the fade stays on `out` so it doesn't dip.
      transformOrigin: vars.transformOrigin,
      transition: 'opacity {durations.fast} {easings.out}, transform {durations.check} {easings.spring}',
      [`&${state.entering}, &${state.exiting}` as const]: { opacity: '0', transform: 'scale(.96)' },
      [`&${state.exiting}` as const]: { transitionTimingFunction: 'out' },
    },
    // Edge to edge: the negative margins cancel the popup's 4px padding on that side.
    header: {
      flex: 'none',
      mx: '-1',
      mt: '-1',
      px: '4',
      py: '3',
      borderBottomWidth: `${c.stroke.hairline}px`,
      borderBottomStyle: 'solid',
      borderBottomColor: 'divider',
    },
    body: {
      flex: '1',
      minHeight: '0',
      overflowY: 'auto',
      overscrollBehavior: 'contain',
      outline: 'none',
    },
    footer: {
      flex: 'none',
      mx: '-1',
      mb: '-1',
      px: '4',
      py: '3',
      borderTopWidth: `${c.stroke.hairline}px`,
      borderTopStyle: 'solid',
      borderTopColor: 'divider',
    },
    group: {
      '& + &': { mt: '1' },
    },
    groupLabel: {
      px: '3',
      pt: '2',
      pb: '1',
      textStyle: 'small',
      color: 'text-muted',
      userSelect: 'none',
    },
    separator: {
      height: `${c.stroke.hairline}px`,
      my: '1',
      mx: '-1',
      bg: 'divider',
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      boxSizing: 'border-box',
      minHeight: 'control-md',
      px: '3',
      py: '2',
      // radius-lg (8px) inside the popup's radius-xl (12px) and 4px padding: concentric.
      borderRadius: 'lg',
      color: 'text',
      lineHeight: toPx(c.field.lineHeight),
      whiteSpace: 'nowrap',
      textDecoration: 'none',
      cursor: 'pointer',
      userSelect: 'none',
      outline: 'none',
      scrollMarginBlock: '1',
      transitionProperty: 'background-color',
      transitionDuration: 'fast',
      [`&${state.highlighted}` as const]: { bg: 'surface-muted' },
      [`&${state.disabled}` as const]: { color: 'text-disabled', cursor: 'not-allowed' },
      // The current page keeps the fill the navigation gives it, so the panel says where you are.
      '&[aria-current=page]': { bg: 'nav-item-active', fontWeight: 'bold' },
    },
    itemIcon: {
      display: 'inline-flex',
      flex: 'none',
      color: 'text-muted',
      '& > svg': { width: 'icon', height: 'icon' },
    },
    itemText: { flex: '1', minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis' },
    itemEnd: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      flex: 'none',
      color: 'text-muted',
      textStyle: 'small',
    },
  },
  variants: {
    content: {
      // Menu rows carry their own side padding, so the body adds none.
      list: { body: { p: '0' } },
      // A Popover holds arbitrary markup: give it the panel's inner air.
      panel: { body: { p: '2' } },
    },
  },
  defaultVariants: { content: 'list' },
});
