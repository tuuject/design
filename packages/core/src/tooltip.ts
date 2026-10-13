import type { ReactElement, ReactNode } from 'react';
import type { ChangeDetails } from './change-details';

export type TooltipSide = 'top' | 'bottom';

export interface TooltipOwnProps<E = unknown> {
  /** A short phrase. Never essential information or interactive content. */
  content: ReactNode;
  /** One focusable element (a Button, IconButton, Link…). */
  children: ReactElement;
  /** Preferred side; flips to the other one when there's no room. Default top. */
  side?: TooltipSide;
  /** Force open or closed (controlled). */
  open?: boolean;
  /** Open on first render, then behave as usual. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details: ChangeDetails<E>) => void;
  /** Milliseconds of hover before it opens. Default 0: it opens on hover, as in legacy. Keyboard focus always opens it at once. */
  delay?: number;
  /** Milliseconds before it closes after the pointer leaves. Default 0. */
  closeDelay?: number;
  /** Never open. */
  disabled?: boolean;
}
