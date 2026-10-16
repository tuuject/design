import * as React from 'react';
import { css } from '@koi/react/styled-system/css';
import { createFileRoute } from '@tanstack/react-router';
import { Badge } from '@koi/react/badge';
import { Button } from '@koi/react/button';
import { Card } from '@koi/react/card';
import { DataTable, type DataTableColumn } from '@koi/react/data-table';
import { Dialog } from '@koi/react/dialog';
import { Input } from '@koi/react/input';
import { Pagination } from '@koi/react/pagination';
import { Select } from '@koi/react/select';
import { SearchIcon } from '@koi/react/icons';
import { useToast } from '@koi/react/toast';
import { PageHeader } from '../components/PageHeader';
import { deleteOrder, fetchOrders, ORDER_STATUS, type Order, type OrderPage, type OrderStatus } from '../mock/api';
import { formatDateTime, formatMoney } from '../lib/format';

const PAGE_SIZE = 8;

export const Route = createFileRoute('/_authed/orders')({
  staticData: { title: '订单管理' },
  validateSearch: (search: Record<string, unknown>) => {
    const rawPage = Number.parseInt(String(search.page ?? '1'), 10);
    return {
      // The list's state lives in the URL, so filtered views can be shared and refreshed.
      q: typeof search.q === 'string' && search.q.length > 0 ? search.q : undefined,
      status: typeof search.status === 'string' && search.status in ORDER_STATUS ? (search.status as OrderStatus) : undefined,
      page: Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1,
    };
  },
  component: OrdersPage,
});

