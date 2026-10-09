import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Dialog, type DialogProps } from '@koi/react';

function DeleteDialog({ initialOpen = false, ...args }: Partial<DialogProps> & { initialOpen?: boolean }) {
  const [open, setOpen] = React.useState(initialOpen);
  return (
    <>
      <Button color="error" onClick={() => setOpen(true)}>删除文章</Button>
      <Dialog
        size="sm"
        title="删除这篇文章？"
        description="删除后无法恢复，评论也会一并移除。"
        footer={<>
          <Button color="secondary" variant="ghost" onClick={() => setOpen(false)}>取消</Button>
          <Button color="error" onClick={() => setOpen(false)}>删除</Button>
        </>}
        {...args}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    open: { control: false },
    onOpenChange: { control: false },
    footer: { control: false },
    children: { control: false },
  },
  args: { open: false, onOpenChange: () => {}, size: 'sm', title: '删除这篇文章？', description: '删除后无法恢复，评论也会一并移除。' },
  render: (args) => <DeleteDialog {...args} />,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Opens on load. scripts/shots.mjs screenshots the whole viewport for stories tagged `shot-viewport`; kept off the docs page, where it would cover everything. */
export const Open: Story = {
  tags: ['shot-viewport', '!autodocs'],
  render: (args) => <DeleteDialog {...args} initialOpen />,
};
