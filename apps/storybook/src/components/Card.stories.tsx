import { Button, Card } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { row } from '../layout';

const variants = ['outlined', 'filled', 'glass'] as const;

const cardWidth = css({ width: '[300px]' });
// Stand-in for an image: a gradient in role colors, so the glass and media stories have color to sit on.
const art = css({ bgGradient: 'to-br', gradientFrom: 'action', gradientTo: 'highlight' });

const footer = (
  <>
    <Button color="secondary" variant="ghost">
      取消订阅
    </Button>
    <Button>订阅</Button>
  </>
);

const meta = {
  title: 'Components/Card',
  component: Card,
  args: {
    title: '订阅更新',
    description: '有新文章时通过邮件通知你。',
    children: '每月最多一封，随时可以退订。',
    footer,
    className: cardWidth,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: variants },
    padding: { control: 'inline-radio', options: ['default', 'none'] },
    footer: { control: false },
    media: { control: false },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className={row}>
      <Card {...args} variant="outlined" />
      <Card {...args} variant="filled" />
    </div>
  ),
};

export const Glass: Story = {
  render: (args) => (
    <div className={css({ position: 'relative', p: '8', borderRadius: 'panel', overflow: 'hidden' })}>
      <div className={`${art} ${css({ position: 'absolute', inset: '0' })}`} />
      <Card {...args} variant="glass" />
    </div>
  ),
};

export const WithMedia: Story = {
  name: 'With media',
  args: {
    media: <div className={`${art} ${css({ height: '[140px]' })}`} role="img" aria-label="文章封面" />,
    title: 'Koi 设计系统',
    description: 'Oct 7, 2026 · tcdw',
    children: '圆润的胶囊控件、毛玻璃面板、天蓝色操作和琥珀色链接。',
    footer: <Button variant="soft">阅读全文</Button>,
  },
};

export const Minimal: Story = {
  render: (args) => (
    <div className={row}>
      <Card className={cardWidth}>只有正文的卡片。</Card>
      <Card className={cardWidth} variant="filled" title="设置" description="标题和描述，没有正文。" />
      <Card {...args} padding="none" title={undefined} description={undefined} footer={undefined} media={undefined}>
        <div className={css({ p: '3', textStyle: 'small', color: 'text-muted' })}>padding="none"：内容自己留边距。</div>
      </Card>
    </div>
  ),
};
