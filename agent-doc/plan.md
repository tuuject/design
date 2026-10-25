# 计划与状态

Koi 的阶段计划。状态只在本页维护；完成项的结论同时写进对应主题文档，本页只留一行和日期。

| 阶段 | 状态 |
| --- | --- |
| Phase 0：工具链跑通 | 完成（2026-10-08） |
| Phase 1：移植 web 组件 | 完成，NavMenu 除外（见下） |
| Phase 2：打包与文档 | 进行中 |
| Phase 3：React Native（`@koi/native`） | 进行中：基础设施完成，组件未开始 |
| Phase 4：同步回设计 artifact | 未开始 |

Phase 0–1 的逐组件记录（每个组件相对 legacy 的 API / 行为决定）归档在 [web-port-record.md](web-port-record.md)。

## Phase 1 剩余

- **NavMenu**：唯一没移植的组件。spec 在 `docs/spec/components/NavMenu.md`。竖版用 Base UI `Collapsible`，横版用 `Navigation Menu`（或 `Menubar` + `Menu` 做多级 flyout）。三级嵌套、靠近窗口边缘时 flyout 翻转，用 Base UI 的定位替换 legacy 手写的翻转逻辑。
- 移植完成后再加的新组件（Base UI 做起来便宜、spec 列为 "not included"）：Menu（下拉菜单）、Popover。可搜索的 Combobox 已经以 `SelectPanel searchable` 存在。
- [x] **Table / DataTable**（2026-10-16，新组件，非移植）：从 admin 模板挪进库。两层：`@koi/react/table` 的 parts（原生 table 元素，props 全透传；`TableHeaderCell` 的 `sort` / `onSort` 与 TanStack Table 的 `getIsSorted()` / `getToggleSortingHandler()` 同形）和 `@koi/react/data-table` 的 `DataTable`（columns + rows + loading + empty）。不依赖 headless 库，选中行用 Koi 自己的 `data-koi-selected`。Storybook 里有 TanStack Table v9 的接法。**native 版暂缓**（core 里的 `Table*OwnProps` 已经平台无关，到时直接建在上面）。
- [x] **ChatBubble**（2026-10-24，新组件，非移植）：聊天 / 评论消息气泡。`side: 'received' | 'sent'`（默认 `received`：`surface-muted` 底 + `text`；`sent`：`action` 底 + `on-action`），`radius-xl` 12px、锚角（received 左下 / sent 右下）收到 `radius-sm`，`max-width` 480px 断行。对齐、头像、时间戳由应用排版，组件只是气泡本身；无文案、无事件，不依赖 headless 库。用的原子 recipe（`defineRecipe`），注册在 `recipes` 而不是 `slotRecipes`——放错一边会变成空 slot recipe，`base` 整个丢失。颜色组合（`text/surface-muted`、`on-action/action`）都是 `contrast-pairs.json` 里已有的 pair。**native 版暂缓**（core 的 `ChatBubbleOwnProps` 平台无关，到时直接建在上面）。
- [x] **Prose**（2026-10-25，新组件，非移植）：渲染好的富文本（markdown、CMS HTML）的长文排版，照搬博客 `MarkdownBody.astro`（Tailwind Typography `prose` + `prose-slate` + Koi 的覆盖）。内部所有字号、间距都是 em（按博客 16px 下的 px 值、除以落在的那个元素的字号），`size: 'sm' | 'md'`（14 / 16px）只设根字号，consumer 自己设 font-size 也一样等比缩放；只有线宽（hairline、`prose.quote-rule` 4px、`prose.head-rule` 2px、`prose.kbd-depth` 3px）是固定 px，进了 `component.prose`。新 role：`prose-text`、`code-block-bg`、`code-block-text`。选择器用 `.koi-prose :where(el)` 保持一个 class 的特异性，上下文覆盖（`pre code`、`h2 + *`）写普通选择器靠特异性取胜，首尾子元素的 margin 归零放进 `size` variant（后面的 layer）；`koi-not-prose` 里的内容不受影响。链接样式与 Link 共用 `recipes/link.ts` 的 `linkStyle`。admin 的 `Markdown.tsx` 已改用它。**native 版暂缓**：em 比例目前只在 recipe 里，native 要做 markdown 渲染时再决定是否收进 tokens。

