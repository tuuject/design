import { css } from '@koi/react/styled-system/css';

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className={css({ display: 'flex', flexDirection: 'column', gap: '1', marginBlockEnd: '6' })}>
      <h1 className={css({ margin: '0', textStyle: 'heading-1', fontWeight: 'bold', color: 'text' })}>{title}</h1>
      {description ? (
        <p className={css({ margin: '0', textStyle: 'body', color: 'text-muted' })}>{description}</p>
      ) : null}
    </header>
  );
}
