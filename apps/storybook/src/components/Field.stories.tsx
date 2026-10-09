import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Card, Field, Input, Textarea } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import { stack } from '../layout';

const width = css({ width: '[360px]', maxWidth: '100%' });
const form = css({ display: 'flex', flexDirection: 'column', gap: '4' });
const actions = css({ display: 'flex', justifyContent: 'flex-end', gap: '2' });

const meta = {
  title: 'Components/Field',
  component: Field,
  args: {
    label: '电子邮箱',
    help: '我们不会公开你的邮箱。',
    error: '',
    required: false,
    optional: false,
    className: width,
    children: <Input type="email" placeholder="you@example.com" />,
  },
  argTypes: {
    label: { control: 'text' },
    help: { control: 'text' },
    error: { control: 'text' },
    children: { control: false },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <div className={stack}>
      <Field {...args} label="电子邮箱" help="我们不会公开你的邮箱。">
        <Input type="email" placeholder="you@example.com" />
      </Field>
      <Field {...args} label="电子邮箱" error="邮箱格式不太对，请检查一下。" help="我们不会公开你的邮箱。">
        <Input type="email" defaultValue="tcdw@example" />
      </Field>
      <Field {...args} label="昵称" help={undefined} required>
        <Input placeholder="大家怎么称呼你" />
      </Field>
      <Field {...args} label="个人网站" help={undefined} optional>
        <Input type="url" placeholder="https://" />
      </Field>
      <Field {...args} label="用户名" help="注册后不能修改。">
        <Input defaultValue="tcdw" disabled />
      </Field>
    </div>
  ),
};

export const WithTextarea: Story = {
  name: 'With textarea',
  render: (args) => (
    <div className={stack}>
      <Field {...args} label="留言" help="支持 Markdown。" optional>
        <Textarea placeholder="想说点什么？" />
      </Field>
      <Field {...args} label="留言" required error="至少写 10 个字吧。" help={undefined}>
        <Textarea defaultValue="写得好" />
      </Field>
    </div>
  ),
};

export const InAForm: Story = {
  name: 'In a form',
  render: () => (
    <Card title="订阅更新" description="有新文章时通过邮件通知你。" className={width}>
      <form className={form} onSubmit={(e) => e.preventDefault()}>
        <Field label="昵称" required>
          <Input placeholder="大家怎么称呼你" />
        </Field>
        <Field label="电子邮箱" required error="邮箱格式不太对，请检查一下。">
          <Input type="email" defaultValue="tcdw@example" />
        </Field>
        <Field label="想看什么" optional help="选填，帮我们决定下一篇写什么。">
          <Textarea rows={3} />
        </Field>
        <div className={actions}>
          <Button color="secondary" variant="ghost" type="button">取消</Button>
          <Button type="submit">订阅</Button>
        </div>
      </form>
    </Card>
  ),
};
