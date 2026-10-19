import { Button, CloseIcon, ExternalIcon, IconButton, InfoIcon, Link, SearchIcon, Tooltip } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { label, row } from '../layout';

// Room above and below each trigger, so an open tooltip has space on both sides and doesn't flip.
const roomy = css({ py: '12' });
// One row per trigger, far enough apart that each open bubble (below its trigger) clears the next row.
const tall = css({ display: 'flex', flexDirection: 'column', gap: '16' });
const wide = css({ display: 'flex', gap: '12', flexWrap: 'wrap', alignItems: 'center' });

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  args: {
    content: '复制文章链接',
    side: 'top',
    children: (
      <Button color="secondary" variant="soft">
        分享
      </Button>
    ),
    onOpenChange: fn(),
  },
  argTypes: {
    side: { control: 'inline-radio', options: ['top', 'bottom'] },
    open: { control: 'boolean' },
    children: { control: false },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

const withRoom: Story['decorators'] = [
  (Story) => (
    <div className={roomy}>
      <Story />
    </div>
  ),
];

/** Hover or tab to the button. */
export const Playground: Story = { decorators: withRoom };

/**
 * Both sides, rendered open. The popup is portaled to `<body>`, outside the story root, so scripts/shots.mjs shoots
 * these as the whole viewport (`shot-viewport`).
 */
export const Sides: Story = {
  tags: ['shot-viewport'],
  decorators: withRoom,
  render: (args) => (
    <div className={wide}>
      <Tooltip {...args} side="top" content="上方（默认）" open>
        <Button color="secondary" variant="outline">
          top
        </Button>
      </Tooltip>
      <Tooltip {...args} side="bottom" content="下方" open>
        <Button color="secondary" variant="outline">
          bottom
        </Button>
      </Tooltip>
    </div>
  ),
};

/** The main use: naming icon-only buttons. The IconButton's native `title` is dropped so only one tooltip shows. */
export const IconButtons: Story = {
  tags: ['shot-viewport'],
  decorators: withRoom,
  render: (args) => (
    <div className={row}>
      <Tooltip {...args} content="搜索" open>
        <IconButton label="搜索" icon={<SearchIcon />} />
      </Tooltip>
      <Tooltip {...args} content="在新窗口打开">
        <IconButton label="在新窗口打开" icon={<ExternalIcon />} href="https://example.com" target="_blank" />
      </Tooltip>
      <Tooltip {...args} content="关闭">
        <IconButton label="关闭" icon={<CloseIcon />} />
      </Tooltip>
    </div>
  ),
};

/** Any focusable child works: a Button, a Link, a disabled Button (hover only, as it can't take focus). Long text wraps at 240px. */
export const Triggers: Story = {
  tags: ['shot-viewport'],
  render: (args) => (
    <div className={tall}>
      <div className={row}>
        <span className={label}>Link</span>
        <Tooltip {...args} content="https://example.com/archive" side="bottom" open>
          <Link href="https://example.com/archive">归档</Link>
        </Tooltip>
      </div>
      <div className={row}>
        <span className={label}>disabled</span>
        <Tooltip {...args} content="登录后才能评论" side="bottom" open>
          <Button disabled>发表评论</Button>
        </Tooltip>
      </div>
      <div className={row}>
        <span className={label}>long</span>
        <Tooltip
          {...args}
          content="草稿会自动保存在本地，关闭页面后再打开也不会丢失，但换一台设备就看不到了。"
          side="bottom"
          open
        >
          <Button color="secondary" variant="ghost" iconStart={<InfoIcon />}>
            草稿说明
          </Button>
        </Tooltip>
      </div>
    </div>
  ),
};

/** A tooltip asked for on top of a trigger at the top edge flips below it. */
export const Flip: Story = {
  tags: ['shot-viewport', '!autodocs'],
  render: (args) => (
    <div className={row}>
      <span className={label}>side=&quot;top&quot;</span>
      <Tooltip {...args} content="上方放不下，翻到下方" side="top" open>
        <Button color="secondary" variant="outline">
          靠近顶部
        </Button>
      </Tooltip>
    </div>
  ),
};
