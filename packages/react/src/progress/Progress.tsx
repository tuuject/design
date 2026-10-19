import { Progress as BaseProgress } from '@base-ui/react/progress';
import { type ProgressOwnProps, strings } from '@koi/core';
import { cx } from '@koi/react/styled-system/css';
import { progress } from '@koi/react/styled-system/recipes';
import type * as React from 'react';

export type { ProgressSize } from '@koi/core';

export interface ProgressProps
  extends ProgressOwnProps,
    Omit<React.ComponentPropsWithRef<'div'>, keyof ProgressOwnProps | 'children'> {}

/** A rounded progress bar. Base UI's root is the `role="progressbar"` element and carries the aria-value attributes. */
export function Progress({ value, max, label, showValue, size = 'md', className, ...rest }: ProgressProps) {
  const s = progress({ size });
  const known = value != null && Number.isFinite(value);
  // `max || 100` as legacy, so max={0} can't divide by zero.
  const top = max || 100;
  const pct = known ? Math.max(0, Math.min(100, (value / top) * 100)) : 0;
  const shownValue = showValue && known;
  return (
    <BaseProgress.Root
      value={known ? value : null}
      max={top}
      aria-label={label ? undefined : strings.progress}
      // Base UI's default text is English ("indeterminate progress"); the percentage stays as it formats it.
      getAriaValueText={(formatted) => (known ? formatted : strings.inProgress)}
      {...rest}
      className={cx(s.root, className)}
    >
      {label || shownValue ? (
        <div className={s.head}>
          {label ? <BaseProgress.Label className={s.label}>{label}</BaseProgress.Label> : null}
          {shownValue ? <span className={s.value}>{Math.round(pct)}%</span> : null}
        </div>
      ) : null}
      <BaseProgress.Track className={s.track}>
        <BaseProgress.Indicator className={s.indicator} />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
