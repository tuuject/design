// App-shell metrics. These are template chrome, not library sizes (the design system only owns
// component sizes); they stay below Koi's overlay layers (dialog 900 / popup 950 / toast 1000).
export const SIDEBAR_WIDTH = '248px';
export const SIDEBAR_WIDTH_COLLAPSED = '72px';
export const TOPBAR_HEIGHT = '56px';
/** The horizontal layout's second row: one control-lg tall. */
export const TOP_NAV_HEIGHT = '44px';
/**
 * The horizontal layout reads as one centered column: header rows and page content share this cap, so on
 * wide screens the navigation doesn't stretch across the whole monitor. The sidebar layout stays full width.
 */
export const CONTENT_MAX_WIDTH = '1280px';
/**
 * Total height of the sticky header block, as a CSS variable set by AppShell: the topbar alone in the
 * sidebar layout, topbar plus nav row in the horizontal one. Sticky offsets in pages read it instead of
 * hard-coding the chrome, so a jump target never lands under the header.
 */
export const HEADER_OFFSET = '--app-header-offset';
/** Mobile drawer + its backdrop, above the topbar (40), below every Koi overlay. */
export const SHELL_Z_INDEX = 60;
export const TOPBAR_Z_INDEX = 40;

/** Koi's keyboard focus outline (mirrors recipes/dimensions.ts focusRing; that helper isn't exported). */
export const focusRing = {
  outlineWidth: '2px',
  outlineStyle: 'solid',
  outlineColor: 'focus-ring',
  outlineOffset: '2px',
} as const;
