# Admin Template（apps/admin）

Koi 的 React Admin Template：参考 vue-element-admin 的产品定位，提供一个开箱即用、可以作为真实后台起点，同时是 `@koi/react` 的综合集成示例。它是一个 app，不是组件库的一部分。（2026-10-16）

## 技术栈与接线

- **Rsbuild**：`apps/admin/rsbuild.config.ts`。TanStack Router 的文件路由插件走 `@tanstack/router-plugin/rspack`，挂在 `tools.rspack.plugins`（官方 Rsbuild 方式）。
- **样式**：全仓库共用根 `panda.config.ts`，app 通过 `apps/admin/postcss.config.cjs`（Panda 的 PostCSS 插件，同 Storybook）注入 layers。app 里用 `css()` 的文件必须被根配置的 `include` 扫到——已加 `./apps/admin/src/**/*.{ts,tsx}`。
- **只用一次的样式直接内联**：`className={css({ … })}` 写在 JSX 上，不抽进文件顶部的 `const s = { … }`；只有同一文件里用到两次以上的才放进 `s`（如 `UserMenu` 的 `item`、订单详情的 `detailLabel` / `detailValue`）。解释“为什么”的注释跟着属性写在 `css({})` 里面。
- **主题**：`theme-init.js` 在 `rsbuild.config.ts` 里读包文件后以 `html.tags` 内联进 `<head>`（无主题闪烁）；切换走 `koiSetTheme`。`hooks/use-theme.ts` 用 `useSyncExternalStore` + `MutationObserver` 直接读 `<html data-theme>`，不另存 state，所以 `koiSetTheme`、跟随系统的切换都能看到。palette 没有做切换 UI，机制与 Storybook 一致。
- **数据层用 TanStack Query**：`index.tsx` 里建 `QueryClient`。query key 约定：`['orders', 'list', query]`、`['orders', 'recent', n]`、`['stats']`；写操作成功后 `invalidateQueries` 前缀。订单页 `placeholderData: keepPreviousData`，`loading = isPending || isPlaceholderData`——换筛选 / 翻页出 skeleton，窗口聚焦、删除后的后台重拉不出。删除确认里 `await invalidateQueries` 后再关弹窗，弹窗关上时表格里那行已经没了。
- **不直接写 `useEffect`**：组件里不用 `useEffect`，只有 `src/hooks/` 里的可复用 hook 可以（`useMountEffect`）。替代写法：页面标题直接渲染 React 19 的 `<title>`（`__root.tsx`；`rsbuild.config.ts` 的 `html.title: ''` 去掉模板里的 `<title>`，不设会回落成 "Rsbuild App"）；任何换页关移动端抽屉在 `index.tsx` 模块顶层 `router.subscribe('onResolved')`，覆盖浏览器后退。
- **表单统一用 react-hook-form**：`useForm` + `register`（Input / Textarea）+ `Controller`（Checkbox / Switch / RadioGroup，Base UI 的 `onCheckedChange` / `onChange` 直接接 `field.onChange`）。字段错误取 `errors.<name>?.message` 喂给 `Field`，表单级（如登录失败）用 `setError('root')`，提交态用 `formState.isSubmitting`；保存成功后 `reset(saved)` 让「重置」回到最新基线。见 `routes/login.tsx`、`routes/_authed.settings.tsx`。
- **路由守卫**：`_authed.tsx` 的 `beforeLoad` 读 zustand store（`useAuthStore.getState()`，persist 同步恢复），未登录 `redirect` 到 `/login?redirect=<href>`；login 的 `validateSearch` 只放行 `/` 开头的回跳地址。
- **URL 即状态**：订单页的 `id / customer / status / from / to / page / pageSize` 全在 search 里（`validateSearch`），筛选、分页、回跳后还原都靠它。页大小只接受 10 / 20 / 50，日期只接受 `YYYY-MM-DD`。
- **订单页搜索是手动的**：`OrderSearchForm` 只在点「搜索」或回车时把草稿写进 URL（2026-10-20 去掉实时搜索：后台列表每敲一个字就发查询没有价值，切筛选还会打断正在输入的内容）。表单保留本地草稿，用自己的 `pushedKey` 区分「自己写的 URL」和「外部导航」，后者才覆盖草稿。
- **筛选栏按自身宽度排版**：字段区 `containerType: inline-size`，内部 grid 用 `@container` 在 480 / 720 / 1200px 切成 1 / 2 / 3 / 4 列；「创建时间」占两列，到 1200px 才恢复单列，否则日期框会被压到只剩图标。搜索 / 重置 `flex: none` 贴右，字段区 `flex: 1 1 480px`，放不下时按钮换行后仍靠右。看容器实际宽度而不是视口，侧边栏折叠不会打乱列数。
- **订单 CRUD**：新增 / 修改用 `OrderFormDialog`（每次打开换 `key` 重挂里面的 react-hook-form 表单，避免用 effect reset；`Dialog` 本身不换 key，否则以打开状态挂载会跳过进场动画），表格选择用 `@koi/react/table` 的 parts 自己拼（`DataTable` 明确不提供选择），删除支持单行与批量。CSV 导入导出在 `lib/order-csv.ts`：导出带 BOM，导入按 `订单号` upsert（有则更新、无则新增），坏行跳过并在 toast 里报告；最后一行删空时自动退回上一页。
- **dev server 可被 agent 接管**：`pnpm dev:admin` 走 `scripts/dev-server.mjs`：已有 server 在 3000 时直接退出（不截断它的日志），否则先 codegen 再起 `rsbuild dev`，输出原样打到终端（`FORCE_COLOR` 保留颜色，stdin 仍是 TTY，快捷键可用），去掉 ANSI 后写进 `.temp/dev-admin.log`。用 Node 管道而不是 `| tee`，是为了 Windows 上也能跑。`rsbuild.config.ts` 设了 `strictPort`，端口被占不会悄悄换到 3001。接管规则见 AGENTS.md 的 Long-Running Process Rules。
- **typecheck**：`node scripts/generate-routes.mjs && tsc`。`@tanstack/router-plugin@1.168` 没有 `tsr` CLI，脚本直接调插件对象的 `vite.configResolved` 钩子生成 `routeTree.gen.ts`（dev/build 时插件本来就会生成）。