## Phase 2：打包与文档

- [ ] **发布方式**：Panda v2 的 `panda lib` / `designSystem` 配置，还是发源码 + preset。待定。
- [ ] **motion 进 tokens.json**：现在在 `packages/tokens/scripts/motion.mjs`（文件头有 TODO）。native 的动画驱动也需要这些值。
- [x] **Storybook 取代 playground**（2026-10-10）：`apps/storybook`，Storybook 10。`Introduction.mdx` 是首页，每个组件有 autodocs 和 stories，工具栏切换主题 / 字体 / 配色，docs 页面跟随工具栏主题。`pnpm shots` 截每个 story。
- [ ] **Storybook 上线**：Cloudflare Workers 静态资源，`apps/storybook/wrangler.jsonc`（Worker `koi-storybook`，自定义域名 `components.design.tuu.run`）。Workers Builds 连 GitHub：root `/`，build `pnpm build:storybook`，deploy `pnpm deploy:storybook`（不能用 `pnpm --filter storybook deploy`，那会跑 pnpm 自带的 `deploy`）；Node 版本取自 `.nvmrc`，pnpm 取自 `packageManager`。还差 Cloudflare 后台操作：建 Worker、连仓库、设置 build watch paths（`apps/storybook/**`、`packages/**`、根配置），免得将来的 `apps/site`（design.tuu.run）触发它重建。
- [x] **Admin Template**（2026-10-16）：`apps/admin`，Rsbuild + TanStack Router + Zustand 的后台管理模板，`@koi/react` 的综合集成示例。见 [admin.md](admin.md)。
- [x] **recipes 与 Base UI 解耦**（2026-10-13）：见 [headless.md](headless.md)。生成的 CSS 逐字节不变。
- [x] **公开 props 不暴露 Base UI 类型**（2026-10-13）：change callback 的第二个参数是 Koi 的 `ChangeDetails`。
- [x] **`@koi/core`**（2026-10-14）：每个组件的 `<Name>OwnProps`、文案、纯函数。见 [core.md](core.md)。
- [x] **palette 可切换**（2026-10-14）：见 [tokens.md](tokens.md#palettes)。
- [x] **组件尺寸进 tokens**（2026-10-15）：见 [tokens.md](tokens.md#component-组)。
- 以后若做 Solid（Kobalte）：把 `recipes/`（连同 `headless.ts`）移出 `@koi/react` 成为框架无关的包。届时的问题：Kobalte 的 presence 等 CSS animation 而不是 transition，也没有 "entering" 标记，`entering` / `exiting` 需要 Koi 自己设的属性或改成 keyframes。

## Phase 3：React Native

**已决定（2026-10-14）：Tamagui 2.4.x**，覆盖 iOS、Android 和 Expo web。理由：Bilisound 的下一个大版本（`apps/mobile-next`）全面用 Tamagui，Expo web 也经由它渲染。DOM web 应用继续用 `@koi/react`，两边共享 `@koi/tokens` 和 `@koi/core`。

当时比较过的方案：

| 方案 | 优点 | 缺点 |
| --- | --- | --- |
| rn-primitives + NativeWind | 类 Radix 的 headless API | web（Base UI）和 native 用两套 headless 库 |
| **Tamagui**（选定） | web 与 native 一套组件，自带编译器 | 若用于 DOM web 会和 Panda + Base UI 冲突，所以只用于 Expo |
| 纯 RN + 样式层（Unistyles） | 依赖最少 | 无障碍和行为都得手写 |

已完成的基础设施：

- [x] props API 抽到 `@koi/core`（2026-10-14）
- [x] palette 可在运行时切换，`createColors()` / `checkPalette()`（2026-10-14）
- [x] 组件尺寸全部进 tokens，`@koi/tokens/dimensions`（2026-10-15）
- [x] `layer`（z-index）token（2026-10-15）
- [x] `@koi/native` 的 `createKoiConfig()`：从 tokens 生成 Tamagui config（2026-10-15）

下一步（按顺序）：

1. **Expo 应用**：在本仓库新建一个 Expo 项目，展示 native 组件、跑 Storybook。名字和 Storybook 形式待定，见下方「未决事项」。
2. **首批组件**：Button、Switch、Dialog，与 `@koi/react` 做截图比对。做法见 [native.md](native.md)。
3. **palette 自动修正**：用户自定义的 palette 没通过 `checkPalette()` 时，自动把色阶整体调深或调浅直到全部达标。现在只能由应用拒绝。Bilisound 的 classic palette 有 5 处不达标、red 有 1 处，它从封面取色生成的 palette 会经常踩线。
4. Bilisound 需要而 Koi 还没有的组件：Slider、Sheet / ActionMenu、Text / Heading、Stack 布局原语。

Bilisound 的接入计划和兼容性分析记录在 Bilisound 仓库的 `agent-doc/v3-plan/koi-design-system.md`（目前暂缓）。

## Phase 4：同步回设计 artifact

仓库上了 GitHub 之后，Claude 里的 Koi design-system artifact 可以从这里同步，让 artifact 里的视觉规范保持最新。

## 与 legacy 不兼容的默认值

- **图标改用 Font Awesome Free Solid**（2026-10-22）：Koi 不再自己画线性图标（24 网格、2.25 描边）。图标是 Iconify 格式的数据（`IconData`，`@koi/core`），`@koi/react/icons` 的 `Icon` 渲染；组件内置图标保留原来的导出名，只有表格排序的 `ChevronUpDownIcon` 换成 `SortIcon` / `SortUpIcon` / `SortDownIcon`。选 Iconify 格式是为了能混用其它图标集（Free 版图标有限）和手写 SVG。`components.icon.stroke` token 随之删除。
- **按钮默认 rounded**（2026-10-20）：Button、IconButton 的 `shape` 和 Pagination 页码默认从 `pill` 改成 `rounded`（`radius-lg` 8px）。legacy 默认 pill，要旧外观的页面（博客）在外层包 `<ShapeProvider shape="pill">`。Dialog footer、TableCell 仍自己提供 rounded。tab、tag、badge、Switch 不变，还是 pill。

## 未决事项

- **字体**：ChillRoundF 还是系统字体栈（`tokens.json` 当前用后者）。两种现在都能用：`<html data-font="chill">`（或 `koiSetFont('chill')`）把 `sans` 换成 ChillRoundF，Storybook 工具栏可切换，`KOI_FONT=chill pnpm shots` 截 ChillRoundF 版。
  - ChillRoundF 的 700 只比 400 粗一点，标题、label、按钮看起来远不如系统字体粗。
  - 系统字体没有加载成本；旧 playground 用 ChillRoundF 时要拉 13 个 woff2 子集。
  - native 需要完整字体文件（CJK 很大）。
  - legacy 的 `--font-sans` 从没真正用过 ChillRoundF（fonts.css 声明了字体但没人引用），所以 `reference/legacy-web/example.html` 也是系统字体，不能当 ChillRoundF 的参照。
- **Expo 应用的形式**：项目名（`apps/expo` 还是 `apps/native-showcase`）；Storybook 是浏览器里的 react-native-web 版（能接进 `pnpm shots` 与 `@koi/react` 比对）加真机 showcase，还是只要真机版。倾向前者。
- **native 的动画驱动**：`createKoiConfig()` 不替应用选（react-native / reanimated / CSS）。Koi 的 `spring` 是 CSS 缓动曲线，物理弹簧驱动要另给参数。
- **media 断点**：tokens 里还没有。Bilisound 用 md 768 切换布局。
