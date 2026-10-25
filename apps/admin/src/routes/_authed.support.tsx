import { Avatar } from '@koi/react/avatar';
import { Card } from '@koi/react/card';
import { ChatBubble } from '@koi/react/chat-bubble';
import { css } from '@koi/react/styled-system/css';
import { createFileRoute } from '@tanstack/react-router';
import { PageHeader } from '../components/PageHeader';

export const Route = createFileRoute('/_authed/support')({
  staticData: { title: '客服会话' },
  component: SupportPage,
});

interface SupportMessage {
  from: 'customer' | 'agent';
  at: string;
  text: string;
}

const CUSTOMER_NAME = '林晚照';
const AGENT_NAME = '客服小周';

// Static sample conversation: two humans going back and forth about a stuck shipment.
const MESSAGES: SupportMessage[] = [
  { from: 'customer', at: '14:02', text: '你好，我上周买的锦鲤抱枕（订单 SO-2410092）显示已发货，但物流三天没动了。' },
  { from: 'agent', at: '14:05', text: '您好！很抱歉给您带来不便，我马上帮您查一下这条物流记录。' },
  {
    from: 'agent',
    at: '14:08',
    text: '查到了：包裹在 10 月 21 日到杭州转运中心后漏扫，件还在仓里，今天就安排优先出库，预计明天送达。',
  },
  { from: 'customer', at: '14:10', text: '好的，那如果明天还没到呢？' },
  { from: 'agent', at: '14:11', text: '明天下午还没更新的话您再找我，我们直接给您补发一件，运费我们承担。' },
  { from: 'customer', at: '14:12', text: '行，麻烦你们了。' },
];

const s = {
  thread: css({ display: 'flex', flexDirection: 'column', gap: '4' }),
  meta: css({ display: 'flex', gap: '3', textStyle: 'small', color: 'text-muted' }),
};

function MessageRow({ message }: { message: SupportMessage }) {
  const received = message.from === 'customer';
  const name = received ? CUSTOMER_NAME : AGENT_NAME;
  return (
    // Customer rows read from the left (avatar + received bubble); the agent sits on the right.
    <div
      className={css({
        display: 'flex',
        gap: '2',
        alignItems: 'flex-start',
        justifyContent: received ? 'flex-start' : 'flex-end',
      })}
    >
      {received ? <Avatar name={CUSTOMER_NAME} /> : null}
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '1',
          minWidth: '0',
          alignItems: received ? 'flex-start' : 'flex-end',
        })}
      >
        <div className={s.meta}>
          <span>{name}</span>
          <span>{message.at}</span>
        </div>
        <ChatBubble side={received ? 'received' : 'sent'}>{message.text}</ChatBubble>
      </div>
    </div>
  );
}

function SupportPage() {
  return (
    <div>
      <PageHeader title="客服会话" description="客户与客服的一来一回：received 在左，sent 在右。" />
      <Card
        title={CUSTOMER_NAME}
        description={
          <span className={css({ display: 'inline-flex', gap: '3' })}>
            <span>订单 SO-2410092</span>
            <span>已发货</span>
          </span>
        }
        className={css({ maxWidth: '[720px]' })}
      >
        <div className={s.thread}>
          {MESSAGES.map((message) => (
            <MessageRow key={message.at} message={message} />
          ))}
        </div>
      </Card>
    </div>
  );
}
