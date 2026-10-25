import type { ReactNode } from 'react';

export interface DialogOwnProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Actions, in order: cancel (secondary ghost), then the confirming solid button. Buttons here default to shape="rounded". */
  footer?: ReactNode;
  /** sm 400 / md 520 / lg 720. Default md. */
  size?: 'sm' | 'md' | 'lg';
  /**
   * 'alertdialog' for confirmations that need an answer: a tap outside never closes it, and focus starts on the
   * first footer button, the least destructive action (cancel). Default 'dialog'.
   */
  role?: 'dialog' | 'alertdialog';
  /** false: a tap outside (on the backdrop) doesn't close it. Esc and the × still do. Default true; an alertdialog is never dismissed by a tap outside. */
  dismissible?: boolean;
  /** Hide the × button (e.g. for confirmations that need an explicit answer). */
  hideClose?: boolean;
}
