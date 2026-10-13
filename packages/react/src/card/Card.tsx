import * as React from 'react';
import { cx } from '@koi/react/styled-system/css';
import { card } from '@koi/react/styled-system/recipes';
import type { CardOwnProps } from '@koi/core';

export interface CardProps extends CardOwnProps, Omit<React.HTMLAttributes<HTMLDivElement>, keyof CardOwnProps> {}

/** A rounded container that groups related content. Don't nest cards. */
export function Card({ variant = 'outlined', padding = 'default', title, description, media, footer, className, children, ...rest }: CardProps) {
  const s = card({ variant, padding });
  return (
    <div {...rest} className={cx(s.root, className)}>
      {media ? <div className={s.media}>{media}</div> : null}
      {title || description ? (
        <div className={s.head}>
          {title ? <h3 className={s.title}>{title}</h3> : null}
          {description ? <p className={s.description}>{description}</p> : null}
        </div>
      ) : null}
      {children != null ? <div className={s.body}>{children}</div> : null}
      {footer ? <div className={s.footer}>{footer}</div> : null}
    </div>
  );
}
