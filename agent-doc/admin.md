# Admin Template（apps/admin）

Koi 的 React Admin Template：参考 vue-element-admin 的产品定位，提供一个开箱即用、可以作为真实后台起点，同时是 `@tuuject/koi-react` 的综合集成示例。它是一个 app，不是组件库的一部分。（2026-10-16）

## 技术栈与接线

- **Vite**：`apps/admin/vite.config.ts`，入口是 `apps/admin/index.html`。TanStack Router 的文件路由插件走 `@tanstack/router-plugin/vite`，必须排在 `@vitejs/plugin-react` 前面。vite / plugin-react 与 Storybook 同版本。2026-10-30 从 Rsbuild 迁过来：Rsbuild 在热更新时经常崩。迁移后连续 40 次改组件和路由文件（含 `?tsr-split` 拆出的 chunk），HMR 全部生效，没有整页刷新，也没有报错。
- **样式**：全仓库共用根 `panda.config.ts`，app 通过 `apps/admin/postcss.config.cjs`（Panda 的 PostCSS 插件，同 Storybook）注入 layers。app 里用 `css()` 的文件必须被根配置的 `include` 扫到——已加 `./apps/admin/src/**/*.{ts,tsx}`。
- **只用一次的样式直接内联**：`className={css({ … })}` 写在 JSX 上，不抽进文件顶部的 `const s = { … }`；只有同一文件里用到两次以上的才放进 `s`（如订单详情的 `detailLabel` / `detailValue`）。解释“为什么”的注释跟着属性写在 `css({})` 里面。
- **主题**：`theme-init.js` 在 `vite.config.ts` 里读包文件后，由一个内联插件的 `transformIndexHtml`（`head-prepend`）塞进 `<head>` 最前面（无主题闪烁）；切换走 `koiSetTheme`。`hooks/use-theme.ts` 用 `useSyncExternalStore` + `MutationObserver` 直接读 `<html data-theme>`，不另存 state，所以 `koiSetTheme`、跟随系统的切换都能看到。palette 没有做切换 UI，机制与 Storybook 一致。
- **数据层用 TanStack Query**：`index.tsx` 里建 `QueryClient`。query key 约定：`['orders', 'list', query]`、`['orders', 'recent', n]`、`['stats']`；写操作成功后 `invalidateQueries` 前缀。订单页 `placeholderData: keepPreviousData`，`loading = isPending || isPlaceholderData`——换筛选 / 翻页出 skeleton，窗口聚焦、删除后的后台重拉不出。删除确认里 `await invalidateQueries` 后再关弹窗，弹窗关上时表格里那行已经没了。
- **不直接写 `useEffect`**：组件里不用 `useEffect`，只有 `src/hooks/` 里的可复用 hook 可以（`useMountEffect`）。替代写法：页面标题直接渲染 React 19 的 `<title>`（`__root.tsx`；`index.html` 故意不写 `<title>`）；任何换页关移动端抽屉在 `index.tsx` 模块顶层 `router.subscribe('onResolved')`，覆盖浏览器后退。
- **表单统一用 react-hook-form**：`useForm` + `register`（Input / Textarea）+ `Controller`（Checkbox / Switch / RadioGroup，Base UI 的 `onCheckedChange` / `onChange` 直接接 `field.onChange`）。字段错误取 `errors.<name>?.message` 喂给 `Field`，表单级（如登录失败）用 `setError('root')`，提交态用 `formState.isSubmitting`；保存成功后 `reset(saved)` 让「重置」回到最新基线。见 `routes/login.tsx`、`routes/_authed.settings.tsx`。分区较多的长表单用 `SectionedForm`（见下一条）。
- **分区长表单 `components/sectioned-form/`**（2026-10-30）：`SectionedForm`（布局、提交流程）+ `FormSection`（分区，Card recipe 画、标题是 `<h2>`）+ `FormField`（包一层 Koi `Field`，按 `name` 从 react-hook-form 取错误）。页面照常 `useForm`，把 `form` 和 `onSubmit: (values) => Promise<saved>` 交给它；示例是 `routes/_authed.assistant-settings.tsx`（`/assistant-settings`，mock 持久化在 `mock/api.ts`）。
  - **状态只有 react-hook-form 一份**：脏 = `formState.dirtyFields`（相对 `defaultValues`，即最近一次加载或保存的值；改回原值会自动掉出），错误 = `formState.errors`，提交态 = `isSubmitting` / `isSubmitSuccessful`，保存失败 = `setError('root.submit')`（下次提交时 RHF 自己清掉）。组件只把它们映射到自己登记过的分区和字段上；没有 `FormField` 声明的脏路径（如 `setValue` 写进去的）也计数，归到「其他」。
  - **登记靠 ref 回调**：分区、字段、首尾哨兵都用 React 19 带 cleanup 的 ref 回调登记进 `FormOutline`（`outline.ts`，`useSyncExternalStore` 读），没有 effect。字段卸载后保留 label：条件字段被隐藏时值还在（RHF 默认 `shouldUnregister: false`），改过的仍算未保存，摘要里标「已隐藏」，点它跳到所在分区。
  - **保存成功的基线**：`reset(服务器返回的值)`（服务器可能规范化，如 trim），再把请求期间又改过的路径（`changedPaths(提交时的值, 当前值)`）`setValue(…, { shouldDirty: true })` 放回去，所以提交中的编辑不丢、并保持为脏。失败时什么都不动。`inFlight` ref 挡住同一 tick 里的二次提交（回车 + 点击）。
  - **页面必须 `shouldFocusError: false`**：校验失败由 `SectionedForm` 按页面顺序滚到第一个错误字段（Controller 字段 RHF 自己聚焦不到），RHF 默认的聚焦会在之后再跳一次。
  - **scrollspy**：IntersectionObserver 的 root 是视口去掉顶部 sticky 区（`rootMargin` 的上边距读分区的 `scroll-margin-top`，CSS 是唯一来源，宽窄布局各一个值，ResizeObserver 触发重读）；当前分区 = 第一个还有部分在这条线以下的分区。末尾很短的分区永远到不了这条线，所以「表单末尾已在屏幕上、开头已滚出」时取最后一个。点导航 / 摘要跳转后锁定目标分区，直到用户自己滚（wheel、touch、滚动键，或 `scrollend` 之后的 scroll 事件），避免平滑滚动途中高亮扫过中间分区。
  - **布局按容器宽度**：根元素 `containerType: inline-size`，`@container (min-width: 720px)` 起左侧 sticky 分区列表，以下是表单上方 sticky 的 `SelectPanel` 下拉（选完自动关闭）。底部操作条 `position: sticky`（不是 fixed）：滚动时浮在内容上，到表单末尾落回自己的位置，不会永久挡住最后的字段；字段的 `scroll-margin-bottom` 让跳转和 Tab 聚焦停在操作条上方。
  - **脏 / 错标记形状不同**：未保存是 `text-brand` 小圆点，需修正是 `error-text` 的 ErrorIcon，各带一段 sr-only 文字。跳到字段时用 `highlight`（琥珀浅底）闪 1.6s；对应的对比度 pair 已加进 `contrast-pairs.json`。摘要只列字段名，从不显示值（密码字段同理）。
