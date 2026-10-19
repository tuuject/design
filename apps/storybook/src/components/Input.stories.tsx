import { Button, CloseIcon, Input, SearchIcon } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { label, row, stack } from '../layout';

const width = css({ width: '[320px]', maxWidth: '100%' });
const narrow = css({ width: '[200px]' });

const meta = {
  title: 'Components/Input',
  component: Input,
  args: { placeholder: 'you@example.com', 'aria-label': '电子邮箱', className: width },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    type: { control: 'select', options: ['text', 'email', 'password', 'search', 'url', 'number'] },
    iconStart: { control: false },
    iconEnd: { control: false },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <div className={stack}>
      <div className={row}>
        <span className={label}>default</span>
        <Input {...args} />
      </div>
      <div className={row}>
        <span className={label}>filled</span>
        <Input {...args} defaultValue="tcdw@example.com" />
      </div>
      <div className={row}>
        <span className={label}>invalid</span>
        <Input {...args} defaultValue="tcdw@example" invalid />
      </div>
      <div className={row}>
        <span className={label}>disabled</span>
        <Input {...args} disabled />
      </div>
      <div className={row}>
        <span className={label}>disabled filled</span>
        <Input {...args} defaultValue="tcdw@example.com" disabled />
      </div>
    </div>
  ),
};

// Inputs share Button's heights, so a row of both lines up.
export const Sizes: Story = {
  render: (args) => (
    <div className={stack}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className={row}>
          <span className={label}>{size}</span>
          <Input {...args} size={size} className={narrow} placeholder="搜索文章" aria-label="搜索文章" />
          <Button size={size}>搜索</Button>
        </div>
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  name: 'With icons',
  render: (args) => (
    <div className={stack}>
      <Input {...args} iconStart={<SearchIcon />} placeholder="搜索文章" aria-label="搜索文章" type="search" />
      <Input
        {...args}
        iconStart={<SearchIcon />}
        iconEnd={<CloseIcon />}
        defaultValue="设计令牌"
        aria-label="搜索文章"
      />
      <Input {...args} size="sm" iconStart={<SearchIcon />} placeholder="搜索文章" aria-label="搜索文章" />
      <Input {...args} iconStart={<SearchIcon />} placeholder="搜索文章" aria-label="搜索文章" disabled />
    </div>
  ),
};
