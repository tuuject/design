import * as React from 'react';
import { cx } from '@koi/react/styled-system/css';
import { card } from '@koi/react/styled-system/recipes';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** outlined (default) · filled · glass (Koi's frosted panel: put it over imagery or color). */
  variant?: 'outlined' | 'filled' | 'glass';
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Full-bleed content above the head, e.g. an <img>. */
  media?: React.ReactNode;
  /** Actions, aligned right. */
  footer?: React.ReactNode;
  padding?: 'default' | 'none';
}

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
