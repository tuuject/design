import { Breadcrumb } from '@tuuject/koi-react';
import { css } from '@tuuject/koi-react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

// The trail as it sits in a topbar: one row, left aligned.
const bar = css({ width: '[520px]', maxWidth: '100%' });
// A topbar squeezed to phone width: the crumbs ellipsize instead of pushing the row wider.
const narrow = css({ width: '[220px]' });

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  args: {
    items: [
      { label: '首页', href: '/dashboard' },
      { label: '订单管理', current: true },
    ],
  },
  argTypes: { items: { control: false } },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The two-crumb case: the section the page lives in, then the page itself. */
export const Playground: Story = {
  decorators: [
    (Story) => (
      <div className={bar}>
        <Story />
      </div>
    ),
  ],
};

/** A deeper trail: every ancestor is a link, only the last crumb is bold and `aria-current="page"`. */
export const DeeperTrail: Story = {
  name: 'Deeper trail',
  args: {
    items: [
      { label: '首页', href: '/dashboard' },
      { label: '订单管理', href: '/orders' },
      { label: '订单详情', current: true },
    ],
  },
  decorators: [
    (Story) => (
      <div className={bar}>
        <Story />
      </div>
    ),
  ],
};

/** In a 220px row the current title ends in an ellipsis: the trail never widens its container. */
export const LongLabel: Story = {
  name: 'Long label',
  args: {
    items: [
      { label: '首页', href: '/dashboard' },
      { label: '订单管理', href: '/orders' },
      { label: '2026 年 11 月渠道订单与退款汇总', current: true },
    ],
  },
  decorators: [
    (Story) => (
      <div className={narrow}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Client-side routing: `onSelect` gets the click, so `preventDefault()` stops the browser from following the
 * `href` and the app navigates instead. `cancel()` prevents the default too, for a click that shouldn't navigate.
 */
export const RouterSelect: Story = {
  name: 'Router select',
  args: {
    items: [
      {
        label: '首页',
        href: '/dashboard',
        onSelect: (details) => {
          details.event.preventDefault();
          fn()(details.reason);
        },
      },
      { label: '仪表盘', current: true },
    ],
  },
  decorators: [
    (Story) => (
      <div className={bar}>
        <Story />
      </div>
    ),
  ],
};
