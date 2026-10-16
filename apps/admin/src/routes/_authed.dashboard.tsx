import * as React from 'react';
import { css } from '@koi/react/styled-system/css';
import { createFileRoute } from '@tanstack/react-router';
import { Badge } from '@koi/react/badge';
import { Card } from '@koi/react/card';
import { Skeleton } from '@koi/react/skeleton';
import { DataTable, type Column } from '../components/DataTable';
import { PageHeader } from '../components/PageHeader';
import { AppLink } from '../components/AppLink';
import { ArrowRightIcon } from '../components/icons';
import { fetchRecentOrders, fetchStats, ORDER_STATUS, type DashboardStats, type Order } from '../mock/api';
import { formatDateTime, formatMoney } from '../lib/format';
import { sizes } from '@koi/tokens/dimensions';

export const Route = createFileRoute('/_authed/dashboard')({
  staticData: { title: '仪表盘' },
  component: DashboardPage,
});

const s = {
  stats: css({ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4' }),
  statLabel: css({ margin: '0', textStyle: 'small', color: 'text-muted' }),
  statValue: css({ textStyle: 'heading-1', fontWeight: 'bold', color: 'text' }),
  statValueRow: css({ marginBlockStart: '1' }),
  statHint: css({ margin: '0', marginBlockStart: '1', textStyle: 'small', color: 'text-muted' }),
  recent: css({ marginBlockStart: '6' }),
};

const statCards: Array<{ key: keyof DashboardStats; label: string; hint: string; format: (value: number) => string }> = [
  { key: 'todayOrders', label: '今日订单', hint: '自然日', format: (value) => String(value) },
  { key: 'pendingOrders', label: '待付款订单', hint: '等待用户付款', format: (value) => String(value) },
  { key: 'monthRevenue', label: '本月营收', hint: '不含已取消', format: formatMoney },
  { key: 'members', label: '注册用户', hint: '全部用户', format: (value) => value.toLocaleString('zh-CN') },
];

function DashboardPage() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [recent, setRecent] = React.useState<Order[] | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    Promise.all([fetchStats(), fetchRecentOrders(5)]).then(([nextStats, nextRecent]) => {
      if (!cancelled) {
        setStats(nextStats);
        setRecent(nextRecent);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const recentColumns: Array<Column<Order>> = [
    { key: 'id', title: '订单号', render: (o) => o.id, skeleton: 'SO-24100' },
    { key: 'customer', title: '客户', render: (o) => o.customer, skeleton: '林晚照' },
    { key: 'product', title: '商品', render: (o) => o.product, skeleton: '锦鲤抱枕' },
    { key: 'amount', title: '金额', align: 'right', render: (o) => formatMoney(o.amount), skeleton: '¥199.00' },
    {
      key: 'status',
      title: '状态',
      render: (o) => <Badge tone={ORDER_STATUS[o.status].badge}>{ORDER_STATUS[o.status].label}</Badge>,
      skeleton: '已完成',
    },
    { key: 'createdAt', title: '创建时间', render: (o) => formatDateTime(o.createdAt), skeleton: 'Oct 16, 14:30' },
  ];

  return (
    <div>
      <PageHeader title="仪表盘" description="Koi 商城的经营概览" />
      <div className={s.stats}>
        {statCards.map((card) => (
          <Card key={card.key}>
            <p className={s.statLabel}>{card.label}</p>
            <div className={s.statValueRow}>
              {stats ? (
                <span className={s.statValue}>{card.format(stats[card.key])}</span>
              ) : (
                <Skeleton><span className={s.statValue}>00,000.00</span></Skeleton>
              )}
            </div>
            <p className={s.statHint}>{card.hint}</p>
          </Card>
        ))}
      </div>
      <Card title="最近订单" className={s.recent} footer={
        <AppLink to="/orders">查看全部 <ArrowRightIcon size={sizes['icon-sm']} /></AppLink>
      }>
        <DataTable cols={recentColumns} rows={recent ?? []} getRowId={(o) => o.id} loading={recent === null} skeletonRows={5} />
      </Card>
    </div>
  );
}
