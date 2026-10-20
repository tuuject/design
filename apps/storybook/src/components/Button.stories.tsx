import { Button, type ButtonColor, type ButtonVariant, CloseIcon, ExternalIcon, IconButton } from '@koi/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { label, row, stack } from '../layout';

const colors: ButtonColor[] = ['primary', 'accent', 'secondary', 'warning', 'error'];
const variants: ButtonVariant[] = ['solid', 'soft', 'outline', 'ghost'];

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { children: '按钮' },
  argTypes: {
    color: { control: 'inline-radio', options: colors },
    variant: { control: 'inline-radio', options: variants },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'inline-radio', options: ['pill', 'rounded'] },
    iconStart: { control: false },
    iconEnd: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className={stack}>
      {variants.map((v) => (
        <div key={v} className={row}>
          <span className={label}>{v}</span>
          {colors.map((c) => (
            <Button key={c} color={c} variant={v}>
              按钮
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const ShapeAndSize: Story = {
  name: 'Shape and size',
  render: () => (
    <div className={stack}>
      <div className={row}>
        <span className={label}>shape</span>
        <Button>rounded</Button>
        <Button shape="pill">pill</Button>
      </div>
      <div className={row}>
        <span className={label}>size</span>
        <Button size="sm">sm</Button>
        <Button>md</Button>
        <Button size="lg">lg</Button>
      </div>
      <div className={row}>
        <span className={label}>icon / loading</span>
        <IconButton label="关闭" icon={<CloseIcon />} />
        <IconButton label="关闭" icon={<CloseIcon />} shape="pill" variant="soft" />
        <Button loading>保存中</Button>
        <Button disabled>已禁用</Button>
      </div>
    </div>
  ),
};

export const AsLink: Story = {
  name: 'As link',
  render: () => (
    <div className={row}>
      <Button href="#button">阅读全文</Button>
      <Button
        href="https://github.com/"
        target="_blank"
        rel="noopener noreferrer"
        color="secondary"
        variant="outline"
        iconEnd={<ExternalIcon />}
      >
        GitHub
      </Button>
      <Button href="#button" disabled>
        已禁用
      </Button>
      <IconButton
        href="https://github.com/"
        target="_blank"
        rel="noopener noreferrer"
        label="在新窗口打开"
        icon={<ExternalIcon />}
      />
    </div>
  ),
};
