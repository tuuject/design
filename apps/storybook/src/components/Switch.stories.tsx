import { Badge, Card, Field, Switch } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';
import { fn } from 'storybook/test';
import { label, row, stack } from '../layout';

const width = css({ width: '[360px]', maxWidth: '100%' });
const list = css({ display: 'flex', flexDirection: 'column', gap: '3' });
const note = css({ textStyle: 'small', color: 'text-muted' });

const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: {
    label: '暗黑模式跟随系统',
    disabled: false,
    onCheckedChange: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <div className={stack}>
      <div className={row}>
        <span className={label}>off</span>
        <Switch {...args} label="自动播放" />
      </div>
      <div className={row}>
        <span className={label}>on</span>
        <Switch {...args} label="自动播放" defaultChecked />
      </div>
      <div className={row}>
        <span className={label}>disabled</span>
        <Switch {...args} label="自动播放" disabled />
      </div>
      <div className={row}>
        <span className={label}>disabled on</span>
        <Switch {...args} label="自动播放" defaultChecked disabled />
      </div>
      <div className={row}>
        <span className={label}>no label</span>
        <Switch {...args} label={undefined} aria-label="自动播放" defaultChecked />
      </div>
    </div>
  ),
};

// The legacy example's row: a switch next to a badge.
export const WithBadge: Story = {
  name: 'With badge',
  render: (args) => (
    <div className={row}>
      <Switch {...args} defaultChecked />
      <Badge tone="accent">NEW</Badge>
    </div>
  ),
};

function ControlledDemo(args: ComponentProps<typeof Switch>) {
  const [checked, setChecked] = useState(false);
  return (
    <div className={stack}>
      <Switch {...args} label="深色代码块" checked={checked} onCheckedChange={setChecked} />
      <span className={note}>当前：{checked ? '开' : '关'}</span>
    </div>
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};

// Inside a Field, the Field's label also toggles it and its help describes it.
export const InAField: Story = {
  name: 'In a field',
  render: (args) => (
    <div className={width}>
      <Field label="评论" help="关闭后，已有的评论仍然可见。">
        <Switch {...args} label="允许读者评论" defaultChecked />
      </Field>
    </div>
  ),
};

export const InACard: Story = {
  name: 'In a card',
  render: (args) => (
    <Card title="偏好设置" description="改动会立即生效。" className={width}>
      <div className={list}>
        <Switch {...args} label="暗黑模式跟随系统" defaultChecked />
        <Switch {...args} label="减少动画" />
        <Switch {...args} label="在新窗口打开外部链接，这一项的文字比较长，会折成两行" defaultChecked />
        <Switch {...args} label="实验性功能（暂不可用）" disabled />
      </div>
    </Card>
  ),
};
