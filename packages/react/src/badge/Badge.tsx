import * as React from 'react';
import { cx } from '@koi/react/styled-system/css';
import { badge } from '@koi/react/styled-system/recipes';

export type BadgeTone = 'neutral' | 'primary' | 'accent' | 'warning' | 'error' | 'solid';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Default neutral. */
  tone?: BadgeTone;
  /** A 6px dot in the text color before the label. */
  dot?: boolean;
  children?: React.ReactNode;
}

/** A small, non-interactive pill label for status or counts. For filters or removable chips, use Tag. */
export function Badge({ tone = 'neutral', dot, className, children, ...rest }: BadgeProps) {
  const s = badge({ tone });
  return (
    <span {...rest} className={cx(s.root, className)}>
      {dot ? <span className={s.dot} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
