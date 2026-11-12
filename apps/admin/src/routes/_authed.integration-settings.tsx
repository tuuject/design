import { Button } from '@tuuject/koi-react/button';
import { Card } from '@tuuject/koi-react/card';
import { Input } from '@tuuject/koi-react/input';
import { MapEditor, type MapEntry } from '@tuuject/koi-react/map-editor';
import { PageHeader } from '@tuuject/koi-react/page-header';
import { SetEditor } from '@tuuject/koi-react/set-editor';
import { css } from '@tuuject/koi-react/styled-system/css';
import { useToast } from '@tuuject/koi-react/toast';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/_authed/integration-settings')({
  staticData: { title: '接入设置' },
  component: IntegrationSettingsPage,
});

const INITIAL_HEADERS: MapEntry<string, string>[] = [
  { key: 'Accept', value: 'application/json' },
  { key: 'X-Client-Id', value: 'koi-admin' },
  { key: 'X-Request-Source', value: 'admin-template' },
];

const INITIAL_ORIGINS = ['https://admin.tuu.run', 'https://design.tuu.run'];

const required = (label: string) => (value: string) => (value.trim() === '' ? `${label}不能为空` : undefined);

function IntegrationSettingsPage() {
  const toast = useToast();
  const [headers, setHeaders] = useState(INITIAL_HEADERS);
  const [origins, setOrigins] = useState(INITIAL_ORIGINS);
  const [saving, setSaving] = useState(false);

  // The editors mark empty and duplicate rows themselves; these only keep the demo from "saving" them.
  const headersReady = headers.every(
    (entry, index) => entry.key.trim() !== '' && !headers.some((other, i) => i !== index && other.key === entry.key),
  );
  const originsReady = origins.every(
    (origin, index) => origin.trim() !== '' && !origins.some((other, i) => i !== index && other === origin),
  );

  const save = async () => {
    if (!headersReady || !originsReady) {
      toast.toast({
        tone: 'error',
        title: '还有条目需要修改',
        description: '重复或为空的条目已经标红，改好后再保存。',
      });
      return;
    }
    setSaving(true);
    // Stands in for the request; the data is page state, so the demo resets when the page unmounts.
    const pending = Promise.withResolvers<void>();
    setTimeout(pending.resolve, 600);
    await pending.promise;
    setSaving(false);
    toast.toast({ tone: 'success', title: '接入设置已保存' });
  };

  return (
    <div className={css({ maxWidth: '768px', marginInline: 'auto' })}>
      <PageHeader title="接入设置" description="调用助手接口时使用的请求头和允许的来源" />
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}>
        <Card title="请求头" description="随每次请求发送">
          <MapEditor
            value={headers}
            onChange={setHeaders}
            sortable={false}
            createEntry={() => ({ key: '', value: '' })}
            validateKey={required('名称')}
            renderKey={({ value, onChange, ...field }) => (
              <Input
                {...field}
                value={value}
                placeholder="Key"
                aria-label="请求头名称"
                onChange={(event) => onChange(event.currentTarget.value)}
              />
            )}
            renderValue={({ value, onChange, ...field }) => (
              <Input
                {...field}
                value={value}
                placeholder="Value"
                aria-label="请求头的值"
                onChange={(event) => onChange(event.currentTarget.value)}
              />
            )}
          />
        </Card>
        <Card title="允许来源" description="只有名单里的来源可以调用接口">
          <SetEditor
            value={origins}
            onChange={setOrigins}
            createValue={() => ''}
            validateValue={required('来源')}
            renderValue={({ value, onChange, ...field }) => (
              <Input
                {...field}
                value={value}
                placeholder="https://example.com"
                aria-label="允许的来源"
                onChange={(event) => onChange(event.currentTarget.value)}
              />
            )}
          />
        </Card>
        <div className={css({ display: 'flex', gap: '2' })}>
          <Button type="button" loading={saving} onClick={save}>
            保存
          </Button>
          <Button
            type="button"
            variant="ghost"
            color="secondary"
            onClick={() => {
              setHeaders(INITIAL_HEADERS);
              setOrigins(INITIAL_ORIGINS);
            }}
          >
            重置
          </Button>
        </div>
      </div>
    </div>
  );
}
