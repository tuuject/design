import * as React from 'react';
import { Progress as BaseProgress } from '@base-ui/react/progress';
import { cx } from '@koi/react/styled-system/css';
import { progress } from '@koi/react/styled-system/recipes';

export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressProps extends Omit<React.ComponentPropsWithRef<'div'>, 'children'> {
  /** 0–`max`. Omit (or pass null) for an indeterminate bar. */
  value?: number | null;
  /** Default 100. */
  max?: number;
  /** Shown above the bar and used as its accessible name. Without it the bar is named "进度". */
  label?: string;
  /** Show the rounded percentage at the end of the head row (determinate bars only). */
  showValue?: boolean;
  /** Track height: sm 4px, md 8px (default), lg 12px. */
  size?: ProgressSize;
}

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
      aria-label={label ? undefined : '进度'}
      // Base UI's default text is English ("indeterminate progress"); the percentage stays as it formats it.
      getAriaValueText={(formatted) => (known ? formatted : '进行中')}
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
