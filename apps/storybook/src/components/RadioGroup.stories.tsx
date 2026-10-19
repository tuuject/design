import { Button, Card, Field, RadioGroup } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { fn } from 'storybook/test';
import { label, row, stack } from '../layout';

const width = css({ width: '[360px]', maxWidth: '100%' });
const form = css({ display: 'flex', flexDirection: 'column', gap: '4' });
const actions = css({ display: 'flex', justifyContent: 'flex-end', gap: '2' });
const note = css({ textStyle: 'small', color: 'text-muted' });

const sizes = [
  { value: 'sm', label: '小' },
  { value: 'md', label: '中' },
  { value: 'lg', label: '大' },
];

const visibility = [
  { value: 'public', label: '公开', description: '所有人都能看到这篇文章。' },
  { value: 'unlisted', label: '不公开列出', description: '只有拿到链接的人能看到。' },
  { value: 'private', label: '私密', description: '只有你自己能看到。' },
];

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  args: {
    label: '字号',
    options: sizes,
    defaultValue: 'md',
    orientation: 'vertical',
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    value: { control: 'text' },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <div className={stack}>
      <div className={row}>
        <span className={label}>none chosen</span>
        <RadioGroup {...args} orientation="horizontal" defaultValue={undefined} />
      </div>
      <div className={row}>
        <span className={label}>chosen</span>
        <RadioGroup {...args} orientation="horizontal" defaultValue="md" />
      </div>
      <div className={row}>
        <span className={label}>one disabled</span>
        <RadioGroup
          {...args}
          orientation="horizontal"
          defaultValue="md"
          options={[...sizes.slice(0, 2), { value: 'lg', label: '大', disabled: true }]}
        />
      </div>
      <div className={row}>
        <span className={label}>disabled</span>
        <RadioGroup {...args} orientation="horizontal" defaultValue="md" disabled />
      </div>
    </div>
  ),
};

export const WithDescription: Story = {
  name: 'With description',
  args: { label: '可见范围', options: visibility, defaultValue: 'public' },
  render: (args) => <RadioGroup {...args} className={width} />,
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
};

// Inside a Field, the Field's label names the group, its error and help describe each radio and its error
// turns the unchosen edges red.
export const InAField: Story = {
  name: 'In a field',
  render: (args) => (
    <div className={`${stack} ${width}`}>
      <Field label="可见范围" required error="请选择谁能看到这篇文章。">
        <RadioGroup {...args} label={undefined} options={visibility} defaultValue={undefined} />
      </Field>
      <Field label="字号" help="只影响正文，标题不变。">
        <RadioGroup {...args} label={undefined} orientation="horizontal" />
      </Field>
    </div>
  ),
};

function ControlledDemo(args: React.ComponentProps<typeof RadioGroup>) {
  const [value, setValue] = React.useState('md');
  return (
    <div className={stack}>
      <RadioGroup
        {...args}
        value={value}
        onChange={(v, d) => {
          setValue(v);
          args.onChange?.(v, d);
        }}
      />
      <span className={note}>当前：{sizes.find((s) => s.value === value)?.label}</span>
    </div>
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledDemo {...args} />,
};

export const InAForm: Story = {
  name: 'In a form',
  render: (args) => (
    <Card title="发布设置" description="发布前确认一下。" className={width}>
      <form className={form} onSubmit={(e) => e.preventDefault()}>
        <Field label="可见范围">
          <RadioGroup {...args} label={undefined} name="visibility" options={visibility} defaultValue="public" />
        </Field>
        <div className={actions}>
          <Button color="secondary" variant="ghost" type="button">
            取消
          </Button>
          <Button type="submit">发布</Button>
        </div>
      </form>
    </Card>
  ),
};
