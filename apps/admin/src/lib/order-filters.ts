import type { OrderFilters, OrderStatus } from '../mock/api';

/** The search form's draft: blank means "not filtering". */
export interface OrderFilterFields {
  id: string;
  customer: string;
  status: OrderStatus | '';
  from: string;
  to: string;
}

/** The subset of the URL search that drives the list. */
export interface OrderFilterSearch {
  id?: string;
  customer?: string;
  status?: OrderStatus;
  from?: string;
  to?: string;
}

export const EMPTY_ORDER_FILTERS: OrderFilterFields = {
  id: '',
  customer: '',
  status: '',
  from: '',
  to: '',
};

export function orderFilterFields(search: OrderFilterSearch): OrderFilterFields {
  return {
    id: search.id ?? '',
    customer: search.customer ?? '',
    status: search.status ?? '',
    from: search.from ?? '',
    to: search.to ?? '',
  };
}

export function normalizeOrderFilters(fields: OrderFilterFields): OrderFilterFields {
  return {
    ...fields,
    id: fields.id.trim(),
    customer: fields.customer.trim(),
    from: fields.from.trim(),
    to: fields.to.trim(),
  };
}

/** Form drafts → API query, dropping blank values so the URL and query key stay clean. */
export function orderFiltersToQuery(fields: OrderFilterFields): OrderFilters {
  const normalized = normalizeOrderFilters(fields);
  return {
    id: normalized.id || undefined,
    customer: normalized.customer || undefined,
    status: normalized.status || undefined,
    from: normalized.from || undefined,
    to: normalized.to || undefined,
  };
}

export function orderFiltersToSearch(fields: OrderFilterFields): OrderFilterSearch {
  return orderFiltersToQuery(fields);
}

/** Stable identity for "did the applied filters change?", independent of object identity. */
export function orderFiltersKey(fields: OrderFilterFields): string {
  return JSON.stringify(normalizeOrderFilters(fields));
}
