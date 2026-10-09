import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Divider } from '@koi/react';
import { css } from '@koi/react/styled-system/css';

const meta = {
  title: 'Components/Divider',
  component: Divider,
  argTypes: { orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] } },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className={css({ p: '6', borderRadius: 'panel', borderWidth: '1px', borderColor: 'border', bg: 'surface' })}>
      <p className={css({ m: '0' })}>账户信息</p>
      <Divider />
      <p className={css({ m: '0' })}>通知设置</p>
    </div>
  ),
};

export const WithLabel: Story = {
  name: 'With label',
  args: { label: '或' },
  render: (args) => (
    <div className={css({ display: 'flex', flexDirection: 'column', alignItems: 'stretch', maxWidth: '[400px]' })}>
      <Button>使用邮箱登录</Button>
      <Divider {...args} />
      <Button color="secondary" variant="outline">使用 GitHub 登录</Button>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <span className={css({ display: 'inline-flex', alignItems: 'center', color: 'text-muted', textStyle: 'small' })}>
      2026 年 10 月 9 日<Divider orientation="vertical" />阅读约 5 分钟<Divider orientation="vertical" />3 条评论
    </span>
  ),
};
