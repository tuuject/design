import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { fn } from 'storybook/test';
import { Button, Card, Checkbox, Field } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import { stack, row, label } from '../layout';

const width = css({ width: '[360px]', maxWidth: '100%' });
const list = css({ display: 'flex', flexDirection: 'column', gap: '3' });
const form = css({ display: 'flex', flexDirection: 'column', gap: '4' });
const actions = css({ display: 'flex', justifyContent: 'flex-end', gap: '2' });
const note = css({ textStyle: 'small', color: 'text-muted' });

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: {
    label: '记住我',
    description: '',
    disabled: false,
    onCheckedChange: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    checked: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <div className={stack}>
      <div className={row}><span className={label}>unchecked</span><Checkbox {...args} label="记住我" /></div>
      <div className={row}><span className={label}>checked</span><Checkbox {...args} label="记住我" defaultChecked /></div>
      <div className={row}><span className={label}>invalid</span><Checkbox {...args} label="我已阅读并同意服务条款" aria-invalid /></div>
      <div className={row}><span className={label}>disabled</span><Checkbox {...args} label="记住我" disabled /></div>
      <div className={row}><span className={label}>disabled checked</span><Checkbox {...args} label="记住我" defaultChecked disabled /></div>
      <div className={row}><span className={label}>no label</span><Checkbox {...args} label={undefined} aria-label="选择这一行" defaultChecked /></div>
    </div>
  ),
};

export const WithDescription: Story = {
  name: 'With description',
  render: (args) => (
    <div className={`${list} ${width}`}>
      <Checkbox {...args} label="新文章通知" description="有新文章发布时给你发一封邮件。" defaultChecked />
      <Checkbox {...args} label="评论回复" description="有人回复你的评论时通知你。" />
      <Checkbox {...args} label="每周摘要" description="每周一早上汇总上周的更新，暂不可用。" disabled />
    </div>
  ),
};

// Inside a Field, the Field's error and help describe the checkbox and its error turns the edge red.
export const InAField: Story = {
  name: 'In a field',
  render: (args) => (
    <div className={`${stack} ${width}`}>
      <Field label="服务条款" required error="请先同意服务条款。">
        <Checkbox {...args} label="我已阅读并同意服务条款" />
      </Field>
      <Field label="服务条款" required help="勾选后才能继续注册。">
        <Checkbox {...args} label="我已阅读并同意服务条款" defaultChecked />
      </Field>
    </div>
  ),
};

function ControlledDemo(args: React.ComponentProps<typeof Checkbox>) {
  const [checked, setChecked] = React.useState(false);
  return (
    <div className={stack}>
      <Checkbox {...args} label="深色代码块" checked={checked} onCheckedChange={setChecked} />
      <span className={note}>当前：{checked ? '开' : '关'}</span>
    </div>
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};

export const InAForm: Story = {
  name: 'In a form',
  render: (args) => (
    <Card title="通知设置" description="选择你想收到的提醒。" className={width}>
      <form className={form} onSubmit={(e) => e.preventDefault()}>
        <div className={list}>
          <Checkbox {...args} name="notify" value="posts" label="新文章" defaultChecked />
          <Checkbox {...args} name="notify" value="replies" label="评论回复" description="只在有人直接回复你时提醒。" defaultChecked />
          <Checkbox {...args} name="notify" value="digest" label="每周摘要" />
        </div>
        <div className={actions}>
          <Button color="secondary" variant="ghost" type="button">取消</Button>
          <Button type="submit">保存</Button>
        </div>
      </form>
    </Card>
  ),
};