## 组件缺口：模板内实现 vs 应该进库

| 能力 | 现状 |
| --- | --- |
| 侧边栏导航 | 模板内 `Sidebar`，样式按 NavMenu spec 的竖版规则（`nav-item-*` token、36px、radius-xl、当前项加粗），但只是三分实现；**NavMenu 仍是库里未移植的组件**，移植后应替换 |
| 用户下拉菜单 | 直接用 `@base-ui/react/menu`（Menu.Root/Trigger/Positioner/Popup），样式照 SelectPanel spec 的面板（36px 项、`radius-lg`、分隔线贴边、scale 96% 弹出）；等库里出了 Menu 再换 |
| 表格 | 已进库：`@koi/react/data-table` 的 `DataTable`（2026-10-16，spec `docs/spec/components/Table.md`）。要排序 / 选择时改用 `@koi/react/table` 的 parts 自己拼，可直接接 TanStack Table |
| 面包屑 | 模板内 `Breadcrumbs`，靠路由 `staticData.title` |
| 业务图标 | `components/icons.tsx`，从 `@iconify-icons/fa7-solid` 挑，用 `@koi/react/icons` 的 `Icon` 渲染。Free 里没有的（如侧边栏图标）可以换别的 Iconify 图标集或手写 `{ body, width, height }` |

## 决定与坑

