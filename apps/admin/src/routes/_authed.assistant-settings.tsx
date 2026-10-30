import { Checkbox } from '@koi/react/checkbox';
import { Input } from '@koi/react/input';
import { RadioGroup } from '@koi/react/radio-group';
import { Select } from '@koi/react/select';
import { Skeleton } from '@koi/react/skeleton';
import { css } from '@koi/react/styled-system/css';
import { Switch } from '@koi/react/switch';
import { Textarea } from '@koi/react/textarea';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Controller, useForm, useFormContext, useWatch } from 'react-hook-form';
import { PageHeader } from '../components/PageHeader';
import { FormField } from '../components/sectioned-form/FormField';
import { FormSection } from '../components/sectioned-form/FormSection';
import { SectionedForm } from '../components/sectioned-form/SectionedForm';
import { type AssistantSettings, fetchAssistantSettings, saveAssistantSettings } from '../mock/api';

export const Route = createFileRoute('/_authed/assistant-settings')({
  staticData: { title: '助手配置' },
  component: AssistantSettingsPage,
});

const QUERY_KEY = ['assistant-settings'] as const;

function AssistantSettingsPage() {
  const { data } = useQuery({ queryKey: QUERY_KEY, queryFn: fetchAssistantSettings });
  const [failSaves, setFailSaves] = useState(false);

  return (
    // Capped like the other form pages, wide enough for the section list beside the form.
    <div className={css({ maxWidth: '960px', marginInline: 'auto' })}>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          columnGap: '6',
        })}
      >
        <PageHeader
          title="助手配置"
          description="分区较多的长表单：按分区跳转，在底部查看和提交未保存的更改。数据只存在内存里，刷新页面会还原。"
        />
        {/* A demo control, outside the form: it applies at once and is never part of the saved settings. */}
        <Switch
          label="模拟保存失败"
          checked={failSaves}
          onCheckedChange={setFailSaves}
          // Only matters once it wraps under the header on narrow screens.
          className={css({ marginBlockEnd: '4' })}
        />
      </div>
      {data ? (
        <AssistantSettingsForm initial={data} failSaves={failSaves} />
      ) : (
        <Skeleton>
          <div className={css({ height: '480px', borderRadius: 'panel' })} />
        </Skeleton>
      )}
    </div>
  );
}

