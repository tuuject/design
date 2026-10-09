import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, type BadgeTone } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import { stack, row, label } from '../layout';

const tones: BadgeTone[] = ['neutral', 'primary', 'accent', 'warning', 'error', 'solid'];

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: '已发布' },
  argTypes: { tone: { control: 'inline-radio', options: tones } },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tones: Story = {
  render: () => (
    <div className={stack}>
      <div className={row}>
        <span className={label}>tone</span>
        {tones.map((t) => <Badge key={t} tone={t}>{t}</Badge>)}
      </div>
      <div className={row}>
        <span className={label}>dot</span>
        {tones.map((t) => <Badge key={t} tone={t} dot>已发布</Badge>)}
      </div>
    </div>
  ),
};

export const InContext: Story = {
  name: 'In context',
  render: () => (
    <div className={row}>
      <span className={css({ display: 'inline-flex', alignItems: 'center', gap: '2' })}>评论 <Badge tone="solid">12</Badge></span>
      <span className={css({ display: 'inline-flex', alignItems: 'center', gap: '2' })}>暗黑模式跟随系统 <Badge tone="accent">NEW</Badge></span>
      <Badge>草稿</Badge>
    </div>
  ),
};
