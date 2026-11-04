import type { ReactElement, ReactNode } from 'react';
import type { ChangeDetails } from './change-details.js';
import type { FloatingPlacement } from './common.js';

export interface PopoverOwnProps {
  /** The element that opens the panel; it must accept a ref and click/keyboard handlers. */
  trigger: ReactElement;
  /** The panel's content. It sits in a panel with 12px inner padding (4px panel + 8px body). */
  children: ReactNode;
  /** Where the panel opens, before it flips to stay on screen. Default 'bottom-start'. */
  placement?: FloatingPlacement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details: ChangeDetails) => void;
  /**
   * true: focus is trapped and the page scroll is locked while it's open. Default false: a popover is a small
   * panel of controls, not a dialog.
   */
  modal?: boolean;
  /** The panel's accessible name, for a panel whose content doesn't name it. */
  label?: string;
}