const s = {
  card: css({ marginBlockStart: '6' }),
  // Columns stop squeezing below this; the table's container scrolls sideways instead.
  dataTable: css({ minWidth: '640px' }),
  head: css({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '3',
    padding: '4',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'divider',
  }),
  cardTitle: css({ margin: '0', textStyle: 'heading-3', fontWeight: 'bold', color: 'text' }),
  cardDesc: css({ margin: '0', marginBlockStart: '1', textStyle: 'small', color: 'text-muted' }),
  toolbar: css({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2' }),
  search: css({ width: '220px' }),
  status: css({ width: '140px' }),
  tableFooter: css({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '3',
    padding: '4',
  }),
  total: css({ textStyle: 'small', color: 'text-muted' }),
  // Pulls the last ghost button's padding back out, so its label lines up with the right-aligned header.
  rowActions: css({ display: 'flex', justifyContent: 'flex-end', gap: '1', marginInlineEnd: '-3' }),
  detail: css({ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2 6', margin: '0', textStyle: 'body' }),
  detailLabel: css({ color: 'text-muted', whiteSpace: 'nowrap' }),
  detailValue: css({ margin: '0' }),
};

function OrdersPage() {
  const { q, status, page } = Route.useSearch();
  const navigate = Route.useNavigate();
  const toast = useToast();

  const [keyword, setKeyword] = React.useState(q ?? '');
  const [data, setData] = React.useState<OrderPage | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [version, setVersion] = React.useState(0);
  // Open state is kept apart from the order a dialog shows: closing only flips `open`, so the old order
  // stays rendered while the dialog fades out instead of blanking first.
  const [detail, setDetail] = React.useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<Order | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const openDetail = (order: Order) => {
    setDetail(order);
    setDetailOpen(true);
  };
  const openDelete = (order: Order) => {
    setPendingDelete(order);
    // Reset here rather than after the request, so the button keeps its spinner through the fade-out.
    setDeleting(false);
    setDeleteOpen(true);
  };

  // Debounce the keyword into the URL (?q=), always landing on the first page.
  React.useEffect(() => {
    if (keyword === (q ?? '')) return;
    const timer = setTimeout(() => {
      navigate({ search: (prev) => ({ ...prev, q: keyword || undefined, page: 1 }), replace: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword, q, navigate]);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchOrders({ page, keyword: q, status }).then((next) => {
      if (!cancelled) {
        setData(next);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [q, status, page, version]);

  const resetFilters = () => {
    setKeyword('');
    navigate({ search: (prev) => ({ ...prev, q: undefined, status: undefined, page: 1 }), replace: true });
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    await deleteOrder(pendingDelete.id);
    setDeleteOpen(false);
    setVersion((v) => v + 1);
    toast.toast({ tone: 'success', title: '订单已删除' });
  };

  const orderColumns: Array<DataTableColumn<Order>> = [
    { key: 'id', header: '订单号', cell: (o) => o.id, skeleton: 'SO-24100' },
    { key: 'customer', header: '客户', cell: (o) => o.customer, skeleton: '林晚照' },
    { key: 'product', header: '商品', cell: (o) => o.product, skeleton: '锦鲤抱枕' },
    { key: 'amount', header: '金额', align: 'end', cell: (o) => formatMoney(o.amount), skeleton: '¥199.00' },
    {
      key: 'status',
      header: '状态',
      cell: (o) => <Badge tone={ORDER_STATUS[o.status].badge}>{ORDER_STATUS[o.status].label}</Badge>,
      skeleton: '已完成',
    },
    { key: 'createdAt', header: '创建时间', cell: (o) => formatDateTime(o.createdAt), skeleton: 'Oct 16, 14:30' },
    {
      key: 'actions',
      header: '操作',
      align: 'end',
      cell: (o) => (
        <span className={s.rowActions}>
          <Button size="sm" variant="ghost" color="secondary" onClick={() => openDetail(o)}>详情</Button>
          <Button size="sm" variant="ghost" color="error" onClick={() => openDelete(o)}>删除</Button>
        </span>
      ),
      skeleton: '详情 删除',
    },
  ];

  const pageCount = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

  return (
    <div>
      <PageHeader title="订单管理" description="搜索、筛选并处理商城订单" />
      <Card padding="none" className={s.card}>
        <div className={s.head}>
          <div>
            <h2 className={s.cardTitle}>订单列表</h2>
            <p className={s.cardDesc}>{data ? `共 ${data.total} 条订单` : '加载中……'}</p>
          </div>
          <div className={s.toolbar}>
            <Input
              size="sm"
              className={s.search}
              iconStart={<SearchIcon />}
              placeholder="搜索客户 / 订单号"
              aria-label="搜索订单"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Select
              size="sm"
              className={s.status}
              aria-label="按状态筛选"
              value={status ?? ''}
              onChange={(e) =>
                navigate({
                  search: (prev) => ({ ...prev, status: (e.target.value || undefined) as OrderStatus | undefined, page: 1 }),
                  replace: true,
                })
              }
              options={[
                { value: '', label: '全部状态' },
                ...Object.entries(ORDER_STATUS).map(([value, meta]) => ({ value, label: meta.label })),
              ]}
            />
            <Button size="sm" variant="ghost" color="secondary" onClick={resetFilters}>重置</Button>
          </div>
        </div>
        <DataTable
          className={s.dataTable}
          columns={orderColumns}
          rows={data?.items ?? []}
          getRowKey={(o) => o.id}
          loading={loading}
          skeletonRows={5}
          empty={<>没有找到匹配的订单，换个关键词或<Button variant="ghost" color="secondary" size="sm" onClick={resetFilters}>重置筛选</Button>试试。</>}
        />
        <div className={s.tableFooter}>
          <span className={s.total}>{data ? `第 ${page} / ${pageCount} 页` : ''}</span>
          <Pagination
            page={page}
            pageCount={pageCount}
            siblings={1}
            onChange={(next) => navigate({ search: (prev) => ({ ...prev, page: next }) })}
          />
        </div>
      </Card>

      <Dialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title={detail ? `订单 ${detail.id}` : undefined}
        size="sm"
        footer={<Button variant="ghost" color="secondary" onClick={() => setDetailOpen(false)}>关闭</Button>}
      >
        {detail ? (
          <dl className={s.detail}>
            <dt className={s.detailLabel}>客户</dt><dd className={s.detailValue}>{detail.customer}</dd>
            <dt className={s.detailLabel}>商品</dt><dd className={s.detailValue}>{detail.product}</dd>
            <dt className={s.detailLabel}>金额</dt><dd className={s.detailValue}>{formatMoney(detail.amount)}</dd>
            <dt className={s.detailLabel}>状态</dt>
            <dd className={s.detailValue}><Badge tone={ORDER_STATUS[detail.status].badge}>{ORDER_STATUS[detail.status].label}</Badge></dd>
            <dt className={s.detailLabel}>创建时间</dt><dd className={s.detailValue}>{formatDateTime(detail.createdAt)}</dd>
          </dl>
        ) : null}
      </Dialog>

      <Dialog
        role="alertdialog"
        hideClose
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="删除订单"
        description={pendingDelete ? `确定删除订单 ${pendingDelete.id}（${pendingDelete.customer}）吗？此操作不可撤销。` : undefined}
        footer={
          <>
            <Button variant="ghost" color="secondary" onClick={() => setDeleteOpen(false)}>取消</Button>
            <Button color="error" loading={deleting} onClick={confirmDelete}>删除</Button>
          </>
        }
      />
    </div>
  );
}