- **路由守卫**：`_authed.tsx` 的 `beforeLoad` 读 zustand store（`useAuthStore.getState()`，persist 同步恢复），未登录 `redirect` 到 `/login?redirect=<href>`；login 的 `validateSearch` 只放行 `/` 开头的回跳地址。
- **URL 即状态**：订单页的 `id / customer / status / from / to / page / pageSize` 全在 search 里（`validateSearch`），筛选、分页、回跳后还原都靠它。页大小只接受 10 / 20 / 50，日期只接受 `YYYY-MM-DD`。
- **订单页搜索是手动的**：`OrderSearchForm` 只在点「搜索」或回车时把草稿写进 URL（2026-10-20 去掉实时搜索：后台列表每敲一个字就发查询没有价值，切筛选还会打断正在输入的内容）。表单保留本地草稿，用自己的 `pushedKey` 区分「自己写的 URL」和「外部导航」，后者才覆盖草稿。
- **筛选栏按自身宽度排版**：字段区 `containerType: inline-size`，内部 grid 用 `@container` 在 480 / 720 / 1200px 切成 1 / 2 / 3 / 4 列；「创建时间」占两列，到 1200px 才恢复单列，否则日期框会被压到只剩图标。搜索 / 重置 `flex: none` 贴右，字段区 `flex: 1 1 480px`，放不下时按钮换行后仍靠右。看容器实际宽度而不是视口，侧边栏折叠不会打乱列数。
- **移动端筛选栏折成一行**（2026-11-03）：md 以下 `OrderSearchForm` 的卡片 `padding="none"`，标题行由 `Collapsible.Trigger` 撑满整张卡（56px 高，自带 20 / 16 内边距和 hover 填充），点它展开表单；桌面不用这层状态，永远展开，标题还是纯文本。默认收起，收起时标题旁显示「已筛选 N 项」（按 URL 里生效的条件算），展开动画走 Base UI `Collapsible.Panel` 的高度变量，和 `NavGroupItem` 同一套。表单自己的内边距只在 md 以下出现：左右 20px 补上卡片让出去的部分，顶部 12px 让标题行的 hover 填充和第一个字段留出间隔。
- **订单 CRUD**：新增 / 修改用 `OrderFormDialog`（每次打开换 `key` 重挂里面的 react-hook-form 表单，避免用 effect reset；`Dialog` 本身不换 key，否则以打开状态挂载会跳过进场动画），表格选择用 `@tuuject/koi-react/table` 的 parts 自己拼（`DataTable` 明确不提供选择），删除支持单行与批量。CSV 导入导出在 `lib/order-csv.ts`：导出带 BOM，导入按 `订单号` upsert（有则更新、无则新增），坏行跳过并在 toast 里报告；最后一行删空时自动退回上一页。
- **dev server 可被 agent 接管**：`pnpm dev:admin` 走 `scripts/dev-server.mjs`：已有 server 在 3000 时直接退出（不截断它的日志），否则先 codegen 再起 `vite`，输出原样打到终端（`FORCE_COLOR` 保留颜色，stdin 仍是 TTY，快捷键可用），去掉 ANSI 后写进 `.temp/dev-admin.log`。用 Node 管道而不是 `| tee`，是为了 Windows 上也能跑。`vite.config.ts` 设了 `strictPort`，端口被占不会悄悄换到 3001。接管规则见 AGENTS.md 的 Long-Running Process Rules。
- **`routeTree.gen.ts` 提交进 git**（按 TanStack Router 官方 FAQ）：它是运行时代码，不是构建产物。dev / build 时 Vite 插件会重新生成，改了路由文件就把它的 diff 一起提交，不要手改；Biome 仍然跳过它。typecheck 因此只是 `tsc`，不用先生成（2026-10-30 删掉了原来的 `scripts/generate-routes.mjs`）。加了路由却没跑过 dev，`createFileRoute('/xxx')` 在旧的 tree 里找不到路径，`tsc` 会报错，不会悄悄过期。

