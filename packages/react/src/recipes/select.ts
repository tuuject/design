import { defineSlotRecipe } from '@pandacss/dev';
import { state, vars } from './headless';
import { components as c } from '@koi/tokens/dimensions';
import { toPx } from './dimensions';

// Port of .koi-select* in reference/legacy-web/components/bundle.css and docs/spec/components/Select.md.
// Two recipes: `select` is the native <select> (legacy); `selectPanel` is the custom dropdown (Base UI Select or
// Combobox). Both draw Input's edge, so the three line up in a form.

// Native: states are read off the <select> with :has(), as Input does, so the `invalid` prop, a Field error and
// native validation all style the same. The selectors never overlap.
const INVALID = '&:has(> select[aria-invalid=true])';
const DISABLED = '&:has(> select:disabled)';

export const select = defineSlotRecipe({
  className: 'koi-select',
  slots: ['root', 'el', 'chevron'],
  base: {
    root: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      boxSizing: 'border-box',
      bg: 'surface',
      borderWidth: `${c.stroke.hairline}px`,
      borderStyle: 'solid',
      borderColor: 'border-control',
      borderRadius: 'xl',
      color: 'text',
      fontFamily: 'sans',
      transitionProperty: 'border-color, box-shadow',
      transitionDuration: 'fast',
      '&:hover:not(:focus-within, :has(> select:disabled, > select[aria-invalid=true]))': { borderColor: 'border-control-hover' },
      '&:focus-within': { borderColor: 'focus-ring', boxShadow: `0 0 0 ${c.stroke.hairline}px {colors.focus-ring}` },
      [INVALID]: { borderColor: 'error-control' },
      [`${INVALID}:focus-within`]: { boxShadow: `0 0 0 ${c.stroke.hairline}px {colors.error-control}` },
      [DISABLED]: { bg: 'surface-muted', color: 'text-disabled', borderColor: 'border', cursor: 'not-allowed' },
    },
    el: {
      flex: '1',
      minWidth: '0',
      height: '100%',
      m: '0',
      // The padding is on the <select>, not the wrapper (legacy), so the whole box opens the picker.
      pe: toPx(c.field.chevronSpace),
      borderWidth: '0',
      borderRadius: 'inherit',
      outline: 'none',
      bg: 'transparent',
      color: 'inherit',
      font: 'inherit',
      lineHeight: toPx(c.field.lineHeight),
      appearance: 'none',
      cursor: 'pointer',
      textOverflow: 'ellipsis',
      // The placeholder option is chosen: draw it like an Input placeholder.
      '&:not(:disabled):has(> option[value=""]:checked)': { color: 'text-muted' },
      '& option': { color: 'text', bg: 'surface' },
      _disabled: { cursor: 'not-allowed' },
    },
    chevron: {
      position: 'absolute',
      insetInlineEnd: toPx(c.field.chevronInset),
      display: 'inline-flex',
      pointerEvents: 'none',
      color: 'text-muted',
      '& > svg': { width: 'icon', height: 'icon' },
      [`:has(> select:disabled) > &`]: { color: 'text-disabled' },
    },
  },
  variants: {
    // Input's heights and side padding.
    size: {
      sm: { root: { height: 'control-sm', textStyle: 'small' }, el: { ps: toPx(c.field.paddingXSm) } },
      md: { root: { height: 'control-md', textStyle: 'body' }, el: { ps: toPx(c.field.paddingXMd) } },
      lg: { root: { height: 'control-lg', textStyle: 'body' }, el: { ps: toPx(c.field.paddingXLg) } },
    },
  },
  defaultVariants: { size: 'md' },
});

// Custom dropdown: the trigger is a <button>, so its states come from the headless layer (headless.ts). Same edge
// as above; an open popup keeps the focus edge. Invalid and disabled never meet a focused edge, so nothing overlaps.
const OPEN = `:is(:focus, ${state.popupOpen})` as const;
const BAD = `:is([aria-invalid=true], ${state.invalid}):not(${state.disabled})` as const;

