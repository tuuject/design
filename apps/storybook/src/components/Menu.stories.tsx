import { Avatar, Button, ExternalIcon, Menu, PlusIcon, TrashIcon } from '@tuuject/koi-react';
import { css } from '@tuuject/koi-react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

const room = css({ minHeight: '[420px]' });

const actions = [
  { value: 'new', label: '新建', icon: <PlusIcon /> },
  { value: 'copy', label: '复制链接', icon: <ExternalIcon /> },
  'separator' as const,
  { value: 'delete', label: '删除', icon: <TrashIcon /> },
];

const grouped = [
  {
    label: '账户',
    items: [
      { value: 'profile', label: '个人设置' },
      { value: 'security', label: '安全设置' },
    ],
  },
  'separator' as const,
  {
    label: '帮助',
    items: [
      { value: 'docs', label: '使用文档', href: '#docs' },
      { value: 'feedback', label: '反馈问题', href: '#feedback' },
    ],
  },
];

// Enough rows to pass the panel's 420px, so it scrolls.
const long = [
  {
    label: '会话设置',
    items: [
      { value: 'active', label: '编辑活跃时间' },
      { value: 'reply', label: '编辑主动回复概率' },
      { value: 'group-memory', label: '编辑群聊记忆' },
    ],
  },
  'separator' as const,
  {
    label: '打开相关页面',
    items: ['提示词', '辞典', '记忆', '群聊记忆', '消息', '运行记录', '定时任务', '成员', '日志'].map((label) => ({
      value: label,
      label,
    })),
  },
];

const user = css({ display: 'flex', alignItems: 'center', gap: '3' });
const userText = css({ display: 'flex', flexDirection: 'column', minWidth: '0' });
const email = css({ textStyle: 'small', color: 'text-muted' });

const header = (
  <div className={user}>
    <Avatar name="tcdw" size="md" />
    <div className={userText}>
      <span className={css({ fontWeight: 'bold' })}>tcdw</span>
      <span className={email}>tcdw@example.com</span>
    </div>
  </div>
);

const footer = <span className={css({ textStyle: 'small', color: 'text-muted' })}>Koi Admin v0.2</span>;

const meta = {
  title: 'Components/Menu',
  component: Menu,
  args: {
    trigger: <Button variant="outline">操作</Button>,
    items: actions,
    onSelect: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    placement: {
      control: 'inline-radio',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end', 'right-start', 'left-start'],
    },
    items: { control: 'object' },
    trigger: { control: false },
    header: { control: false },
    footer: { control: false },
    onSelect: { control: false },
    onOpenChange: { control: false },
    finalFocus: { control: false },
  },
  decorators: [
    (Story) => (
      <div className={room}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Click the trigger, or focus it and press ↓, Enter or Space. Arrow keys move, Esc closes, typing jumps. */
export const Playground: Story = {};

/** `header` and `footer` sit above and below the rows, divided from them by a line. */
export const HeaderFooter: Story = {
  name: 'Header and footer',
  tags: ['shot-viewport'],
  args: { items: grouped, header, footer, defaultOpen: true },
};

/** Groups get a heading each; `href` rows are real links, so middle-click and copy-link work. */
export const Grouped: Story = {
  tags: ['shot-viewport'],
  args: { items: grouped, defaultOpen: true },
};

/** Past 420px the rows scroll inside the panel, and the scrollbar runs along the panel's edge, inside its corners. */
export const LongList: Story = {
  name: 'Long list',
  tags: ['shot-viewport'],
  args: { items: long, defaultOpen: true },
};

/** With a header and a footer, only the rows between them scroll. */
export const LongListHeaderFooter: Story = {
  name: 'Long list with header and footer',
  tags: ['shot-viewport'],
  args: { items: long, header, footer, defaultOpen: true },
};

/** `current` marks the row the page is on; `disabled` keeps a row visible but out of reach. */
export const CurrentAndDisabled: Story = {
  name: 'Current and disabled',
  tags: ['shot-viewport'],
  args: {
    items: [
      { value: 'dashboard', label: '仪表盘' },
      { value: 'orders', label: '订单管理', current: true },
      { value: 'support', label: '客服会话', disabled: true },
      { value: 'agent', label: '对话示例', endContent: <span>新</span> },
    ],
    defaultOpen: true,
  },
};

/** `openOnHover` opens the panel from the mouse too, for navigation flyouts; a hover-opened menu is never modal. */
export const OpenOnHover: Story = {
  name: 'Open on hover',
  args: { items: grouped, openOnHover: true, modal: false },
};

/** `placement` picks the side and the alignment; the panel flips on its own near the window edge. */
export const Placement: Story = {
  args: { placement: 'bottom-end', items: grouped, defaultOpen: true },
  tags: ['shot-viewport'],
  // Against the right edge, so `bottom-end` has room to stay end-aligned instead of flipping to start.
  render: (args) => (
    <div className={css({ display: 'flex', justifyContent: 'flex-end', width: '100%', minWidth: '[360px]' })}>
      <Menu {...args} />
    </div>
  ),
};