## 组件缺口：模板内实现 vs 应该进库

| 能力 | 现状 |
| --- | --- |
| 侧边栏 / 水平导航 | 模板内 `Sidebar` + `TopNav`，共用 `nav-item.ts` 的行样式与 `NavItemButton`（组内页面）、`NavGroupItem`（竖版分组，Base UI `Collapsible`）、`NavFlyout`（横版 / 折叠栏分组，已改用库的 `Menu`）。样式按 NavMenu spec 的竖版 / 横版规则（`nav-item-*` token、36px、radius-xl、当前项加粗、横版焦点环画在内部），但只是四分实现；**NavMenu 仍是库里未移植的组件**，移植后应替换 |
| 用户下拉菜单 | 已进库：`@tuuject/koi-react/menu` 的 `Menu`（2026-11-04，spec `docs/spec/components/Menu.md`）。`UserMenu` 用库组件，触发器仍是模板自己的按钮，`header` 放头像与邮箱 |
| 表格 | 已进库：`@tuuject/koi-react/data-table` 的 `DataTable`（2026-10-16，spec `docs/spec/components/Table.md`）。要排序 / 选择时改用 `@tuuject/koi-react/table` 的 parts 自己拼，可直接接 TanStack Table |
| 面包屑 | 模板内 `Breadcrumbs`，靠路由 `staticData.title`；祖先链接用 `Link variant="plain"`（`text-muted`，hover 变 `text-brand`，无下划线） |
| 未保存更改摘要 | `sectioned-form/ChangeSummary.tsx` 用库的 `Menu`：`header` 是标题，分组列出改动字段，`endContent` 放「需修正 / 已隐藏 / 已修改」，`finalFocus` 把焦点交给跳转目标 |
| 移动导航 | 已进库：`@tuuject/koi-react/drawer` 的 `Drawer`（2026-11-04，spec `docs/spec/components/Drawer.md`）。`MobileNav` 用它，md 以下才挂载；品牌与导航列表抽成 `SidebarContent`，与桌面 `Sidebar` 共用，宽度仍 248px。换页关闭在 `index.tsx` 的 `router.subscribe` |
| 业务图标 | `components/icons.tsx`，从 `@iconify-icons/fa7-solid` 挑，用 `@tuuject/koi-react/icons` 的 `Icon` 渲染。Free 里没有的（如侧边栏图标）可以换别的 Iconify 图标集或手写 `{ body, width, height }` |

