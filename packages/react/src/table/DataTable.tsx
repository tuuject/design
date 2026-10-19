import type { DataTableOwnProps } from '@koi/core';
import { table } from '@koi/react/styled-system/recipes';
import type { ComponentPropsWithRef } from 'react';
import { Skeleton } from '../skeleton/Skeleton';
import { Table, TableBody, TableCaption, TableCell, TableEmpty, TableHeader, TableHeaderCell, TableRow } from './Table';

export type { DataTableColumn } from '@koi/core';

export interface DataTableProps<T>
  extends DataTableOwnProps<T>,
    Omit<ComponentPropsWithRef<'table'>, keyof DataTableOwnProps<T> | 'children'> {
  /** Class for the scrolling container around the table. */
  containerClassName?: string;
}

/**
 * A ready-made table from `columns` and `rows`, with skeleton loading and an empty state. Built from the Table
 * parts; for sorting, selection or a table library such as TanStack Table, compose those parts directly.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  loading,
  skeletonRows = 5,
  empty,
  caption,
  ...rest
}: DataTableProps<T>) {
  const s = table();
  return (
    <Table {...rest} aria-busy={loading || undefined}>
      {caption != null ? <TableCaption>{caption}</TableCaption> : null}
      {columns.some((col) => col.width != null) ? (
        <colgroup>
          {columns.map((col) => (
            <col key={col.key} style={col.width != null ? { width: col.width } : undefined} />
          ))}
        </colgroup>
      ) : null}
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHeaderCell key={col.key} align={col.align}>
              {col.header}
            </TableHeaderCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: skeletonRows }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows never reorder
            <TableRow key={i}>
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align}>
                  {/* A sample value, invisible, sizes the bar like the real content. */}
                  <Skeleton as="span" className={s.skeleton}>
                    {col.skeleton ?? '──────'}
                  </Skeleton>
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : rows.length === 0 ? (
          <TableEmpty colSpan={columns.length}>{empty}</TableEmpty>
        ) : (
          rows.map((row, i) => (
            <TableRow key={getRowKey(row, i)}>
              {columns.map((col) => (
                <TableCell key={col.key} align={col.align}>
                  {col.cell(row, i)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
