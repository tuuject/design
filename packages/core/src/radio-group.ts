import type { ReactNode } from 'react';
import type { ChangeDetails } from './change-details';

export interface RadioOption {
  value: string;
  label: ReactNode;
  /** Shown under the label in text-muted. */
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupOwnProps<E = unknown> {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  /** Called with the newly chosen value. */
  onChange?: (value: string, details: ChangeDetails<E>) => void;
  /** Accessible name of the group (not shown). Inside a Field, the Field's label names it instead. */
  label?: string;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
}
