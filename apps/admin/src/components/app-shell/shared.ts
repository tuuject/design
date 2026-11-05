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

// Safe area (defined from env() in index.css). Rows on a window edge pad by max(own padding, inset): a cutout
// inset already includes its own margin, so adding the row's padding on top would leave a double gap.
export const SAFE_TOP = 'var(--app-safe-top)';
export const SAFE_RIGHT = 'var(--app-safe-right)';
export const SAFE_BOTTOM = 'var(--app-safe-bottom)';
export const SAFE_LEFT = 'var(--app-safe-left)';
/**
 * How far the first header row keeps its content from the window's left / right edge: past a cutout, or past
 * the window controls plus the row's own 8px control gap, so the controls read as one more item in the row.
 * Only the top row needs this; the controls sit in the title-bar strip and nothing below it is covered.
 */
export const TOP_ROW_CLEAR_LEFT = `max(${SAFE_LEFT}, calc(var(--app-titlebar-inset-left) + token(spacing.2)))`;
export const TOP_ROW_CLEAR_RIGHT = `max(${SAFE_RIGHT}, calc(var(--app-titlebar-inset-right) + token(spacing.2)))`;
/**
 * Space between the window edge and the centered column (0 once the window is narrower than the cap), for
 * padding on a capped row: % in padding resolves against the full-width parent. The column keeps its usual
 * padding until an inset actually reaches into it, so on wide windows the brand still lines up with the page.
 */
export const COLUMN_OFFSET = `max(0px, (100% - ${CONTENT_MAX_WIDTH}) / 2)`;
/**
 * Window controls on the left (macOS traffic lights) sit over the sidebar's top corner, where neither the
 * 248px brand row nor the 72px rail has room beside them: the sidebar starts below a title-bar strip instead,
 * like a native macOS sidebar. `inset * 1000` is a CSS-only "is it non-zero": 0 stays 0, anything else caps at
 * the strip height. Controls on the right (Windows) leave the sidebar alone.
 */
export const SIDEBAR_TITLEBAR_STRIP = 'min(calc(var(--app-titlebar-inset-left) * 1000), var(--app-titlebar-height))';
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
