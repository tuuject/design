import type { ReactNode } from 'react';
import type { ChangeDetails } from './change-details';

export interface CheckboxOwnProps<E = unknown> {
  label?: ReactNode;
  /** Shown under the label in text-muted. Needs a label. */
  description?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean, details: ChangeDetails<E>) => void;
  disabled?: boolean;
  readOnly?: boolean;
}
