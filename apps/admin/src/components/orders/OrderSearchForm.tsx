import { Collapsible } from '@base-ui/react/collapsible';
import { Button } from '@tuuject/koi-react/button';
import { Card } from '@tuuject/koi-react/card';
import { Field } from '@tuuject/koi-react/field';
import { ChevronDownIcon, SearchIcon } from '@tuuject/koi-react/icons';
import { Input } from '@tuuject/koi-react/input';
import { Select } from '@tuuject/koi-react/select';
import { css, cx } from '@tuuject/koi-react/styled-system/css';
import { field } from '@tuuject/koi-react/styled-system/recipes';
import { sizes } from '@tuuject/koi-tokens/dimensions';
import { useRef, useState } from 'react';
import { useMediaQuery } from '../../hooks/use-media-query';
import {
  EMPTY_ORDER_FILTERS,
  normalizeOrderFilters,
  type OrderFilterFields,
  orderFiltersKey,
} from '../../lib/order-filters';
import { ORDER_STATUS, type OrderStatus } from '../../mock/api';
import { focusRing } from '../app-shell/shared';
import { RefreshIcon } from '../icons';

// Below md the card has no padding: the title row is the full-bleed tap target, and its own padding is the inset.
const toggleClass = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
  width: '100%',
  paddingBlock: '4',
  paddingInline: '5',
  border: 'none',
  bg: 'transparent',
  color: 'text',
  textStyle: 'heading-3',
  textAlign: 'left',
  cursor: 'pointer',
  transitionProperty: 'background-color',
  transitionDuration: 'fast',
  _hover: { bg: 'surface-muted' },
  // Inset: the row bleeds to the card's rounded edge, where an offset outline would be clipped.
  _focusVisible: { ...focusRing, outlineOffset: '-2px' },
});

const toggleCountClass = css({ textStyle: 'small', color: 'text-muted' });

const toggleChevronClass = css({
  flexShrink: '0',
  marginInlineStart: 'auto',
  color: 'text-muted',
  transition: 'transform token(durations.check) token(easings.spring)',
  '[data-panel-open] > &': { transform: 'rotate(180deg)' },
});

// Height animates on the panel's own measured value; global-css stops the transition under reduced motion.
const panelClass = css({
  overflow: 'hidden',
  height: 'var(--collapsible-panel-height)',
  transition: 'height token(durations.fast) token(easings.out)',
  '&[data-starting-style], &[data-ending-style]': { height: '0' },
});

interface OrderSearchFormProps {
  /** The filters currently applied to the URL, normalized. */
  value: OrderFilterFields;
  /** Manual submit. Always lands on page 1. */
  onSearch: (fields: OrderFilterFields) => void;
  onReset: () => void;
}

