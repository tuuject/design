import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button, Toast, ToastProvider, useToast, type ToastOptions, type ToastProviderProps } from '@koi/react';
import { css, cx } from '@koi/react/styled-system/css';
import { stack } from '../layout';

const tones = ['info', 'success', 'warning', 'error'] as const;
// Room for the float shadow, which the screenshot of #storybook-root would otherwise crop.
const padded = css({ p: '6' });

const samples: ToastOptions[] = [
  { tone: 'info', title: '有新版本', description: '刷新页面即可使用最新功能。' },
  { tone: 'success', title: '已保存', description: '你的修改已同步到所有设备。' },
  { tone: 'warning', title: '存储空间快满了', description: '已使用 92%，超出后将无法上传新文件。' },
  { tone: 'error', title: '保存失败', description: '网络连接中断，你的修改还没有保存。' },
];

/** A button that fires a toast with the story's args. */
function Trigger({ options }: { options: ToastOptions }) {
  const { toast } = useToast();
  return <Button onClick={() => toast(options)}>显示通知</Button>;
}

/** Adds the toasts once on mount and keeps them (duration 0), so screenshots are stable. */
function OnMount({ list }: { list: ToastOptions[] }) {
  const { toast } = useToast();
  const done = React.useRef(false);
  React.useEffect(() => {
    if (done.current) return;
    done.current = true;
    for (const t of list) toast({ duration: 0, ...t });
  }, [toast, list]);
  return <Trigger options={{ ...samples[1], duration: 0 }} />;
}

function Stacked({ list, position }: { list: ToastOptions[]; position?: ToastProviderProps['position'] }) {
  return (
    <ToastProvider position={position}>
      <OnMount list={list} />
    </ToastProvider>
  );
}

type PlaygroundArgs = React.ComponentProps<typeof Toast> & { duration?: number; position?: ToastProviderProps['position'] };

const meta: Meta<PlaygroundArgs> = {
  title: 'Components/Toast',
  component: Toast,
  args: { tone: 'success', title: '订阅成功', description: '下次更新时会通知你。', duration: 4000, position: 'bottom' },
  argTypes: {
    tone: { control: 'inline-radio', options: tones },
    position: { control: 'inline-radio', options: ['bottom', 'top'] },
    duration: { control: { type: 'number', min: 0, step: 1000 } },
    action: { control: false },
    onClose: { control: false },
  },
};

export default meta;
type Story = StoryObj<PlaygroundArgs>;

/** Wraps the story in ToastProvider; the button calls `useToast().toast(...)`. */
export const Playground: Story = {
  render: ({ tone, title, description, duration, position }) => (
    <ToastProvider position={position}>
      <Trigger options={{ tone, title, description, duration }} />
    </ToastProvider>
  ),
};

/** `Toast` rendered on its own, without the provider: each tone, with an action, with a close button. */
export const Tones: Story = {
  render: () => (
    <div className={cx(stack, padded)}>
      {samples.map((t) => <Toast key={t.tone} {...t} />)}
      <Toast title="已移到回收站" action={<Button size="sm" variant="ghost">撤销</Button>} onClose={fn()} />
      <Toast tone="success" description="链接已复制。" onClose={fn()} />
    </div>
  ),
};

/** Four toasts in ToastProvider, newest at the bottom, nearest the edge. They stay until closed. */
export const Stack: Story = {
  tags: ['shot-viewport', '!autodocs'],
  render: () => <Stacked list={samples} />,
};

/** `position="top"`: the newest is at the top. */
export const StackTop: Story = {
  name: 'Stack at the top',
  tags: ['shot-viewport', '!autodocs'],
  render: () => <Stacked position="top" list={[samples[0], { ...samples[3], action: <Button size="sm" color="error" variant="ghost">重试</Button> }]} />,
};
