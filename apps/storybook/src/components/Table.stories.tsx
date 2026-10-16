import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  createColumnHelper,
  createSortedRowModel,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  DataTable,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableFooter,
  TableHeader,
  TableHeaderCell,
  TableRow,
  type DataTableColumn,
  type TableAlign,
  type TableSortDirection,
} from '@koi/react';
import { css } from '@koi/react/styled-system/css';

interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'pending' | 'shipped' | 'completed';
  createdAt: string;
}

const STATUS = {
  pending: { label: '待付款', tone: 'warning' },
  shipped: { label: '已发货', tone: 'primary' },
  completed: { label: '已完成', tone: 'neutral' },
} as const;

const orders: Order[] = [
  { id: 'SO-24127', customer: '沈鱼', product: '云养锦鲤月卡', amount: 51.65, status: 'completed', createdAt: 'Oct 15, 11:29' },
  { id: 'SO-24116', customer: '顾青崖', product: 'Koi 主题授权', amount: 313.1, status: 'shipped', createdAt: 'Oct 15, 07:43' },
  { id: 'SO-24112', customer: '苏折枝', product: '透明玻璃杯', amount: 75.86, status: 'pending', createdAt: 'Oct 15, 07:03' },
  { id: 'SO-24108', customer: '闻人语', product: '毛绒挂件', amount: 35.42, status: 'completed', createdAt: 'Oct 15, 00:10' },
  { id: 'SO-24145', customer: '陆知遥', product: '折叠露营椅', amount: 280.63, status: 'shipped', createdAt: 'Oct 14, 03:23' },
];

const money = (n: number) => `¥${n.toFixed(2)}`;
const status = (o: Order) => <Badge tone={STATUS[o.status].tone}>{STATUS[o.status].label}</Badge>;

// Wide enough for the columns; narrower containers scroll the table sideways.
const frame = css({ width: '[760px]', maxWidth: '100%' });
const wide = css({ minWidth: '[640px]' });
const selectCell = css({ width: '[1px]', paddingInlineEnd: '0' });
const summary = css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '3', minHeight: 'control-lg', px: '4', py: '2', textStyle: 'small', color: 'text-muted' });

const columns: Array<DataTableColumn<Order>> = [
  { key: 'id', header: '订单号', cell: (o) => o.id, skeleton: 'SO-24100' },
  { key: 'customer', header: '客户', cell: (o) => o.customer, skeleton: '林晚照' },
  { key: 'product', header: '商品', cell: (o) => o.product, skeleton: '锦鲤抱枕' },
  { key: 'amount', header: '金额', align: 'end', cell: (o) => money(o.amount), skeleton: '¥199.00' },
  { key: 'status', header: '状态', cell: status, skeleton: '已完成' },
  { key: 'createdAt', header: '创建时间', cell: (o) => o.createdAt, skeleton: 'Oct 16, 14:30' },
];

const meta = {
  title: 'Components/Table',
  component: DataTable<Order>,
  args: { columns, rows: orders, getRowKey: (o) => o.id, loading: false, skeletonRows: 5, caption: '订单列表', className: wide },
  argTypes: {
    columns: { control: false },
    rows: { control: false },
    getRowKey: { control: false },
    empty: { control: 'text' },
  },
  decorators: [(Story) => <div className={frame}><Card padding="none"><Story /></Card></div>],
} satisfies Meta<typeof DataTable<Order>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** DataTable: columns and rows in, a finished table out. Each column's `skeleton` sizes its loading placeholder. */
export const Playground: Story = {};

export const Loading: Story = { args: { loading: true } };

const fixedColumns: Array<DataTableColumn<Order>> = columns.map((c) => ({
  ...c,
  // The product name takes what's left; every other column has a width.
  width: ({ id: 120, customer: 104, amount: 112, status: 96, createdAt: 136 } as Record<string, number | undefined>)[c.key],
  skeleton: c.key === 'status' ? <Badge>已完成</Badge> : c.skeleton,
}));

/**
 * `layout="fixed"` with column widths: the columns keep their widths whatever the cells hold, so nothing moves when
 * the skeletons turn into rows. Toggle `loading` to compare.
 */
export const FixedLayout: Story = {
  name: 'Fixed layout',
  args: { columns: fixedColumns, layout: 'fixed' },
};

export const FixedLayoutLoading: Story = {
  name: 'Fixed layout, loading',
  args: { columns: fixedColumns, layout: 'fixed', loading: true },
};

export const Empty: Story = { args: { rows: [], empty: '没有找到匹配的订单，换个关键词试试。' } };

type SortKey = 'customer' | 'amount';

/**
 * The parts, composed by hand: a sortable header (`sort` + `onSort`), end-aligned numbers, a selected row and a
 * footer row. Every part takes its element's native attributes.
 */
