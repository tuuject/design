import { Button } from '@koi/react/button';
import { css } from '@koi/react/styled-system/css';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/$')({
  staticData: { title: '页面不存在' },
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <div
      className={css({
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4',
        textAlign: 'center',
      })}
    >
      <p className={css({ margin: '0', textStyle: 'display', fontWeight: 'bold', color: 'text-brand' })}>404</p>
      <p className={css({ margin: '0', textStyle: 'body', color: 'text-muted' })}>
        这个页面不在这里，可能已被移动或删除。
      </p>
      <Button
        onClick={() => {
          window.location.assign('/');
        }}
      >
        返回首页
      </Button>
    </div>
  );
}
