import type { ReactNode } from 'react';

export interface CardOwnProps {
  /** outlined (default) / filled / glass (Koi's frosted panel: put it over imagery or color). */
  variant?: 'outlined' | 'filled' | 'glass';
  title?: ReactNode;
  description?: ReactNode;
  /** Full-bleed content above the head, e.g. an image. */
  media?: ReactNode;
  /** Actions, aligned right. */
  footer?: ReactNode;
  padding?: 'default' | 'none';
  children?: ReactNode;
}
