/**
 * Every piece of copy a component writes on its own (labels, accessible names, defaults). Simplified Chinese, no
 * emoji. Not `as const`: an app replaces these strings, so each key is a plain `string` in `Strings`, not a literal.
 */
export const strings = {
  close: '关闭',
  loading: '加载中',
  /** A Button's spinner while `loading`. */
  processing: '处理中',
  avatar: '头像',
  optional: '（选填）',
  /** Read after an external Link. */
  opensInNewWindow: '（在新窗口打开）',
  prevPage: '上一页',
  nextPage: '下一页',
  pagination: '分页',
  page: (n: number) => `第 ${n} 页`,
  progress: '进度',
  /** An indeterminate Progress's value text. */
  inProgress: '进行中',
  selectPlaceholder: '请选择',
  search: '搜索',
  noMatches: '无匹配项',
  /** Tag's × button; the tag's label follows it. */
  remove: '移除',
  /** An empty Table's message. */
  noData: '暂无数据',
  /** The toast region's accessible name. */
  notifications: '通知',
  /** A NavMenu's landmark name, and the mobile drawer's title. */
  navMenu: '主导航',
  /** A Breadcrumb's landmark name. */
  breadcrumb: '面包屑',
  /** A DropZone with no visible title, and its default title. */
  dropZone: '选择文件',
  dropZoneTitle: '拖拽文件到这里，或点击选择',
  /** MapEditor and SetEditor: add button, empty state, and the row's remove and drag handles. */
  addEntry: '添加条目',
  addValue: '添加值',
  noEntries: '还没有条目',
  noValues: '还没有值',
  removeEntry: '删除条目',
  removeValue: '删除值',
  dragToReorder: '拖动排序',
  /** The name a draggable row announces, and what the keyboard does. */
  sortableItem: '可拖动条目',
  dragInstructions: '按空格键抓取条目，用方向键移动，再按空格键放下，按 Esc 取消。',
  dragPickedUp: (position: number) => `已抓取第 ${position} 项。`,
  dragMoved: (position: number) => `已移动到第 ${position} 项。`,
  dragDropped: (position: number) => `已放到第 ${position} 项。`,
  dragCanceled: '已取消拖动。',
  /** Shown under a field whose key or value repeats another row. */
  duplicateKey: '键名不能重复',
  duplicateValue: '值不能重复',
};

/** The full copy table: every string Koi writes, with Koi's Simplified Chinese defaults. */
export type Strings = typeof strings;

/** Copy an app replaces. Every key is optional; a missing key keeps Koi's default. */
export type StringsOverride = { [K in keyof Strings]?: Strings[K] };

/**
 * Builds a copy table from Koi's defaults plus `overrides`. Shallow: an overridden key is replaced whole.
 * `undefined` is ignored rather than merged in, so `t('close')` returning undefined can't erase the default.
 */
export function createStrings(overrides: StringsOverride = {}): Strings {
  const merged: Record<string, unknown> = { ...strings };
  for (const [key, value] of Object.entries(overrides)) {
    if (value !== undefined) {
      merged[key] = value;
    }
  }
  return merged as Strings;
}
