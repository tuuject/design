import { Card, Link } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { stack } from '../layout';

const para = css({ m: '0', maxWidth: '[480px]' });

const meta = {
  title: 'Components/Link',
  component: Link,
  args: { href: '#', children: '查看更新日志', external: false },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const External: Story = {
  args: { href: 'https://example.com', children: '项目主页', external: true },
};

export const InText: Story = {
  name: 'In text',
  render: () => (
    <div className={stack}>
      <p className={para}>
        Koi 的颜色和间距都来自<Link href="#">设计令牌</Link>，组件只用语义角色，不直接写色值。完整规范见
        <Link href="https://example.com" external>
          设计文档
        </Link>
        。
      </p>
      <p className={css({ m: '0', maxWidth: '[480px]', textStyle: 'prose' })}>
        长文阅读用 16px 的 prose 字号，链接跟着正文放大：<Link href="#">从旧版迁移</Link>，或者
        <Link href="https://example.com" external>
          在 GitHub 上提问
        </Link>
        。
      </p>
      <Card title="在卡片上" className={css({ maxWidth: '[480px]' })}>
        <p className={para}>
          放在 surface 上也一样：<Link href="#">编辑资料</Link>、
          <Link href="https://example.com" external>
            帮助中心
          </Link>
          。
        </p>
      </Card>
    </div>
  ),
};
