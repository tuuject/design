import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import { row, label } from '../layout';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {
  render: () => (
    <div aria-busy="true" aria-label="加载中" className={css({ display: 'flex', flexDirection: 'column', gap: '3', p: '5', width: '[320px]', borderRadius: 'panel', borderWidth: '1px', borderColor: 'border', bg: 'surface' })}>
      <Skeleton className={css({ height: '[140px]', borderRadius: 'xl' })} />
      <div className={css({ display: 'flex', gap: '3', alignItems: 'center' })}>
        <Skeleton className={css({ width: '[40px]', height: '[40px]', borderRadius: 'full', flexShrink: '0' })} />
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '2', flex: '1' })}>
          <Skeleton className={css({ height: '[14px]', width: '60%', borderRadius: 'sm' })} />
          <Skeleton className={css({ height: '[12px]', width: '40%', borderRadius: 'sm' })} />
        </div>
      </div>
    </div>
  ),
};

export const List: Story = {
  render: () => (
    <div aria-busy="true" aria-label="加载中" className={css({ display: 'flex', flexDirection: 'column', gap: '3', width: '[320px]' })}>
      {[80, 65, 72].map((w) => (
        <div key={w} className={css({ display: 'flex', gap: '3', alignItems: 'center' })}>
          <Skeleton className={css({ width: '[28px]', height: '[28px]', borderRadius: 'full', flexShrink: '0' })} />
          <Skeleton className={css({ height: '[12px]', borderRadius: 'full' })} style={{ width: `${w}%` }} />
        </div>
      ))}
    </div>
  ),
};

export const InText: Story = {
  name: 'In text',
  render: () => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
      <p className={css({ m: '0' })}>作者：<Skeleton as="span" className={css({ borderRadius: 'sm' })}>某某某</Skeleton> · 发布于 <Skeleton as="span" className={css({ borderRadius: 'sm' })}>2026 年 10 月 9 日</Skeleton></p>
      <div className={row}>
        <span className={label}>sized by text</span>
        <Skeleton className={css({ textStyle: 'heading-2', borderRadius: 'lg' })}>示例标题</Skeleton>
        <span className={css({ textStyle: 'heading-2' })}>示例标题</span>
      </div>
    </div>
  ),
};