## 决定与坑

- **集合编辑器示例页**（2026-11-04）：`/integration-settings`（`routes/_authed.integration-settings.tsx`）用 `MapEditor` 编辑请求头（`sortable={false}`，顺序无意义）、用 `SetEditor` 编辑允许来源（可拖动，顺序即显示顺序）。数据是页面 state，保存只做延迟和 toast，没走 `mock/api.ts`；重复和空条目在组件内标红，保存前再查一遍并拦下。侧栏入口挂在「智能助手」组。
- **客服会话 / AI 助手是 ChatBubble 的两个组合示例**（2026-10-24）：`/support`（`routes/_authed.support.tsx`）是两个真人的会话——客户走 `received`（左，带头像）、客服走 `sent`（右），包在 Card 里；`/agent`（`routes/_authed.agent.tsx`）是真人消息在右侧气泡、助手回复直接平铺 markdown（`components/Markdown.tsx`，`react-markdown` 包在库的 `Prose size="sm"` 里，14px，与页面其余 UI 文字同一基准），不加 Card。markdown 用 `react-markdown`（admin 独有依赖，内容是静态示例，无输入框）。
- **Panda preflight 把所有列表的 marker 去掉了**：reset 层有 `ol, ul, menu { list-style: none; }`。markdown 正文交给 `Prose`，它会把 marker 加回来；自己写列表时要在组件 css 恢复 `listStyleType`。不要动全局 reset——侧边栏等处的列表正依赖它。
- **断点在 config，不在 tokens**：`panda.config.ts` 的 `theme.extend.breakpoints = { md: '768px' }`（与 Bilisound 的 md 768 约定一致）。preset-base 不带断点；等 tokens.json 收编后应挪过去（plan.md 未决事项）。
- **这版 Panda 的断点条件没有下划线**：顶层写 `md: {...}`、响应式值写 `display: { base: 'none', md: 'inline' }`，不是 `_md`。嵌套选择器必须以 `&` 开头（`'& [data-nav-label]'`），`&[data-x]` 是同元素匹配，不是后代。
- **spacing token 是裸数字**：`gap: '4'`、`padding: '6'`，**不是** `'space-4'`——写错会生成空规则（`.px_space-4 { }`），`strictTokens: false` 下静默通过。radius/shadow/size 才用名字（`'xl'`、`'float'`、`'control-md'`）。
- **JSX 属性名撞 CSS 属性名**：Panda 默认把任何 JSX 上与 CSS 属性同名的 prop 当 style prop 抽取（`<DataTable columns={…}>` 报 `nested_property`，Tooltip 的 `content` 生成过 `content: 关闭` 之类的垃圾规则）。根配置已设 `jsxStyleProps: 'none'`，样式只走 `css()` 和 recipe，prop 可以放心叫 `columns`。
- **产物告警**：库侧两条既有 `pure_helper_unevaluated`（Pagination 的 `useButtonShape`、SelectPanel 的 `useParts`）来自抽取器无法求值 hook，样式实际由 `staticCss: { recipes: '*' }` 预生成，渲染无影响；属于库的已知行为，不是模板引入的。
- 布局常量（侧边栏 248/72、app 层 z-index 60/40）是模板自己的 chrome 常量，低于 Koi 浮层（dialog 900+）；库的 focusRing 没有导出，`shared.ts` 里镜像了一份。顶栏和导航行的尺寸不再各自写死：`HEADER_ROW_HEIGHT` = 一个 `control-md`（36px），`HEADER_HEIGHT` / `HEADER_HEIGHT_HORIZONTAL` = 36 + 8×2 / 36×2 + 8×3（52 / 96px），都由 `sizes` / `space` token 算出来（2026-11-03）。
- **桌面导航有两种布局**（2026-11-03）：`stores/ui.ts` 的 `navLayout: 'sidebar' | 'horizontal'`（persist），顶栏右侧的图标按钮切换。竖版是 `Sidebar`，横版是 `TopNav`（顶栏下面第二行，同一份 `NAV_GROUPS`），两者共用 `nav-item.ts` 的行样式（`data-orientation` 决定占满宽还是横排、焦点环画在内部还是外部）和 `NavItemButton`。横版下 `Sidebar` 只在 md 以下作为抽屉存在（`[data-nav-layout=horizontal]` 在 md 起 `display: none`），品牌从侧边栏移到顶栏第一行（`Brand compact`，36px logo）。顶栏 + 导航行包在同一个 sticky 块里（`TOPBAR_Z_INDEX`），滚动时两行一起钉住。断点以下没有横版：抽屉是唯一导航。
- **横版是一条 1280 居中的列**：顶栏内层、导航行内层、`<main>` 都用 `CONTENT_MAX_WIDTH`（1280px）+ `marginInline: auto`，md 起统一 24px 内边距，所以 logo 盒、第一个导航项、页面 `h1` 左边缘对齐（1600px 下都在 184px）。竖版保持整宽。
- **顶栏与导航行同一套垂直节奏**（2026-11-03）：8px（`space-2`，和行内控件间距、导航组间间距同一个值）的上下留白和行间距挂在 sticky 块上（`AppShell` 的 `paddingBlock` + `gap` 都用 `HEADER_ROW_PADDING`），两行本身都是 36px 高、不带内边距，所以「顶栏上 / 两行之间 / 导航行下」都是 8px，而不是之前 10 / 0 / 4。块自己画唯一的底边（`divider`）、自己铺 `surface`，`Topbar` 和 `TopNav` 都不再带边框或背景——横版不再需要 `data-flush` 去关掉顶栏那条线。
- **横版只有一条横线**：由 sticky 块的底边统一当 header / content 的分界。竖版也走同一条规则：块高度 53px（8 + 36 + 8 + 1）。
- **brand 与面包屑之间 16px**：横版第一行是 8px gap，品牌名和面包屑之间偏挤；分隔线加 `marginInline: '2'`（两侧各 8px），brand 到线、线到面包屑都是 16px。
- **导航分组与二级菜单**（2026-11-03）：`nav.ts` 的 `NAV_GROUPS` 是两级树，**一级就是分类本身**（概览 / 业务 / 智能助手 / 账户，各带 16px 图标），二级是页面。分类不再是列表上方的静态标签，所以没有「分类标签」这层样式，横版也不再需要组间竖线。`NavGroup` / `NavLeaf` 用 `children` / `to` 互斥区分，`navContains` 判断某个分组是否含当前路径。spec 允许三级，模板只做两级。
  - **竖版分组用 `Collapsible`**：自己一行是触发器（`aria-expanded` + `data-panel-open`），面板按 `--collapsible-panel-height` 动 height（150ms `out`）。当前页所在的分组在挂载时自动展开；从别的页面导航进分组时也展开，手动收起后不会再被强行拉开。子项 `depth=1`：不画图标，左内边距 32px（8 + 16 + 8）对齐分组标签。
  - **分组之间 4px**：一级项是各自的分组，列表 `gap: '1'`，展开的页面在分组内零间距（hover / 当前填充相接）。横版同一条规则放宽到 8px（`TopNav` 的 `gap: '2'`）：横版每个分组自带填充，4px 时 pill 几乎贴在一起（2026-11-03）。
  - **横版 / 折叠栏分组用库的 `Menu`**：横版向下弹（`bottom-start`）、折叠栏（72px）向右弹（`right-start`），面板就是 Menu 与 Popover 共用的那一个（`surface` + `border` + `radius-xl` + `shadow-float`）。`openOnHover`、方向键、type-to-find、Esc、点外部、靠近窗口边缘翻转都由库负责；`modal={false}` 免得锁页面滚动。子项用 `href` + `current`，点选时 `preventDefault` 后自己 `navigate`。
  - **折叠栏的分支只能弹出来**：72px 宽时标签全隐藏，就地展开没有意义，所以只有桌面侧栏（`SidebarContent` 的 `rail`）才换成 `NavFlyout`（`side="right"`、`aria-label` 补名字、`data-rail` 让分支图标带当前填充）；md 以下的抽屉永远是全宽，就地展开。
  - **分支状态是加粗不是填充**：竖版父项带 `data-in-path` 时只把文字变粗（`text`），横版和折叠栏没有展开树可看，父项直接吃 `nav-item-active` 填充。