/** Mounted once the settings have loaded, so they are the form's first baseline (no effect to reset into). */
function AssistantSettingsForm({ initial, failSaves }: { initial: AssistantSettings; failSaves: boolean }) {
  const queryClient = useQueryClient();
  const form = useForm<AssistantSettings>({
    mode: 'onTouched',
    defaultValues: initial,
    // SectionedForm scrolls to the first invalid field itself, in page order.
    shouldFocusError: false,
  });
  const { control, register } = form;

  const save = async (values: AssistantSettings) => {
    const saved = await saveAssistantSettings(values, { fail: failSaves });
    // The action bar reports the outcome; no toast on top of it.
    queryClient.setQueryData(QUERY_KEY, saved);
    return saved;
  };

  return (
    <SectionedForm form={form} onSubmit={save}>
      <FormSection id="profile" title="常规设置" description="客户在会话里看到的助手信息。">
        <FormField name="profile.name" label="助手名称" help="显示在会话窗口顶部，最多 20 个字">
          <Input
            {...register('profile.name', {
              validate: (value) => {
                const name = value.trim();
                if (!name) {
                  return '助手名称不能为空';
                }
                return name.length <= 20 || '助手名称最多 20 个字';
              },
            })}
          />
        </FormField>
        <FormField name="profile.description" label="简介" optional>
          <Textarea {...register('profile.description')} rows={3} maxLength={120} />
        </FormField>
        <FormField name="profile.language" label="默认语言">
          <Select
            {...register('profile.language')}
            options={[
              { value: 'zh-CN', label: '简体中文' },
              { value: 'en', label: '英语' },
              { value: 'ja', label: '日语' },
            ]}
          />
        </FormField>
        <FormField name="profile.greeting" label="欢迎语" optional help="客户打开会话时自动发送">
          <Textarea {...register('profile.greeting')} rows={2} maxLength={120} />
        </FormField>
        <CheckboxField name="profile.enabled" label="启用助手" description="关闭后，客户在会话里看不到助手入口" />
      </FormSection>

      <FormSection id="schedule" title="消息定时" description="按固定时间给订阅的客户推送消息。">
        <CheckboxField name="schedule.enabled" label="启用定时消息" />
        <ScheduleDetails />
      </FormSection>

      <FormSection id="model" title="模型配置" description="生成回复所用的模型和参数。">
        <FormField name="model.name" label="模型">
          <Select
            {...register('model.name')}
            options={[
              { value: 'koi-large', label: 'Koi Large（效果优先）' },
              { value: 'koi-fast', label: 'Koi Fast（速度优先）' },
              { value: 'koi-mini', label: 'Koi Mini（成本优先）' },
            ]}
          />
        </FormField>
        <FormField name="model.temperature" label="温度" help="0 到 2，越高回复越发散">
          <Input
            type="number"
            step={0.1}
            inputMode="decimal"
            className={css({ maxWidth: '200px' })}
            {...register('model.temperature', {
              valueAsNumber: true,
              validate: (value) => (Number.isFinite(value) && value >= 0 && value <= 2) || '温度要在 0 到 2 之间',
            })}
          />
        </FormField>
        <FormField name="model.maxTokens" label="最大回复长度" help="单位是 token，64 到 4096">
          <Input
            type="number"
            step={1}
            inputMode="numeric"
            className={css({ maxWidth: '200px' })}
            {...register('model.maxTokens', {
              valueAsNumber: true,
              validate: (value) =>
                (Number.isInteger(value) && value >= 64 && value <= 4096) || '最大回复长度要在 64 到 4096 之间',
            })}
          />
        </FormField>
        <FormField name="model.systemPrompt" label="系统提示词" optional>
          <Textarea {...register('model.systemPrompt')} rows={5} />
        </FormField>
        <FormField name="model.apiKey" label="API 密钥" help="未保存的更改里只显示「已修改」，不会显示密钥内容">
          <Input
            type="password"
            autoComplete="off"
            {...register('model.apiKey', { validate: (value) => value.trim().length > 0 || '请填写 API 密钥' })}
          />
        </FormField>
      </FormSection>

      <FormSection id="access" title="权限" description="谁能使用助手，以及助手能读取哪些数据。">
        <FormField name="access.visibility" label="可见范围">
          <Controller
            control={control}
            name="access.visibility"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: 'all', label: '所有成员', description: '登录后台的成员都能使用' },
                  { value: 'team', label: '客服组', description: '只有客服组成员能使用' },
                  { value: 'admins', label: '仅管理员', description: '适合试运行阶段' },
                ]}
              />
            )}
          />
        </FormField>
        <CheckboxField name="access.readOrders" label="允许读取订单" />
        <CheckboxField name="access.readCustomers" label="允许读取客户资料" description="包括手机号和收货地址" />
        <CheckboxField name="access.externalLinks" label="允许发送外部链接" />
        <CheckboxField
          name="access.reviewReplies"
          label="回复先经人工审核"
          description="助手的回复先进入待审核列表，通过后才发给客户"
        />
      </FormSection>

      <FormSection id="advanced" title="高级设置" description="接口回调与日志，没有特殊需要可以保持默认。">
        <FormField name="advanced.webhookUrl" label="回调地址" optional help="会话结束时把摘要推送到这个地址">
          <Input
            type="url"
            inputMode="url"
            placeholder="https://"
            {...register('advanced.webhookUrl', {
              validate: (value) =>
                !value.trim() || /^https:\/\/\S+$/.test(value.trim()) || '回调地址要以 https:// 开头',
            })}
          />
        </FormField>
        <FormField name="advanced.timeoutSeconds" label="请求超时" help="单位是秒，5 到 120">
          <Input
            type="number"
            step={1}
            inputMode="numeric"
            className={css({ maxWidth: '200px' })}
            {...register('advanced.timeoutSeconds', {
              valueAsNumber: true,
              validate: (value) =>
                (Number.isInteger(value) && value >= 5 && value <= 120) || '请求超时要在 5 到 120 秒之间',
            })}
          />
        </FormField>
        <FormField name="advanced.retries" label="失败重试">
          <Select
            {...register('advanced.retries')}
            options={[
              { value: '0', label: '不重试' },
              { value: '1', label: '重试 1 次' },
              { value: '3', label: '重试 3 次' },
            ]}
          />
        </FormField>
        <CheckboxField name="advanced.logging" label="记录会话日志" />
        <LogRetention />
      </FormSection>
    </SectionedForm>
  );
}

