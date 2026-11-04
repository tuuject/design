import { Field, Slider } from '@tuuject/koi-react';
import { css } from '@tuuject/koi-react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';
import { fn } from 'storybook/test';
import { label, stack } from '../layout';

const width = css({ width: '[360px]', maxWidth: '100%' });

const meta = {
  title: 'Components/Slider',
  component: Slider,
  args: {
    label: '音量',
    showValue: true,
    defaultValue: 40,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    onValueChange: fn(),
    onValueCommitted: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    showValue: { control: 'boolean' },
    disabled: { control: 'boolean' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <div className={width}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <div className={stack}>
      <span className={label}>default</span>
      <Slider {...args} label={undefined} aria-label="音量" defaultValue={40} />
      <span className={label}>disabled</span>
      <Slider {...args} label={undefined} aria-label="音量" defaultValue={40} disabled />
      <span className={label}>at min</span>
      <Slider {...args} label={undefined} aria-label="音量" defaultValue={0} />
      <span className={label}>at max</span>
      <Slider {...args} label={undefined} aria-label="音量" defaultValue={100} />
      <span className={label}>no value</span>
      <Slider {...args} label={undefined} showValue={false} aria-label="音量" defaultValue={40} />
    </div>
  ),
};

// A quality control: a fractional range with a percentage readout.
export const Fractional: Story = {
  args: {
    label: '压缩质量',
    min: 0.1,
    max: 1,
    step: 0.05,
    defaultValue: 0.8,
    formatValue: (value) => `${Math.round(value * 100)}%`,
  },
};

export const InAField: Story = {
  name: 'In a field',
  args: {
    label: undefined,
    showValue: true,
    defaultValue: 40,
  },
  render: (args) => (
    <Field label="音量" help="调整会立即生效。">
      <Slider {...args} />
    </Field>
  ),
};

export const WithError: Story = {
  name: 'With error',
  args: {
    label: undefined,
    showValue: true,
    defaultValue: 0,
  },
  render: (args) => (
    <Field label="音量" error="至少调到 10，否则听不到提示音。">
      <Slider {...args} />
    </Field>
  ),
};

function ControlledDemo(args: ComponentProps<typeof Slider>) {
  const [value, setValue] = useState(30);
  return (
    <div className={stack}>
      <Slider {...args} value={value} onValueChange={setValue} />
      <span className={label}>当前：{value}</span>
    </div>
  );
}

export const Controlled: Story = {
  args: {
    label: '音量',
    showValue: true,
  },
  render: (args) => <ControlledDemo {...args} />,
};
