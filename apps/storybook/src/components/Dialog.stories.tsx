import { Button, Dialog, type DialogProps, Field, Input } from '@koi/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

function DeleteDialog({ initialOpen = false, ...args }: Partial<DialogProps> & { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <>
      <Button color="error" onClick={() => setOpen(true)}>
        删除文章
      </Button>
      <Dialog
        size="sm"
        title="删除这篇文章？"
        description="删除后无法恢复，评论也会一并移除。"
        footer={
          <>
            <Button color="secondary" variant="ghost" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button color="error" onClick={() => setOpen(false)}>
              删除
            </Button>
          </>
        }
        {...args}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

/** The legacy example's confirmation, as an alert dialog. */
function UnsubscribeDialog({ initialOpen = false, ...args }: Partial<DialogProps> & { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <>
      <Button color="secondary" variant="ghost" onClick={() => setOpen(true)}>
        取消订阅
      </Button>
      <Dialog
        role="alertdialog"
        size="sm"
        title="确定取消订阅？"
        description="之后有新文章时，你不会再收到邮件通知。"
        footer={
          <>
            <Button color="secondary" variant="ghost" onClick={() => setOpen(false)}>
              再想想
            </Button>
            <Button color="error" onClick={() => setOpen(false)}>
              取消订阅
            </Button>
          </>
        }
        {...args}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

/** A short form: a stray click outside shouldn't throw away what was typed. */
function EditProfileDialog({ initialOpen = false, ...args }: Partial<DialogProps> & { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <>
      <Button onClick={() => setOpen(true)}>编辑资料</Button>
      <Dialog
        dismissible={false}
        title="编辑资料"
        description="点击对话框外面不会关闭它，按 Esc 或点「取消」才会。"
        footer={
          <>
            <Button color="secondary" variant="ghost" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button onClick={() => setOpen(false)}>保存</Button>
          </>
        }
        {...args}
        open={open}
        onOpenChange={setOpen}
      >
        <Field label="昵称">
          <Input defaultValue="tcdw" />
        </Field>
      </Dialog>
    </>
  );
}

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    role: { control: 'inline-radio', options: ['dialog', 'alertdialog'] },
    dismissible: { control: 'boolean' },
    open: { control: false },
    onOpenChange: { control: false },
    footer: { control: false },
    children: { control: false },
  },
  args: {
    open: false,
    onOpenChange: () => {},
    size: 'sm',
    title: '删除这篇文章？',
    description: '删除后无法恢复，评论也会一并移除。',
  },
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

/**
 * `role="alertdialog"` for destructive confirmations (Base UI AlertDialog). Looks the same as a dialog; a click
 * outside never closes it, and focus starts on the least destructive action, the first footer button (「再想想」).
 * Esc and the × still cancel.
 */
export const AlertDialog: Story = {
  args: { role: 'alertdialog', title: '确定取消订阅？', description: '之后有新文章时，你不会再收到邮件通知。' },
  render: (args) => <UnsubscribeDialog {...args} />,
};

/** The alert dialog, open on load (whole-viewport screenshot). */
export const AlertDialogOpen: Story = {
  tags: ['shot-viewport', '!autodocs'],
  args: { role: 'alertdialog', title: '确定取消订阅？', description: '之后有新文章时，你不会再收到邮件通知。' },
  render: (args) => <UnsubscribeDialog {...args} initialOpen />,
};

/** `dismissible={false}`: a click on the backdrop doesn't close it; Esc, the × and the footer buttons do. */
export const NotDismissible: Story = {
  args: {
    dismissible: false,
    size: 'md',
    title: '编辑资料',
    description: '点击对话框外面不会关闭它，按 Esc 或点「取消」才会。',
  },
  render: (args) => <EditProfileDialog {...args} />,
};

/** Not dismissible, open on load (whole-viewport screenshot). */
export const NotDismissibleOpen: Story = {
  tags: ['shot-viewport', '!autodocs'],
  args: {
    dismissible: false,
    size: 'md',
    title: '编辑资料',
    description: '点击对话框外面不会关闭它，按 Esc 或点「取消」才会。',
  },
  render: (args) => <EditProfileDialog {...args} initialOpen />,
};
