import { Button, Field, Input, Popover, Switch } from '@tuuject/koi-react';
import { css } from '@tuuject/koi-react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

const room = css({ minHeight: '[420px]' });
const panel = css({ display: 'flex', flexDirection: 'column', gap: '3', width: '[264px]' });
const row = css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '3' });

const meta = {
  title: 'Components/Popover',
  component: Popover,
  args: {
    trigger: <Button variant="outline">筛选</Button>,
    children: (
      <div className={panel}>
        <Field label="关键词">
          <Input placeholder="订单号或客户名" />
        </Field>
        <div className={row}>
          <span>只看未完成</span>
          <Switch aria-label="只看未完成" defaultChecked />
        </div>
      </div>
    ),
    label: '筛选条件',
    onOpenChange: fn(),
  },
  argTypes: {
    placement: {
      control: 'inline-radio',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end', 'right-start', 'left-start'],
    },
    trigger: { control: false },
    children: { control: false },
    onOpenChange: { control: false },
  },
  decorators: [
    (Story) => (
      <div className={room}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Click the trigger. Esc and a click outside close it; focus goes back to the trigger. */
export const Playground: Story = {};

/** Open on load, with a short form in the panel (whole-viewport screenshot). */
export const Open: Story = {
  tags: ['shot-viewport'],
  args: { defaultOpen: true },
};

/** `placement` picks the side and the alignment; the panel flips on its own near the window edge. */
export const Placement: Story = {
  tags: ['shot-viewport'],
  args: {
    placement: 'top-start',
    defaultOpen: true,
    children: (
      <div className={panel}>
        <span>面板在触发器的上方，与它的左边缘对齐。</span>
      </div>
    ),
  },
  // Room above the trigger, or the panel would flip below it.
  decorators: [
    (Story) => (
      <div className={css({ paddingBlockStart: '[240px]' })}>
        <Story />
      </div>
    ),
  ],
};

/** `modal` traps focus and locks the page scroll; a popover of plain controls leaves the page alone. */
export const Modal: Story = {
  args: {
    modal: true,
    defaultOpen: true,
    label: '快捷操作',
    children: (
      <div className={panel}>
        <span>焦点被限制在面板里，直到它关闭。</span>
        <Button>确认</Button>
      </div>
    ),
  },
  tags: ['shot-viewport'],
};
