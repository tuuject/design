import type { ReactNode } from 'react';
import type { ChangeDetails } from './change-details';
import type { ControlSize } from './common';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectOptionGroup<T extends SelectOption = SelectOption> {
  label: string;
  items: T[];
}

export type SelectEntry = SelectOption | SelectOptionGroup;
/** The option type inside `items`: the item itself, or the items of a group. */
export type SelectOptionOf<I> = I extends SelectOptionGroup<infer T> ? T : I;

/** The platform's own picker (a native <select> on the web). Its value and change handler are the platform's. */
export interface SelectOwnProps {
  /** The choices. */
  options?: SelectOption[];
  /** A disabled first option shown until the user picks. */
  placeholder?: string;
  /** sm 28px · md 36px · lg 44px, the same heights as Input and Button. Default md. */
  size?: ControlSize;
  /** Red edge, announced as invalid. Set automatically inside a Field with an error. */
  invalid?: boolean;
}

/** Koi's own dropdown panel, optionally searchable. */
export interface SelectPanelOwnProps<I extends SelectEntry = SelectEntry, E = unknown> {
  /** Options (`{value, label, disabled?}` plus any fields of your own), or groups of them (`{label, items}`). */
  items: readonly I[];
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null, details: ChangeDetails<E>) => void;
  /** Shown in the trigger until something is chosen. Default "请选择". */
  placeholder?: ReactNode;
  /** sm 28px · md 36px · lg 44px, the same heights as Input and Button. Default md. */
  size?: ControlSize;
  /** Red edge, announced as invalid. Set automatically inside a Field with an error. */
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  /** Puts a search box at the top of the panel that filters `items` by label. */
  searchable?: boolean;
  /** Default "搜索". Also the search box's accessible name. */
  searchPlaceholder?: string;
  /** Shown when the search matches nothing. Default "无匹配项". */
  emptyText?: ReactNode;
  /** Draws the chosen option in the trigger. Default: its label. */
  renderValue?: (item: SelectOptionOf<I>) => ReactNode;
  /**
   * Draws the panel. Receives the options to show (filtered by the search, empty groups dropped) in the shape
   * `items` has; render each as a SelectItem (in SelectGroups, with SelectSeparators, around your own markup).
   * Default: a SelectItem per option and a SelectGroup per group.
   */
  children?: (items: I[]) => ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details: ChangeDetails<E>) => void;
}

export interface SelectItemOwnProps {
  /** The option's `value`. */
  value: string;
  /** Text for type-to-find when `children` isn't plain text. */
  label?: string;
  disabled?: boolean;
  children: ReactNode;
}

export interface SelectGroupOwnProps {
  /** The heading; it names the group for screen readers. */
  label: ReactNode;
  children: ReactNode;
}
