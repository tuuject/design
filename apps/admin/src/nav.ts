import type { ComponentType } from 'react';
import { LayoutIcon, OrdersIcon, SlidersIcon } from './components/icons';

/**
 * The single navigation config: it drives the sidebar, the breadcrumb and (through each route's own
 * staticData.title) the document title. Route paths are kept as literal strings so TanStack Router's
 * typed navigation stays fully checked.
 */
export interface NavItem {
  title: string;
  to: '/dashboard' | '/orders' | '/settings';
  icon: ComponentType<{ size?: number }>;
}

export const NAV_ITEMS: NavItem[] = [
  { title: '仪表盘', to: '/dashboard', icon: LayoutIcon },
  { title: '订单管理', to: '/orders', icon: OrdersIcon },
  { title: '个人设置', to: '/settings', icon: SlidersIcon },
];
