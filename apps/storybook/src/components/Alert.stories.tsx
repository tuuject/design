import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Alert, Button } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import { stack } from '../layout';

const tones = ['info', 'warning', 'error'] as const;
// Action buttons on a tone fill: outline or ghost in the alert's own color. Soft fills sink into the dark tone surfaces.
const width = css({ width: '[420px]', maxWidth: '100%' });

const meta = {
  title: 'Components/Alert',
  component: Alert,
  args: {
    tone: 'info',
    title: '它能用了',
    children: '字体、颜色和组件都已从本地文件加载。',
    className: width,
  },
  argTypes: {
    tone: { control: 'inline-radio', options: tones },
    icon: { control: false },
    action: { control: false },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: (args) => (
    <div className={stack}>
      <Alert {...args} tone="info" title="新版本可用">刷新页面即可使用最新功能。</Alert>
      <Alert {...args} tone="warning" title="存储空间快满了">已使用 92%，超出后将无法上传新文件。</Alert>
      <Alert {...args} tone="error" title="保存失败">网络连接中断，你的修改还没有保存。</Alert>
    </div>
  ),
};

export const WithAction: Story = {
  name: 'With action and close',
  args: { onClose: fn() },
  render: (args) => (
    <div className={stack}>
      <Alert {...args} tone="error" title="保存失败" action={<Button size="sm" color="error" variant="outline">重试</Button>}>
        网络连接中断，你的修改还没有保存。
      </Alert>
      <Alert {...args} tone="warning" title="存储空间快满了" action={<>
        <Button size="sm" color="warning" variant="outline">升级方案</Button>
        <Button size="sm" color="warning" variant="ghost">清理文件</Button>
      </>}>
        已使用 92%，超出后将无法上传新文件。
      </Alert>
      <Alert {...args} tone="info">这条提示可以关闭。</Alert>
    </div>
  ),
};

export const Minimal: Story = {
  render: (args) => (
    <div className={stack}>
      <Alert {...args} title={undefined}>只有正文，没有标题。</Alert>
      <Alert {...args} tone="warning" title="只有标题" children={undefined} />
      <Alert {...args} tone="error" icon={null} title="没有图标">icon=&#123;null&#125; 隐藏图标。</Alert>
    </div>
  ),
};
