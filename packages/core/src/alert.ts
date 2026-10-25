import type { ReactNode } from 'react';

export type AlertTone = 'info' | 'warning' | 'error';

export interface AlertOwnProps {
  /** info (sky) / warning (yellow) / error (red). Default info. */
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  /** Replaces the tone icon; null hides it. */
  icon?: ReactNode | null;
  /** Usually a small Button, below the text. */
  action?: ReactNode;
  /** Shows a close button. */
  onClose?: () => void;
}
