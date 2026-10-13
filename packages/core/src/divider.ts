import type { ReactNode } from 'react';

export interface DividerOwnProps {
  /** Default horizontal. Vertical stretches to its row's height. */
  orientation?: 'horizontal' | 'vertical';
  /** Text centered in a horizontal divider ("或"). Ignored when vertical. */
  label?: ReactNode;
}
