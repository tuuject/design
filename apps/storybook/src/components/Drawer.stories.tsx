import { Button, Drawer, type DrawerProps, Field, Input } from '@tuuject/koi-react';
import { css } from '@tuuject/koi-react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

const panelLink = css({
  display: 'flex',
  alignItems: 'center',
  height: 'control-md',
  paddingInline: '2',
  borderRadius: 'xl',
  color: 'text',
  textDecoration: 'none',
  _hover: { bg: 'surface-muted' },
  '&[aria-current=page]': { bg: 'nav-item-active', fontWeight: 'bold' },
});

function Navigation({ side, initialOpen = false, ...args }: Partial<DrawerProps> & { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <>
      <Button color="secondary" onClick={() => setOpen(true)}>
        打开导航
      </Button>
      <Drawer
        side={side}
        title="主导航"
        description="Koi Admin 的全部页面"
        {...args}
        open={open}
        onOpenChange={setOpen}
      >
        <nav aria-label="示例导航" className={css({ display: 'flex', flexDirection: 'column', gap: '1' })}>
          <a href="#dashboard" className={panelLink} aria-current="page">
            仪表盘
          </a>
          <a href="#orders" className={panelLink}>
            订单管理
          </a>
          <a href="#support" className={panelLink}>
            客服会话
          </a>
          <a href="#settings" className={panelLink}>
            设置
          </a>
        </nav>
      </Drawer>
    </>
  );
}

function HiddenTitle({ initialOpen = false, ...args }: Partial<DrawerProps> & { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <>
      <Button color="secondary" onClick={() => setOpen(true)}>
        打开抽屉
      </Button>
      <Drawer hideTitle title="筛选条件" {...args} description={undefined} open={open} onOpenChange={setOpen}>
        <Field label="关键词">
          <Input placeholder="订单号或客户名" />
        </Field>
        <Field label="状态">
          <Input placeholder="全部" />
        </Field>
      </Drawer>
    </>
  );
}

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  argTypes: {
    side: { control: 'inline-radio', options: ['left', 'right', 'top', 'bottom'] },
    open: { control: false },
    onOpenChange: { control: false },
    children: { control: false },
    footer: { control: false },
  },
  args: {
    side: 'left',
    open: false,
    onOpenChange: () => {},
    title: '主导航',
    description: 'Koi Admin 的全部页面',
  },
  render: (args) => <Navigation {...args} />,
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Click the trigger. Esc, a click on the backdrop and the × close it; focus returns to the trigger. */
export const Playground: Story = {};

/** `side` picks the edge it slides in from; the border sits on the inner edge, against the page. */
export const Sides: Story = {
  render: (args) => (
    <div className={css({ display: 'flex', gap: '3', flexWrap: 'wrap' })}>
      {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
        <Navigation key={side} {...args} side={side} />
      ))}
    </div>
  ),
};

/** Open on load, sliding in from the left (whole-viewport screenshot). */
export const Open: Story = {
  tags: ['shot-viewport', '!autodocs'],
  render: (args) => <Navigation {...args} initialOpen />,
};

/** `hideTitle` keeps the title for screen readers only, for a panel whose content already starts with a header. */
export const HiddenTitleStory: Story = {
  name: 'Hidden title',
  args: { title: '筛选条件' },
  render: (args) => <HiddenTitle {...args} />,
};

/** The hidden-title drawer, open on load (whole-viewport screenshot). */
export const HiddenTitleOpen: Story = {
  name: 'Hidden title open',
  tags: ['shot-viewport', '!autodocs'],
  args: { title: '筛选条件' },
  render: (args) => <HiddenTitle {...args} initialOpen />,
};

function NotDismissible({ initialOpen = false, ...args }: Partial<DrawerProps> & { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <>
      <Button color="secondary" onClick={() => setOpen(true)}>
        编辑资料
      </Button>
      <Drawer
        dismissible={false}
        title="编辑资料"
        description="点击抽屉外面不会关闭它，按 Esc 或点「取消」才会。"
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
      />
    </>
  );
}

/** `dismissible={false}`: a click outside doesn't close it; Esc, the × and the footer buttons do. */
export const NotDismissibleStory: Story = {
  name: 'Not dismissible',
  render: (args) => <NotDismissible {...args} />,
};
