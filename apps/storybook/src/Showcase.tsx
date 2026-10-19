import { Badge, Button, Divider, Spinner } from '@koi/react';
import { css } from '@koi/react/styled-system/css';

/** A few live components for the Introduction page. Lives in TSX because Panda doesn't extract from MDX. */
export function Showcase() {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        p: '6',
        my: '6',
        borderRadius: 'panel',
        borderWidth: '1px',
        borderColor: 'border',
        bg: 'page-bg',
        color: 'text',
        fontFamily: 'sans',
        textStyle: 'body',
      })}
    >
      <div className={css({ display: 'flex', gap: '3', flexWrap: 'wrap', alignItems: 'center' })}>
        <Button>发布文章</Button>
        <Button color="secondary" variant="outline">
          存为草稿
        </Button>
        <Button color="accent" variant="soft">
          预览
        </Button>
        <Button color="secondary" variant="ghost" loading>
          同步中
        </Button>
      </div>
      <Divider />
      <div className={css({ display: 'flex', gap: '2', flexWrap: 'wrap', alignItems: 'center' })}>
        <Badge tone="primary" dot>
          已发布
        </Badge>
        <Badge tone="accent">NEW</Badge>
        <Badge tone="warning">待审核</Badge>
        <Badge>草稿</Badge>
        <span className={css({ display: 'inline-flex', alignItems: 'center', gap: '2', color: 'text-muted' })}>
          <Spinner size="sm" />
          加载中…
        </span>
      </div>
    </div>
  );
}
