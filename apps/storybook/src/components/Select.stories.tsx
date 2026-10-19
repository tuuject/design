import { Button, Field, Input, Select } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { label, row, stack } from '../layout';

const width = css({ width: '[320px]', maxWidth: '100%' });
const narrow = css({ width: '[200px]' });

const cities = [
  { value: 'sh', label: '上海' },
  { value: 'bj', label: '北京' },
  { value: 'gz', label: '广州' },
  { value: 'sz', label: '深圳' },
  { value: 'cd', label: '成都', disabled: true },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  args: { options: cities, placeholder: '选择城市', 'aria-label': '城市', className: width, onChange: fn() },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    options: { control: 'object' },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A native `<select>`: it opens the platform picker. For groups, search or custom rows, use SelectPanel. */
export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <div className={stack}>
      <div className={row}>
        <span className={label}>placeholder</span>
        <Select {...args} />
      </div>
      <div className={row}>
        <span className={label}>filled</span>
        <Select {...args} defaultValue="sh" />
      </div>
      <div className={row}>
        <span className={label}>invalid</span>
        <Select {...args} invalid />
      </div>
      <div className={row}>
        <span className={label}>disabled</span>
        <Select {...args} disabled />
      </div>
      <div className={row}>
        <span className={label}>disabled filled</span>
        <Select {...args} defaultValue="sh" disabled />
      </div>
    </div>
  ),
};

// Same heights as Input and Button, so they line up in a row.
export const Sizes: Story = {
  render: (args) => (
    <div className={stack}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className={row}>
          <span className={label}>{size}</span>
          <Select {...args} size={size} className={narrow} defaultValue="bj" />
          <Input size={size} className={narrow} placeholder="详细地址" aria-label="详细地址" />
          <Button size={size}>保存</Button>
        </div>
      ))}
    </div>
  ),
};

/** `<option>` and `<optgroup>` children work as well as `options`. */
export const Children: Story = {
  args: { options: undefined, placeholder: '选择时区' },
  render: (args) => (
    <Select {...args} aria-label="时区">
      <optgroup label="亚洲">
        <option value="Asia/Shanghai">上海（UTC+8）</option>
        <option value="Asia/Tokyo">东京（UTC+9）</option>
      </optgroup>
      <optgroup label="欧洲">
        <option value="Europe/London">伦敦（UTC+0）</option>
        <option value="Europe/Paris">巴黎（UTC+1）</option>
      </optgroup>
    </Select>
  ),
};

export const InField: Story = {
  name: 'In a Field',
  render: (args) => (
    <div className={stack}>
      <Field label="所在城市" help="用于推荐附近的活动。" className={width}>
        <Select {...args} aria-label={undefined} className={undefined} />
      </Field>
      <Field label="所在城市" error="请选择一个城市。" required className={width}>
        <Select {...args} aria-label={undefined} className={undefined} />
      </Field>
    </div>
  ),
};
