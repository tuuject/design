import type { ComponentType } from 'react';
import { BriefcaseIcon, LayoutIcon, RobotIcon, UserIcon } from './components/icons';

/**
 * The single navigation config: it drives the sidebar, the horizontal bar and (through each route's own
 * staticData.title) the breadcrumb. Route paths are kept as literal strings so TanStack Router's typed
 * navigation stays fully checked.
 *
 * The shape follows docs/spec/components/NavMenu.md with the categories themselves as the first level: every
 * top-level item is a `NavGroup` (概览, 业务, 智能助手, 账户) that expands into its pages, so the grouping is part
 * of the menu rather than a static label above it. The spec allows three levels; this template stops at two.
 */
export type NavTo = '/dashboard' | '/orders' | '/support' | '/agent' | '/assistant-settings' | '/settings';

export interface NavLeaf {
  title: string;
  to: NavTo;
  children?: never;
}

export interface NavGroup {
  title: string;
  /** A 16px icon in `currentColor`. Children drop it and indent instead, per the spec. */
  icon: ComponentType<{ size?: number }>;
  children: NavLeaf[];
  /** A group only opens and closes its children; every page is one of those children. */
  to?: never;
}

export type NavItem = NavLeaf | NavGroup;

export const NAV_GROUPS: NavGroup[] = [
  {
    title: '概览',
    icon: LayoutIcon,
    children: [{ title: '仪表盘', to: '/dashboard' }],
  },
  {
    title: '业务',
    icon: BriefcaseIcon,
    children: [
      { title: '订单管理', to: '/orders' },
      { title: '客服会话', to: '/support' },
    ],
  },
  {
    title: '智能助手',
    icon: RobotIcon,
    children: [
      { title: '对话示例', to: '/agent' },
      { title: '助手配置', to: '/assistant-settings' },
    ],
  },
  {
    title: '账户',
    icon: UserIcon,
    children: [{ title: '个人设置', to: '/settings' }],
  },
];

/** Whether `pathname` is one of `item`'s children, or the item itself when it is a leaf. */
export function navContains(item: NavItem, pathname: string): boolean {
  return item.children ? item.children.some((child) => child.to === pathname) : item.to === pathname;
}
