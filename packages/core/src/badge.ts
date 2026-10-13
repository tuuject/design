import type { ReactNode } from 'react';

export type BadgeTone = 'neutral' | 'primary' | 'accent' | 'warning' | 'error' | 'solid';

export interface BadgeOwnProps {
  /** Default neutral. */
  tone?: BadgeTone;
  /** A 6px dot in the text color before the label. */
  dot?: boolean;
  children?: ReactNode;
}
