import { defineSlotRecipe } from '@pandacss/dev';
import { state, vars } from './headless';
import { focusRing } from './dimensions';

// Port of .koi-tabs* in reference/legacy-web/components/bundle.css and docs/spec/components/Tabs.md.
// DOM: <div root> <div list role=tablist> <button tab role=tab/>… <span indicator/> </div> <div panel role=tabpanel/> </div>.
// The white pill is Base UI's Tabs.Indicator, not the tab's own background, so it can slide between tabs.
// Base UI measures the active tab (`vars.activeTab*` in headless.ts) and re-measures on resize
// (a ResizeObserver on the list and every tab), so a font swap or the bold label moves the pill too.
export const tabs = defineSlotRecipe({
  className: 'koi-tabs',
  slots: ['root', 'list', 'tab', 'indicator', 'panel'],
  base: {
    root: { display: 'flex', flexDirection: 'column', gap: '4' },
    // 36px tabs + 4px padding = the 44px (control-lg) track. `isolation` makes the list a stacking context so
    // the indicator's negative z-index puts it above the track's fill but under the labels.
    list: {
      position: 'relative',
      isolation: 'isolate',
      display: 'inline-flex',
      alignSelf: 'flex-start',
      gap: '1',
      p: '1',
      borderRadius: 'full',
      bg: 'surface-muted',
    },
    tab: {
      flex: 'none',
      height: 'control-md',
      px: '4',
      m: '0',
      borderWidth: '0',
      borderRadius: 'full',
      bg: 'transparent',
      fontFamily: 'sans',
      textStyle: 'body',
      fontWeight: 'normal',
      whiteSpace: 'nowrap',
      color: 'text-muted',
      cursor: 'pointer',
      userSelect: 'none',
      transitionProperty: 'color',
      transitionDuration: 'fast',
      _focusVisible: focusRing,
      // Three states that can't overlap, so Panda's emit order doesn't matter.
      [`&${state.selected}:not(${state.disabled})` as const]: { color: 'text', fontWeight: 'bold' },
      [`&:hover:not(${state.selected}, ${state.disabled})` as const]: { color: 'text' },
      [`&${state.disabled}` as const]: { color: 'text-disabled', cursor: 'not-allowed' },
    },
    // Hidden (by Base UI) until the active tab is measured, so it appears in place instead of sliding in from 0.
    // Slides on the spring curve; global-css.ts stops it under reduced motion.
    indicator: {
      position: 'absolute',
      zIndex: '-1',
      top: '0',
      left: '0',
      width: `[${vars.activeTabWidth}]`,
      height: `[${vars.activeTabHeight}]`,
      translate: `[${vars.activeTabLeft} ${vars.activeTabTop}]`,
      borderRadius: 'full',
      bg: 'surface',
      boxShadow: 'raised',
      transitionProperty: 'translate, width',
      transitionDuration: 'spring',
      transitionTimingFunction: 'spring',
    },
    panel: {
      textStyle: 'body',
      borderRadius: 'lg',
      _focusVisible: focusRing,
    },
  },
  variants: {
    fullWidth: {
      true: { list: { alignSelf: 'stretch' }, tab: { flex: '1' } },
      false: {},
    },
  },
  defaultVariants: { fullWidth: false },
});