- **sticky 偏移读 shell 的变量，不写死顶栏高度**：`AppShell` 在根元素设 `--app-header-offset`（竖版 `HEADER_HEIGHT` 52px；横版 md 起 `HEADER_HEIGHT_HORIZONTAL` 96px），分区长表单的 `scroll-margin-top`、sticky 分区下拉都读它。加新的 sticky 行时改这一处，页面不用跟着改。
- **横版的焦点环画在内部**（`outlineOffset: -2px`）：导航行 `overflowX: auto`，外扩的 2px 环会被裁掉。这是 NavMenu spec 对横版的规定。
- **自己 portal 的浮层要给 z-index**：portal 到 `<body>` 的元素没有层级，会被 sticky 顶栏（z-index 40）盖住上沿。库里的 Menu / Popover / Drawer 已经带上 `popup` / `dialog` 层；模板自己 portal 的东西照 SelectPanel 给 Positioner `zIndex: 'popup'`。
- **`reset()` 之后调用 `register` 的组件必须重渲染**：RHF 的 `reset` 会清空字段登记（无参时还会原生 `form.reset()` 把输入框清空），值要等调用 `register` 的组件下次渲染、ref 回调重新登记时才写回 DOM。页面若不读任何 `formState`，RHF 不会重渲染它：「放弃更改」后输入框全空、字段也没了校验。`SectionedForm` 渲染时读一次 `form.formState.isDirty`，让页面订阅上 isDirty。
- **Base UI Menu 的坑**：默认 `modal` 会锁页面滚动，从菜单项开始的平滑滚动会被吃掉，摘要菜单用 `modal={false}`；`finalFocus` 回调拿到的关闭类型在触摸点选菜单项时不是 `touch`，要从菜单项 click 事件的 `pointerType` 自己判断（触摸时聚焦字段外层，不弹软键盘）。
- **Dialog 的开关和数据分开存**：别用 `open={detail !== null}`、关闭时 `setDetail(null)`——Base UI 退场时 Popup 还挂着播淡出，数据一清空，内容就先消失再淡出。用独立的 `open` state，关闭只翻它，数据留到下次打开时覆盖；有 loading 的确认框在打开时重置 loading，别在请求结束后先关 loading 再关弹窗（按钮会在淡出中闪回原文案）。见 `routes/_authed.orders.tsx`。
- **URL 驱动的输入框要跟随外部变化**：`OrderSearchForm` 的草稿只在「外部导航」时被 URL 覆盖（点侧边栏「订单管理」、后退），靠 `pushedKey` 记住自己刚写的筛选，避免自己提交的 URL 落地时把紧接着输入的字清掉。删除按钮的 loading 仍用本地 `deleting`，别换成 `useMutation().isPending`（理由见上一条）。
- **行内操作是 rounded**：`TableCell` 里的按钮默认 `shape="rounded"`（sm 档左右 8px），操作按钮之间不留间距，组合再 `marginInlineEnd: '-2'` 让最后一个字和表头右边对齐。pill 在行里显得太散（2026-10-16 改，之前一度为「一个 surface 一种形状」统一成 pill）；表格下方的 Pagination 用 `variant="compact"`（圆形 icon-only 上一页 / 下一页，整行固定 pill），spec 允许按钮组之间形状不同。

