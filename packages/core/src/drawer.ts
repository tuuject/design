import type { ReactNode } from 'react';

export interface DrawerOwnProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Which edge it slides in from. Default 'left'. `left` and `right` are physical screen edges; `start` and `end`
   * follow the reading direction (the inline start/end edge), so a navigation drawer opens on the right in RTL.
   */
  side?: 'left' | 'right' | 'start' | 'end' | 'top' | 'bottom';
  /** The panel's heading. Also its accessible name; with `hideTitle` it stays for screen readers only. */
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Actions pinned under the content. */
  footer?: ReactNode;
  /** The panel's accessible name when there is no `title`. */
  label?: string;
  /** Keeps `title` for screen readers without drawing it (a drawer whose content already starts with its own header). */
  hideTitle?: boolean;
  /** false: a tap outside doesn't close it. Esc and the × still do. Default true. */
  dismissible?: boolean;
  /** Hide the × button. */
  hideClose?: boolean;
}
