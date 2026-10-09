import * as React from 'react';
import { cx } from '@koi/react/styled-system/css';
import { link } from '@koi/react/styled-system/recipes';
import { ExternalIcon } from '../icons';

export interface LinkProps extends React.ComponentPropsWithRef<'a'> {
  /** Opens in a new tab with rel="noopener noreferrer", an arrow glyph and a screen-reader note. */
  external?: boolean;
}

/**
 * An inline text link: amber text over a dashed underline that fills with a soft tint on hover.
 * For links inside running text; for standalone actions use Button (ghost for a quiet one).
 */
export function Link({ external, className, children, ...rest }: LinkProps) {
  const s = link();
  // Passed target/rel still win, as in legacy.
  const ext = external ? { target: '_blank', rel: 'noopener noreferrer' } : null;
  return (
    <a {...ext} {...rest} className={cx(s.root, className)}>
      {children}
      {external ? (
        <span className={s.external}>
          <ExternalIcon size={14} />
          <span className={s.srOnly}>（在新窗口打开）</span>
        </span>
      ) : null}
    </a>
  );
}
