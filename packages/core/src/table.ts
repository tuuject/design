import type { ReactNode } from 'react';

/** Where a cell's content sits. Put numbers at `end`. */
export type TableAlign = 'start' | 'center' | 'end';

/** A column's sort state. The same shape TanStack Table's `column.getIsSorted()` returns. */
export type TableSortDirection = 'asc' | 'desc' | false;

/**
 * How column widths are decided. `auto` (default): by content, so they shift when the content changes (a skeleton
 * being replaced, the next page). `fixed`: by the widths you give (the header row's cells, or DataTable's column
 * `width`); columns without one share what's left. Content that doesn't fit ends in an ellipsis.
 */
export type TableLayout = 'auto' | 'fixed';

/** The table itself. Its parts are plain table elements, so a headless table library can drive them directly. */
export interface TableOwnProps {
  /** auto (default) · fixed. Use fixed with column widths when the rows load or page in place. */
  layout?: TableLayout;
  children?: ReactNode;
}

/** The header, body and footer row groups. */
export interface TableSectionOwnProps {
  children?: ReactNode;
}
export type TableHeaderOwnProps = TableSectionOwnProps;
export type TableBodyOwnProps = TableSectionOwnProps;
export type TableFooterOwnProps = TableSectionOwnProps;
export type TableCaptionOwnProps = TableSectionOwnProps;

export interface TableCellOwnProps {
  /** start (default) · center · end. */
  align?: TableAlign;
  children?: ReactNode;
}

export interface TableHeaderCellOwnProps<E = unknown> extends TableCellOwnProps {
  /** The column's current sort. Only shown when the column is sortable (`onSort`). */
  sort?: TableSortDirection;
  /**
   * Makes the header a sort button. Called on press; the platform's event is passed through, so TanStack
   * Table's `column.getToggleSortingHandler()` can be handed over as is. TanStack v9 returns a handler even for
   * columns that can't sort, so pass it only when `column.getCanSort()`.
   */
  onSort?: (event: E) => void;
}

export interface TableRowOwnProps {
  /** Fills the row with the selection tint. */
  selected?: boolean;
  children?: ReactNode;
}

export interface TableEmptyOwnProps {
  /** How many columns the message spans: the table's column count. */
  colSpan: number;
  /** Default "暂无数据". */
  children?: ReactNode;
}

export interface DataTableColumn<T> {
  /** Unique within the table. */
  key: string;
  header: ReactNode;
  cell: (row: T, index: number) => ReactNode;
  align?: TableAlign;
  /** The column's width: a number is px, a string any CSS length ('20%'). Pair with the table's `layout="fixed"`. */
  width?: number | string;
  /** Sample content for this column's loading placeholder, which takes its size (e.g. '¥199.00'). */
  skeleton?: ReactNode;
}

/** A ready-made table from columns and rows. For sorting, selection or a table library, compose the Table parts instead. */
export interface DataTableOwnProps<T> {
  columns: ReadonlyArray<DataTableColumn<T>>;
  rows: readonly T[];
  getRowKey: (row: T, index: number) => string | number;
  /** Shows skeleton rows instead of `rows`. */
  loading?: boolean;
  /** How many skeleton rows to show while loading. Default 5. */
  skeletonRows?: number;
  /** Shown when there are no rows. Default "暂无数据". */
  empty?: ReactNode;
  /** The table's accessible name, read by screen readers only. */
  caption?: ReactNode;
  /** auto (default) · fixed. With `fixed` and column widths, columns hold still while rows load and page. */
  layout?: TableLayout;
}
