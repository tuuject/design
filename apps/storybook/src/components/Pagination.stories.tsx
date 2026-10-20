import { Pagination, type PaginationProps, ShapeProvider } from '@koi/react';
import { css } from '@koi/react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { fn } from 'storybook/test';
import { label, row, stack } from '../layout';

const width = css({ width: '[680px]', maxWidth: '100%' });
const grow = css({ flex: '1', minWidth: '0' });

/** Keeps its own page so the buttons work, and follows the `page` arg when it changes. */
function Controlled({ page: initial, onChange, ...rest }: PaginationProps) {
  const [page, setPage] = useState(initial);
  useEffect(() => setPage(initial), [initial]);
  return (
    <Pagination
      {...rest}
      page={page}
      onChange={(p) => {
        setPage(p);
        onChange?.(p);
      }}
    />
  );
}

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  args: { page: 5, pageCount: 10, variant: 'numbered', siblings: 1, onChange: fn() },
  argTypes: {
    page: { control: { type: 'number', min: 1 } },
    pageCount: { control: { type: 'number', min: 1 } },
    siblings: { control: { type: 'number', min: 0 } },
    variant: { control: 'inline-radio', options: ['numbered', 'simple'] },
  },
  decorators: [
    (Story) => (
      <div className={width}>
        <Story />
      </div>
    ),
  ],
  render: (args) => <Controlled {...args} />,
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The first and last page are always there; the current page keeps one neighbour each side, and "…" stands in for the rest. */
export const Numbered: Story = {
  render: () => (
    <div className={stack}>
      {[1, 2, 4, 5, 9, 10].map((p) => (
        <div key={p} className={row}>
          <span className={label}>{`第 ${p} 页`}</span>
          <div className={grow}>
            <Pagination page={p} pageCount={10} />
          </div>
        </div>
      ))}
    </div>
  ),
};

/** Few pages: no gaps. One page: both buttons disabled. */
export const SmallTotals: Story = {
  render: () => (
    <div className={stack}>
      {[
        [1, 1],
        [1, 2],
        [2, 3],
        [3, 5],
      ].map(([p, n]) => (
        <div key={`${p}/${n}`} className={row}>
          <span className={label}>{`${p} / ${n}`}</span>
          <div className={grow}>
            <Pagination page={p} pageCount={n} />
          </div>
        </div>
      ))}
    </div>
  ),
};

/** `siblings` sets how many neighbours the current page keeps on each side. */
export const Siblings: Story = {
  render: () => (
    <div className={stack}>
      {[0, 1, 2].map((s) => (
        <div key={s} className={row}>
          <span className={label}>{`siblings ${s}`}</span>
          <div className={grow}>
            <Pagination page={10} pageCount={20} siblings={s} />
          </div>
        </div>
      ))}
    </div>
  ),
};

/** Two large solid buttons around "n / m". The blog wraps it in a pill ShapeProvider (see Pill). */
export const Simple: Story = {
  render: () => (
    <div className={stack}>
      <Pagination variant="simple" page={1} pageCount={8} />
      <Pagination variant="simple" page={3} pageCount={8} />
      <Pagination variant="simple" page={8} pageCount={8} prevLabel="较新的文章" nextLabel="更早的文章" />
    </div>
  ),
};

/** Inside a pill ShapeProvider (the blog's voice) the buttons and page numbers turn pills together. */
export const Pill: Story = {
  render: () => (
    <ShapeProvider shape="pill">
      <div className={stack}>
        <Pagination page={5} pageCount={10} />
        <Pagination variant="simple" page={3} pageCount={8} />
      </div>
    </ShapeProvider>
  ),
};
