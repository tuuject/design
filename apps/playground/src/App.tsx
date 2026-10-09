import * as React from 'react';
import { Button, IconButton, Dialog, Spinner, Skeleton, CloseIcon, ExternalIcon, type ButtonColor, type ButtonVariant } from '@koi/react';
import { css } from '@koi/react/styled-system/css';

// One section per component. scripts/shots.mjs screenshots each [data-shot] element in both themes.
const colors: ButtonColor[] = ['primary', 'accent', 'secondary', 'warning', 'error'];
const variants: ButtonVariant[] = ['solid', 'soft', 'outline', 'ghost'];

const page = css({ maxWidth: 'content-max', mx: 'auto', p: '8', display: 'flex', flexDirection: 'column', gap: '10' });
const section = css({ display: 'flex', flexDirection: 'column', gap: '4' });
const row = css({ display: 'flex', gap: '3', flexWrap: 'wrap', alignItems: 'center' });
const label = css({ textStyle: 'small', color: 'text-muted', width: '[88px]' });

export function App() {
  const [open, setOpen] = React.useState(false);
  const [chill, setChill] = React.useState(() => document.documentElement.dataset.font === 'chill');
  const toggleFont = () => { window.koiSetFont?.(chill ? null : 'chill'); setChill(!chill); };
  return (
    <main className={page}>
      <header className={row}>
        <h1 className={css({ textStyle: 'display', m: '0', flex: '1' })}>Koi</h1>
        <Button color="secondary" variant="outline" size="sm" onClick={toggleFont}>
          字体：{chill ? '寒蝉全圆体' : '系统'}
        </Button>
        <Button color="secondary" variant="outline" size="sm" onClick={() => window.koiSetTheme?.(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark')}>
          切换主题
        </Button>
      </header>

      <section className={section} data-shot="Button">
        <h2 className={css({ textStyle: 'heading-2', m: '0' })}>Button</h2>
        {variants.map((v) => (
          <div key={v} className={row}>
            <span className={label}>{v}</span>
            {colors.map((c) => <Button key={c} color={c} variant={v}>按钮</Button>)}
          </div>
        ))}
        <div className={row}>
          <span className={label}>shape / size</span>
          <Button shape="rounded">rounded</Button>
          <Button size="sm">sm</Button>
          <Button size="lg">lg</Button>
          <IconButton label="关闭" icon={<CloseIcon />} />
          <Button loading>保存中</Button>
        </div>
        <div className={row}>
          <span className={label}>as link</span>
          <Button href="#button">阅读全文</Button>
          <Button href="https://github.com/" target="_blank" rel="noopener noreferrer" color="secondary" variant="outline" iconEnd={<ExternalIcon />}>GitHub</Button>
          <Button href="#button" disabled>已禁用</Button>
          <IconButton href="https://github.com/" target="_blank" rel="noopener noreferrer" label="在新窗口打开" icon={<ExternalIcon />} />
        </div>
      </section>

      <section className={section} data-shot="Spinner">
        <h2 className={css({ textStyle: 'heading-2', m: '0' })}>Spinner</h2>
        <div className={row}>
          <span className={label}>size</span>
          <Spinner size="sm" />
          <Spinner />
          <Spinner size="lg" />
        </div>
        <div className={row}>
          <span className={label}>color</span>
          <span className={css({ color: 'text-muted', display: 'inline-flex', alignItems: 'center', gap: '2' })}><Spinner size="sm" />加载中…</span>
          <span className={css({ color: 'text-brand', display: 'inline-flex' })}><Spinner /></span>
        </div>
        <div className={row}>
          <span className={label}>in Button</span>
          <Button size="sm" loading>保存中</Button>
          <Button loading>保存中</Button>
          <Button size="lg" loading>保存中</Button>
          <Button color="secondary" variant="soft" loading>保存中</Button>
          <Button color="secondary" variant="outline" loading>保存中</Button>
        </div>
      </section>

      <section className={section} data-shot="Skeleton">
        <h2 className={css({ textStyle: 'heading-2', m: '0' })}>Skeleton</h2>
        <div className={row}>
          <span className={label}>card</span>
          <div aria-busy="true" aria-label="加载中" className={css({ display: 'flex', flexDirection: 'column', gap: '3', p: '5', width: '[320px]', borderRadius: 'panel', borderWidth: '1px', borderColor: 'border', bg: 'surface' })}>
            <Skeleton className={css({ height: '[140px]', borderRadius: 'xl' })} />
            <div className={css({ display: 'flex', gap: '3', alignItems: 'center' })}>
              <Skeleton className={css({ width: '[40px]', height: '[40px]', borderRadius: 'full', flexShrink: '0' })} />
              <div className={css({ display: 'flex', flexDirection: 'column', gap: '2', flex: '1' })}>
                <Skeleton className={css({ height: '[14px]', width: '60%', borderRadius: 'sm' })} />
                <Skeleton className={css({ height: '[12px]', width: '40%', borderRadius: 'sm' })} />
              </div>
            </div>
          </div>
        </div>
        <div className={row}>
          <span className={label}>list</span>
          <div aria-busy="true" aria-label="加载中" className={css({ display: 'flex', flexDirection: 'column', gap: '3', width: '[320px]' })}>
            {[80, 65, 72].map((w) => (
              <div key={w} className={css({ display: 'flex', gap: '3', alignItems: 'center' })}>
                <Skeleton className={css({ width: '[28px]', height: '[28px]', borderRadius: 'full', flexShrink: '0' })} />
                <Skeleton className={css({ height: '[12px]', borderRadius: 'full' })} style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        </div>
        <div className={row}>
          <span className={label}>in text</span>
          <p className={css({ m: '0' })}>作者：<Skeleton as="span" className={css({ borderRadius: 'sm' })}>某某某</Skeleton> · 发布于 <Skeleton as="span" className={css({ borderRadius: 'sm' })}>2026 年 10 月 9 日</Skeleton></p>
        </div>
        <div className={row}>
          <span className={label}>sized by text</span>
          <Skeleton className={css({ textStyle: 'heading-2', borderRadius: 'lg' })}>示例标题</Skeleton>
          <span className={css({ textStyle: 'heading-2' })}>示例标题</span>
        </div>
      </section>

      <section className={section} data-shot="Dialog">
        <h2 className={css({ textStyle: 'heading-2', m: '0' })}>Dialog</h2>
        <div className={row}><Button color="error" onClick={() => setOpen(true)}>删除文章</Button></div>
        <Dialog
          open={open}
          onOpenChange={setOpen}
          size="sm"
          title="删除这篇文章？"
          description="删除后无法恢复，评论也会一并移除。"
          footer={<>
            <Button color="secondary" variant="ghost" onClick={() => setOpen(false)}>取消</Button>
            <Button color="error" onClick={() => setOpen(false)}>删除</Button>
          </>}
        />
      </section>
    </main>
  );
}
