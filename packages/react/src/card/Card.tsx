import type { CardOwnProps } from '@koi/core';
import { cx } from '@koi/react/styled-system/css';
import { type CardSlot, card } from '@koi/react/styled-system/recipes';
import type { HTMLAttributes } from 'react';
import type { SlotClassNames } from '../types';

export interface CardProps extends CardOwnProps, Omit<HTMLAttributes<HTMLDivElement>, keyof CardOwnProps> {
  classNames?: SlotClassNames<CardSlot>;
}

/** A rounded container that groups related content. Don't nest cards. */
export function Card({
  variant = 'outlined',
  padding = 'default',
  title,
  description,
  media,
  footer,
  className,
  classNames,
  children,
  ...rest
}: CardProps) {
  const s = card({ variant, padding });
  return (
    <div {...rest} className={cx(s.root, className)}>
      {media ? <div className={cx(s.media, classNames?.media)}>{media}</div> : null}
      {title || description ? (
        <div className={cx(s.head, classNames?.head)}>
          {title ? <h3 className={cx(s.title, classNames?.title)}>{title}</h3> : null}
          {description ? <p className={cx(s.description, classNames?.description)}>{description}</p> : null}
        </div>
      ) : null}
      {children != null ? <div className={cx(s.body, classNames?.body)}>{children}</div> : null}
      {footer ? <div className={cx(s.footer, classNames?.footer)}>{footer}</div> : null}
    </div>
  );
}
