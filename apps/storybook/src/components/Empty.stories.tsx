import {
  Button,
  Empty,
  ErrorIcon,
  SearchIcon,
  Table,
  TableBody,
  TableEmpty,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '@tuuject/koi-react';
import { css } from '@tuuject/koi-react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

const width = css({ width: '[480px]', maxWidth: '100%' });

const meta = {
  title: 'Components/Empty',
  component: Empty,
  args: {
    title: '还没有订单',
    description: '新建的订单会按创建时间倒序列在这里。',
    action: <Button onClick={fn()}>创建订单</Button>,
    className: width,
  },
  argTypes: {
    icon: { control: false },
    title: { control: 'text' },
    description: { control: 'text' },
    action: { control: false },
    variant: { control: 'inline-radio', options: ['default', 'plain'] },
  },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithAction: Story = {
  name: 'With action',
  render: (args) => (
    <Empty
      {...args}
      icon={<SearchIcon size={32} />}
      title="没有匹配的订单"
      description="换个关键词，或清空筛选条件再试一次。"
      action={<Button onClick={fn()}>清空筛选</Button>}
    />
  ),
};

export const ErrorState: Story = {
  name: 'Error state',
  render: (args) => (
    <Empty
      {...args}
      icon={<ErrorIcon size={32} />}
      title="加载失败"
      description="网络连接中断，订单没有加载出来。"
      action={<Button onClick={fn()}>重试</Button>}
    />
  ),
};

export const InTable: Story = {
  name: 'In a table',
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>订单号</TableHeaderCell>
          <TableHeaderCell>客户</TableHeaderCell>
          <TableHeaderCell align="end">金额</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableEmpty colSpan={3} />
      </TableBody>
    </Table>
  ),
};

/** TableEmpty forwards `icon`, `description` and `action` to Empty's plain variant. */
export const InTableWithAction: Story = {
  name: 'In a table, with action',
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderCell>订单号</TableHeaderCell>
          <TableHeaderCell>客户</TableHeaderCell>
          <TableHeaderCell align="end">金额</TableHeaderCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableEmpty
          colSpan={3}
          icon={<SearchIcon size={24} />}
          description="换个关键词，或清空筛选条件再试一次。"
          action={
            <Button size="sm" onClick={fn()}>
              清空筛选
            </Button>
          }
        />
      </TableBody>
    </Table>
  ),
};
