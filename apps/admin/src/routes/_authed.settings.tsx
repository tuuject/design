import { Avatar } from '@koi/react/avatar';
import { Badge } from '@koi/react/badge';
import { Button } from '@koi/react/button';
import { Card } from '@koi/react/card';
import { Checkbox } from '@koi/react/checkbox';
import { Field } from '@koi/react/field';
import { Input } from '@koi/react/input';
import { RadioGroup } from '@koi/react/radio-group';
import { css } from '@koi/react/styled-system/css';
import { Switch } from '@koi/react/switch';
import { Textarea } from '@koi/react/textarea';
import { useToast } from '@koi/react/toast';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { PageHeader } from '../components/PageHeader';
import { useAuthStore } from '../stores/auth';

export const Route = createFileRoute('/_authed/settings')({
  staticData: { title: '个人设置' },
  component: SettingsPage,
});

const BIO_MAX = 120;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const s = {
  card: css({ marginBlockStart: '6' }),
  profile: css({ display: 'flex', alignItems: 'center', gap: '3', marginBlockEnd: '6' }),
  // flex-start: a stretched Badge would fill the column with its label stuck to the left.
  profileText: css({ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1' }),
  profileName: css({ textStyle: 'heading-3', fontWeight: 'bold', color: 'text' }),
  form: css({ display: 'flex', flexDirection: 'column', gap: '4', maxW: '480px' }),
  actions: css({ display: 'flex', gap: '2', marginBlockStart: '2' }),
};

function SettingsPage() {
  const user = useAuthStore((st) => st.user);
  const login = useAuthStore((st) => st.login);
  const toast = useToast();

  const [name, setName] = React.useState(user?.name ?? '');
  const [email, setEmail] = React.useState(user?.email ?? '');
  const [bio, setBio] = React.useState('');
  const [role, setRole] = React.useState('admin');
  const [emailNotify, setEmailNotify] = React.useState(true);
  const [systemNotify, setSystemNotify] = React.useState(true);
  const [errors, setErrors] = React.useState<{ name?: string; email?: string }>({});
  const [saving, setSaving] = React.useState(false);

  if (!user) {
    return null;
  }

  const validate = (): { name?: string; email?: string } => {
    const next = {
      name: name.trim() ? undefined : '昵称不能为空',
      email: EMAIL_RE.test(email) ? undefined : '邮箱格式不太对，请检查一下。',
    };
    setErrors(next);
    return next;
  };

  const save = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    if (nextErrors.name || nextErrors.email) {
      return;
    }
    setSaving(true);
    const { promise, resolve } = Promise.withResolvers<void>();
    setTimeout(resolve, 600);
    await promise;
    login({ ...user, name: name.trim(), email });
    setSaving(false);
    toast.toast({ tone: 'success', title: '设置已保存' });
  };

  const reset = () => {
    setName(user.name);
    setEmail(user.email);
    setBio('');
    setRole('admin');
    setEmailNotify(true);
    setSystemNotify(true);
    setErrors({});
  };

  return (
    <div>
      <PageHeader title="个人设置" description="资料保存后立即生效（演示环境不会真的提交到服务器）" />
      <Card title="基本资料" className={s.card}>
        <div className={s.profile}>
          <Avatar name={user.name} size="xl" />
          <div className={s.profileText}>
            <span className={s.profileName}>{user.name}</span>
            <Badge tone="primary">{user.role}</Badge>
          </div>
        </div>
        <form className={s.form} onSubmit={save} noValidate>
          <Field label="昵称" required error={errors.name} onBlur={validate}>
            <Input value={name} onChange={(e) => setName(e.target.value)} onBlur={validate} />
          </Field>
          <Field label="邮箱" required error={errors.email}>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={validate} />
          </Field>
          <Field label="个人简介" optional help={`${bio.length} / ${BIO_MAX}`}>
            <Textarea value={bio} maxLength={BIO_MAX} onChange={(e) => setBio(e.target.value)} rows={4} />
          </Field>
          <Field label="角色">
            <RadioGroup
              orientation="horizontal"
              value={role}
              onChange={setRole}
              options={[
                { value: 'admin', label: '管理员', description: '全部权限' },
                { value: 'ops', label: '运营', description: '订单与内容' },
                { value: 'viewer', label: '只读', description: '仅查看' },
              ]}
            />
          </Field>
          <Checkbox
            label="邮件通知"
            description="订单状态变化时发送邮件"
            checked={emailNotify}
            onCheckedChange={(checked) => setEmailNotify(checked)}
          />
          <Switch label="接收系统通知" checked={systemNotify} onCheckedChange={(checked) => setSystemNotify(checked)} />
          <div className={s.actions}>
            <Button type="submit" loading={saving}>
              保存更改
            </Button>
            <Button type="button" variant="ghost" color="secondary" onClick={reset}>
              重置
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
