import { cx } from '@koi/react/styled-system/css';
import { spinner } from '@koi/react/styled-system/recipes';
import { strings, type SpinnerOwnProps, type SpinnerSize } from '@koi/core';

export type { SpinnerSize } from '@koi/core';


export interface SpinnerProps extends SpinnerOwnProps {
  className?: string;
}

const PX: Record<SpinnerSize, number> = { sm: 16, md: 20, lg: 32 };

/** A 25%-opacity ring with an arc that turns every 800ms. Takes the surrounding text color. */
export function Spinner({ size = 'md', label = strings.loading, className }: SpinnerProps) {
  const s = spinner();
  const px = PX[size] ?? PX.md;
  return (
    <span role="status" aria-label={label} className={cx(s.root, className)}>
      <svg className={s.svg} width={px} height={px} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity={0.25} strokeWidth={3} />
        <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
      </svg>
    </span>
  );
}
