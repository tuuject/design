import { Button } from '@koi/react/button';
import { Card } from '@koi/react/card';
import { Field } from '@koi/react/field';
import { SearchIcon } from '@koi/react/icons';
import { Input } from '@koi/react/input';
import { Select } from '@koi/react/select';
import { css, cx } from '@koi/react/styled-system/css';
import { field } from '@koi/react/styled-system/recipes';
import { useRef, useState } from 'react';
import {
  EMPTY_ORDER_FILTERS,
  normalizeOrderFilters,
  type OrderFilterFields,
  orderFiltersKey,
} from '../../lib/order-filters';
import { ORDER_STATUS, type OrderStatus } from '../../mock/api';
import { RefreshIcon } from '../icons';

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

  return (
    <Card title="筛选条件" className={css({gap: '4'})}>
      <form
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6',
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
        <div className={css({ display: 'flex', flex: 'none', gap: '2', marginInlineStart: 'auto', paddingTop: '26px' })}>
          <Button type="submit" iconStart={<SearchIcon />}>
            搜索
          </Button>
          <Button type="button" variant="ghost" color="secondary" iconStart={<RefreshIcon />} onClick={reset}>
            重置
          </Button>
        </div>
      </form>
    </Card>
  );
}
