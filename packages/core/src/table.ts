import type { ReactNode } from 'react';

/** Where a cell's content sits. Put numbers at `end`. */
export type TableAlign = 'start' | 'center' | 'end';

/** A column's sort state. The same shape TanStack Table's `column.getIsSorted()` returns. */
export type TableSortDirection = 'asc' | 'desc' | false;

/** The table itself. Its parts are plain table elements, so a headless table library can drive them directly. */
export interface TableOwnProps {
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
  /** Placeholder for this column's cells while loading, sized like the real content (e.g. a sample value). */
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
}
