import type { AdminUser } from '../stores/auth';

export type OrderStatus = 'pending' | 'shipped' | 'completed' | 'cancelled';

export const ORDER_STATUS: Record<OrderStatus, { label: string; badge: 'warning' | 'primary' | 'neutral' | 'solid' }> =
  {
    pending: { label: '待付款', badge: 'warning' },
    // Solid, not primary: the orders table lets rows be selected, and a primary badge would vanish into the
    // selected row's `action-subtle` fill (docs/spec/components/Table.md).
    shipped: { label: '已发货', badge: 'solid' },
    completed: { label: '已完成', badge: 'neutral' },
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

/** The filters the list and the CSV export share. Dates are local `YYYY-MM-DD` days. */
export interface OrderFilters {
  id?: string;
  customer?: string;
  status?: OrderStatus;
  from?: string;
  to?: string;
}

export interface OrderQuery extends OrderFilters {
  page: number;
  pageSize?: number;
}

export interface OrderPage {
  items: Order[];
  total: number;
}

/** What a create/update form submits; the API owns IDs and creation times. */
export interface OrderDraft {
  customer: string;
  product: string;
  amount: number;
  status: OrderStatus;
}

/** A CSV row. An existing `id` updates that order; a new one keeps it. */
export interface OrderImport extends OrderDraft {
  id?: string;
  createdAt?: number;
}

export interface OrderImportResult {
  inserted: number;
  updated: number;
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
  '林晚照',
  '沈鱼',
  '顾青崖',
  '白鹿',
  '陆知遥',
  '苏折枝',
  '江晚吟',
  '闻人语',
  '温叙白',
  '姜眠',
  '宋知微',
  '裴见山',
  '谢栖迟',
  '阮眠棠',
  '霍无涯',
  '程既白',
];

const PRODUCTS: Array<[string, number]> = [
  ['锦鲤抱枕', 89],
  ['云养锦鲤月卡', 25],
  ['Koi 主题授权', 199],
  ['樱花季贴纸包', 12.9],
  ['透明玻璃杯', 49],
  ['折叠露营椅', 329],
  ['手账本 · 锦鲤别册', 68],
  ['毛绒挂件', 35],
  ['帆布袋', 79],
  ['亚克力立牌', 45],
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
      amount: Math.round(base * (0.8 + rand() * 1.6) * 100) / 100,
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

let nextOrderSequence =
  orders.reduce((max, order) => Math.max(max, Number.parseInt(order.id.slice(3), 10) || 0), 24099) + 1;

function makeOrderId() {
  return `SO-${nextOrderSequence++}`;
}

function filterOrders(filters: OrderFilters) {
  const id = filters.id?.trim().toLowerCase();
  const customer = filters.customer?.trim().toLowerCase();
  const from = filters.from ? new Date(`${filters.from}T00:00:00`).getTime() : undefined;
  const to = filters.to ? new Date(`${filters.to}T23:59:59.999`).getTime() : undefined;
  return orders.filter(
    (order) =>
      (!id || order.id.toLowerCase().includes(id)) &&
      (!customer || order.customer.toLowerCase().includes(customer)) &&
      (!filters.status || order.status === filters.status) &&
      (from === undefined || Number.isNaN(from) || order.createdAt >= from) &&
      (to === undefined || Number.isNaN(to) || order.createdAt <= to),
  );
}

function normalizeDraft(input: OrderDraft): OrderDraft {
  const customer = input.customer.trim();
  const product = input.product.trim();
  const amount = Number(input.amount);
  if (!customer) {
    throw new Error('客户名称不能为空。');
  }
  if (!product) {
    throw new Error('商品名称不能为空。');
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('金额必须是大于 0 的数字。');
  }
  if (!Object.hasOwn(ORDER_STATUS, input.status)) {
    throw new Error('订单状态不合法。');
  }
  return { customer, product, amount: Math.round(amount * 100) / 100, status: input.status };
}

function sortByNewest() {
  orders.sort((a, b) => b.createdAt - a.createdAt);
}

export async function fetchOrders({ page, pageSize = 10, ...filters }: OrderQuery): Promise<OrderPage> {
  await delay(300);
  const filtered = filterOrders(filters);
  const size = Math.max(1, pageSize);
  const start = (page - 1) * size;
  return { items: filtered.slice(start, start + size).map((order) => ({ ...order })), total: filtered.length };
}

/** Every matching order, regardless of the pager: what the CSV export writes. */
export async function fetchAllOrders(filters: OrderFilters = {}): Promise<Order[]> {
  await delay(300);
  return filterOrders(filters).map((order) => ({ ...order }));
}

export async function createOrder(input: OrderDraft): Promise<Order> {
  await delay(400);
  const order: Order = { id: makeOrderId(), ...normalizeDraft(input), createdAt: Date.now() };
  orders.unshift(order);
  sortByNewest();
  return { ...order };
}

export async function updateOrder(id: string, input: OrderDraft): Promise<Order> {
  await delay(400);
  const index = orders.findIndex((order) => order.id === id);
  if (index === -1) {
    throw new Error('订单不存在，可能已被删除。');
  }
  const updated: Order = { ...orders[index], ...normalizeDraft(input) };
  orders[index] = updated;
  sortByNewest();
  return { ...updated };
}

export async function deleteOrders(ids: readonly string[]): Promise<number> {
  await delay(400);
  const doomed = new Set(ids);
  const before = orders.length;
  for (let i = orders.length - 1; i >= 0; i--) {
    if (doomed.has(orders[i].id)) {
      orders.splice(i, 1);
    }
  }
  return before - orders.length;
}

/**
 * Upserts parsed CSV rows. An `id` that already exists is updated, so exporting and re-importing applies edits;
 * rows without an `id` (or with a fresh one) are inserted.
 */
export async function importOrders(rows: readonly OrderImport[]): Promise<OrderImportResult> {
  await delay(500);
  let inserted = 0;
  let updated = 0;
  for (const row of rows) {
    const draft = normalizeDraft(row);
    const id = row.id?.trim();
    const index = id ? orders.findIndex((order) => order.id === id) : -1;
    if (index !== -1) {
      orders[index] = { ...orders[index], ...draft, createdAt: row.createdAt ?? orders[index].createdAt };
      updated++;
      continue;
    }
    const orderId = id || makeOrderId();
    const sequence = Number.parseInt(orderId.slice(3), 10);
    if (Number.isFinite(sequence)) {
      nextOrderSequence = Math.max(nextOrderSequence, sequence + 1);
    }
    orders.push({ id: orderId, ...draft, createdAt: row.createdAt ?? Date.now() });
    inserted++;
  }
  sortByNewest();
  return { inserted, updated };
}

export async function fetchRecentOrders(count = 5): Promise<Order[]> {
  await delay(300);
  return orders.slice(0, count).map((o) => ({ ...o }));
}

export async function fetchStats(): Promise<DashboardStats> {
  await delay(300);
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
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
