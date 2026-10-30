import type { ReactNode } from 'react';

/**
 * underline (default): the blog's dashed underline and soft hover tint. plain: secondary text that turns brand on
 * hover, no underline and no tint; for navigation rows such as breadcrumbs, where a link should read as a muted
 * label until pointed at.
 */
export type LinkVariant = 'underline' | 'plain';

export interface LinkOwnProps {
  href?: string;
  /** Opens outside the app (a new tab on the web), with an arrow glyph and a screen-reader note. */
  external?: boolean;
  /** How the link is drawn. Default underline. */
  variant?: LinkVariant;
  children?: ReactNode;
}