/** RuoYi-style filter bar: the draft only reaches the URL on submit. */
export function OrderSearchForm({ value, onSearch, onReset }: OrderSearchFormProps) {
  const [draft, setDraft] = useState(value);
  // Below md the whole form folds under its title: collapsed by default, and the desktop form is always open.
  const desktop = useMediaQuery('(min-width: 768px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const expanded = desktop || mobileOpen;
  // Our own URL pushes land back on the draft; only a real outside change (back button, sidebar link) resets it.
  const pushedKey = useRef(orderFiltersKey(value));
  const [seenKey, setSeenKey] = useState(orderFiltersKey(value));
  const appliedKey = orderFiltersKey(value);

  if (appliedKey !== seenKey) {
    setSeenKey(appliedKey);
    if (appliedKey !== pushedKey.current) {
      setDraft(normalizeOrderFilters(value));
    }
  }

  const push = (next: OrderFilterFields) => {
    const normalized = normalizeOrderFilters(next);
    pushedKey.current = orderFiltersKey(normalized);
    onSearch(normalized);
  };

  const change = (patch: Partial<OrderFilterFields>) => {
    setDraft((previous) => ({ ...previous, ...patch }));
  };

  const submit = () => {
    setDraft(normalizeOrderFilters(draft));
    push(draft);
  };

  const reset = () => {
    setDraft(EMPTY_ORDER_FILTERS);
    pushedKey.current = orderFiltersKey(EMPTY_ORDER_FILTERS);
    onReset();
  };

  // The date range is two controls under one label, so it borrows Field's styles instead of nesting a Field.
  const rangeField = field();

  // What the list is actually filtered by, summed up while the panel is folded away.
  const appliedFilterCount =
    [value.id, value.customer, value.status].filter(Boolean).length + (value.from || value.to ? 1 : 0);

  return (
    <Collapsible.Root
      open={expanded}
      onOpenChange={(next) => {
        // Desktop has no trigger: there `open` only follows the viewport.
        if (!desktop) {
          setMobileOpen(next);
        }
      }}
    >
      <Card
        // Below md the title row is the card's whole surface and the form carries its own inset padding.
        padding="none"
        title={
          desktop ? (
            '筛选条件'
          ) : (
            <Collapsible.Trigger className={toggleClass}>
              <span>筛选条件</span>
              {appliedFilterCount > 0 ? <span className={toggleCountClass}>已筛选 {appliedFilterCount} 项</span> : null}
              <ChevronDownIcon size={sizes['icon-sm']} className={toggleChevronClass} />
            </Collapsible.Trigger>
          )
        }
        className={css({ gap: { base: '0', md: '4' }, md: { padding: '5' } })}
      >
        <Collapsible.Panel className={panelClass}>
          <form
            className={css({
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6',
              // The card has no padding below md, so the form supplies it instead; the top padding keeps the
              // header row's hover fill from sitting flush against the first label.
              paddingBlockStart: { base: '3', md: '0' },
              paddingInline: { base: '5', md: '0' },
              paddingBlockEnd: { base: '5', md: '0' },
            })}
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <div
              className={css({
                containerType: 'inline-size',
                // Basis is the two-column threshold: below it the buttons take their own line.
                flex: '1 1 480px',
                minWidth: '0',
              })}
            >
              <div
                className={css({
                  display: 'grid',
                  gap: '4',
                  gridTemplateColumns: '1fr',
                  '@container (min-width: 480px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
                  '@container (min-width: 720px)': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
                  '@container (min-width: 1200px)': { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
                })}
              >
                <Field label="订单号" className={css({ minWidth: '0' })}>
                  <Input
                    placeholder="请输入订单号"
                    value={draft.id}
                    onChange={(event) => change({ id: event.target.value })}
                  />
                </Field>
                <Field label="客户" className={css({ minWidth: '0' })}>
                  <Input
                    placeholder="请输入客户名称"
                    value={draft.customer}
                    onChange={(event) => change({ customer: event.target.value })}
                  />
                </Field>
                <Field label="状态" className={css({ minWidth: '0' })}>
                  <Select
                    value={draft.status}
                    onChange={(event) => change({ status: event.target.value as OrderStatus | '' })}
                    options={[
                      { value: '', label: '全部状态' },
                      ...Object.entries(ORDER_STATUS).map(([status, meta]) => ({ value: status, label: meta.label })),
                    ]}
                  />
                </Field>
                {/* A legend can't be a flex item, so the visible label is a span and the legend speaks for it. */}
                <fieldset className={css({ display: 'contents' })}>
                  <legend className={css({ srOnly: true })}>创建时间</legend>
                  <div className={cx(rangeField.root, css({ minWidth: '0' }))}>
                    <span aria-hidden="true" className={rangeField.label}>
                      创建时间
                    </span>
                    <div className={css({ display: 'flex', alignItems: 'center', gap: '1', minWidth: '0' })}>
                      <Input
                        type="date"
                        aria-label="开始日期"
                        max={draft.to || undefined}
                        value={draft.from}
                        className={css({ flex: '1', minWidth: '0' })}
                        onChange={(event) => change({ from: event.target.value })}
                      />
                      <span className={css({ color: 'text-muted', flex: 'none' })}>-</span>
                      <Input
                        type="date"
                        aria-label="结束日期"
                        min={draft.from || undefined}
                        value={draft.to}
                        className={css({ flex: '1', minWidth: '0' })}
                        onChange={(event) => change({ to: event.target.value })}
                      />
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <div
              className={css({
                display: 'flex',
                flex: 'none',
                gap: '2',
                marginInlineStart: 'auto',
                paddingTop: '26px',
              })}
            >
              <Button type="submit" iconStart={<SearchIcon />}>
                搜索
              </Button>
              <Button type="button" variant="ghost" color="secondary" iconStart={<RefreshIcon />} onClick={reset}>
                重置
              </Button>
            </div>
          </form>
        </Collapsible.Panel>
      </Card>
    </Collapsible.Root>
  );
}
