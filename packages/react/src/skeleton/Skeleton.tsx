import * as React from 'react';
import { cx } from '@koi/react/styled-system/css';
import { skeleton } from '@koi/react/styled-system/recipes';

export interface SkeletonProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. Default 'div'; use 'span' inside text. */
  as?: keyof React.JSX.IntrinsicElements;
  /** Optional: real or placeholder content to size the skeleton by. It is kept in layout but hidden. */
  children?: React.ReactNode;
}

/** Only the fill and shimmer. Set width, height, border-radius and layout with your own className or style. Always aria-hidden. */
export function Skeleton({ as: Tag = 'div', className, ...rest }: SkeletonProps) {
  const El = Tag as React.ElementType;
  return <El aria-hidden="true" {...rest} className={cx(skeleton(), className)} />;
}
