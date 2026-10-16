import * as React from 'react';
import { css } from '@koi/react/styled-system/css';
import { Skeleton } from '@koi/react/skeleton';

export interface Column<T> {
  key: string;
  title: React.ReactNode;
  align?: 'left' | 'right';
  render: (row: T) => React.ReactNode;
  /** Placeholder shown in this column's cells while loading, sized like the real content. */
  skeleton?: React.ReactNode;
}

const s = {
  wrapper: css({ overflowX: 'auto' }),
  table: css({
    width: '100%',
    minWidth: '640px',
    borderCollapse: 'collapse',
    textStyle: 'body',
    '& tbody tr:hover > td': { bg: 'surface-muted' },
    // Body rows are at least 48px whatever the cells hold (text, a Badge, sm buttons), with the cells' 8px
    // padding kept for taller content. `height` on a row is its minimum in table layout; min-height is
    // ignored on table rows and cells.
    '& tbody tr': { height: 'token(spacing.12)' },
  }),
  th: css({
    textAlign: 'left',
    textStyle: 'small',
    color: 'text-muted',
    fontWeight: 'bold',
    paddingInline: '4',
    paddingBlock: '2',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'divider',
    whiteSpace: 'nowrap',
    '&[data-align=right]': { textAlign: 'right' },
  }),
  td: css({
    verticalAlign: 'middle',
    paddingInline: '4',
    paddingBlock: '2',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'divider',
    whiteSpace: 'nowrap',
    '&[data-align=right]': { textAlign: 'right' },
  }),
  empty: css({
    paddingBlock: '10',
    textAlign: 'center',
    color: 'text-muted',
  }),
};

interface DataTableProps<T> {
  // Named `cols`, not `columns`: the Panda extractor treats JSX attributes named after CSS
  // properties as style objects (a `columns` prop triggered nested_property warnings).
  cols: Array<Column<T>>;
  rows: T[];
  getRowId: (row: T) => React.Key;
  loading?: boolean;
  skeletonRows?: number;
  empty?: React.ReactNode;
}

/** A plain semantic table with hover rows, skeleton loading and an empty state. Template business UI. */
export function DataTable<T>({ cols, rows, getRowId, loading, skeletonRows = 5, empty }: DataTableProps<T>) {
  return (
    <div className={s.wrapper}>
      <table className={s.table}>
        <thead>
          <tr>
            {cols.map((col) => (
              <th key={col.key} className={s.th} data-align={col.align}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: skeletonRows }, (_, i) => (
                <tr key={i}>
                  {cols.map((col) => (
                    <td key={col.key} className={s.td} data-align={col.align}>
                      <Skeleton>{col.skeleton ?? '──────'}</Skeleton>
                    </td>
                  ))}
                </tr>
              ))
            : rows.length === 0
              ? (
                  <tr>
                    <td colSpan={cols.length} className={s.empty}>{empty ?? '暂无数据'}</td>
                  </tr>
                )
              : rows.map((row) => (
                  <tr key={getRowId(row)}>
                    {cols.map((col) => (
                      <td key={col.key} className={s.td} data-align={col.align}>{col.render(row)}</td>
                    ))}
                  </tr>
                ))}
        </tbody>
      </table>
    </div>
  );
}
