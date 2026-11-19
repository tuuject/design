import { Button, Dialog, type DialogProps, Field, Input } from '@tuuject/koi-react';
import { css } from '@tuuject/koi-react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { stack } from '../layout';

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

const releases = Array.from({ length: 12 }, (_, i) => ({
  version: `0.${12 - i}.0`,
  note: '修复了若干问题，提升了长列表的滚动性能，并调整了深色主题下部分文字的对比度。',
}));

/** More content than fits: the body scrolls between the fixed title and footer. */
function ChangelogDialog({ initialOpen = false, ...args }: Partial<DialogProps> & { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <>
      <Button color="secondary" variant="outline" onClick={() => setOpen(true)}>
        更新日志
      </Button>
      <Dialog
        footer={
          <>
            <Button color="secondary" variant="ghost" onClick={() => setOpen(false)}>
              关闭
            </Button>
            <Button onClick={() => setOpen(false)}>知道了</Button>
          </>
        }
        {...args}
        open={open}
        onOpenChange={setOpen}
      >
        <div className={stack}>
          <Field label="搜索版本">
            <Input placeholder="例如 0.6.0" />
          </Field>
          {releases.map((r) => (
            <section key={r.version}>
              <h3 className={css({ m: '0', textStyle: 'heading-3' })}>{r.version}</h3>
              <p className={css({ m: '0', color: 'text-muted' })}>{r.note}</p>
            </section>
          ))}
        </div>
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

const longArgs = { size: 'md', title: '更新日志', description: '最近 12 个版本的改动。' } as const;

/** Long content: only the body scrolls, so the title, the × and the footer stay put and the scrollbar stays inside the panel's corners. */
export const LongContent: Story = {
  args: longArgs,
  render: (args) => <ChangelogDialog {...args} />,
};

/** Long content, open on load (whole-viewport screenshot). */
export const LongContentOpen: Story = {
  tags: ['shot-viewport', '!autodocs'],
  args: longArgs,
  render: (args) => <ChangelogDialog {...args} initialOpen />,
};
