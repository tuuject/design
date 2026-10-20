import { Button } from '@koi/react/button';
import { Card } from '@koi/react/card';
import { SearchIcon } from '@koi/react/icons';
import { Input } from '@koi/react/input';
import { Select } from '@koi/react/select';
import { css } from '@koi/react/styled-system/css';
import { useId, useRef, useState } from 'react';
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
  const uid = useId();
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

  // Filter labels are Field labels: the 14px `label` style, not `small`.
  const labelClass = css({ flex: 'none', width: '64px', textStyle: 'label', color: 'text' });

  return (
    <Card title="筛选条件">
      <form
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          gap: '4',
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
            <div className={css({ display: 'flex', alignItems: 'center', gap: '2', minWidth: '0' })}>
              <label htmlFor={`${uid}-id`} className={labelClass}>
                订单号
              </label>
              <Input
                id={`${uid}-id`}
                placeholder="请输入订单号"
                value={draft.id}
                onChange={(event) => change({ id: event.target.value })}
              />
            </div>
            <div className={css({ display: 'flex', alignItems: 'center', gap: '2', minWidth: '0' })}>
              <label htmlFor={`${uid}-customer`} className={labelClass}>
                客户
              </label>
              <Input
                id={`${uid}-customer`}
                placeholder="请输入客户名称"
                value={draft.customer}
                onChange={(event) => change({ customer: event.target.value })}
              />
            </div>
            <div className={css({ display: 'flex', alignItems: 'center', gap: '2', minWidth: '0' })}>
              <label htmlFor={`${uid}-status`} className={labelClass}>
                状态
              </label>
              <Select
                id={`${uid}-status`}
                value={draft.status}
                onChange={(event) => change({ status: event.target.value as OrderStatus | '' })}
                options={[
                  { value: '', label: '全部状态' },
                  ...Object.entries(ORDER_STATUS).map(([status, meta]) => ({ value: status, label: meta.label })),
                ]}
              />
            </div>
            <fieldset className={css({ display: 'contents' })}>
              <legend className={css({ srOnly: true })}>创建时间</legend>
              <div
                className={css({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2',
                  minWidth: '0',
                })}
              >
                <span className={labelClass}>创建时间</span>
                <div className={css({ display: 'flex', alignItems: 'center', gap: '1', flex: '1', minWidth: '0' })}>
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
        <div className={css({ display: 'flex', flex: 'none', gap: '2', marginInlineStart: 'auto' })}>
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
