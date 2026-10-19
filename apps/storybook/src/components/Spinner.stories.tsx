import { Button, Spinner } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { label, row, stack } from '../layout';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Overview: Story = {
  render: () => (
    <div className={stack}>
      <div className={row}>
        <span className={label}>size</span>
        <Spinner size="sm" />
        <Spinner />
        <Spinner size="lg" />
      </div>
      <div className={row}>
        <span className={label}>color</span>
        <span className={css({ color: 'text-muted', display: 'inline-flex', alignItems: 'center', gap: '2' })}>
          <Spinner size="sm" />
          加载中…
        </span>
        <span className={css({ color: 'text-brand', display: 'inline-flex' })}>
          <Spinner />
        </span>
      </div>
      <div className={row}>
        <span className={label}>in Button</span>
        <Button size="sm" loading>
          保存中
        </Button>
        <Button loading>保存中</Button>
        <Button size="lg" loading>
          保存中
        </Button>
        <Button color="secondary" variant="soft" loading>
          保存中
        </Button>
        <Button color="secondary" variant="outline" loading>
          保存中
        </Button>
      </div>
    </div>
  ),
};
