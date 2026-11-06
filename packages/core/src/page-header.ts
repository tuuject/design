import type { ReactNode } from 'react';

export interface PageHeaderOwnProps {
  /** The page's `h1`. */
  title: ReactNode;
  /** One line under the title: what the page is for. */
  description?: ReactNode;
  /** Page-level controls, pinned to the right of the title block. */
  actions?: ReactNode;
  /** A mark beside the title that explains it, e.g. an IconButton opening a Tooltip. */
  info?: ReactNode;
}