- **客服会话 / AI 助手是 ChatBubble 的两个组合示例**（2026-10-24）：`/support`（`routes/_authed.support.tsx`）是两个真人的会话——客户走 `received`（左，带头像）、客服走 `sent`（右），包在 Card 里；`/agent`（`routes/_authed.agent.tsx`）是真人消息在右侧气泡、助手回复直接平铺 markdown（`components/Markdown.tsx`，`react-markdown` 包在库的 `Prose size="sm"` 里，14px，与页面其余 UI 文字同一基准），不加 Card。markdown 用 `react-markdown`（admin 独有依赖，内容是静态示例，无输入框）。
- **Panda preflight 把所有列表的 marker 去掉了**：reset 层有 `ol, ul, menu { list-style: none; }`。markdown 正文交给 `Prose`，它会把 marker 加回来；自己写列表时要在组件 css 恢复 `listStyleType`。不要动全局 reset——侧边栏等处的列表正依赖它。
- **断点在 config，不在 tokens**：`panda.config.ts` 的 `theme.extend.breakpoints = { md: '768px' }`（与 Bilisound 的 md 768 约定一致）。preset-base 不带断点；等 tokens.json 收编后应挪过去（plan.md 未决事项）。
- **这版 Panda 的断点条件没有下划线**：顶层写 `md: {...}`、响应式值写 `display: { base: 'none', md: 'inline' }`，不是 `_md`。嵌套选择器必须以 `&` 开头（`'& [data-nav-label]'`），`&[data-x]` 是同元素匹配，不是后代。
- **spacing token 是裸数字**：`gap: '4'`、`padding: '6'`，**不是** `'space-4'`——写错会生成空规则（`.px_space-4 { }`），`strictTokens: false` 下静默通过。radius/shadow/size 才用名字（`'xl'`、`'float'`、`'control-md'`）。
- **JSX 属性名撞 CSS 属性名**：Panda 默认把任何 JSX 上与 CSS 属性同名的 prop 当 style prop 抽取（`<DataTable columns={…}>` 报 `nested_property`，Tooltip 的 `content` 生成过 `content: 关闭` 之类的垃圾规则）。根配置已设 `jsxStyleProps: 'none'`，样式只走 `css()` 和 recipe，prop 可以放心叫 `columns`。
- **产物告警**：库侧两条既有 `pure_helper_unevaluated`（Pagination 的 `useButtonShape`、SelectPanel 的 `useParts`）来自抽取器无法求值 hook，样式实际由 `staticCss: { recipes: '*' }` 预生成，渲染无影响；属于库的已知行为，不是模板引入的。
- 布局常量（侧边栏 248/72、顶栏 56、app 层 z-index 60/40）是模板自己的 chrome 常量，低于 Koi 浮层（dialog 900+）；库的 focusRing 没有导出，`shared.ts` 里镜像了一份。
- **自己 portal 的浮层要给 z-index**：模板里直接用 Base UI 的浮层（如 UserMenu 的 `Menu.Positioner`）portal 到 `<body>` 后没有层级，会被 sticky 顶栏（z-index 40）盖住上沿。照 SelectPanel 给 Positioner `zIndex: 'popup'`。
- **Dialog 的开关和数据分开存**：别用 `open={detail !== null}`、关闭时 `setDetail(null)`——Base UI 退场时 Popup 还挂着播淡出，数据一清空，内容就先消失再淡出。用独立的 `open` state，关闭只翻它，数据留到下次打开时覆盖；有 loading 的确认框在打开时重置 loading，别在请求结束后先关 loading 再关弹窗（按钮会在淡出中闪回原文案）。见 `routes/_authed.orders.tsx`。
- **URL 驱动的输入框要跟随外部变化**：`OrderSearchForm` 的草稿只在「外部导航」时被 URL 覆盖（点侧边栏「订单管理」、后退），靠 `pushedKey` 记住自己刚写的筛选，避免自己提交的 URL 落地时把紧接着输入的字清掉。删除按钮的 loading 仍用本地 `deleting`，别换成 `useMutation().isPending`（理由见上一条）。
- **行内操作是 rounded**：`TableCell` 里的按钮默认 `shape="rounded"`（sm 档左右 8px），操作按钮之间不留间距，组合再 `marginInlineEnd: '-2'` 让最后一个字和表头右边对齐。pill 在行里显得太散（2026-10-16 改，之前一度为「一个 surface 一种形状」统一成 pill）；表格下方的 Pagination 用 `variant="compact"`（圆形 icon-only 上一页 / 下一页，整行固定 pill），spec 允许按钮组之间形状不同。

## 验证

`pnpm check` 全绿（含 admin typecheck）。浏览器冒烟（dev + 生产构建）：登录/守卫回跳、URL 筛选与分页、详情/删除弹窗 + toast、表单校验与保存同步、深浅主题、折叠侧边栏 + Tooltip、移动端抽屉、404。截图确认过浅色与深色。
