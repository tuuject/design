import type { ReactNode } from 'react';

export interface TagOwnProps<E = unknown> {
  children: ReactNode;
  /** A 14px icon before the label. */
  icon?: ReactNode;
  /** The `action-subtle` fill of a chosen filter chip. On its own it's only the look. */
  selected?: boolean;
  /**
   * Makes the tag a toggle for filter chips. Called with the next state when it's pressed; pass `selected` back.
   * `E` is the platform's press event.
   */
  onSelectedChange?: (selected: boolean, event: E) => void;
  /** Shows a remove (×) button, named "移除 <label>". */
  onRemove?: () => void;
}
