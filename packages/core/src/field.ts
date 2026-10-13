import type { ReactNode } from 'react';

export interface FieldOwnProps {
  label?: ReactNode;
  /** Shown under the control in text-muted. */
  help?: ReactNode;
  /** Shown under the control in error-text; marks the control invalid. */
  error?: ReactNode;
  /** Adds a red asterisk and marks the control required. */
  required?: boolean;
  /** Appends "（选填）" to the label. */
  optional?: boolean;
  /** One Input, Textarea or Select; it gets the label, help and error wired to it. */
  children: ReactNode;
}
