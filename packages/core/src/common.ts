/** control-sm 28 / control-md 36 / control-lg 44. Components in one row share a size. */
export type ControlSize = 'sm' | 'md' | 'lg';

/**
 * Reading direction of the text around a component. `ltr` for Latin and CJK, `rtl` for Arabic and Hebrew.
 * Web reads it from the `DirectionProvider` (and the `dir` attribute it writes); native gets it from the platform.
 */
export type Direction = 'ltr' | 'rtl';

/**
 * Where a panel opens from its trigger, before it flips to stay on screen: below or above, aligned to the
 * trigger's start or end, or beside it. Menu, Popover and the nav flyouts share these.
 *
 * Every value is reading-direction relative, and the positioner does the mirroring: it holds the direction Koi gives
 * it (`dir`), and from that it resolves `start`/`end` on a top/bottom panel, while `left`/`right` become the inline
 * sides (`placementOf`). `start` is where the text starts.
 */
export type FloatingPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'right-start' | 'left-start';