type BooleanPath =
  | 'profile.enabled'
  | 'schedule.enabled'
  | 'schedule.skipHolidays'
  | 'access.readOrders'
  | 'access.readCustomers'
  | 'access.externalLinks'
  | 'access.reviewReplies'
  | 'advanced.logging';

/** A Checkbox is its own label, so the Field above it shows none. Checkbox, not Switch: it applies on save. */
function CheckboxField({ name, label, description }: { name: BooleanPath; label: string; description?: string }) {
  return (
    <FormField name={name} label={label} inlineLabel>
      <Controller<AssistantSettings, BooleanPath>
        name={name}
        render={({ field }) => (
          <Checkbox label={label} description={description} checked={field.value} onCheckedChange={field.onChange} />
        )}
      />
    </FormField>
  );
}

// The conditional parts watch only their own switch, so toggling it re-renders just them. Hidden fields keep
// their values (react-hook-form's default): a hidden change is still unsaved, and the summary still lists it.
function ScheduleDetails() {
  const { control, register } = useFormContext<AssistantSettings>();
  const enabled = useWatch({ control, name: 'schedule.enabled' });
  if (!enabled) {
    return null;
  }
  return (
    <>
      <FormField name="schedule.frequency" label="发送频率">
        <Controller
          control={control}
          name="schedule.frequency"
          render={({ field }) => (
            <RadioGroup
              orientation="horizontal"
              value={field.value}
              onChange={field.onChange}
              options={[
                { value: 'daily', label: '每天' },
                { value: 'weekly', label: '每周一' },
                { value: 'monthly', label: '每月 1 日' },
              ]}
            />
          )}
        />
      </FormField>
      <FormField name="schedule.time" label="发送时间">
        <Input
          type="time"
          className={css({ maxWidth: '200px' })}
          {...register('schedule.time', { required: '请选择发送时间' })}
        />
      </FormField>
      <FormField name="schedule.timezone" label="时区">
        <Select
          {...register('schedule.timezone')}
          options={[
            { value: 'Asia/Shanghai', label: '北京时间（UTC+8）' },
            { value: 'Asia/Tokyo', label: '东京时间（UTC+9）' },
            { value: 'Europe/London', label: '伦敦时间（UTC+0）' },
            { value: 'America/Los_Angeles', label: '洛杉矶时间（UTC-8）' },
          ]}
        />
      </FormField>
      <CheckboxField name="schedule.skipHolidays" label="法定节假日不发送" />
    </>
  );
}

function LogRetention() {
  const { control, register } = useFormContext<AssistantSettings>();
  const logging = useWatch({ control, name: 'advanced.logging' });
  if (!logging) {
    return null;
  }
  return (
    <FormField name="advanced.logRetentionDays" label="日志保留时长">
      <Select
        {...register('advanced.logRetentionDays')}
        options={[
          { value: '7', label: '7 天' },
          { value: '30', label: '30 天' },
          { value: '90', label: '90 天' },
        ]}
      />
    </FormField>
  );
}
