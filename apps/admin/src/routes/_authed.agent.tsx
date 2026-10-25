import { ChatBubble } from '@koi/react/chat-bubble';
import { css } from '@koi/react/styled-system/css';
import { createFileRoute } from '@tanstack/react-router';
import { Markdown } from '../components/Markdown';
import { PageHeader } from '../components/PageHeader';

export const Route = createFileRoute('/_authed/agent')({
  staticData: { title: 'AI 助手' },
  component: AgentPage,
});

interface AgentTurn {
  from: 'user' | 'assistant';
  at: string;
  text: string;
}

const ASSISTANT_NAME = 'Koi 助手';

// Static sample conversation. The user's turns are bubbles on the right; the assistant's replies are
// flat markdown on the page — no bubble, just prose.
const TURNS: AgentTurn[] = [
  {
    from: 'user',
    at: '14:03',
    text: '订单列表的筛选条件存在哪里？刷新以后还在吗？',
  },
  {
    from: 'assistant',
    at: '14:04',
    text: `筛选条件全部存在 URL 的查询参数里，刷新、分享链接、浏览器后退都会原样还原。

### 支持的参数

- \`id\`：按订单号精确匹配
- \`customer\`：客户名包含匹配
- \`status\`：\`pending\` / \`paid\` / \`shipped\` / \`cancelled\`
- \`from\`、\`to\`：创建时间范围，格式 \`YYYY-MM-DD\`
- \`page\`、\`pageSize\`：分页，页大小只接受 10 / 20 / 50

\`\`\`text
/orders?customer=林&status=paid&from=2026-10-01&page=2
\`\`\`

筛选表单本身是手动的：要点「搜索」或按回车才写入 URL，避免每敲一个字就发一次查询。`,
  },
  {
    from: 'user',
    at: '14:06',
    text: '那把订单导出成 CSV，用 Excel 打开会乱码吗？',
  },
  {
    from: 'assistant',
    at: '14:07',
    text: `不会。导出时已写入 UTF-8 BOM，Excel 双击打开就能认出编码。

导入时有三个细节：

1. 按「订单号」upsert——已存在就更新，不存在就新增；
2. 坏行会跳过，处理完在 toast 里报告跳过了几行；
3. 表头第一行是字段识别的依据，列的顺序不重要。

> 导出的文件带 BOM，用「数据 → 从文本导入」时记得仍选 UTF-8，别让 Excel 再猜一次。`,
  },
];

const s = {
  thread: css({ display: 'flex', flexDirection: 'column', gap: '5', maxWidth: '[720px]' }),
  userRow: css({ display: 'flex', justifyContent: 'flex-end' }),
  turnCol: css({ display: 'flex', flexDirection: 'column', gap: '1', alignItems: 'flex-end', minWidth: '0' }),
  assistantTurn: css({ display: 'flex', flexDirection: 'column', gap: '1', minWidth: '0' }),
  meta: css({ display: 'flex', gap: '3', textStyle: 'small', color: 'text-muted' }),
};

function Turn({ turn }: { turn: AgentTurn }) {
  if (turn.from === 'user') {
    return (
      <div className={s.userRow}>
        <div className={s.turnCol}>
          <span className={s.meta}>{turn.at}</span>
          <ChatBubble side="sent">{turn.text}</ChatBubble>
        </div>
      </div>
    );
  }
  return (
    <div className={s.assistantTurn}>
      <div className={s.meta}>
        <span>{ASSISTANT_NAME}</span>
        <span>{turn.at}</span>
      </div>
      <Markdown>{turn.text}</Markdown>
    </div>
  );
}

function AgentPage() {
  return (
    <div>
      <PageHeader title="AI 助手" description="真人消息是右侧的气泡，助手的回复直接平铺成 markdown 正文。" />
      <div className={s.thread}>
        {TURNS.map((turn) => (
          <Turn key={turn.at} turn={turn} />
        ))}
      </div>
    </div>
  );
}
