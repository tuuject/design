import { createContext, useContext } from 'react';
import { TOPBAR_HEIGHT } from '../app-shell/shared';
import type { FormOutline } from './outline';

export const OutlineContext = createContext<FormOutline | null>(null);
export const SectionContext = createContext<string | null>(null);

export function useOutline() {
  const outline = useContext(OutlineContext);
  if (!outline) {
    throw new Error('FormSection and FormField must be rendered inside a SectionedForm.');
  }
  return outline;
}

export function useSectionId() {
  const id = useContext(SectionContext);
  if (id === null) {
    throw new Error('FormField must be rendered inside a FormSection.');
  }
  return id;
}

// Layout metrics shared by the parts. The two-column layout starts at a 720px container ('@container
// (min-width: 720px)', written out where used so Panda can read it).
/** Wide layout: where the sticky section list sits, and where a section's top lands when jumped to. */
export const WIDE_TOP = `calc(${TOPBAR_HEIGHT} + 24px)`;
/** Stacked layout: below the topbar and the sticky section dropdown (a 36px trigger with 8px above and below). */
export const STACKED_TOP = `calc(${TOPBAR_HEIGHT} + 52px + 16px)`;
/** Room a field keeps below itself when scrolled to, so the action bar (68px, 16px off the edge) doesn't cover it. */
export const BAR_CLEARANCE = 'calc(100px + env(safe-area-inset-bottom, 0px))';
/** The sticky dropdown and action bar paint over the content, under the topbar (40). */
export const STICKY_Z_INDEX = 30;
