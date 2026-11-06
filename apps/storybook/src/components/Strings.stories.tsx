import {
  Button,
  Field,
  Input,
  Pagination,
  SelectPanel,
  StringsProvider,
  type StringsOverride,
  Table,
  TableBody,
  TableEmpty,
  TableHeader,
  TableHeaderCell,
  TableRow,
  Toast,
  ToastProvider,
} from '@tuuject/koi-react';
import { css, cx } from '@tuuject/koi-react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { stack } from '../layout';

const width = css({ width: '[420px]', maxWidth: '100%' });

/** The keys this story's components write; everything else stays Koi's default. */
const english = {
  optional: ' (optional)',
  processing: 'Processing',
  loading: 'Loading',
  close: 'Close',
  notifications: 'Notifications',
  noData: 'No data',
  prevPage: 'Previous',
  nextPage: 'Next',
  pagination: 'Pagination',
  page: (n: number) => `Page ${n}`,
  selectPlaceholder: 'Select an option',
  search: 'Search',
  noMatches: 'No matches',
} satisfies StringsOverride;

const meta = {
  title: 'Components/Strings',
  component: StringsProvider,
  args: { strings: english },
  render: (args) => (
    <StringsProvider {...args}>
      <div className={cx(stack, width)}>
        <Field label="Website" optional>
          <Input type="url" placeholder="https://" />
        </Field>
        <Button loading>Save</Button>
        <SelectPanel items={[{ value: 'koi', label: 'Koi' }]} searchable />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableEmpty colSpan={1} />
          </TableBody>
        </Table>
        <Pagination page={2} pageCount={5} />
        <ToastProvider label="Notifications" closeLabel="Dismiss">
          <Toast tone="success" title="Saved" description="Your changes are live." onClose={fn()} />
        </ToastProvider>
      </div>
    </StringsProvider>
  ),
} satisfies Meta<typeof StringsProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One StringsProvider replaces the copy every Koi component inside writes, so an English app shows no Chinese. */
export const English: Story = {};