export const selectPanel = defineSlotRecipe({
  className: 'koi-select-panel',
  slots: [
    'trigger', 'value', 'icon',
    'positioner', 'popup', 'search', 'searchInput', 'list', 'empty',
    'item', 'itemText', 'itemIndicator', 'group', 'groupLabel', 'separator',
  ],
  base: {
    trigger: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      width: '100%',
      boxSizing: 'border-box',
      m: '0',
      bg: 'surface',
      borderWidth: `${c.stroke.hairline}px`,
      borderStyle: 'solid',
      borderColor: 'border-control',
      borderRadius: 'xl',
      color: 'text',
      fontFamily: 'sans',
      textAlign: 'start',
      cursor: 'pointer',
      outline: 'none',
      transitionProperty: 'border-color, box-shadow',
      transitionDuration: 'fast',
      [`&:hover:not(${OPEN}, ${state.disabled}, ${BAD})` as const]: { borderColor: 'border-control-hover' },
      [`&${OPEN}:not(${BAD})` as const]: { borderColor: 'focus-ring', boxShadow: `0 0 0 ${c.stroke.hairline}px {colors.focus-ring}` },
      [`&${BAD}` as const]: { borderColor: 'error-control' },
      [`&${BAD}${OPEN}` as const]: { boxShadow: `0 0 0 ${c.stroke.hairline}px {colors.error-control}` },
      [`&${state.disabled}` as const]: { bg: 'surface-muted', color: 'text-disabled', borderColor: 'border', cursor: 'not-allowed' },
    },
    value: {
      flex: '1',
      minWidth: '0',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      lineHeight: toPx(c.field.lineHeight),
      [`${state.placeholder}:not(${state.disabled}) > &` as const]: { color: 'text-muted' },
    },
    icon: {
      display: 'inline-flex',
      flex: 'none',
      // Legacy's chevron sat 10px from the edge; the trigger's padding is 12px at md.
      marginInlineEnd: toPx(-c.selectPanel.chevronOverhang),
      color: 'text-muted',
      // Turns over while open, on the spring like NavMenu's chevron.
      transitionProperty: 'transform',
      transitionDuration: 'check',
      transitionTimingFunction: 'spring',
      '& > svg': { width: 'icon', height: 'icon' },
      [`${state.popupOpen} > &` as const]: { transform: 'rotate(180deg)' },
      [`${state.disabled} > &` as const]: { color: 'text-disabled' },
    },
    positioner: {
      // Portaled to <body>: above a Dialog (900), below a Tooltip (1000).
      zIndex: '950',
      outline: 'none',
    },
    popup: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      minWidth: vars.anchorWidth,
      maxWidth: vars.availableWidth,
      maxHeight: `min(${c.selectPanel.maxHeight}px, ${vars.availableHeight})`,
      overflow: 'hidden',
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
      // Pops from the trigger on the spring (NavMenu's flyouts); the fade stays on `out` so it doesn't dip.
      transformOrigin: vars.transformOrigin,
      transition: 'opacity {durations.fast} {easings.out}, transform {durations.check} {easings.spring}',
      [`&${state.entering}, &${state.exiting}` as const]: { opacity: '0', transform: 'scale(.96)' },
      [`&${state.exiting}` as const]: { transitionTimingFunction: 'out' },
    },
    search: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      flex: 'none',
      height: 'control-md',
      px: '3',
      borderBottomWidth: `${c.stroke.hairline}px`,
      borderBottomStyle: 'solid',
      borderBottomColor: 'divider',
      color: 'text-muted',
      '& > svg': { flex: 'none', width: 'icon', height: 'icon' },
    },
    // Focus stays here while the arrow keys move the highlight, so the caret is the focus indicator.
    searchInput: {
      flex: '1',
      minWidth: '0',
      height: '100%',
      m: '0',
      p: '0',
      borderWidth: '0',
      outline: 'none',
      bg: 'transparent',
      color: 'text',
      font: 'inherit',
      lineHeight: toPx(c.field.lineHeight),
      _placeholder: { color: 'text-muted' },
    },
    list: {
      flex: '1',
      minHeight: '0',
      overflowY: 'auto',
      overscrollBehavior: 'contain',
      p: '1',
      scrollPaddingBlock: '1',
      outline: 'none',
      _empty: { display: 'none' },
    },
    empty: {
      px: '3',
      py: '2',
      color: 'text-muted',
      _empty: { display: 'none' },
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
      cursor: 'pointer',
      userSelect: 'none',
      outline: 'none',
      scrollMarginBlock: '1',
      transitionProperty: 'background-color',
      transitionDuration: 'fast',
      [`&${state.highlighted}` as const]: { bg: 'surface-muted' },
      [`&${state.disabled}` as const]: { color: 'text-disabled', cursor: 'not-allowed' },
    },
    itemText: { flex: '1', minWidth: '0' },
    itemIndicator: {
      display: 'inline-flex',
      flex: 'none',
      color: 'text-brand',
      '& > svg': { width: 'icon', height: 'icon' },
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
  },
  variants: {
    size: {
      sm: { trigger: { height: 'control-sm', px: toPx(c.field.paddingXSm), textStyle: 'small' } },
      md: { trigger: { height: 'control-md', px: toPx(c.field.paddingXMd), textStyle: 'body' } },
      lg: { trigger: { height: 'control-lg', px: toPx(c.field.paddingXLg), textStyle: 'body' } },
    },
  },
  defaultVariants: { size: 'md' },
});
