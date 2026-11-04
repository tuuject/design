import { Input, SetEditor, type SetEditorProps } from '@tuuject/koi-react';
import { css } from '@tuuject/koi-react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';
import { fn } from 'storybook/test';
import { label, stack } from '../layout';

const width = css({ width: '[460px]', maxWidth: '100%' });

const tags = ['设计系统', '组件库', 'Koi'];

const meta = {
  title: 'Components/SetEditor',
  component: SetEditor,
  args: {
    value: tags,
    sortable: true,
    disabled: false,
    readOnly: false,
    createValue: () => '',
    renderValue: ({ value, onChange, ...field }) => (
      <Input
        {...field}
        value={value}
        placeholder="值"
        aria-label="值"
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    ),
    onChange: fn(),
  },
  argTypes: {
    value: { control: 'object' },
    sortable: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className={width}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<SetEditorProps<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Holds the rows while the story is open; the editor itself is controlled. */
function Editable({ onChange, ...args }: ComponentProps<typeof SetEditor<string>>) {
  const [values, setValues] = useState(args.value);
  return (
    <SetEditor
      {...args}
      value={values}
      onChange={(next) => {
        setValues(next);
        onChange?.(next);
      }}
    />
  );
}

export const Playground: Story = {
  render: (args) => <Editable {...args} />,
};

// A set has no order; the handle is off and the field starts at the edge.
export const SortableOff: Story = {
  args: { sortable: false },
  render: (args) => <Editable {...args} />,
};

export const States: Story = {
  render: (args) => (
    <div className={stack}>
      <span className={label}>disabled</span>
      <Editable {...args} disabled />
      <span className={label}>read-only</span>
      <Editable {...args} readOnly />
      <span className={label}>empty</span>
      <Editable {...args} value={[]} />
    </div>
  ),
};

// Duplicate values are kept, not deduplicated: both rows show the error until the app validates.
export const DuplicateValues: Story = {
  args: { value: ['Koi', 'Koi'] },
  render: (args) => <Editable {...args} />,
};