## 验证

`pnpm check` 全绿（含 admin typecheck）。浏览器冒烟（dev + 生产构建）：登录/守卫回跳、URL 筛选与分页、详情/删除弹窗 + toast、表单校验与保存同步、深浅主题、折叠侧边栏 + Tooltip、移动端抽屉、404。截图确认过浅色与深色。分区长表单（2026-10-30）用 Playwright（系统 Chrome）在 1440 / 1280 / 1024 / 900 / 390 宽度下跑过：scrollspy 与几何计算逐步对拍一致、导航与摘要跳转到具体字段（键盘、鼠标、触摸）、计数与回退、隐藏字段、校验失败跳转、保存失败保留、提交中编辑保留、服务器规范化后的基线、放弃更改。导航分组与二级菜单（2026-11-03）用 Playwright 验证：竖版展开 / 收起、深链进来时分支自动展开、手动收起后再进分支会重新展开、子项 `aria-current`、横版 hover / Enter 开面板 / Esc 关并回到触发器 / 方向键落到第一项、面板里点选导航后关闭、折叠栏右弹面板、390 抽屉就地展开、浅深两色与 rose 配色截图，无 console 报错。分类改为可展开的一级项后重跑（2026-11-03）：两组可同时展开、组内子项标签与父项标签左边缘对齐（都是 44px，父项 padding 8px / 子项 32px）、两级行都是 36px 且子项无图标、导航进别组后该组自动展开、折叠栏 hover 弹出面板在 x=75 且能点选导航、横版面板与触发器左对齐（118/118）并落在行下方（96/100）、面板在 popup 层（950）、Esc 与方向键焦点行为、抽屉点选后关闭；几何测量组间 4px、组内 0。桌面导航双布局（2026-11-03）在 1600 / 1440 / 1280 / 1024 / 768 / 390 下验证：布局切换与刷新后的持久化、横版两行一起 sticky、横版三处内层都是 1280 居中（1600px 下 left=160，logo 盒 / 首个导航项 / `h1` 都在 184）、两行之间无横线且导航行底边保留 1px、`--app-header-offset` 在横版 100px / 竖版 56px、分区跳转落在头部下方（section top 124 = 100 + 24）、横版键盘 Tab 到导航项时焦点环内画不被裁、md 以下抽屉与导航后自动关闭、竖版仍是整宽 + 顶栏一条线、浅深两色截图。顶栏与导航行统一垂直节奏（2026-11-03，留白改 8px 并挂到 sticky 块、组间 4 → 8px）后重测 1600 / 1440 / 1280 / 1024 / 768 / 390：两行都是 36px，块 `paddingBlock` 8px + `gap` 8px，实测顶栏上 8 / 两行间 8 / 导航行下 8（block 97 = 8 + 36 + 8 + 36 + 8 + 1）；首项仍与 `h1` 同一条左边缘（1600 下都在 184）、组间 8/8/8、`--app-header-offset` 横版 96px / 竖版 52px、分区跳转后 section top 120（= 96 + 24）、横版面板与触发器左对齐并落在行下方（x=300、y=92，行底 88 + 4px offset）、焦点环仍是 `outlineOffset: -2px`（截图确认内画不被裁）、1024 与 768 下不出现横向滚动、390 仍只有抽屉且块高 53px；sticky 滚动后块仍贴顶（y=0、底 97）、只有块底一条 1px 线（顶栏 `borderBottom` 为 0）、浅深两色截图。

## 外部仓库使用（npm 消费）

`apps/admin` 可以从别的仓库复制，改造成只依赖 `@tuuject/koi-*` npm 包的 app。复制时不要带走 koi-ui 的根 `panda.config.ts`、`tsconfig.base.json` 或 `packages/react/styled-system`：消费方要有自己的 Panda 配置（`designSystem: '@tuuject/koi-react'`）、自己的 PostCSS 配置和独立 tsconfig。完整清单、tarball 联调、Tailwind / Rsbuild 迁移边界和验收步骤见 [consuming-koi.md](consuming-koi.md)。

模板的 demo 数据在 `src/mock/api.ts`，外部接入时换成真实 API；`src/shared.ts` 的 `focusRing` 是库内 helper 的临时镜像，等库导出后再替换。
