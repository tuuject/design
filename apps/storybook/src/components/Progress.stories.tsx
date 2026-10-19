import { Button, Progress, type ProgressSize } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useLayoutEffect, useRef, useState } from 'react';
import { label, row, stack } from '../layout';

const sizes: ProgressSize[] = ['sm', 'md', 'lg'];
const column = css({ display: 'flex', flexDirection: 'column', gap: '5' });

/**
 * Under automation (`pnpm shots`, where `navigator.webdriver` is true) the indeterminate slide is paused halfway,
 * with the bar in the middle of the track, so screenshots don't depend on when they were taken. In a normal
 * browser it keeps sliding.
 */
const freezeForShots: Decorator = (Story) => {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!navigator.webdriver || !ref.current) {
      return;
    }
    for (const a of ref.current.getAnimations({ subtree: true })) {
      if ((a as CSSAnimation).animationName !== 'koi-indet') {
        continue;
      }
      a.pause();
      a.currentTime = 600; // half of the 1.2s slide
    }
  });
  return (
    <div ref={ref}>
      <Story />
    </div>
  );
};

const meta = {
  title: 'Components/Progress',
  component: Progress,
  args: { value: 60, max: 100, label: '上传文件', showValue: true, size: 'md' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    size: { control: 'inline-radio', options: sizes },
  },
  decorators: [
    freezeForShots,
    (Story) => (
      <div className={css({ width: '[360px]' })}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The head row (label, percentage) only shows when there's something in it. */
export const Overview: Story = {
  render: () => (
    <div className={column}>
      <Progress value={42} label="上传文件" showValue />
      <Progress value={100} label="已完成" showValue />
      <Progress value={0} label="等待开始" showValue />
      <Progress value={68} label="仅标签" />
      <Progress value={25} />
      <Progress label="正在准备…" />
    </div>
  ),
};

/** sm 4px, md 8px, lg 12px tracks. */
export const Sizes: Story = {
  render: () => (
    <div className={stack}>
      {sizes.map((size) => (
        <div key={size} className={row}>
          <span className={label}>{size}</span>
          <div className={css({ flex: '1', display: 'flex', flexDirection: 'column', gap: '3' })}>
            <Progress size={size} value={60} />
            <Progress size={size} />
          </div>
        </div>
      ))}
    </div>
  ),
};

/** Without `value` a 40% bar slides across the track, over and over. Under reduced motion it fills the track and pulses in place instead. */
export const Indeterminate: Story = {
  args: { value: undefined, label: '正在处理', showValue: true },
};

/** The bar eases to each new value on the spring curve. */
export const Changing: Story = {
  render: function Render() {
    const [value, setValue] = useState(30);
    return (
      <div className={column}>
        <Progress value={value} label="下载中" showValue />
        <div className={row}>
          <Button size="sm" variant="soft" onClick={() => setValue((v) => Math.max(0, v - 20))}>
            -20
          </Button>
          <Button size="sm" variant="soft" onClick={() => setValue((v) => Math.min(100, v + 20))}>
            +20
          </Button>
          <Button size="sm" variant="outline" onClick={() => setValue(0)}>
            重置
          </Button>
        </div>
      </div>
    );
  },
};
