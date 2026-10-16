// App-shell metrics. These are template chrome, not library sizes (the design system only owns
// component sizes); they stay below Koi's overlay layers (dialog 900 / popup 950 / toast 1000).
export const SIDEBAR_WIDTH = '248px';
export const SIDEBAR_WIDTH_COLLAPSED = '72px';
export const TOPBAR_HEIGHT = '56px';
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
