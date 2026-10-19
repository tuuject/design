import { CheckIcon, SearchIcon, Tag, type TagProps } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { fn } from 'storybook/test';
import { label, row, stack } from '../layout';

const tagRow = css({ display: 'flex', gap: '2', flexWrap: 'wrap', alignItems: 'center' });

/** Keeps its own `selected` so the toggle works, and follows the arg when it changes. */
function Controlled({ selected: initial = false, onSelectedChange, ...rest }: TagProps) {
  const [selected, setSelected] = React.useState(initial);
  React.useEffect(() => setSelected(initial), [initial]);
  return (
    <Tag
      {...rest}
      selected={selected}
      onSelectedChange={(next, e) => {
        setSelected(next);
        onSelectedChange?.(next, e);
      }}
    />
  );
}

const meta = {
  title: 'Components/Tag',
  component: Tag,
  args: { children: '设计系统', selected: false, onSelectedChange: fn(), onRemove: fn() },
  argTypes: { icon: { control: false } },
  render: (args) => <Controlled {...args} />,
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Plain tags are not interactive. `selected` alone is only the look; `onRemove` adds the × button. */
export const States: Story = {
  render: () => (
    <div className={stack}>
      <div className={row}>
        <span className={label}>default</span>
        <Tag>设计系统</Tag>
        <Tag icon={<SearchIcon />}>搜索词</Tag>
        <Tag onRemove={() => {}}>可移除</Tag>
        <Tag icon={<SearchIcon />} onRemove={() => {}}>
          可移除
        </Tag>
      </div>
      <div className={row}>
        <span className={label}>selected</span>
        <Tag selected>设计系统</Tag>
        <Tag selected icon={<CheckIcon />}>
          已选择
        </Tag>
        <Tag selected onRemove={() => {}}>
          可移除
        </Tag>
        <Tag selected icon={<CheckIcon />} onRemove={() => {}}>
          可移除
        </Tag>
      </div>
      <div className={row}>
        <span className={label}>toggle</span>
        <Tag onSelectedChange={() => {}}>未选</Tag>
        <Tag selected onSelectedChange={() => {}}>
          已选
        </Tag>
        <Tag onSelectedChange={() => {}} onRemove={() => {}}>
          未选可移除
        </Tag>
        <Tag selected onSelectedChange={() => {}} onRemove={() => {}}>
          已选可移除
        </Tag>
      </div>
    </div>
  ),
};

const topics = ['全部', '前端', '设计', '随笔', '游戏', '音乐'];

/** Filter chips: each is a `<button aria-pressed>`. Click, Enter or Space toggles. */
export const Filters: Story = {
  render: function Render() {
    const [chosen, setChosen] = React.useState<string[]>(['前端', '设计']);
    return (
      <>
        {/* biome-ignore lint/a11y/useSemanticElements: a fieldset's default border and padding would break the chip row */}
        <div className={tagRow} role="group" aria-label="按主题筛选">
          {topics.map((t) => (
            <Tag
              key={t}
              selected={chosen.includes(t)}
              icon={chosen.includes(t) ? <CheckIcon /> : undefined}
              onSelectedChange={(on) => setChosen((c) => (on ? [...c, t] : c.filter((x) => x !== t)))}
            >
              {t}
            </Tag>
          ))}
        </div>
      </>
    );
  },
};

const people = ['小鲤', 'tcdw', '设计组', 'Alice Chen'];

/** Entered values, like recipients. Each × is named "移除 <label>". */
export const Removable: Story = {
  render: function Render() {
    const [list, setList] = React.useState(people);
    return (
      <div className={tagRow}>
        {list.map((p) => (
          <Tag key={p} onRemove={() => setList((l) => l.filter((x) => x !== p))}>
            {p}
          </Tag>
        ))}
        {list.length === 0 ? (
          <span className={css({ textStyle: 'small', color: 'text-muted' })}>没有收件人</span>
        ) : null}
      </div>
    );
  },
};

export const InContext: Story = {
  name: 'In context',
  render: () => (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '2', width: '[420px]', maxWidth: '100%' })}>
      <h3 className={css({ m: '0', textStyle: 'heading-3', color: 'text' })}>用 Panda CSS 重写 Koi</h3>
      <p className={css({ m: '0', textStyle: 'body', color: 'text-muted' })}>2026 年 10 月 · 约 8 分钟</p>
      <div className={tagRow}>
        <Tag>设计系统</Tag>
        <Tag>React</Tag>
        <Tag>Panda CSS</Tag>
      </div>
    </div>
  ),
};
