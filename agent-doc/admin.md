# Admin Template（apps/admin）

Koi 的 React Admin Template：参考 vue-element-admin 的产品定位，提供一个开箱即用、可以作为真实后台起点，同时是 `@koi/react` 的综合集成示例。它是一个 app，不是组件库的一部分。（2026-10-16）

## 技术栈与接线

- **Rsbuild**：`apps/admin/rsbuild.config.ts`。TanStack Router 的文件路由插件走 `@tanstack/router-plugin/rspack`，挂在 `tools.rspack.plugins`（官方 Rsbuild 方式）。
- **样式**：全仓库共用根 `panda.config.ts`，app 通过 `apps/admin/postcss.config.cjs`（Panda 的 PostCSS 插件，同 Storybook）注入 layers。app 里用 `css()` 的文件必须被根配置的 `include` 扫到——已加 `./apps/admin/src/**/*.{ts,tsx}`。
- **主题**：`theme-init.js` 在 `rsbuild.config.ts` 里读包文件后以 `html.tags` 内联进 `<head>`（无主题闪烁）；切换走 `koiSetTheme`（`hooks/use-theme.ts` 只是给图标/文案做的镜像）。palette 没有做切换 UI，机制与 Storybook 一致。
- **路由守卫**：`_authed.tsx` 的 `beforeLoad` 读 zustand store（`useAuthStore.getState()`，persist 同步恢复），未登录 `redirect` 到 `/login?redirect=<href>`；login 的 `validateSearch` 只放行 `/` 开头的回跳地址。
- **URL 即状态**：订单页的 `q / status / page` 全在 search 里（`validateSearch`），筛选、分页、回跳后还原都靠它。
- **typecheck**：`node scripts/generate-routes.mjs && tsc`。`@tanstack/router-plugin@1.168` 没有 `tsr` CLI，脚本直接调插件对象的 `vite.configResolved` 钩子生成 `routeTree.gen.ts`（dev/build 时插件本来就会生成）。

## 组件缺口：模板内实现 vs 应该进库

| 能力 | 现状 |
| --- | --- |
| 侧边栏导航 | 模板内 `Sidebar`，样式按 NavMenu spec 的竖版规则（`nav-item-*` token、36px、radius-xl、当前项加粗），但只是三分实现；**NavMenu 仍是库里未移植的组件**，移植后应替换 |
| 用户下拉菜单 | 直接用 `@base-ui/react/menu`（Menu.Root/Trigger/Positioner/Popup），样式照 SelectPanel spec 的面板（36px 项、`radius-lg`、分隔线贴边、scale 96% 弹出）；等库里出了 Menu 再换 |
| 表格 | 已进库：`@koi/react/data-table` 的 `DataTable`（2026-10-16，spec `docs/spec/components/Table.md`）。要排序 / 选择时改用 `@koi/react/table` 的 parts 自己拼，可直接接 TanStack Table |
| 面包屑 | 模板内 `Breadcrumbs`，靠路由 `staticData.title` |
| 业务图标 | `components/icons.tsx`，按 Koi 图标规范画（24 网格、2.25 描边、currentColor） |

## 决定与坑

- **断点在 config，不在 tokens**：`panda.config.ts` 的 `theme.extend.breakpoints = { md: '768px' }`（与 Bilisound 的 md 768 约定一致）。preset-base 不带断点；等 tokens.json 收编后应挪过去（plan.md 未决事项）。
- **这版 Panda 的断点条件没有下划线**：顶层写 `md: {...}`、响应式值写 `display: { base: 'none', md: 'inline' }`，不是 `_md`。嵌套选择器必须以 `&` 开头（`'& [data-nav-label]'`），`&[data-x]` 是同元素匹配，不是后代。
- **spacing token 是裸数字**：`gap: '4'`、`padding: '6'`，**不是** `'space-4'`——写错会生成空规则（`.px_space-4 { }`），`strictTokens: false` 下静默通过。radius/shadow/size 才用名字（`'xl'`、`'float'`、`'control-md'`）。
- **JSX 属性名撞 CSS 属性名**：Panda 默认把任何 JSX 上与 CSS 属性同名的 prop 当 style prop 抽取（`<DataTable columns={…}>` 报 `nested_property`，Tooltip 的 `content` 生成过 `content: 关闭` 之类的垃圾规则）。根配置已设 `jsxStyleProps: 'none'`，样式只走 `css()` 和 recipe，prop 可以放心叫 `columns`。
- **产物告警**：库侧两条既有 `pure_helper_unevaluated`（Pagination 的 `useButtonShape`、SelectPanel 的 `useParts`）来自抽取器无法求值 hook，样式实际由 `staticCss: { recipes: '*' }` 预生成，渲染无影响；属于库的已知行为，不是模板引入的。
- 布局常量（侧边栏 248/72、顶栏 56、app 层 z-index 60/40）是模板自己的 chrome 常量，低于 Koi 浮层（dialog 900+）；库的 focusRing 没有导出，`shared.ts` 里镜像了一份。
- **自己 portal 的浮层要给 z-index**：模板里直接用 Base UI 的浮层（如 UserMenu 的 `Menu.Positioner`）portal 到 `<body>` 后没有层级，会被 sticky 顶栏（z-index 40）盖住上沿。照 SelectPanel 给 Positioner `zIndex: 'popup'`。
- **Dialog 的开关和数据分开存**：别用 `open={detail !== null}`、关闭时 `setDetail(null)`——Base UI 退场时 Popup 还挂着播淡出，数据一清空，内容就先消失再淡出。用独立的 `open` state，关闭只翻它，数据留到下次打开时覆盖；有 loading 的确认框在打开时重置 loading，别在请求结束后先关 loading 再关弹窗（按钮会在淡出中闪回原文案）。见 `routes/_authed.orders.tsx`。
- **一个 surface 一种形状**：订单卡片里分页和工具栏是 pill，行内操作按钮也用 pill，不混 `shape="rounded"`（spec 的 "Use one shape per surface"）。

## 验证

`pnpm check` 全绿（含 admin typecheck）。浏览器冒烟（dev + 生产构建）：登录/守卫回跳、URL 筛选与分页、详情/删除弹窗 + toast、表单校验与保存同步、深浅主题、折叠侧边栏 + Tooltip、移动端抽屉、404。截图确认过浅色与深色。
