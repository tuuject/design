import { css } from '@koi/react/styled-system/css';

const s = {
  root: css({ display: 'flex', flexDirection: 'column', gap: '1', marginBlockEnd: '6' }),
  title: css({ margin: '0', textStyle: 'heading-1', fontWeight: 'bold', color: 'text' }),
  description: css({ margin: '0', textStyle: 'body', color: 'text-muted' }),
};

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className={s.root}>
      <h1 className={s.title}>{title}</h1>
      {description ? <p className={s.description}>{description}</p> : null}
    </header>
  );
}