export const Parts: Story = {
  render: () => {
    const [sort, setSort] = React.useState<{ key: SortKey; dir: 'asc' | 'desc' } | null>({ key: 'amount', dir: 'desc' });
    const sortOf = (key: SortKey): TableSortDirection => (sort?.key === key ? sort.dir : false);
    // asc → desc → unsorted, the cycle TanStack Table uses by default.
    const toggle = (key: SortKey) => setSort((s) => (s?.key !== key ? { key, dir: 'asc' } : s.dir === 'asc' ? { key, dir: 'desc' } : null));
    const rows = sort
      ? [...orders].sort((a, b) => {
          const d = sort.key === 'amount' ? a.amount - b.amount : a.customer.localeCompare(b.customer, 'zh');
          return sort.dir === 'asc' ? d : -d;
        })
      : orders;
    return (
      <Table className={wide}>
        <TableCaption>订单列表</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>订单号</TableHeaderCell>
            <TableHeaderCell sort={sortOf('customer')} onSort={() => toggle('customer')}>客户</TableHeaderCell>
            <TableHeaderCell>商品</TableHeaderCell>
            <TableHeaderCell align="end" sort={sortOf('amount')} onSort={() => toggle('amount')}>金额</TableHeaderCell>
            <TableHeaderCell>状态</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((o) => (
            <TableRow key={o.id} selected={o.id === 'SO-24127'}>
              <TableCell>{o.id}</TableCell>
              <TableCell>{o.customer}</TableCell>
              <TableCell>{o.product}</TableCell>
              <TableCell align="end">{money(o.amount)}</TableCell>
              <TableCell>{status(o)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>合计</TableCell>
            <TableCell align="end">{money(orders.reduce((n, o) => n + o.amount, 0))}</TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    );
  },
};

/** TableEmpty spans the columns of an empty body. */
export const PartsEmpty: Story = {
  name: 'Parts, empty',
  render: () => (
    <Table className={wide}>
      <TableHeader>
        <TableRow>
          {columns.map((c) => <TableHeaderCell key={c.key} align={c.align}>{c.header}</TableHeaderCell>)}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableEmpty colSpan={columns.length} />
      </TableBody>
    </Table>
  ),
};

// TanStack Table v9: the feature registry, columns and helper live at module scope so they stay stable.
const features = tableFeatures({
  rowSortingFeature,
  rowSelectionFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
});
const helper = createColumnHelper<typeof features, Order>();
const tanstackColumns = helper.columns([
  helper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        aria-label="选择全部订单"
        checked={table.getIsAllRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllRowsSelected(checked)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`选择订单 ${row.original.id}`}
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
      />
    ),
  }),
  helper.accessor('id', { header: '订单号', enableSorting: false }),
  helper.accessor('customer', { header: '客户' }),
  helper.accessor('product', { header: '商品', enableSorting: false }),
  helper.accessor('amount', { header: '金额', cell: (info) => money(info.getValue()) }),
  helper.accessor('status', { header: '状态', enableSorting: false, cell: (info) => status(info.row.original) }),
]);
const ALIGN: Partial<Record<string, TableAlign>> = { amount: 'end' };

/**
 * TanStack Table drives the parts directly: `column.getIsSorted()` goes to `sort`, `column.getToggleSortingHandler()`
 * to `onSort` and `row.getIsSelected()` to `selected`. v9 hands out a sorting handler even for columns that can't
 * sort, so gate it on `column.getCanSort()`; without `onSort` the header stays plain.
 */
export const WithTanStackTable: Story = {
  name: 'With TanStack Table',
  render: () => {
    const table = useTable({ features, columns: tanstackColumns, data: orders, getRowId: (o) => o.id });
    const selected = table.getSelectedRowModel().rows.length;
    return (
      <>
        <Table className={wide}>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHeaderCell
                    key={header.id}
                    align={ALIGN[header.column.id]}
                    sort={header.column.getIsSorted()}
                    onSort={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                    className={header.column.id === 'select' ? selectCell : undefined}
                  >
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHeaderCell>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} selected={row.getIsSelected()}>
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id} align={ALIGN[cell.column.id]} className={cell.column.id === 'select' ? selectCell : undefined}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className={summary}>
          {selected ? `已选择 ${selected} 条订单` : '勾选订单可以批量处理'}
          {selected ? <Button size="sm" variant="ghost" color="secondary" onClick={() => table.resetRowSelection()}>取消选择</Button> : null}
        </div>
      </>
    );
  },
};

/** Row actions are `sm` ghost Buttons with no gap; cells make them rounded, the dense shape. */
export const WithRowActions: Story = {
  name: 'With row actions',
  args: {
    columns: [
      ...columns.slice(0, 4),
      {
        key: 'actions',
        header: '操作',
        align: 'end',
        cell: () => (
          <span className={css({ display: 'inline-flex', marginInlineEnd: '-2' })}>
            <Button size="sm" variant="ghost" color="secondary">详情</Button>
            <Button size="sm" variant="ghost" color="error">删除</Button>
          </span>
        ),
      },
    ],
  },
};
