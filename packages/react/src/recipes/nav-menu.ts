import { components as c, space } from '@tuuject/koi-tokens/dimensions';
import { defineSlotRecipe } from '@pandacss/dev/define';
import { focusRingInside, toPx } from './dimensions.js';
import { state, vars } from './headless.js';

// The horizontal bar fades out its inline end to hint at rows it has scrolled past. Mask alpha only, not a Koi
// color: it follows whatever the nav sits on. `to right`/`to left` can't be logical, so RTL gets its own gradient.
const FADE = `calc(100% - ${space['8']}px)`;
const fade = (to: 'right' | 'left') => `linear-gradient(to ${to}, currentColor ${FADE}, transparent)`;

// Port of .koi-nav* in reference/legacy-web/components/bundle.css and docs/spec/components/NavMenu.md.
// DOM: <nav root> <a|div brand> <div body> <div section> <div sectionLabel/> <ul list> <li> <a|button|trigger item/>
// … </div> </div> <div footer/> </nav>. The horizontal and rail flyouts are Base UI Menu popups: they take
// floatingPanel's positioner/popup (same panel as Menu and Popover) and draw their rows with this recipe's `item`,
// so a flyout row reads exactly like the row in the bar.
// The chevron turns while its Collapsible or Menu trigger is open; the collapsible panel animates on height.
export const navMenu = defineSlotRecipe({
  className: 'koi-nav-menu',
  slots: [
    'root',
    'brand',
    'brandLogo',
    'brandText',
    'brandTitle',
    'brandSubtitle',
    'body',
    'section',
    'sectionLabel',
    'list',
    'item',
    'itemIcon',
    'itemLabel',
    'trailing',
    'badge',
    'chevron',
    'submenuChevron',
    // A parent of the current page. The tree bolds it; the one-line bar and the rail also fill it, because there
    // is no expanded branch there to show where the page sits.
    // Named so it sorts after `item`: Panda emits slot rules alphabetically, and `item` sets the padding, color
    // and weight these two modifiers override.
    'onPath',
    // Level 2 and level 3 children line up under their parent's label instead of drawing an icon.
    'level2',
    'level3',
    'collapse',
    'panel',
    'panelList',
    'panelItem',
    'divider',
    'footer',
  ],
  base: {
    root: {
      boxSizing: 'border-box',
      width: '100%',
      color: 'text',
      fontFamily: 'sans',
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: '3',
      flex: 'none',
      px: '3',
      color: 'inherit',
      textDecoration: 'none',
      borderRadius: 'xl',
      '&:focus-visible': focusRingInside,
    },
    brandLogo: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none',
      overflow: 'hidden',
      width: 'control-lg',
      height: 'control-lg',
      borderRadius: 'xl',
      bg: 'secondary-solid',
      color: 'on-secondary-solid',
      textStyle: 'heading-3',
      fontWeight: 'bold',
      // An <img> or a single icon fills the box instead of sitting in it at its own size.
      '& > img, & > svg:only-child': { maxWidth: '100%' },
    },
    brandText: { display: 'flex', flexDirection: 'column', minWidth: '0' },
    // Products keep one line even when the name is long: the brand sits in the sidebar's header and a wrapped
    // subtitle would push the rows down. The overflow becomes an ellipsis and NavMenu puts the full text in a `title`.
    brandTitle: {
      textStyle: 'heading-3',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    brandSubtitle: {
      textStyle: 'small',
      color: 'text-muted',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    body: { display: 'flex', flexDirection: 'column', gap: '6', minWidth: '0' },
    section: { display: 'flex', flexDirection: 'column', gap: '1' },
    sectionLabel: { px: '3', textStyle: 'small', color: 'text-muted' },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
      m: '0',
      p: '0',
      // Panda's preflight drops list markers; the nav is a list for structure only.
      listStyleType: 'none',
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      boxSizing: 'border-box',
      width: '100%',
      // A floor rather than a fixed height: a long label (a German compound in a 248px sidebar) wraps onto a second
      // line and the row grows, instead of truncating the destination away. `fit-content` keeps the growth from the
      // content, so a flex row can't stretch the row to a taller sibling either.
      minHeight: 'control-md',
      height: 'fit-content',
      px: '3',
      m: '0',
      borderWidth: '0',
      borderRadius: 'xl',
      bg: 'transparent',
      color: 'nav-item-text',
      fontFamily: 'sans',
      textStyle: 'body',
      fontWeight: 'normal',
      textAlign: 'start',
      textDecoration: 'none',
      whiteSpace: 'normal',
      overflowWrap: 'break-word',
      cursor: 'pointer',
      outline: 'none',
      transitionProperty: 'background-color, color',
      transitionDuration: 'fast',
      // A disabled row never lights up: neither a disabled button nor a disabled menu row.
      [`&:hover:not(:disabled):not(${state.disabled}):not([aria-current])` as const]: {
        bg: 'nav-item-hover',
        color: 'text',
      },
      // The row the pointer or arrow keys are on inside a flyout panel. The current row keeps its fill.
      [`&${state.highlighted}:not([aria-current])` as const]: { bg: 'nav-item-hover', color: 'text' },
      '&:focus-visible': focusRingInside,
      '&[aria-current]': { bg: 'nav-item-active', color: 'text', fontWeight: 'bold' },
      [`&${state.disabled}, &:disabled` as const]: { color: 'text-disabled', cursor: 'not-allowed' },
    },
    onPath: { color: 'text', fontWeight: 'bold' },
    itemIcon: {
      display: 'inline-flex',
      flex: 'none',
      '& > svg': { width: 'icon', height: 'icon' },
    },
    itemLabel: { flex: '1', minWidth: '0' },
    // Badge and chevron travel together at the end of the row; one auto margin keeps them from splitting apart.
    trailing: { display: 'flex', alignItems: 'center', gap: '2', flex: 'none', marginInlineStart: 'auto' },
    badge: { flex: 'none' },
    chevron: {
      display: 'inline-flex',
      flex: 'none',
      color: 'text-muted',
      transition: 'transform {durations.check} {easings.spring}',
      [`${state.panelOpen} &, ${state.popupOpen} &` as const]: { transform: 'rotate(180deg)' },
    },
    submenuChevron: { display: 'inline-flex', flex: 'none', color: 'text-muted' },
    level2: { paddingInlineStart: toPx(c.navMenu.indent1) },
    level3: { paddingInlineStart: toPx(c.navMenu.indent2) },
    // Base UI measures the content into --collapsible-panel-height when it opens; the transition animates the
    // height between 0 and that. Reduced motion stops it in global-css.
    collapse: {
      overflow: 'hidden',
      height: vars.collapsiblePanelHeight,
      transition: 'height {durations.fast} {easings.out}',
      [`&${state.entering}, &${state.exiting}` as const]: { height: '0' },
    },
    // Applied together with floatingPanel's popup: only the width differs from a Menu's panel, and it gives way to
    // the room left on a narrow viewport the same way.
    panel: {
      minWidth: `min(${c.navMenu.flyoutMinWidth}px, ${vars.availableWidth})`,
      maxWidth: `min(${c.navMenu.flyoutMaxWidth}px, ${vars.availableWidth})`,
    },
    // Applied together with floatingPanel's body, which scrolls a branch taller than the room below the trigger.
    panelList: { display: 'flex', flexDirection: 'column', gap: '0', m: '0', p: '0', listStyleType: 'none' },
    // Inside the panel's radius-xl and 4px padding, radius-lg is the concentric corner. Rows keep their 36px when the
    // list scrolls, rather than squeezing to fit the panel.
    panelItem: { flex: 'none', borderRadius: 'lg' },
    divider: {
      flex: 'none',
      width: `${c.stroke.hairline}px`,
      height: toPx(space['6']),
      mx: '2',
      bg: 'divider',
    },
    footer: { flex: 'none' },
  },
  variants: {
    orientation: {
      vertical: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          gap: '6',
          // The sidebar and the drawer hand their padding over to the nav (NavMenu owns it), so the brand, the
          // labels and the rows all sit on the same 12px inset.
          paddingBlock: '4',
          paddingInline: '3',
          // Fills the sidebar or the drawer body it was put in; a plain block parent leaves it at content height.
          flex: '1',
          minHeight: '0',
          maxWidth: toPx(c.navMenu.maxWidth),
        },
        body: { flex: '1', minHeight: '0', overflowY: 'auto' },
        footer: { marginTop: 'auto' },
      },
      horizontal: {
        root: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '6',
          paddingBlock: '2',
          paddingInline: '4',
        },
        brand: { px: '0' },
        brandLogo: { width: 'control-md', height: 'control-md', textStyle: 'body' },
        brandTitle: { textStyle: 'body' },
        // One row: the sections run side by side, their labels are for screen readers only, and a line separates
        // one group from the next.
        body: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: '1',
          flex: '1',
          minWidth: '0',
          overflowX: 'auto',
          // The bar never shows a scrollbar; the fade at the end hints that it scrolls.
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          // The fade sits at the inline end (right in LTR, left in RTL); the trailing padding keeps it off the last
          // row while everything fits.
          maskImage: fade('right'),
          '&:dir(rtl)': { maskImage: fade('left') },
          pe: '8',
        },
        section: { flexDirection: 'row', alignItems: 'center', flex: 'none', gap: '0' },
        sectionLabel: { srOnly: true },
        list: { flexDirection: 'row' },
        // No expanded tree to read in one row, so a parent holding the current page takes the current fill.
        // One row only: a label that doesn't fit scrolls sideways with the bar instead of making the bar taller.
        item: { width: 'auto', flexShrink: '0', whiteSpace: 'nowrap' },
        onPath: { bg: 'nav-item-active', color: 'text', fontWeight: 'bold' },
        itemLabel: { flex: 'none' },
        footer: { marginInlineStart: 'auto' },
      },
    },
    collapsed: {
      true: {
        // A 72px rail: only the icons stay. The logo box keeps its 44px and centers in the rail. The brand's text
        // and the row labels stay for screen readers: they are the only names the link and the rows have, whatever
        // node the label is. `relative` keeps the visually hidden text anchored to its row.
        root: { width: toPx(c.navMenu.railWidth) },
        brand: { position: 'relative', px: '0', justifyContent: 'center' },
        brandText: { srOnly: true },
        // A 72px rail has no room for a heading, but the group keeps its name for screen readers.
        sectionLabel: { srOnly: true },
        // The branch is hidden behind a flyout, so its icon carries the fill the bar gives its parent.
        item: { position: 'relative', justifyContent: 'center', px: '0' },
        onPath: { bg: 'nav-item-active', color: 'text', fontWeight: 'bold' },
        itemLabel: { srOnly: true },
        trailing: { display: 'none' },
      },
    },
  },
  defaultVariants: { orientation: 'vertical' },
});
