import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import { stack, row, label } from '../layout';

const width = css({ width: '[360px]', maxWidth: '100%' });

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  args: { placeholder: '想说点什么？', 'aria-label': '留言', className: width },
  argTypes: { rows: { control: { type: 'number', min: 1 } } },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <div className={stack}>
      <div className={row}><span className={label}>default</span><Textarea {...args} /></div>
      <div className={row}>
        <span className={label}>filled</span>
        <Textarea {...args} defaultValue={'文章写得很清楚，谢谢！\n想问一下，深色模式下的对比度是怎么检查的？'} />
      </div>
      <div className={row}><span className={label}>invalid</span><Textarea {...args} defaultValue="太短" invalid /></div>
      <div className={row}><span className={label}>disabled</span><Textarea {...args} disabled /></div>
      <div className={row}><span className={label}>rows=2</span><Textarea {...args} rows={2} /></div>
    </div>
  ),
};
