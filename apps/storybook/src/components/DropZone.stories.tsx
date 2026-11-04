import { DropZone } from '@tuuject/koi-react';
import { css } from '@tuuject/koi-react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';
import { fn } from 'storybook/test';
import { label, stack } from '../layout';

const width = css({ width: '[360px]', maxWidth: '100%' });
const list = css({ display: 'flex', flexDirection: 'column', gap: '1', textStyle: 'small', color: 'text-muted' });

const meta = {
  title: 'Components/DropZone',
  component: DropZone,
  args: {
    title: '拖拽图片到这里，或点击选择',
    description: '支持 JPG、PNG、WebP，单张最大 100MB',
    multiple: true,
    disabled: false,
    onFiles: fn(),
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className={width}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DropZone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <div className={stack}>
      <span className={label}>default</span>
      <DropZone {...args} />
      <span className={label}>title only</span>
      <DropZone {...args} title="选择 CSV 文件" description={undefined} />
      <span className={label}>disabled</span>
      <DropZone {...args} disabled />
    </div>
  ),
};

function PickedDemo(args: ComponentProps<typeof DropZone>) {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div className={stack}>
      <DropZone
        {...args}
        onFiles={(picked) => {
          setFiles(picked);
          args.onFiles?.(picked);
        }}
      />
      <div className={list}>
        {files.length === 0 ? (
          <span>还没有选择文件</span>
        ) : (
          files.map((file) => <span key={file.name}>{file.name}</span>)
        )}
      </div>
    </div>
  );
}

export const Picked: Story = {
  name: 'Picked files',
  render: (args) => <PickedDemo {...args} />,
};
