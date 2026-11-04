import type { ReactNode } from 'react';
import type { ChangeDetails } from './change-details.js';

/** One row in a NavMenu: a page, or a parent that opens its children. */
export interface NavItem {
  /** Identifies the row to `value` and `onSelect`; also the key a parent expands by. */
  value: string;
  /** The row's content: usually text, but a node works too. */
  label: ReactNode;
  /** A 16px icon in `currentColor`. Children drop it and indent instead. */
  icon?: ReactNode;
  /** Renders the row as a real link. A parent's own href is ignored: it only opens its children. */
  href?: string;
  /** Content after the label, e.g. a count Badge. */
  badge?: ReactNode;
  disabled?: boolean;
  /** Nests one level deeper. The third level's own children are ignored, per the spec. */
  children?: NavItem[];
}

/** A group of items, optionally with a heading ("观察", "管理"). */
export interface NavSection {
  /** The group's heading; screen readers use it too. */
  label?: ReactNode;
  items: NavItem[];
}

/** The product mark above a vertical nav, or at the start of a horizontal one. */
export interface NavMenuBrand {
  /** A mark in the 44px logo box, or an `<img>` to use a picture instead. */
  logo?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  href?: string;
}

export interface NavMenuOwnProps<E = unknown> {
  /** `vertical` (sidebar) or `horizontal` (top bar). Default `vertical`. */
  orientation?: 'vertical' | 'horizontal';
  /** Groups of items. Use `items` instead for a single ungrouped list. */
  sections?: NavSection[];
  items?: NavItem[];
  /** The current item's value, for a consumer that routes. */
  value?: string;
  defaultValue?: string;
  /** A leaf was chosen. Call `details.cancel()` to keep the current value. */
  onSelect?: (value: string, item: NavItem, details: ChangeDetails<E>) => void;
  /** Parent values expanded when the nav first renders; the current branch always opens itself. */
  defaultExpanded?: string[];
  brand?: NavMenuBrand;
  /** Pinned to the bottom of a vertical nav, at the end of a horizontal one. */
  footer?: ReactNode;
  /** The nav landmark's accessible name. Default `strings.navMenu`. */
  label?: string;
  /** The `aria-current` value the current row carries. Default `'page'`. */
  current?: 'page' | 'location' | 'true';
  /**
   * A vertical rail: icons only, no labels, and a parent opens its children in a flyout beside the rail instead
   * of expanding in place. Ignored when horizontal.
   */
  collapsed?: boolean;
}

/**
 * The chain of item values from the top level down to `value` (the value itself included), or `[]` when it
 * isn't in the tree. A nav uses it to open a branch and to mark the parents of the current page.
 */
export function navPath(items: NavItem[], value: string | undefined): string[] {
  if (value === undefined) {
    return [];
  }
  for (const item of items) {
    if (item.value === value) {
      return [item.value];
    }
    const below = item.children === undefined ? [] : navPath(item.children, value);
    if (below.length > 0) {
      return [item.value, ...below];
    }
  }
  return [];
}
