import type { ReactNode } from 'react';

export interface LinkOwnProps {
  href?: string;
  /** Opens outside the app (a new tab on the web), with an arrow glyph and a screen-reader note. */
  external?: boolean;
  children?: ReactNode;
}
