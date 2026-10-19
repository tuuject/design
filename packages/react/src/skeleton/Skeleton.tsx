import type { SkeletonOwnProps } from '@koi/core';
import { cx } from '@koi/react/styled-system/css';
import { skeleton } from '@koi/react/styled-system/recipes';
import type { ElementType, HTMLAttributes, JSX } from 'react';

export interface SkeletonProps extends SkeletonOwnProps, Omit<HTMLAttributes<HTMLElement>, keyof SkeletonOwnProps> {
  /** Element to render. Default 'div'; use 'span' inside text. */
  as?: keyof JSX.IntrinsicElements;
}

/** Only the fill and shimmer. Set width, height, border-radius and layout with your own className or style. Always aria-hidden. */
export function Skeleton({ as: Tag = 'div', className, ...rest }: SkeletonProps) {
  const El = Tag as ElementType;
  return <El aria-hidden="true" {...rest} className={cx(skeleton(), className)} />;
}
