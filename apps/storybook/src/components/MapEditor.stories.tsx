import { Input, MapEditor, type MapEditorProps } from '@tuuject/koi-react';
import { css } from '@tuuject/koi-react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';
import { fn } from 'storybook/test';
import { label, stack } from '../layout';

const width = css({ width: '[560px]', maxWidth: '100%' });

const headers = [
  { key: 'Accept', value: 'application/json' },
  { key: 'Authorization', value: 'Bearer ...' },
  { key: 'X-Request-Id', value: '01J8Z6' },
];

const meta = {
  title: 'Components/MapEditor',
  component: MapEditor,
  args: {
    value: headers,
    sortable: true,
    disabled: false,
    readOnly: false,
    createEntry: () => ({ key: '', value: '' }),
    renderKey: ({ value, onChange, ...field }) => (
      <Input
        {...field}
        value={value}
        placeholder="Key"
        aria-label="键"
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    ),
    renderValue: ({ value, onChange, ...field }) => (
      <Input
        {...field}
        value={value}
        placeholder="Value"
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
} satisfies Meta<MapEditorProps<string, string>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Holds the rows while the story is open; the editor itself is controlled. */
function Editable({ onChange, ...args }: ComponentProps<typeof MapEditor<string, string>>) {
  const [entries, setEntries] = useState(args.value);
  return (
    <MapEditor
      {...args}
      value={entries}
      onChange={(next) => {
        setEntries(next);
        onChange?.(next);
      }}
    />
  );
}

export const Playground: Story = {
  render: (args) => <Editable {...args} />,
};

// The order has no meaning for HTTP headers, so the handle is gone and the fields start at the edge.
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

// Duplicate keys are kept, not merged: both rows show the error until the app validates.
export const DuplicateKeys: Story = {
  args: {
    value: [
      { key: 'Accept', value: 'application/json' },
      { key: 'Accept', value: 'text/html' },
    ],
  },
  render: (args) => <Editable {...args} />,
};
