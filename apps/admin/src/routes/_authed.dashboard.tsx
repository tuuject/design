import { Badge } from '@koi/react/badge';
import { Card } from '@koi/react/card';
import { DataTable, type DataTableColumn } from '@koi/react/data-table';
import { Skeleton } from '@koi/react/skeleton';
import { css } from '@koi/react/styled-system/css';
import { sizes } from '@koi/tokens/dimensions';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { AppLink } from '../components/AppLink';
import { ArrowRightIcon } from '../components/icons';
import { PageHeader } from '../components/PageHeader';
import { formatDateTime, formatMoney } from '../lib/format';
import { type DashboardStats, fetchRecentOrders, fetchStats, ORDER_STATUS, type Order } from '../mock/api';

export const Route = createFileRoute('/_authed/dashboard')({
  staticData: { title: '仪表盘' },
  component: DashboardPage,
});

const s = {
  statValue: css({ textStyle: 'heading-1', fontWeight: 'bold', color: 'text' }),
};

const statCards: Array<{ key: keyof DashboardStats; label: string; hint: string; format: (value: number) => string }> =
  [
    { key: 'todayOrders', label: '今日订单', hint: '自然日', format: (value) => String(value) },
    { key: 'pendingOrders', label: '待付款订单', hint: '等待用户付款', format: (value) => String(value) },
    { key: 'monthRevenue', label: '本月营收', hint: '不含已取消', format: formatMoney },
    { key: 'members', label: '注册用户', hint: '全部用户', format: (value) => value.toLocaleString('zh-CN') },
  ];

function DashboardPage() {
  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: fetchStats });
  const { data: recent } = useQuery({ queryKey: ['orders', 'recent', 5], queryFn: () => fetchRecentOrders(5) });

  const recentColumns: Array<DataTableColumn<Order>> = [
    { key: 'id', header: '订单号', width: 120, cell: (o) => o.id, skeleton: 'SO-24100' },
    { key: 'customer', header: '客户', width: 120, cell: (o) => o.customer, skeleton: '林晚照' },
    // No width: the product name takes the rest.
    { key: 'product', header: '商品', cell: (o) => o.product, skeleton: '锦鲤抱枕' },
    {
      key: 'amount',
      header: '金额',
      align: 'end',
      width: 120,
      cell: (o) => formatMoney(o.amount),
      skeleton: '¥199.00',
    },
    {
      key: 'status',
      header: '状态',
      width: 104,
      cell: (o) => <Badge tone={ORDER_STATUS[o.status].badge}>{ORDER_STATUS[o.status].label}</Badge>,
      skeleton: <Badge>已完成</Badge>,
    },
    {
      key: 'createdAt',
      header: '创建时间',
      width: 152,
      cell: (o) => formatDateTime(o.createdAt),
      skeleton: 'Oct 16, 14:30',
    },
  ];

  return (
    <div>
      <PageHeader title="仪表盘" description="Koi 商城的经营概览" />
      <div className={css({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4' })}>
        {statCards.map((card) => (
          <Card key={card.key}>
            <p className={css({ margin: '0', textStyle: 'small', color: 'text-muted' })}>{card.label}</p>
            <div className={css({ marginBlockStart: '1' })}>
              {stats ? (
                <span className={s.statValue}>{card.format(stats[card.key])}</span>
              ) : (
                <Skeleton>
                  <span className={s.statValue}>00,000.00</span>
                </Skeleton>
              )}
            </div>
            <p className={css({ margin: '0', marginBlockStart: '1', textStyle: 'small', color: 'text-muted' })}>
              {card.hint}
            </p>
          </Card>
        ))}
      </div>
      <Card
        title="最近订单"
        className={css({ marginBlockStart: '6' })}
        footer={
          <AppLink to="/orders">
            查看全部
            <ArrowRightIcon
              size={sizes['icon-sm']}
              className={css({
                // Panda's reset makes svg a block, which broke the arrow onto its own line inside the inline link.
                display: 'inline-block',
                verticalAlign: 'middle',
                marginInlineStart: '1',
              })}
            />
          </AppLink>
        }
      >
        <DataTable
          className={css({
            // Columns stop squeezing below this; the table's container scrolls sideways instead.
            minWidth: '640px',
          })}
          layout="fixed"
          columns={recentColumns}
          rows={recent ?? []}
          getRowKey={(o) => o.id}
          loading={!recent}
          skeletonRows={5}
        />
      </Card>
    </div>
  );
}
