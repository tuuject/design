/** Every piece of copy a component writes on its own (labels, accessible names, defaults). Simplified Chinese, no emoji. */
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
} as const;
