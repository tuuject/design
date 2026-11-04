import { Avatar, Badge, InfoIcon, NavMenu, PlusIcon, SearchIcon, UploadIcon, WarningIcon } from '@tuuject/koi-react';
import { css, cx } from '@tuuject/koi-react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

const brand = { logo: 'K', title: 'Koi Admin', subtitle: 'Koi 组件库演示' };

const sections = [
  {
    label: '观察',
    items: [
      { value: 'dashboard', label: '仪表盘', icon: <InfoIcon />, href: '#dashboard' },
      { value: 'reports', label: '报表', icon: <SearchIcon />, href: '#reports' },
    ],
  },
  {
    label: '管理',
    items: [
      {
        value: 'orders',
        label: '订单管理',
        icon: <UploadIcon />,
        children: [
          { value: 'orders-all', label: '全部订单', href: '#orders' },
          { value: 'orders-draft', label: '草稿' },
        ],
      },
      { value: 'settings', label: '设置', icon: <PlusIcon />, href: '#settings' },
    ],
  },
];

/** Three levels: a parent, a child that is itself a parent, and its pages. A third level's own children are ignored. */
const deep = [
  {
    label: '商品',
    items: [
      {
        value: 'catalog',
        label: '商品',
        icon: <InfoIcon />,
        children: [
          { value: 'catalog-all', label: '全部商品', href: '#catalog' },
          {
            value: 'catalog-categories',
            label: '分类',
            children: [
              { value: 'cat-apparel', label: '服装', href: '#apparel' },
              { value: 'cat-digital', label: '数码', href: '#digital' },
              { value: 'cat-home', label: '家居', href: '#home' },
            ],
          },
          { value: 'catalog-brands', label: '品牌', href: '#brands' },
        ],
      },
    ],
  },
];

const footer = (
  <div className={css({ display: 'flex', alignItems: 'center', gap: '3', paddingInline: '3' })}>
    <Avatar name="tcdw" size="sm" />
    <span className={css({ textStyle: 'small', color: 'text-muted' })}>tcdw@example.com</span>
  </div>
);

const sidebar = css({
  display: 'flex',
  width: '[248px]',
  height: '[560px]',
  bg: 'surface',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'divider',
  borderRadius: 'xl',
  overflow: 'hidden',
});

// A block div is already full width; the narrow story overrides it with its own width.
const bar = css({ display: 'flex', bg: 'surface' });

const meta = {
  title: 'Components/NavMenu',
  component: NavMenu,
  args: {
    sections,
    brand,
    footer,
    defaultValue: 'dashboard',
    onSelect: fn(),
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    current: { control: 'inline-radio', options: ['page', 'location', 'true'] },
    sections: { control: 'object' },
    items: { control: 'object' },
    brand: { control: 'object' },
    footer: { control: false },
    onSelect: { control: false },
  },
} satisfies Meta<typeof NavMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The sidebar layout: brand, groups with 12px labels, the current page's branch already open, and a footer. */
export const Playground: Story = {
  args: { defaultValue: 'orders-draft' },
  decorators: [
    (Story) => (
      <div className={sidebar}>
        <Story />
      </div>
    ),
  ],
};

/** One row, no brand: groups are divided by a 24px line and their labels are kept for screen readers. */
export const Horizontal: Story = {
  args: { orientation: 'horizontal', brand: undefined, footer: undefined },
  decorators: [
    (Story) => (
      <div className={bar}>
        <Story />
      </div>
    ),
  ],
};

/** `collapsed` turns the sidebar into a 72px rail: icons only, and each parent opens its pages beside it. */
export const Rail: Story = {
  name: 'Collapsed rail',
  args: { collapsed: true, brand: { logo: 'K', title: 'Koi Admin' }, footer: undefined, defaultValue: 'orders-draft' },
  decorators: [
    (Story) => (
      <div className={cx(sidebar, css({ width: '[72px]' }))}>
        <Story />
      </div>
    ),
  ],
};

/** Up to three levels, indented 36px and 52px. A parent only opens and closes: give the page its own row. */
export const ThreeLevels: Story = {
  name: 'Three levels',
  args: { sections: deep, defaultValue: 'cat-digital', defaultExpanded: ['catalog', 'catalog-categories'] },
  decorators: [
    (Story) => (
      <div className={sidebar}>
        <Story />
      </div>
    ),
  ],
};

/** The current row fills and bolds; a parent of the current page is bold; `disabled` stays out of reach. */
export const CurrentAndDisabled: Story = {
  name: 'Current, disabled and badge',
  args: {
    sections: [
      {
        label: '管理',
        items: [
          {
            value: 'orders',
            label: '订单管理',
            icon: <UploadIcon />,
            children: [
              { value: 'orders-all', label: '全部订单', href: '#orders', badge: <Badge tone="accent">12</Badge> },
              { value: 'orders-draft', label: '草稿', badge: <Badge>2</Badge> },
            ],
          },
          { value: 'settings', label: '设置', icon: <PlusIcon />, href: '#settings', disabled: true },
          { value: 'danger', label: '危险操作', icon: <WarningIcon />, disabled: true },
        ],
      },
    ],
    defaultValue: 'orders-draft',
  },
  decorators: [
    (Story) => (
      <div className={sidebar}>
        <Story />
      </div>
    ),
  ],
};

/** In a narrow container the bar scrolls sideways and its end fades, instead of squeezing the labels. */
export const Narrow: Story = {
  name: 'Narrow overflow',
  args: { orientation: 'horizontal', brand: undefined, footer: undefined },
  decorators: [
    (Story) => (
      <div className={cx(bar, css({ width: '[320px]', maxWidth: '100%' }))}>
        <Story />
      </div>
    ),
  ],
};
