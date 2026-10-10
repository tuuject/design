import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Avatar, Badge, Button, Field, SelectGroup, SelectItem, SelectPanel, SelectSeparator } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import { stack, row, label } from '../layout';

const width = css({ width: '[320px]', maxWidth: '100%' });
const narrow = css({ width: '[200px]' });
// Room under the trigger so an open panel fits without flipping.
const room = css({ minHeight: '[420px]' });

const cities = [
  { value: 'sh', label: '上海' },
  { value: 'bj', label: '北京' },
  { value: 'gz', label: '广州' },
  { value: 'sz', label: '深圳' },
  { value: 'cd', label: '成都', disabled: true },
];

const regions = [
  { label: '华东', items: [{ value: 'sh', label: '上海' }, { value: 'hz', label: '杭州' }, { value: 'nj', label: '南京' }, { value: 'sz-js', label: '苏州' }] },
  { label: '华北', items: [{ value: 'bj', label: '北京' }, { value: 'tj', label: '天津' }] },
  { label: '华南', items: [{ value: 'gz', label: '广州' }, { value: 'sz', label: '深圳' }, { value: 'xm', label: '厦门' }] },
  { label: '西南', items: [{ value: 'cd', label: '成都' }, { value: 'cq', label: '重庆' }, { value: 'km', label: '昆明', disabled: true }] },
];

interface Member { value: string; label: string; email: string; role?: string; disabled?: boolean }
const members: Member[] = [
  { value: 'tcdw', label: 'tcdw', email: 'tcdw@example.com', role: '管理员' },
  { value: 'mio', label: '秋山澪', email: 'mio@example.com' },
  { value: 'ritsu', label: '田井中律', email: 'ritsu@example.com' },
  { value: 'yui', label: '平泽唯', email: 'yui@example.com' },
  { value: 'tsumugi', label: '琴吹䌷', email: 'mugi@example.com', disabled: true },
];

const person = css({ display: 'flex', alignItems: 'center', gap: '2', minWidth: '0' });
const personText = css({ display: 'flex', flexDirection: 'column', minWidth: '0' });
const email = css({ textStyle: 'small', color: 'text-muted' });

const meta = {
  title: 'Components/SelectPanel',
  component: SelectPanel,
  args: {
    items: cities,
    placeholder: '选择城市',
    'aria-label': '城市',
    searchable: false,
    className: width,
    onChange: fn(),
    onOpenChange: fn(),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    items: { control: 'object' },
    children: { control: false },
    renderValue: { control: false },
  },
} satisfies Meta<typeof SelectPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Click the trigger, or focus it and press ↓, Enter or Space. Turn on `searchable` for a search box. */
export const Playground: Story = { decorators: [(Story) => <div className={room}><Story /></div>] };

export const States: Story = {
  render: (args) => (
    <div className={stack}>
      <div className={row}><span className={label}>placeholder</span><SelectPanel {...args} /></div>
      <div className={row}><span className={label}>filled</span><SelectPanel {...args} defaultValue="sh" /></div>
      <div className={row}><span className={label}>invalid</span><SelectPanel {...args} invalid /></div>
      <div className={row}><span className={label}>disabled</span><SelectPanel {...args} disabled /></div>
      <div className={row}><span className={label}>disabled filled</span><SelectPanel {...args} defaultValue="sh" disabled /></div>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className={stack}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className={row}>
          <span className={label}>{size}</span>
          <SelectPanel {...args} size={size} className={narrow} defaultValue="bj" />
          <Button size={size}>保存</Button>
        </div>
      ))}
    </div>
  ),
};

/** Open, with the chosen option ticked and a disabled one. Portaled, so it's shot as the whole viewport. */
export const Open: Story = {
  tags: ['shot-viewport'],
  args: { defaultOpen: true, defaultValue: 'bj' },
  decorators: [(Story) => <div className={room}><Story /></div>],
};

/** Groups (`{label, items}`) get a heading each. */
export const Grouped: Story = {
  tags: ['shot-viewport'],
  args: { items: regions, defaultOpen: true, defaultValue: 'hz' },
  decorators: [(Story) => <div className={room}><Story /></div>],
};

/** `searchable` adds a search box; typing filters by label and drops groups with no match. */
export const Searchable: Story = {
  tags: ['shot-viewport'],
  args: { items: regions, searchable: true, defaultOpen: true, defaultValue: 'gz' },
  decorators: [(Story) => <div className={room}><Story /></div>],
};

/**
 * The panel is yours: `children` receives the options to show (already filtered by the search) and draws them
 * with SelectItem, SelectGroup and SelectSeparator around any markup. `renderValue` draws the trigger.
 */
export const CustomPanel: Story = {
  name: 'Custom panel',
  tags: ['shot-viewport'],
  args: {
    items: members,
    placeholder: '选择负责人',
    'aria-label': '负责人',
    searchable: true,
    searchPlaceholder: '搜索成员',
    defaultOpen: true,
    defaultValue: 'mio',
  },
  decorators: [(Story) => <div className={room}><Story /></div>],
  render: (args) => (
    <SelectPanel
      {...args}
      items={members}
      renderValue={(m) => <span className={person}><Avatar name={m.label} size="sm" />{m.label}</span>}
    >
      {(items) => (
        <>
          {items.filter((m) => m.role).map((m) => <MemberItem key={m.value} m={m} />)}
          {items.some((m) => m.role) && items.some((m) => !m.role) ? <SelectSeparator /> : null}
          <SelectGroup label="成员">
            {items.filter((m) => !m.role).map((m) => <MemberItem key={m.value} m={m} />)}
          </SelectGroup>
        </>
      )}
    </SelectPanel>
  ),
};

function MemberItem({ m }: { m: Member }) {
  return (
    <SelectItem value={m.value} label={m.label} disabled={m.disabled}>
      <span className={person}>
        <Avatar name={m.label} size="sm" />
        <span className={personText}>
          <span>{m.label}</span>
          <span className={email}>{m.email}</span>
        </span>
        {m.role ? <Badge tone="primary">{m.role}</Badge> : null}
      </span>
    </SelectItem>
  );
}

export const InField: Story = {
  name: 'In a Field',
  render: (args) => (
    <div className={stack}>
      <Field label="所在城市" help="用于推荐附近的活动。" className={width}>
        <SelectPanel {...args} aria-label={undefined} className={undefined} />
      </Field>
      <Field label="所在城市" error="请选择一个城市。" required className={width}>
        <SelectPanel {...args} aria-label={undefined} className={undefined} />
      </Field>
    </div>
  ),
};
