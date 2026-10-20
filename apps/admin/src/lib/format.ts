const money = new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' });

export function formatMoney(value: number) {
  return money.format(value);
}

/** Short date + time, like "Oct 7, 14:30" (docs/spec/README.md: short dates, no zeros padding). */
export function formatDateTime(ts: number) {
  const d = new Date(ts);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${hh}:${mm}`;
}

/** Sortable, Excel-friendly `2026-01-18 10:58:15`; also what the CSV export writes and the import parses. */
export function formatDateTimeFull(ts: number) {
  const d = new Date(ts);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
