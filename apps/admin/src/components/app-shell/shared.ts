// App-shell metrics. These are template chrome, not library sizes (the design system only owns
// component sizes); they stay below Koi's overlay layers (dialog 900 / popup 950 / toast 1000).
import { sizes, space } from '@tuuject/koi-tokens/dimensions';

export const SIDEBAR_WIDTH = '248px';
export const SIDEBAR_WIDTH_COLLAPSED = '72px';
/**
 * Air above, below and between the header rows, the same 8px (space-2) the rows use between their own
 * controls and the nav row uses between its groups: the header reads as one grid instead of three different
 * rhythms. It sits on the sticky block, not on the rows, so the gap between the two rows isn't the sum of two
 * paddings.
 */
export const HEADER_ROW_PADDING = '2';
/** A header row is exactly one control-md; the air around it belongs to the block. */
export const HEADER_ROW_HEIGHT = `${sizes['control-md']}px`;
/** One row plus its air on both sides: the header height in the sidebar layout. */
export const HEADER_HEIGHT = `${sizes['control-md'] + space['2'] * 2}px`;
/** Two rows with the same 8px above, between and below: the horizontal layout's header at md and up. */
export const HEADER_HEIGHT_HORIZONTAL = `${sizes['control-md'] * 2 + space['2'] * 3}px`;
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
