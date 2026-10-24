import type { ComponentType } from 'react';
import { HeadsetIcon, LayoutIcon, OrdersIcon, RobotIcon, SlidersIcon } from './components/icons';

/**
 * The single navigation config: it drives the sidebar, the breadcrumb and (through each route's own
 * staticData.title) the document title. Route paths are kept as literal strings so TanStack Router's
 * typed navigation stays fully checked.
 */
export interface NavItem {
  title: string;
  to: '/dashboard' | '/orders' | '/settings' | '/support' | '/agent';
  icon: ComponentType<{ size?: number }>;
}

export const NAV_ITEMS: NavItem[] = [
  { title: '仪表盘', to: '/dashboard', icon: LayoutIcon },
  { title: '订单管理', to: '/orders', icon: OrdersIcon },
  { title: '客服会话', to: '/support', icon: HeadsetIcon },
  { title: 'AI 助手', to: '/agent', icon: RobotIcon },
  { title: '个人设置', to: '/settings', icon: SlidersIcon },
];
