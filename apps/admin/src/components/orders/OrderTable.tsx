import { Badge } from '@koi/react/badge';
import { Button } from '@koi/react/button';
import { Checkbox } from '@koi/react/checkbox';
import { Skeleton } from '@koi/react/skeleton';
import { css } from '@koi/react/styled-system/css';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@koi/react/table';
import type { ReactNode } from 'react';
import { formatDateTimeFull, formatMoney } from '../../lib/format';
import { ORDER_STATUS, type Order } from '../../mock/api';

const s = {
  skeleton: css({ display: 'inline-block', maxWidth: '100%', verticalAlign: 'middle', borderRadius: 'sm' }),
};

const checkboxSkeleton = css({ width: '4', height: '4', borderRadius: 'sm' });

interface OrderTableProps {
  rows: readonly Order[];
  loading: boolean;
  skeletonRows: number;
  selectedIds: ReadonlySet<string>;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onDetail: (order: Order) => void;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
  empty?: ReactNode;
}

/** The Table parts rather than DataTable: the list needs selection, which DataTable deliberately leaves out. */
export function OrderTable({
  rows,
  loading,
  skeletonRows,
  selectedIds,
  onToggleRow,
  onToggleAll,
  onDetail,
  onEdit,
  onDelete,
  empty,
}: OrderTableProps) {
  const allSelected = rows.length > 0 && rows.every((order) => selectedIds.has(order.id));

  return (
    <Table
      aria-busy={loading || undefined}
      layout="fixed"
      className={css({
        // Columns stop squeezing below this; the table's container scrolls sideways instead.
        minWidth: '980px',
      })}
    >
      <TableCaption>订单列表</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHeaderCell align="center" style={{ width: 48 }}>
            <Checkbox
              checked={allSelected}
              disabled={loading}
              onCheckedChange={(checked) => onToggleAll(checked)}
              aria-label="全选本页订单"
            />
          </TableHeaderCell>
          <TableHeaderCell style={{ width: 120 }}>订单号</TableHeaderCell>
          {/* 客户 and 商品 have no width, so they split the spare room instead of it pooling into one wide gap. */}
          <TableHeaderCell>客户</TableHeaderCell>
          <TableHeaderCell>商品</TableHeaderCell>
          <TableHeaderCell align="end" style={{ width: 112 }}>
            金额
          </TableHeaderCell>
          <TableHeaderCell align="center" style={{ width: 96 }}>
            状态
          </TableHeaderCell>
          <TableHeaderCell style={{ width: 184 }}>创建时间</TableHeaderCell>
          <TableHeaderCell align="end" style={{ width: 176 }}>
            操作
          </TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: skeletonRows }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static placeholder rows never reorder
            <TableRow key={i}>
              <TableCell align="center">
                <Skeleton className={checkboxSkeleton} />
              </TableCell>
              <TableCell>
                <Skeleton as="span" className={s.skeleton}>
                  SO-24100
                </Skeleton>
              </TableCell>
              <TableCell>
                <Skeleton as="span" className={s.skeleton}>
                  林晚照
                </Skeleton>
              </TableCell>
              <TableCell>
                <Skeleton as="span" className={s.skeleton}>
                  锦鲤抱枕
                </Skeleton>
              </TableCell>
              <TableCell align="end">
                <Skeleton as="span" className={s.skeleton}>
                  ¥199.00
                </Skeleton>
              </TableCell>
              <TableCell align="center">
                <Skeleton as="span" className={s.skeleton}>
                  <Badge>已完成</Badge>
                </Skeleton>
              </TableCell>
              <TableCell>
                <Skeleton as="span" className={s.skeleton}>
                  2026-01-18 10:58:15
                </Skeleton>
              </TableCell>
              <TableCell align="end">
                <Skeleton as="span" className={s.skeleton}>
                  详情 修改 删除
                </Skeleton>
              </TableCell>
            </TableRow>
          ))
        ) : rows.length === 0 ? (
          <TableEmpty colSpan={8}>{empty}</TableEmpty>
        ) : (
          rows.map((order) => (
            <TableRow key={order.id} selected={selectedIds.has(order.id)}>
              <TableCell align="center">
                <Checkbox
                  checked={selectedIds.has(order.id)}
                  onCheckedChange={(checked) => onToggleRow(order.id, checked)}
                  aria-label={`选择订单 ${order.id}`}
                />
              </TableCell>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.product}</TableCell>
              <TableCell align="end">{formatMoney(order.amount)}</TableCell>
              <TableCell align="center">
                <Badge tone={ORDER_STATUS[order.status].badge}>{ORDER_STATUS[order.status].label}</Badge>
              </TableCell>
              <TableCell>{formatDateTimeFull(order.createdAt)}</TableCell>
              <TableCell align="end">
                <span
                  className={css({
                    // No gap between the rounded actions; -2 pulls the last one's 8px side back out, so its label
                    // lines up with the right-aligned header.
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginInlineEnd: '-2',
                  })}
                >
                  <Button size="sm" variant="ghost" color="secondary" onClick={() => onDetail(order)}>
                    详情
                  </Button>
                  <Button size="sm" variant="ghost" color="secondary" onClick={() => onEdit(order)}>
                    修改
                  </Button>
                  <Button size="sm" variant="ghost" color="error" onClick={() => onDelete(order)}>
                    删除
                  </Button>
                </span>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
