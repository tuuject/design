import type { ReactElement, ReactNode } from 'react';
import type { ChangeDetails } from './change-details.js';
import type { FloatingPlacement } from './common.js';

/** One choosable row in a Menu. */
export interface MenuItemOwnProps<E = unknown> {
  /** Identifies the row to `onSelect`. */
  value: string;
  /** The row's content: usually text, but a node (an avatar, a two-line block) works too. */
  label: ReactNode;
  /** What the keyboard's type-to-find matches when `label` isn't plain text. */
  textValue?: string;
  /** A 16px icon before the label, in `currentColor`. */
  icon?: ReactNode;
  /** Content after the label, e.g. a badge or a short status. */
  endContent?: ReactNode;
  /** Renders the row as a link instead of a button. */
  href?: string;
  disabled?: boolean;
  /** The current page or choice: `aria-current="page"` and the active fill. */
  current?: boolean;
  /** Overrides the menu's `onSelect` for this row. */
  onSelect?: (value: string, item: MenuItemOwnProps<E>, details: ChangeDetails<E>) => void;
}

/** A titled group of rows. */
export interface MenuGroupOwnProps<E = unknown> {
  /** The heading; it names the group for screen readers. */
  label?: ReactNode;
  items: MenuItemOwnProps<E>[];
}

/** A row, a group of rows, or a line between them. */
export type MenuEntry<E = unknown> = MenuItemOwnProps<E> | MenuGroupOwnProps<E> | 'separator';

export interface MenuOwnProps<E = unknown> {
  /** The element that opens the menu; it must accept a ref and click/keyboard handlers. */
  trigger: ReactElement;
  /** The rows, in order. */
  items: MenuEntry<E>[];
  /** Content above the rows, divided from them by a line. */
  header?: ReactNode;
  /** Content below the rows, divided from them by a line. */
  footer?: ReactNode;
  /** Where the panel opens, before it flips to stay on screen. Default 'bottom-start'. */
  placement?: FloatingPlacement;
  /** Opens on hover too (mouse), for navigation flyouts. A hover-opened menu is never modal. */
  openOnHover?: boolean;
  /**
   * true: the page scrolls locked and outside clicks are blocked while it's open (Base UI's default).
   * Set false when picking a row starts a scroll or a navigation. Default true.
   */
  modal?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details: ChangeDetails<E>) => void;
  /** A row was chosen. Call `details.cancel()` to keep the menu open. */
  onSelect?: (value: string, item: MenuItemOwnProps<E>, details: ChangeDetails<E>) => void;
}
