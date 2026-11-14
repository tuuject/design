import type { FloatingPlacement } from '@tuuject/koi-core';

/** The positioner's side/align pair, spelled out so no library type leaks into a component's body signature. */
export interface ResolvedPlacement {
  side: 'top' | 'bottom' | 'inline-start' | 'inline-end';
  align: 'start' | 'end';
}

/**
 * Koi's `FloatingPlacement` in the terms the positioner takes. `start` and `end` mean where the text starts, and the
 * positioner resolves that itself: Floating UI mirrors an alignment on a top/bottom placement when the floating
 * element's computed `direction` is rtl (it reads the direction off that element). So the value passes through
 * unchanged, and what Koi has to get right is the direction on the positioner: every floating component writes
 * `dir` on its Positioner, from `useDirectionAttr()`.
 *
 * `left` / `right` are the LTR spelling of a side panel: they become `inline-start` / `inline-end`, which the
 * positioner resolves from the same direction, so a flyout that opens to the right in LTR opens to the left in RTL.
 */
export function placementOf(placement: FloatingPlacement): ResolvedPlacement {
  const [side, align] = placement.split('-') as ['top' | 'bottom' | 'left' | 'right', 'start' | 'end'];
  if (side === 'left' || side === 'right') {
    return { side: side === 'right' ? 'inline-end' : 'inline-start', align };
  }
  return { side, align };
}
