import type { ReactNode } from 'react';
import type { ChangeDetails } from './change-details.js';

/** What ended a slider interaction: the reason and the platform event. A commit can't be canceled. */
export interface SliderCommitDetails<E = unknown> {
  reason: string;
  event: E;
}

export interface SliderOwnProps<E = unknown> {
  /** Controlled value. */
  value?: number;
  /** Initial value when uncontrolled. Defaults to `min`. */
  defaultValue?: number;
  /** Lower bound. Default 0. */
  min?: number;
  /** Upper bound. Default 100. */
  max?: number;
  /** Granularity of the steps. Default 1. */
  step?: number;
  /** Called on every change: dragging, clicking the track, or an arrow key. */
  onValueChange?: (value: number, details: ChangeDetails<E>) => void;
  /** Called once a change is committed (pointer released, key released); for work too heavy to run per pixel. */
  onValueCommitted?: (value: number, details: SliderCommitDetails<E>) => void;
  /** Shown above the track; without it give the control an `aria-label`. */
  label?: ReactNode;
  /** Shows the current value at the end of the label row. */
  showValue?: boolean;
  /** Formats the value for display and screen readers, e.g. `(value) => `${Math.round(value * 100)}%``. */
  formatValue?: (value: number) => string;
  disabled?: boolean;
}
