import * as React from 'react';
import { css } from '@koi/react/styled-system/css';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { Alert } from '@koi/react/alert';
import { Button } from '@koi/react/button';
import { Card } from '@koi/react/card';
import { Field } from '@koi/react/field';
import { Input } from '@koi/react/input';
import { useAuthStore } from '../stores/auth';
import { mockLogin } from '../mock/api';
import { ThemeToggle } from '../components/app-shell/ThemeToggle';

export const Route = createFileRoute('/login')({
  staticData: { title: '登录' },
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    // Only in-app paths may be redirected to (no //evil.com or https://).
    redirect: typeof search.redirect === 'string' && search.redirect.startsWith('/') ? search.redirect : undefined,
  }),
  beforeLoad: () => {
    if (useAuthStore.getState().user) throw redirect({ to: '/dashboard' });
  },
  component: LoginPage,
});

const s = {
  page: css({ minHeight: '100%', display: 'grid', placeItems: 'center', padding: '4' }),
  themeCorner: css({ position: 'fixed', top: '4', right: '4' }),
  card: css({ width: 'min(400px, 100%)', boxSizing: 'border-box' }),
  brand: css({ display: 'flex', alignItems: 'center', gap: '3', marginBlockEnd: '6' }),
  logo: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'control-lg',
    height: 'control-lg',
    borderRadius: 'xl',
    bg: 'secondary-solid',
    color: 'on-secondary-solid',
    textStyle: 'heading-3',
    fontWeight: 'bold',
    flexShrink: '0',
  }),
  brandTitle: css({ margin: '0', textStyle: 'heading-2', fontWeight: 'bold', color: 'text' }),
  brandSubtitle: css({ margin: '0', textStyle: 'small', color: 'text-muted' }),
  alert: css({ marginBlockEnd: '4' }),
  form: css({ display: 'flex', flexDirection: 'column', gap: '4' }),
  hint: css({ margin: '0', marginBlockStart: '4', textStyle: 'small', color: 'text-muted', textAlign: 'center' }),
};

function LoginPage() {
  const search = Route.useSearch();
  const router = useRouter();
  const login = useAuthStore((st) => st.login);
  const [username, setUsername] = React.useState('admin');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const submit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await mockLogin(username, password);
      login(user);
      router.history.push(search.redirect ?? '/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请稍后再试。');
      setSubmitting(false);
    }
  };

  return (
    <div className={s.page}>
      <div className={s.themeCorner}><ThemeToggle /></div>
      <Card className={s.card}>
        <div className={s.brand}>
          <span className={s.logo}>K</span>
          <div>
            <h1 className={s.brandTitle}>Koi Admin</h1>
            <p className={s.brandSubtitle}>Koi 组件库后台管理模板</p>
          </div>
        </div>
        {error ? <Alert tone="error" className={s.alert}>{error}</Alert> : null}
        <form className={s.form} onSubmit={submit}>
          <Field label="用户名">
            <Input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          </Field>
          <Field label="密码">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </Field>
          <Button type="submit" size="lg" fullWidth loading={submitting}>登录</Button>
        </form>
        <p className={s.hint}>演示账号：admin · 密码：123456</p>
      </Card>
    </div>
  );
}
