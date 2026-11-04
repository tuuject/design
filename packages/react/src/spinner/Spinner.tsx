import type { SpinnerOwnProps, SpinnerSize } from '@tuuject/koi-core';
import { cx } from '@tuuject/koi-react/styled-system/css';
import { spinner } from '@tuuject/koi-react/styled-system/recipes';
import { components } from '@tuuject/koi-tokens/dimensions';
import { useStrings } from '../strings.js';

export type { SpinnerSize } from '@tuuject/koi-core';

export interface SpinnerProps extends SpinnerOwnProps {
  className?: string;
}

const { spinner: dim } = components;
const PX: Record<SpinnerSize, number> = { sm: dim.sizeSm, md: dim.sizeMd, lg: dim.sizeLg };

/** A 25%-opacity ring with an arc that turns every 800ms. Takes the surrounding text color. */
export function Spinner({ size = 'md', label, className }: SpinnerProps) {
  const s = spinner();
  const t = useStrings();
  const px = PX[size] ?? PX.md;
  return (
    <span role="status" aria-label={label ?? t.loading} className={cx(s.root, className)}>
      <svg className={s.svg} width={px} height={px} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity={0.25} strokeWidth={dim.stroke} />
        <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth={dim.stroke} strokeLinecap="round" />
      </svg>
    </span>
  );
}
