import type { ReactNode } from 'react';
import type { ChangeDetails } from './change-details.js';

/** One crumb in a trail: a page above the current one, or the page being shown. */
export interface BreadcrumbItem<E = unknown> {
  /** The crumb's text. */
  label: ReactNode;
  /** Renders the crumb as a link. An item without one is plain text, like the current page. */
  href?: string;
  /** The page being shown: bold, and carrying `aria-current="page"`. Usually the last item. */
  current?: boolean;
  /**
   * A crumb with an `href` was clicked. `details.event` is the DOM event, so with client-side routing call
   * `details.event.preventDefault()` and navigate yourself. `details.cancel()` also prevents the default.
   */
  onSelect?: (event: ChangeDetails<E>) => void;
}

export interface BreadcrumbOwnProps<E = unknown> {
  /** The trail, outermost page first and the current one last. */
  items: BreadcrumbItem<E>[];
  /** The nav landmark's accessible name. Default `strings.breadcrumb`. */
  label?: string;
}
