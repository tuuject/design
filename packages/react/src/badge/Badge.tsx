import type { BadgeOwnProps } from '@tuuject/koi-core';
import { cx } from '@tuuject/koi-react/styled-system/css';
import { badge } from '@tuuject/koi-react/styled-system/recipes';
import type { HTMLAttributes } from 'react';

export type { BadgeTone } from '@tuuject/koi-core';

export interface BadgeProps extends BadgeOwnProps, Omit<HTMLAttributes<HTMLSpanElement>, keyof BadgeOwnProps> {}

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
