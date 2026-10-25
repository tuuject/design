import { Avatar, ChatBubble } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { label, stack } from '../layout';

const meta = {
  title: 'Components/ChatBubble',
  component: ChatBubble,
  args: { children: '这条消息要认真核对一下参数，别把宽度算错了。' },
  argTypes: { side: { control: 'radio', options: ['received', 'sent'] } },
} satisfies Meta<typeof ChatBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** `received` is a muted panel; `sent` is the filled action color. Alignment is the app's layout. */
export const Sides: Story = {
  render: () => (
    <div className={stack}>
      <div className={css({ display: 'flex', gap: '3', alignItems: 'baseline' })}>
        <span className={label}>received</span>
        <ChatBubble>这边看没问题，明早同步给你。</ChatBubble>
      </div>
      <div className={css({ display: 'flex', gap: '3', justifyContent: 'flex-end', alignItems: 'baseline' })}>
        <span className={label}>sent</span>
        <ChatBubble side="sent">收到，我改完就发过去。</ChatBubble>
      </div>
    </div>
  ),
};

/** Long messages wrap at the 480px cap instead of running the row; anchors mark the sender's side. */
export const Thread: Story = {
  render: () => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '3', maxWidth: '[560px]' })}>
      <div className={chatRow}>
        <Avatar name="小鲤" />
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '1', alignItems: 'flex-start' })}>
          <div className={metaLine}>
            <span>小鲤</span>
            <span>14:02</span>
          </div>
          <ChatBubble>
            我把调色板那页的截图都看了一遍，深色模式的对比度已经达标了，就差 rose 配色再确认一轮，你那边什么时候方便？
          </ChatBubble>
        </div>
      </div>
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '1', alignItems: 'flex-end' })}>
        <span className={metaLine}>14:05</span>
        <ChatBubble side="sent">下午三点之后都行，我把检查结果先跑上。</ChatBubble>
      </div>
    </div>
  ),
};

const chatRow = css({ display: 'flex', gap: '2', alignItems: 'flex-start' });
const metaLine = css({ display: 'flex', gap: '3', textStyle: 'small', color: 'text-muted' });
