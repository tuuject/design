import { Separator } from '@base-ui/react/separator';
import type { DividerOwnProps } from '@koi/core';
import { cx } from '@koi/react/styled-system/css';
import { separator } from '@koi/react/styled-system/recipes';
import { useId } from 'react';

export interface DividerProps extends DividerOwnProps {
  className?: string;
}

/** A 1px hairline separator. Prefer spacing; add a divider only when space alone doesn't separate the groups. */
export function Divider({ orientation = 'horizontal', label, className }: DividerProps) {
  const labelId = useId();
  if (orientation === 'vertical') {
    return (
      <Separator orientation="vertical" render={<span />} className={cx(separator({ kind: 'vertical' }), className)} />
    );
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
