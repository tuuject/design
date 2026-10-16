import type { AdminUser } from '../stores/auth';

export type OrderStatus = 'pending' | 'shipped' | 'completed' | 'cancelled';

export const ORDER_STATUS: Record<OrderStatus, { label: string; badge: 'warning' | 'primary' | 'solid' | 'neutral' }> = {
  pending: { label: '待付款', badge: 'warning' },
  shipped: { label: '已发货', badge: 'primary' },
  completed: { label: '已完成', badge: 'solid' },
  cancelled: { label: '已取消', badge: 'neutral' },
};

export interface Order {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: OrderStatus;
  createdAt: number;
}

export interface OrderQuery {
  page: number;
  pageSize?: number;
  keyword?: string;
  status?: OrderStatus;
}

export interface OrderPage {
  items: Order[];
  total: number;
}

export interface DashboardStats {
  todayOrders: number;
  pendingOrders: number;
  monthRevenue: number;
  members: number;
}

// Deterministic pseudo-random data (LCG), so the demo and its screenshots are stable across reloads.
function makeRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const CUSTOMERS = [
  '林晚照', '沈鱼', '顾青崖', '白鹿', '陆知遥', '苏折枝', '江晚吟', '闻人语',
  '温叙白', '姜眠', '宋知微', '裴见山', '谢栖迟', '阮眠棠', '霍无涯', '程既白',
];

const PRODUCTS: Array<[string, number]> = [
  ['锦鲤抱枕', 89], ['云养锦鲤月卡', 25], ['Koi 主题授权', 199], ['樱花季贴纸包', 12.9],
  ['透明玻璃杯', 49], ['折叠露营椅', 329], ['手账本 · 锦鲤别册', 68], ['毛绒挂件', 35],
  ['帆布袋', 79], ['亚克力立牌', 45],
];

const STATUSES: OrderStatus[] = ['completed', 'completed', 'completed', 'pending', 'shipped', 'shipped', 'cancelled'];

const orders: Order[] = (() => {
  const rand = makeRandom(20261016);
  const now = Date.now();
  const list: Order[] = [];
  for (let i = 0; i < 57; i++) {
    const [product, base] = PRODUCTS[Math.floor(rand() * PRODUCTS.length)];
    list.push({
      id: `SO-${24100 + i}`,
      customer: CUSTOMERS[Math.floor(rand() * CUSTOMERS.length)],
      product,
      // A slightly different amount per order, keeping the cent digits lively.
      amount: Math.round((base * (0.8 + rand() * 1.6) * 100)) / 100,
      status: STATUSES[Math.floor(rand() * STATUSES.length)],
      createdAt: now - Math.floor(rand() * 30 * 24 * 60 * 60 * 1000),
    });
  }
  return list.sort((a, b) => b.createdAt - a.createdAt);
})();

const delay = (ms: number) => {
  const { promise, resolve } = Promise.withResolvers<void>();
  setTimeout(resolve, ms);
  return promise;
};

export async function fetchOrders({ page, pageSize = 8, keyword, status }: OrderQuery): Promise<OrderPage> {
  await delay(300);
  const kw = keyword?.trim().toLowerCase();
  const filtered = orders.filter(
    (o) =>
      (!kw || o.customer.toLowerCase().includes(kw) || o.id.toLowerCase().includes(kw)) &&
      (!status || o.status === status),
  );
  const start = (page - 1) * pageSize;
  return { items: filtered.slice(start, start + pageSize).map((o) => ({ ...o })), total: filtered.length };
}

export async function deleteOrder(id: string): Promise<void> {
  await delay(400);
  const index = orders.findIndex((o) => o.id === id);
  if (index !== -1) orders.splice(index, 1);
}

export async function fetchRecentOrders(count = 5): Promise<Order[]> {
  await delay(300);
  return orders.slice(0, count).map((o) => ({ ...o }));
}

export async function fetchStats(): Promise<DashboardStats> {
  await delay(300);
  const dayStart = new Date(); dayStart.setHours(0, 0, 0, 0);
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  return {
    todayOrders: orders.filter((o) => o.createdAt >= dayStart.getTime()).length,
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    monthRevenue: orders
      .filter((o) => o.createdAt >= monthStart.getTime() && o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.amount, 0),
    members: 1284 + (orders.length % 7),
  };
}

const DEMO_ACCOUNT = { username: 'admin', password: '123456' };

export async function mockLogin(username: string, password: string): Promise<AdminUser> {
  await delay(500);
  if (username.trim() !== DEMO_ACCOUNT.username || password !== DEMO_ACCOUNT.password) {
    throw new Error('用户名或密码不对，请再试试看。');
  }
  return { name: 'Koi 管理员', email: 'admin@koi.design', role: '管理员' };
}
