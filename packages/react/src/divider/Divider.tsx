import * as React from 'react';
import { Separator } from '@base-ui/react/separator';
import { cx } from '@koi/react/styled-system/css';
import { separator } from '@koi/react/styled-system/recipes';

export interface DividerProps {
  /** Default horizontal. Vertical renders an inline <span> that stretches to its row's height. */
  orientation?: 'horizontal' | 'vertical';
  /** Text centered in a horizontal divider ("或"). Ignored when vertical. */
  label?: React.ReactNode;
  className?: string;
}

/** A 1px hairline separator. Prefer spacing; add a divider only when space alone doesn't separate the groups. */
export function Divider({ orientation = 'horizontal', label, className }: DividerProps) {
  const labelId = React.useId();
  if (orientation === 'vertical') {
    return <Separator orientation="vertical" render={<span />} className={cx(separator({ kind: 'vertical' }), className)} />;
  }
  if (label != null && label !== false) {
    // A separator's children are presentational, so the label names it instead of being lost.
    return (
      <Separator aria-labelledby={labelId} className={cx(separator({ kind: 'label' }), className)}>
        <span id={labelId}>{label}</span>
      </Separator>
    );
  }
  return <Separator className={cx(separator(), className)} />;
}
