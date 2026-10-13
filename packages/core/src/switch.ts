import type { ReactNode } from 'react';
import type { ChangeDetails } from './change-details';

export interface SwitchOwnProps<E = unknown> {
  label?: ReactNode;
  /** On or off (controlled). */
  checked?: boolean;
  /** On or off at first (uncontrolled). */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean, details: ChangeDetails<E>) => void;
  disabled?: boolean;
  /** Can't be switched, but still focusable. */
  readOnly?: boolean;
}
