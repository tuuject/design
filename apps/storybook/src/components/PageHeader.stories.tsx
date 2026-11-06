import { Button, IconButton, InfoIcon, PageHeader, Tooltip } from '@tuuject/koi-react';
import { css } from '@tuuject/koi-react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';

const page = css({ width: '[760px]', maxWidth: '100%' });
// The header is a container: at this width the actions take a row of their own under the title block.
const narrow = css({ width: '[320px]' });

const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
  args: {
    title: '订单管理',
    description: '筛选、创建、修改、删除并导入导出商城订单',
  },
  argTypes: { title: { control: 'text' }, description: { control: 'text' } },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  decorators: [
    (Story) => (
      <div className={page}>
        <Story />
      </div>
    ),
  ],
};

/** Page-level controls sit on the right, level with the title. */
export const WithActions: Story = {
  name: 'With actions',
  args: {
    actions: (
      <>
        <Button color="secondary" variant="outline">
          导出
        </Button>
        <Button>新建订单</Button>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div className={page}>
        <Story />
      </div>
    ),
  ],
};

/** `info` is a mark beside the title, usually an icon button that explains the page in a Tooltip. */
export const WithInfo: Story = {
  name: 'With info',
  args: {
    info: (
      <Tooltip content="按创建时间倒序排列">
        <IconButton icon={<InfoIcon />} label="关于这个页面" size="sm" variant="ghost" />
      </Tooltip>
    ),
  },
  decorators: [
    (Story) => (
      <div className={page}>
        <Story />
      </div>
    ),
  ],
};

/** At 320px the actions drop below the title block instead of squeezing the title. */
export const Narrow: Story = {
  args: {
    actions: (
      <>
        <Button color="secondary" variant="outline">
          导出
        </Button>
        <Button>新建订单</Button>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div className={narrow}>
        <Story />
      </div>
    ),
  ],
};
