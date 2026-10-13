import type { ReactNode } from 'react';

export interface SkeletonOwnProps {
  /** Optional: real or placeholder content to size the skeleton by. It is kept in layout but hidden. */
  children?: ReactNode;
}
