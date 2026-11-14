import {
  Badge,
  Button,
  DirectionProvider,
  Drawer,
  Field,
  Menu,
  Popover,
  SelectPanel,
  Tag,
  Textarea,
} from '@tuuject/koi-react';
import { css, cx } from '@tuuject/koi-react/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

// Probes for `pnpm rtl-check` (apps/storybook/scripts/rtl-check.mjs).
// Every probe is something a screenshot can't judge: which edge a floating panel lines up with, which edge a Drawer
// opens on, how tall a control gets in a row with a taller sibling, whether one long word fits. The check reads
// `data-koi-probe` attributes, so renaming a probe means renaming it there too.
// The three floating panels are open at once because the check measures them in one page load: they overlap in the
// screenshot, which is fine — this page is a fixture, not a design reference.
const page = css({ display: 'flex', flexDirection: 'column', gap: '8', minWidth: '0' });
// One probe per centred row: a trigger in the middle of the viewport with room for a 320px panel on either side, so
// collision avoidance can't flip the alignment into looking right.
const centred = css({ display: 'flex', flexDirection: 'column', gap: '8' });
const probeRow = css({ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' });
const panel = css({ display: 'flex', flexDirection: 'column', gap: '2', width: '[320px]' });

const menuItems = [
  { value: 'save', label: 'Benutzeroberflächeneinstellungen speichern' },
  { value: 'privacy', label: 'Datenschutzgrundverordnung bestätigen' },
  { value: 'back', label: 'Zurück zur Übersicht' },
];

const options = [
  { value: 'de', label: 'Deutsch (Deutschland und Österreich)' },
  { value: 'ar', label: 'العربية (المملكة العربية السعودية)' },
  { value: 'en', label: 'English (United States of America)' },
];

const LONG_WORD = 'Benutzeroberflächeneinstellungen';

/** The placement, drawer and row-height probes. `dir` comes from the document unless a story wraps it. */
function Probes() {
  const [drawerSide, setDrawerSide] = useState<'start' | 'end' | null>(null);
  return (
    <div className={cx(page, centred)}>
      <div className={probeRow}>
        <span data-koi-probe="popover">
          <Popover
            defaultOpen
            modal={false}
            placement="bottom-start"
            label="Probe"
            trigger={<Button variant="outline">popover</Button>}
          >
            <div className={panel}>
              <span>Ein Panel, breiter als sein Auslöser, damit die Ausrichtung eindeutig ist.</span>
            </div>
          </Popover>
        </span>
      </div>
      <div className={probeRow}>
        <span data-koi-probe="menu">
          <Menu
            defaultOpen
            modal={false}
            placement="bottom-start"
            trigger={<Button variant="outline">menu</Button>}
            items={menuItems}
          />
        </span>
      </div>
      <div className={probeRow}>
        <span data-koi-probe="select">
          <SelectPanel defaultOpen defaultValue="de" items={options} style={{ width: '200px' }} />
        </span>
      </div>
      <div className={probeRow}>
        {/* Controlled with no selection: `value={null}` means "none", not "the default". */}
        <span data-koi-probe="select-null">
          <SelectPanel value={null} defaultValue="de" items={options} style={{ width: '200px' }} />
        </span>
      </div>
      <div className={probeRow}>
        <span data-koi-probe="drawer-start">
          <Button variant="ghost" color="secondary" onClick={() => setDrawerSide('start')}>
            open start
          </Button>
        </span>
        <span data-koi-probe="drawer-end">
          <Button variant="ghost" color="secondary" onClick={() => setDrawerSide('end')}>
            open end
          </Button>
        </span>
      </div>
      <Drawer
        open={drawerSide !== null}
        onOpenChange={(open) => !open && setDrawerSide(null)}
        side={drawerSide ?? 'start'}
        title="Einstellungen"
      >
        <p>Ein Panel an der Randkante: die Seite entscheidet, wo es andockt.</p>
      </Drawer>
    </div>
  );
}

/**
 * A Button, a Tag and a Badge in a plain flex row (default `align-items: stretch`) with a much taller Textarea. The
 * row is wide enough that nothing has to shrink: this measures heights, the narrow-word story measures wrapping.
 */
function RowHeight() {
  return (
    <div className={css({ maxWidth: '[760px]' })}>
      <div className={css({ display: 'flex', gap: '4' })} data-koi-probe="row">
        <Button>Speichern</Button>
        <Tag>Entwurf</Tag>
        <Badge tone="warning">Ausstehend</Badge>
        <div className={css({ display: 'flex', width: '[240px]', flex: 'none' })}>
          <Textarea rows={4} aria-label="Beschreibung" placeholder="Beschreibung" />
        </div>
      </div>
    </div>
  );
}

/**
 * One unbreakable compound in a 240px column, each control in a flex row that may not wrap: the control's min-content
 * width is the whole word, so `overflow-wrap: break-word` alone can't let it fit (finding: break-word doesn't change
 * min-content sizing). The row is what the check measures for overflow.
 */
function NarrowWords() {
  const narrowRow = css({ display: 'flex', gap: '2', minWidth: '0' });
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '4', width: '[240px]' })}>
      <div className={narrowRow} data-koi-probe="narrow-button">
        <Button>{LONG_WORD}</Button>
      </div>
      <div className={narrowRow} data-koi-probe="narrow-tag">
        <Tag>{LONG_WORD}</Tag>
      </div>
      <div className={narrowRow} data-koi-probe="narrow-badge">
        <Badge>{LONG_WORD}</Badge>
      </div>
      <Field label={LONG_WORD} error={LONG_WORD} data-koi-probe="narrow-field">
        <Textarea rows={2} aria-label={LONG_WORD} />
      </Field>
    </div>
  );
}

/**
 * Probes for the direction and long-text checks. `Document` follows the 方向 toolbar (`<html dir>`), `ScopedRtl` is
 * an RTL subtree inside an LTR document: `dir` on the wrapper plus `DirectionProvider` for behaviour, which is what
 * an app embedding an RTL region anywhere below the root does.
 */
const meta = {
  title: 'Components/RtlProbe',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Document: Story = { render: () => <Probes /> };

export const ScopedRtl: Story = {
  // The document stays LTR whatever the toolbar says; only this subtree reads right to left.
  globals: { direction: 'ltr' },
  render: () => (
    <div dir="rtl" lang="ar">
      <DirectionProvider direction="rtl">
        <Probes />
      </DirectionProvider>
    </div>
  ),
};

export const RowHeightStory: Story = { name: 'Row height', render: () => <RowHeight /> };

export const NarrowWordsStory: Story = { name: 'Narrow words', render: () => <NarrowWords /> };
