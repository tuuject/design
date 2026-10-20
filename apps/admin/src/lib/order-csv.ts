import { ORDER_STATUS, type Order, type OrderImport, type OrderStatus } from '../mock/api';
import { formatDateTimeFull } from './format';

const HEADER = ['订单号', '客户', '商品', '金额', '状态', '创建时间'];

export function ordersToCsv(rows: readonly Order[]) {
  // Quote only when a value could break the row; Excel opens the BOM-prefixed UTF-8 as Chinese.
  const lines = [
    HEADER.join(','),
    ...rows.map((order) =>
      [
        order.id,
        order.customer,
        order.product,
        order.amount.toFixed(2),
        ORDER_STATUS[order.status].label,
        formatDateTimeFull(order.createdAt),
      ]
        .map((value) => (/[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value))
        .join(','),
    ),
  ];
  // The BOM makes Excel read the file as UTF-8 instead of the system's ANSI code page.
  return `\uFEFF${lines.join('\r\n')}\r\n`;
}

/** RFC 4180-ish: quoted cells may contain commas, quotes and newlines. */
function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  const source = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (quoted) {
      if (char === '"') {
        if (source[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        cell += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(cell);
      cell = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && source[i + 1] === '\n') {
        i++;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((cells) => cells.some((value) => value.trim().length > 0));
}

export interface ParsedOrderCsv {
  rows: OrderImport[];
  errors: string[];
}

/**
 * Reads the file written by `ordersToCsv` (or a hand-made one with the same header). An `订单号` cell updates that
 * order on import; leave it empty to insert a new one. Bad rows are reported and skipped, never half-imported.
 */
export function parseOrderCsv(text: string): ParsedOrderCsv {
  const table = parseCsv(text);
  if (table.length === 0) {
    return { rows: [], errors: ['文件是空的。'] };
  }
  const header = table[0].map((value) => value.trim().toLowerCase());
  const column = (aliases: readonly string[]) => header.findIndex((value) => aliases.includes(value));
  const idAt = column(['订单号', 'id', 'order id']);
  const customerAt = column(['客户', '客户名称', 'customer']);
  const productAt = column(['商品', '商品名称', 'product']);
  const amountAt = column(['金额', 'amount']);
  const statusAt = column(['状态', 'status']);
  const createdAtAt = column(['创建时间', 'createdat', 'created at']);

  const missing = [
    customerAt === -1 ? '客户' : '',
    productAt === -1 ? '商品' : '',
    amountAt === -1 ? '金额' : '',
    statusAt === -1 ? '状态' : '',
  ].filter(Boolean);
  if (missing.length > 0) {
    return { rows: [], errors: [`缺少必需的列：${missing.join('、')}。`] };
  }

  const rows: OrderImport[] = [];
  const errors: string[] = [];
  for (let i = 1; i < table.length; i++) {
    const cells = table[i];
    const line = i + 1;
    const id = idAt >= 0 ? cells[idAt]?.trim() : '';
    const customer = cells[customerAt]?.trim() ?? '';
    const product = cells[productAt]?.trim() ?? '';
    const amount = Number((cells[amountAt] ?? '').replace(/[¥￥,\s]/g, ''));
    const rawStatus = (cells[statusAt] ?? '').trim();
    const status = (
      Object.hasOwn(ORDER_STATUS, rawStatus)
        ? rawStatus
        : Object.keys(ORDER_STATUS).find((key) => ORDER_STATUS[key as OrderStatus].label === rawStatus)
    ) as OrderStatus | undefined;
    const issues: string[] = [];
    if (!customer) {
      issues.push('客户为空');
    }
    if (!product) {
      issues.push('商品为空');
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      issues.push('金额无效');
    }
    if (!status) {
      issues.push('状态无法识别');
    }
    let createdAt: number | undefined;
    const rawCreatedAt = createdAtAt >= 0 ? (cells[createdAtAt] ?? '').trim() : '';
    if (rawCreatedAt) {
      createdAt = new Date(rawCreatedAt.includes('T') ? rawCreatedAt : rawCreatedAt.replace(' ', 'T')).getTime();
      if (Number.isNaN(createdAt)) {
        issues.push('创建时间无效');
      }
    }
    if (issues.length > 0 || !status) {
      errors.push(`第 ${line} 行：${issues.join('，')}。`);
      continue;
    }
    rows.push({ id: id || undefined, customer, product, amount, status, createdAt });
  }
  return { rows, errors };
}
