import {
  strings,
  type TableBodyOwnProps,
  type TableCaptionOwnProps,
  type TableCellOwnProps,
  type TableEmptyOwnProps,
  type TableFooterOwnProps,
  type TableHeaderCellOwnProps,
  type TableHeaderOwnProps,
  type TableOwnProps,
  type TableRowOwnProps,
} from '@koi/core';
import { cx } from '@koi/react/styled-system/css';
import { table } from '@koi/react/styled-system/recipes';
import type { ComponentPropsWithRef, MouseEvent } from 'react';
import { SortDownIcon, SortIcon, SortUpIcon } from '../icons';
import { ShapeProvider } from '../shape';

export type { TableAlign, TableLayout, TableSortDirection } from '@koi/core';

// Plain table elements with every native attribute passed through (colSpan, style, ref…), so a headless table
// library renders straight into them: TanStack Table's header groups map onto TableHeader > TableRow >
// TableHeaderCell, its row model onto TableBody > TableRow > TableCell.

export interface TableProps extends TableOwnProps, Omit<ComponentPropsWithRef<'table'>, keyof TableOwnProps> {
  /** Class for the scrolling container around the table. */
  containerClassName?: string;
}

/** A data table inside a container that scrolls sideways when the table is wider than it. */
export function Table({ layout, containerClassName, className, ...rest }: TableProps) {
  const s = table({ layout });
  return (
    <div className={cx(s.container, containerClassName)}>
      <table {...rest} className={cx(s.root, className)} />
    </div>
  );
}

export interface TableHeaderProps
  extends TableHeaderOwnProps,
    Omit<ComponentPropsWithRef<'thead'>, keyof TableHeaderOwnProps> {}
export function TableHeader({ className, ...rest }: TableHeaderProps) {
  return <thead {...rest} className={cx(table().header, className)} />;
}

export interface TableBodyProps
  extends TableBodyOwnProps,
    Omit<ComponentPropsWithRef<'tbody'>, keyof TableBodyOwnProps> {}
export function TableBody({ className, ...rest }: TableBodyProps) {
  return <tbody {...rest} className={cx(table().body, className)} />;
}

export interface TableFooterProps
  extends TableFooterOwnProps,
    Omit<ComponentPropsWithRef<'tfoot'>, keyof TableFooterOwnProps> {}
export function TableFooter({ className, ...rest }: TableFooterProps) {
  return <tfoot {...rest} className={cx(table().footer, className)} />;
}

export interface TableRowProps extends TableRowOwnProps, Omit<ComponentPropsWithRef<'tr'>, keyof TableRowOwnProps> {}

/** A row. Body rows are at least 48px tall and highlight on hover. */
export function TableRow({ selected, className, ...rest }: TableRowProps) {
  // A Koi attribute rather than aria-selected, which is only valid on rows of a grid, not of a plain table.
  return <tr data-koi-selected={selected ? '' : undefined} {...rest} className={cx(table().row, className)} />;
}

export interface TableHeaderCellProps
  extends TableHeaderCellOwnProps<MouseEvent<HTMLButtonElement>>,
    Omit<ComponentPropsWithRef<'th'>, keyof TableHeaderCellOwnProps | 'align'> {}

const ARIA_SORT = { asc: 'ascending', desc: 'descending' } as const;

/** A column header (`<th scope="col">`). With `onSort` its label becomes a sort button. */
export function TableHeaderCell({ align, sort = false, onSort, className, children, ...rest }: TableHeaderCellProps) {
  const s = table({ align });
  const sortable = onSort != null;
  const Indicator = sort === 'asc' ? SortUpIcon : sort === 'desc' ? SortDownIcon : SortIcon;
  return (
    <th
      scope="col"
      aria-sort={sortable && sort ? ARIA_SORT[sort] : undefined}
      {...rest}
      className={cx(s.headerCell, className)}
    >
      {sortable ? (
        <button type="button" className={s.sortButton} onClick={onSort}>
          {children}
          <Indicator />
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export interface TableCellProps
  extends TableCellOwnProps,
    Omit<ComponentPropsWithRef<'td'>, keyof TableCellOwnProps | 'align'> {}

/** A body or footer cell. Buttons inside default to shape="rounded", the dense shape, as in Dialog footers. */
export function TableCell({ align, className, children, ...rest }: TableCellProps) {
  return (
    <td {...rest} className={cx(table({ align }).cell, className)}>
      <ShapeProvider shape="rounded">{children}</ShapeProvider>
    </td>
  );
}

export interface TableEmptyProps
  extends TableEmptyOwnProps,
    Omit<ComponentPropsWithRef<'td'>, keyof TableEmptyOwnProps> {}

/** A full-width "no data" row for an empty TableBody. */
export function TableEmpty({ colSpan, className, children, ...rest }: TableEmptyProps) {
  return (
    <tr>
      <td {...rest} colSpan={colSpan} className={cx(table().empty, className)}>
        <ShapeProvider shape="rounded">{children ?? strings.noData}</ShapeProvider>
      </td>
    </tr>
  );
}

export interface TableCaptionProps
  extends TableCaptionOwnProps,
    Omit<ComponentPropsWithRef<'caption'>, keyof TableCaptionOwnProps> {}

/** The table's accessible name, for screen readers only. Put it first inside Table. */
export function TableCaption({ className, ...rest }: TableCaptionProps) {
  return <caption {...rest} className={cx(table().caption, className)} />;
}
