import { Badge } from '@koi/react/badge';
import { Button, IconButton } from '@koi/react/button';
import { Dialog } from '@koi/react/dialog';
import { Input } from '@koi/react/input';
import { Pagination } from '@koi/react/pagination';
import { Select } from '@koi/react/select';
import { css } from '@koi/react/styled-system/css';
import { useToast } from '@koi/react/toast';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { type ChangeEvent, useRef, useState } from 'react';
import { DownloadIcon, EditIcon, PlusIcon, RefreshIcon, TrashIcon, UploadIcon } from '../components/icons';
import { OrderFormDialog } from '../components/orders/OrderFormDialog';
import { OrderSearchForm } from '../components/orders/OrderSearchForm';
import { OrderTable } from '../components/orders/OrderTable';
import { PageHeader } from '../components/PageHeader';
import { formatDateTimeFull, formatMoney } from '../lib/format';
import { ordersToCsv, parseOrderCsv } from '../lib/order-csv';
import {
  EMPTY_ORDER_FILTERS,
  type OrderFilterFields,
  orderFilterFields,
  orderFiltersToQuery,
  orderFiltersToSearch,
} from '../lib/order-filters';
import {
  createOrder,
  deleteOrders,
  fetchAllOrders,
  fetchOrders,
  importOrders,
  ORDER_STATUS,
  type Order,
  type OrderDraft,
  type OrderStatus,
  updateOrder,
} from '../mock/api';

const PAGE_SIZES = [10, 20, 50] as const;
type PageSize = (typeof PAGE_SIZES)[number];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_IMPORT_BYTES = 2 * 1024 * 1024;

interface OrdersSearch {
  id?: string;
  customer?: string;
  status?: OrderStatus;
  from?: string;
  to?: string;
  page: number;
  pageSize: PageSize;
}

const readText = (value: unknown) => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const text = value.trim();
  return text.length > 0 ? text : undefined;
};

export const Route = createFileRoute('/_authed/orders')({
  staticData: { title: '订单管理' },
  validateSearch: (search: Record<string, unknown>): OrdersSearch => {
    const rawPage = Number.parseInt(String(search.page ?? '1'), 10);
    const rawPageSize = Number.parseInt(String(search.pageSize ?? PAGE_SIZES[0]), 10);
    const status = readText(search.status);
    const from = readText(search.from);
    const to = readText(search.to);
    return {
      // Filters and paging live in the URL, so a filtered view can be shared, refreshed and walked with Back.
      id: readText(search.id),
      customer: readText(search.customer),
      status: status && Object.hasOwn(ORDER_STATUS, status) ? (status as OrderStatus) : undefined,
      from: from && DATE_RE.test(from) && !Number.isNaN(new Date(`${from}T00:00:00`).getTime()) ? from : undefined,
      to: to && DATE_RE.test(to) && !Number.isNaN(new Date(`${to}T00:00:00`).getTime()) ? to : undefined,
      page: Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1,
      pageSize: PAGE_SIZES.includes(rawPageSize as PageSize) ? (rawPageSize as PageSize) : PAGE_SIZES[0],
    };
  },
  component: OrdersPage,
});

const s = {
  detailLabel: css({ color: 'text-muted', whiteSpace: 'nowrap' }),
  detailValue: css({ margin: '0' }),
};

function OrdersPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const filters = orderFilterFields(search);
  const apiFilters = orderFiltersToQuery(filters);
  const query = { page: search.page, pageSize: search.pageSize, ...apiFilters };
  const { data, isPending, isPlaceholderData, isFetching, refetch } = useQuery({
    queryKey: ['orders', 'list', query],
    queryFn: () => fetchOrders(query),
    // Keep the last page on screen while the next one loads, so the count and pager don't blank out.
    placeholderData: keepPreviousData,
  });
  // Skeleton only while showing a different query's rows; background refetches (focus, after a write) stay quiet.
  const loading = isPending || isPlaceholderData;
  const rows = data?.items ?? [];
  const pageCount = data ? Math.max(1, Math.ceil(data.total / search.pageSize)) : 1;

  // Selection is page-local in practice: actions only ever see IDs still present in `rows`.
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(() => new Set());
  const selectedOrders = rows.filter((order) => selectedIds.has(order.id));
  const editingSelection = selectedOrders.length === 1 ? selectedOrders[0] : null;

  const [detail, setDetail] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [deleteTargets, setDeleteTargets] = useState<Order[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const invalidateOrderData = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['orders'] }),
      queryClient.invalidateQueries({ queryKey: ['stats'] }),
    ]);

  const clearSelection = () => setSelectedIds(new Set());

  const openDetail = (order: Order) => {
    setDetail(order);
    setDetailOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    setFormKey((key) => key + 1);
    setFormOpen(true);
  };

  const openEdit = (order: Order) => {
    setEditing(order);
    setFormKey((key) => key + 1);
    setFormOpen(true);
  };

  const openDelete = (targets: Order[]) => {
    if (targets.length === 0) {
      return;
    }
    setDeleteTargets(targets);
    // Reset here rather than after the request, so the button keeps its spinner through the fade-out.
    setDeleting(false);
    setDeleteOpen(true);
  };

  const toggleRow = (id: string, checked: boolean) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const toggleAll = (checked: boolean) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      for (const order of rows) {
        if (checked) {
          next.add(order.id);
        } else {
          next.delete(order.id);
        }
      }
      return next;
    });
  };

  const applyFilters = (next: OrderFilterFields) => {
    clearSelection();
    navigate({
      search: (previous) => ({ ...previous, ...orderFiltersToSearch(next), page: 1 }),
      replace: true,
    });
  };

  const resetFilters = () => applyFilters(EMPTY_ORDER_FILTERS);

  const goPage = (next: number) => {
    clearSelection();
    navigate({ search: (previous) => ({ ...previous, page: next }) });
  };

  const changePageSize = (next: PageSize) => {
    clearSelection();
    navigate({ search: (previous) => ({ ...previous, pageSize: next, page: 1 }), replace: true });
  };

  const saveOrder = async (values: OrderDraft) => {
    try {
      if (editing) {
        await updateOrder(editing.id, values);
      } else {
        await createOrder(values);
      }
      await invalidateOrderData();
      setFormOpen(false);
      toast.toast({ tone: 'success', title: editing ? '订单已更新' : '订单已创建' });
    } catch (error) {
      toast.toast({
        tone: 'error',
        title: '保存失败',
        description: error instanceof Error ? error.message : '请稍后再试。',
      });
    }
  };

  const confirmDelete = async () => {
    if (deleteTargets.length === 0) {
      return;
    }
    setDeleting(true);
    const ids = deleteTargets.map((order) => order.id);
    try {
      await deleteOrders(ids);
      setSelectedIds((previous) => {
        const next = new Set(previous);
        for (const id of ids) {
          next.delete(id);
        }
        return next;
      });
      await invalidateOrderData();
      // Deleting the last rows of the last page would leave the pager past its end.
      if (rows.length - ids.length <= 0 && search.page > 1) {
        navigate({ search: (previous) => ({ ...previous, page: search.page - 1 }), replace: true });
      }
      setDeleteOpen(false);
      toast.toast({ tone: 'success', title: ids.length > 1 ? `已删除 ${ids.length} 个订单` : '订单已删除' });
    } catch (error) {
      setDeleting(false);
      toast.toast({
        tone: 'error',
        title: '删除失败',
        description: error instanceof Error ? error.message : '请稍后再试。',
      });
    }
  };

  const importCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Clear first, so picking the same file again still fires a change event.
    event.target.value = '';
    if (!file) {
      return;
    }
    if (file.size > MAX_IMPORT_BYTES) {
      toast.toast({ tone: 'error', title: '文件太大', description: '请选择 2MB 以内的 CSV 文件。' });
      return;
    }
    setImporting(true);
    try {
      const parsed = parseOrderCsv(await file.text());
      if (parsed.rows.length === 0) {
        toast.toast({
          tone: 'error',
          title: '导入失败',
          description: parsed.errors[0] ?? '文件里没有可导入的订单。',
        });
        return;
      }
      const result = await importOrders(parsed.rows);
      await invalidateOrderData();
      clearSelection();
      const summary = `新增 ${result.inserted} 条，更新 ${result.updated} 条。`;
      toast.toast({
        tone: parsed.errors.length > 0 ? 'warning' : 'success',
        title: '导入完成',
        description:
          parsed.errors.length > 0 ? `${summary} 跳过 ${parsed.errors.length} 行：${parsed.errors[0]}` : summary,
      });
    } catch (error) {
      toast.toast({
        tone: 'error',
        title: '导入失败',
        description: error instanceof Error ? error.message : '请检查文件格式。',
      });
    } finally {
      setImporting(false);
    }
  };

  const exportCsv = async () => {
    setExporting(true);
    try {
      const all = await fetchAllOrders(apiFilters);
      if (all.length === 0) {
        toast.toast({ tone: 'warning', title: '没有可导出的订单' });
        return;
      }
      const url = URL.createObjectURL(new Blob([ordersToCsv(all)], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `orders-${formatDateTimeFull(Date.now()).slice(0, 10)}.csv`;
      link.style.display = 'none';
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 0);
      toast.toast({ tone: 'success', title: `已导出 ${all.length} 条订单` });
    } catch (error) {
      toast.toast({
        tone: 'error',
        title: '导出失败',
        description: error instanceof Error ? error.message : '请稍后再试。',
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <PageHeader title="订单管理" description="筛选、创建、修改、删除并导入导出商城订单" />
      <OrderSearchForm value={filters} onSearch={applyFilters} onReset={resetFilters} />
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '3',
          marginBlockStart: '5',
        })}
      >
        <div className={css({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2' })}>
          <Button variant="outline" iconStart={<PlusIcon />} onClick={openCreate}>
            新增
          </Button>
          <Button
            variant="outline"
            color="secondary"
            iconStart={<EditIcon />}
            disabled={loading || !editingSelection}
            onClick={() => editingSelection && openEdit(editingSelection)}
          >
            修改
          </Button>
          <Button
            variant="outline"
            color="error"
            iconStart={<TrashIcon />}
            disabled={loading || selectedOrders.length === 0}
            onClick={() => openDelete(selectedOrders)}
          >
            删除
          </Button>
          <Button
            variant="outline"
            color="secondary"
            iconStart={<UploadIcon />}
            loading={importing}
            onClick={() => fileInput.current?.click()}
          >
            导入
          </Button>
          <Button
            variant="outline"
            color="secondary"
            iconStart={<DownloadIcon />}
            loading={exporting}
            disabled={data?.total === 0}
            onClick={exportCsv}
          >
            导出
          </Button>
          <input ref={fileInput} type="file" accept=".csv,text/csv" hidden onChange={importCsv} />
        </div>
        <div className={css({ display: 'flex', alignItems: 'center', gap: '3' })}>
          {selectedOrders.length > 0 ? (
            <span className={css({ textStyle: 'small', color: 'text-muted' })}>已选 {selectedOrders.length} 条</span>
          ) : null}
          <IconButton
            label="刷新列表"
            icon={<RefreshIcon />}
            disabled={isFetching}
            onClick={() => {
              clearSelection();
              void refetch();
            }}
          />
        </div>
      </div>
      <div className={css({ marginBlockStart: '5' })}>
        <OrderTable
          rows={rows}
          loading={loading}
          skeletonRows={search.pageSize}
          selectedIds={selectedIds}
          onToggleRow={toggleRow}
          onToggleAll={toggleAll}
          onDetail={openDetail}
          onEdit={openEdit}
          onDelete={(order) => openDelete([order])}
          empty={
            <>
              没有找到匹配的订单，换个条件或
              <Button variant="ghost" color="secondary" size="sm" onClick={resetFilters}>
                重置筛选
              </Button>
              试试。
            </>
          }
        />
        <div
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '3',
            padding: '4',
          })}
        >
          <div className={css({ display: 'flex', alignItems: 'center', gap: '3' })}>
            <span className={css({ textStyle: 'small', color: 'text-muted' })}>
              {data ? `共 ${data.total} 条` : '加载中……'}
            </span>
            <Select
              aria-label="每页条数"
              className={css({ width: 'auto', minWidth: 'control-lg', flex: 'none' })}
              value={String(search.pageSize)}
              onChange={(event) => changePageSize(Number(event.target.value) as PageSize)}
              options={PAGE_SIZES.map((size) => ({ value: String(size), label: `${size}条/页` }))}
            />
          </div>
          <div className={css({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3' })}>
            <Pagination variant="compact" page={search.page} pageCount={pageCount} siblings={1} onChange={goPage} />
            <form
              className={css({ display: 'flex', alignItems: 'center', gap: '2' })}
              onSubmit={(event) => {
                event.preventDefault();
                const value = Number(new FormData(event.currentTarget).get('page'));
                if (Number.isFinite(value)) {
                  goPage(Math.min(Math.max(Math.trunc(value), 1), pageCount));
                }
              }}
            >
              <span className={css({ textStyle: 'small', color: 'text-muted' })}>前往</span>
              <Input
                key={search.page}
                name="page"
                type="number"
                inputMode="numeric"
                min={1}
                max={pageCount}
                defaultValue={search.page}
                aria-label="跳转到页码"
                className={css({ width: 'control-lg', flex: 'none' })}
              />
              <span className={css({ textStyle: 'small', color: 'text-muted' })}>页</span>
            </form>
          </div>
        </div>
      </div>

      <OrderFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        order={editing}
        formKey={formKey}
        onSubmit={saveOrder}
      />

      <Dialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title={detail ? `订单 ${detail.id}` : undefined}
        size="sm"
        footer={
          <Button variant="ghost" color="secondary" onClick={() => setDetailOpen(false)}>
            关闭
          </Button>
        }
      >
        {detail ? (
          <dl
            className={css({
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '2 6',
              margin: '0',
              textStyle: 'body',
            })}
          >
            <dt className={s.detailLabel}>客户</dt>
            <dd className={s.detailValue}>{detail.customer}</dd>
            <dt className={s.detailLabel}>商品</dt>
            <dd className={s.detailValue}>{detail.product}</dd>
            <dt className={s.detailLabel}>金额</dt>
            <dd className={s.detailValue}>{formatMoney(detail.amount)}</dd>
            <dt className={s.detailLabel}>状态</dt>
            <dd className={s.detailValue}>
              <Badge tone={ORDER_STATUS[detail.status].badge}>{ORDER_STATUS[detail.status].label}</Badge>
            </dd>
            <dt className={s.detailLabel}>创建时间</dt>
            <dd className={s.detailValue}>{formatDateTimeFull(detail.createdAt)}</dd>
          </dl>
        ) : null}
      </Dialog>

      <Dialog
        role="alertdialog"
        hideClose
        open={deleteOpen}
        onOpenChange={(next) => {
          if (!next && deleting) {
            return;
          }
          setDeleteOpen(next);
        }}
        title={deleteTargets.length > 1 ? `删除 ${deleteTargets.length} 个订单` : '删除订单'}
        description={
          deleteTargets.length === 1
            ? `确定删除订单 ${deleteTargets[0].id}（${deleteTargets[0].customer}）吗？此操作不可撤销。`
            : `确定删除选中的 ${deleteTargets.length} 个订单吗？此操作不可撤销。`
        }
        footer={
          <>
            <Button variant="ghost" color="secondary" disabled={deleting} onClick={() => setDeleteOpen(false)}>
              取消
            </Button>
            <Button color="error" loading={deleting} onClick={confirmDelete}>
              删除
            </Button>
          </>
        }
      />
    </div>
  );
}
