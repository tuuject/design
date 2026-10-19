import { Card, Skeleton, Spinner, Tabs } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';
import { fn } from 'storybook/test';
import { label, row, stack } from '../layout';

const width = css({ width: '[420px]', maxWidth: '100%' });
const note = css({ textStyle: 'small', color: 'text-muted' });
const p = css({ m: '0' });
const loading = css({ display: 'flex', alignItems: 'center', gap: '2', color: 'text-muted' });
const lines = css({ display: 'flex', flexDirection: 'column', gap: '2', width: '[240px]' });

const views = [
  { value: 'posts', label: '文章', content: <p className={p}>最近发布的 12 篇文章。</p> },
  { value: 'notes', label: '随笔', content: <p className={p}>写到一半的想法和读书笔记。</p> },
  { value: 'links', label: '友链', content: <p className={p}>朋友们的博客，按认识的先后排列。</p> },
];

const ranges = [
  { value: 'day', label: '今天' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'year', label: '今年' },
];

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    label: '内容分类',
    items: views,
    defaultValue: 'posts',
    fullWidth: false,
    onChange: fn(),
  },
  argTypes: {
    value: { control: 'text' },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

// Without `content` it's a pure segmented control: no panels.
export const Segmented: Story = {
  args: { label: '时间范围', items: ranges, defaultValue: 'week' },
};

export const States: Story = {
  render: (args) => (
    <div className={stack}>
      <div className={row}>
        <span className={label}>first</span>
        <Tabs {...args} label="时间范围" items={ranges} defaultValue="day" />
      </div>
      <div className={row}>
        <span className={label}>last</span>
        <Tabs {...args} label="时间范围" items={ranges} defaultValue="year" />
      </div>
      <div className={row}>
        <span className={label}>one disabled</span>
        <Tabs
          {...args}
          label="时间范围"
          items={[...ranges.slice(0, 3), { value: 'year', label: '今年', disabled: true }]}
          defaultValue="week"
        />
      </div>
      <div className={row}>
        <span className={label}>first disabled</span>
        <Tabs
          {...args}
          label="时间范围"
          items={[{ value: 'day', label: '今天', disabled: true }, ...ranges.slice(1)]}
          defaultValue={undefined}
        />
      </div>
      <div className={row}>
        <span className={label}>mixed labels</span>
        <Tabs
          {...args}
          label="视图"
          items={[
            { value: 'grid', label: 'Grid 网格' },
            { value: 'list', label: 'List 列表' },
            { value: 'map', label: 'Map' },
          ]}
          defaultValue="list"
        />
      </div>
    </div>
  ),
};

export const FullWidth: Story = {
  name: 'Full width',
  args: { fullWidth: true },
  render: (args) => <Tabs {...args} className={width} />,
};

// The legacy example: one panel loading, one loaded.
export const Example: Story = {
  args: {
    label: '示例',
    defaultValue: 'loading',
    items: [
      {
        value: 'loading',
        label: '加载中',
        content: (
          <div className={stack}>
            <span className={loading}>
              <Spinner size="sm" />
              正在获取评论…
            </span>
            <div className={lines} aria-hidden>
              <Skeleton className={css({ height: '[12px]', borderRadius: 'full' })} />
              <Skeleton className={css({ height: '[12px]', width: '70%', borderRadius: 'full' })} />
            </div>
          </div>
        ),
      },
      { value: 'done', label: '已加载', content: <p className={p}>tcdw · 2026 年 10 月 7 日</p> },
    ],
  },
};

function ControlledDemo(args: ComponentProps<typeof Tabs>) {
  const [value, setValue] = useState('week');
  return (
    <div className={stack}>
      <Tabs {...args} label="时间范围" items={ranges} value={value} onChange={(v) => setValue(v)} />
      <span className={note}>当前：{ranges.find((r) => r.value === value)?.label}</span>
    </div>
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};

export const InACard: Story = {
  name: 'In a card',
  render: (args) => (
    <Card title="阅读统计" description="按时间范围查看访问量。" className={width}>
      <Tabs
        {...args}
        fullWidth
        label="时间范围"
        items={ranges.map((r) => ({ ...r, content: <p className={p}>{r.label}的访问量会显示在这里。</p> }))}
        defaultValue="week"
      />
    </Card>
  ),
};
