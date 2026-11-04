import type { LinkOwnProps } from '@tuuject/koi-core';
import { cx } from '@tuuject/koi-react/styled-system/css';
import { link } from '@tuuject/koi-react/styled-system/recipes';
import { sizes } from '@tuuject/koi-tokens/dimensions';
import type { ComponentPropsWithRef } from 'react';
import { ExternalIcon } from '../icons.js';
import { useStrings } from '../strings.js';

export type { LinkVariant } from '@tuuject/koi-core';

export interface LinkProps extends LinkOwnProps, Omit<ComponentPropsWithRef<'a'>, keyof LinkOwnProps> {}

/**
 * An inline text link: amber text over a dashed underline that fills with a soft tint on hover.
 * `variant="plain"` reads as secondary text and turns brand on hover, for navigation rows such as breadcrumbs.
 * For standalone actions use Button (ghost for a quiet one).
 */
export function Link({ external, variant, className, children, ...rest }: LinkProps) {
  const s = link({ variant });
  const t = useStrings();
  // Passed target/rel still win, as in legacy.
  const ext = external ? { target: '_blank', rel: 'noopener noreferrer' } : null;
  return (
    <a {...ext} {...rest} className={cx(s.root, className)}>
      {children}
      {external ? (
        <span className={s.external}>
          <ExternalIcon size={sizes['icon-sm']} />
          <span className={s.srOnly}>{t.opensInNewWindow}</span>
        </span>
      ) : null}
    </a>
  );
}
