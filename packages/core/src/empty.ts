import type { ReactNode } from 'react';

/**
 * A page, panel or table's empty, error or placeholder state: an icon over a title, with an optional description
 * and action. The layout and copy stay with the platform; TableEmpty passes its own title in.
 */
export interface EmptyOwnProps {
  /** Decorative, above the title. The platform draws it at the size it's given. */
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** A call to action under the copy, e.g. a Button. */
  action?: ReactNode;
  /**
   * 'plain' drops the block padding and keeps the title in the muted body style, for a table's empty row.
   * Default 'default', the page-level state.
   */
  variant?: 'default' | 'plain';
}
