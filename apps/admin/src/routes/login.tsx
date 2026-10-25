import { Alert } from '@koi/react/alert';
import { Button } from '@koi/react/button';
import { Card } from '@koi/react/card';
import { Field } from '@koi/react/field';
import { Input } from '@koi/react/input';
import { css } from '@koi/react/styled-system/css';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { ThemeToggle } from '../components/app-shell/ThemeToggle';
import { mockLogin } from '../mock/api';
import { useAuthStore } from '../stores/auth';

export const Route = createFileRoute('/login')({
  staticData: { title: '登录' },
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    // Only in-app paths may be redirected to (no //evil.com or https://).
    redirect: typeof search.redirect === 'string' && search.redirect.startsWith('/') ? search.redirect : undefined,
  }),
  beforeLoad: () => {
    if (useAuthStore.getState().user) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: LoginPage,
});

interface LoginValues {
  username: string;
  password: string;
}

function LoginPage() {
  const search = Route.useSearch();
  const router = useRouter();
  const login = useAuthStore((st) => st.login);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ defaultValues: { username: 'admin', password: '' } });

  const submit = handleSubmit(async ({ username, password }) => {
    clearErrors('root');
    try {
      const user = await mockLogin(username, password);
      login(user);
      router.history.push(search.redirect ?? '/dashboard');
    } catch (err) {
      setError('root', { message: err instanceof Error ? err.message : '登录失败，请稍后再试。' });
    }
  });

  return (
    <div className={css({ minHeight: '100%', display: 'grid', placeItems: 'center', padding: '4' })}>
      <div className={css({ position: 'fixed', top: '4', right: '4' })}>
        <ThemeToggle />
      </div>
      <Card className={css({ width: 'min(400px, 100%)', boxSizing: 'border-box' })}>
        <div className={css({ display: 'flex', alignItems: 'center', gap: '3', marginBlockEnd: '6' })}>
          <span
            className={css({
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
            })}
          >
            K
          </span>
          <div>
            <h1 className={css({ margin: '0', textStyle: 'heading-2', fontWeight: 'bold', color: 'text' })}>
              Koi Admin
            </h1>
            <p className={css({ margin: '0', textStyle: 'small', color: 'text-muted' })}>Koi 组件库后台管理模板</p>
          </div>
        </div>
        {errors.root?.message ? (
          <Alert tone="error" className={css({ marginBlockEnd: '4' })}>
            {errors.root.message}
          </Alert>
        ) : null}
        <form className={css({ display: 'flex', flexDirection: 'column', gap: '4' })} onSubmit={submit}>
          <Field label="用户名">
            <Input {...register('username')} autoComplete="username" />
          </Field>
          <Field label="密码">
            <Input type="password" {...register('password')} autoComplete="current-password" />
          </Field>
          <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
            登录
          </Button>
        </form>
        <p
          className={css({
            margin: '0',
            marginBlockStart: '4',
            textStyle: 'small',
            color: 'text-muted',
            display: 'flex',
            justifyContent: 'center',
            gap: '3',
          })}
        >
          <span>演示账号：admin</span>
          <span>密码：123456</span>
        </p>
      </Card>
    </div>
  );
}
