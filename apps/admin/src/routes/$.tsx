import { css } from '@koi/react/styled-system/css';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@koi/react/button';

export const Route = createFileRoute('/$')({
  staticData: { title: '页面不存在' },
  component: NotFoundPage,
});

const s = {
  page: css({ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4', textAlign: 'center' }),
  code: css({ margin: '0', textStyle: 'display', fontWeight: 'bold', color: 'text-brand' }),
  text: css({ margin: '0', textStyle: 'body', color: 'text-muted' }),
};

function NotFoundPage() {
  return (
    <div className={s.page}>
      <p className={s.code}>404</p>
      <p className={s.text}>这个页面不在这里，可能已被移动或删除。</p>
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
