# Surowan Admin 重写：组件缺口 Epic

> 状态：库侧 E1–E5 完成（2026-11-04）；E6 在 surowan 仓库，随重写进行。进度与下一步只在 [../plan.md](../plan.md) 维护。
> 创建：2026-11-04
> 关联：[../admin.md](../admin.md)（模板现状与缺口表）、[../consuming-koi.md](../consuming-koi.md)（外部仓库消费）、[../../docs/spec/components/NavMenu.md](../../docs/spec/components/NavMenu.md)

## 背景

surowan 的 `apps/admin-next` 目前是 Rsbuild + Tailwind v4 + shadcn/Radix + sonner + recharts，计划改用 `apps/admin` 模板加 `@tuuject/koi-*` 重写。

模板已经覆盖应用外壳（AppShell、Sidebar、TopNav、移动抽屉、面包屑、用户菜单、主题切换）和长表单（SectionedForm），但目标应用的若干页面级能力在库里没有对应实现。本 epic 只记录「为了这次重写，Koi 需要补什么」，不记录 surowan 的业务改造。

## 目标

1. 重写后的 admin 功能不弱于现状：导航、弹窗、表格、空态、Toast、表单、图表、JSON 详情、时间线都在。
2. 缺口按「进库 / 留在模板 / 留在应用」归档，避免把应用专属组件塞进设计系统。
3. 每条有可验证的验收标准，能直接派给 agent。

## 缺口总览

### P0：进库，阻塞重写

| 能力 | 现状 | 影响 | 验收 |
| --- | --- | --- | --- |
| `Menu` | 无。模板直接用 Base UI `Menu` 拼（UserMenu、NavFlyout、ChangeSummary） | 行操作菜单、用户菜单、分组导航、未保存摘要 | 公开 props 不暴露 Base UI 类型；模板三处换用；Storybook 与双主题截图 |
| `Drawer`（Sheet） | 无。模板移动导航是手写 off-canvas | 移动侧栏、帮助面板 | 贴边滑入用 `out` 200ms；焦点陷阱、Esc、滚动锁；390px 截图 |
| `Empty` | 只有 `TableEmpty`（`<tr>` 内） | 列表空态、错误态、详情占位 | 支持 icon、title、description、action；`TableEmpty` 复用同一 recipe |
| 文案注入 | `koi-core/strings` 中文硬编码，无 locale 入口 | en 界面会出现「（选填）」「处理中」「暂无数据」等可见中文 | 可见文案全部可由 props 或 provider 覆盖；en 页面无中文；现有中文默认值不变 |

### P1：进库，重写期间可并行

| 能力 | 现状 | 影响 | 验收 |
| --- | --- | --- | --- |
| `NavMenu` | 唯一未移植组件。模板内多份实现（Sidebar、TopNav、NavItemButton、NavGroupItem、NavFlyout） | 消费方要再写一份导航 | 按 spec 移植竖版 Collapsible 与横版 flyout；模板替换；键盘与 390 / 1440 截图 |
| `Breadcrumb` | 模板内，靠路由 `staticData.title` | 每个消费方都要抄 | 库提供 items 版；模板保留路由适配 |
| `PageHeader` | 模板内，只有 title 与 description | 页面标题需要 info 按钮与操作区 | 增加 actions、info 插槽；模板与消费方共用 |
| `Tabs` 溢出 | pill 轨道 `nowrap`，定位是 2 到 6 个平级视图 | 详情页多个 tab 在窄屏被裁 | 窄屏横向滚动或降级为 `SelectPanel`；390px 验证 |

### P2：观察，暂不补

| 能力 | 理由 |
| --- | --- |
| `Label` 独立导出 | `Field` 已覆盖表单行；只有脱离 `Field` 的组标签需要，出现第二处再导出 |
| `Alert` success tone | 现状只有 info / warning / error；surowan 没有成功态 Alert |
| `Toast` promise API | 消费方只用 success / error / info，没有 loading 或 promise 用法 |

### 留在应用，不进库

| 能力 | 理由 |
| --- | --- |
| Chart（recharts 包装） | 应用专属的 series 与 axis 组合；Koi 只保证配色用 role token 或色阶 |
| JsonView（`@uiw/react-json-view`） | 第三方渲染器；主题适配留在应用 |
| Timeline（Invocation 卡片流） | 业务语义强 |
| CopyButton、KVList | 通用但小，等第二个真实消费方再收 |
| CursorList（keyset 无限加载） | 数据层是 cursor 契约，与模板的页码模型不同 |
| TableShell（展开行） | 用 `Table` parts 组合；`DataTable` 不提供选择与展开是既定决定 |

判定规则沿用 AGENTS.md：应用专属组件不进库。上表任何一项要进库，必须先有第二个真实消费方。

## 非组件接线

这些是重写工作量，不是库缺口，但排期时要算进去。

| 项 | 从 | 到 |
| --- | --- | --- |
| 样式 | Tailwind v4 + shadcn | Panda CSS + recipes |
| 构建 | Rsbuild | Vite（模板） |
| 原语 | Radix UI | Base UI |
| Toast | sonner | `ToastProvider` 加 `useToast` |
| 图标 | lucide-react、tabler | Font Awesome Solid（Iconify 加 `Icon`） |
| 主题 | `.dark` class | `data-theme` 加 `koiSetTheme` |
| 字体 | Inter Variable | Koi 系统字体栈或 ChillRoundF |
| 表格 | shadcn table 加展开行 | `Table` parts（横向滚动、排序头） |
| 分页 | 无（cursor） | 保留 cursor；模板 `Pagination` 只作 demo |

## 任务拆分

### E1 浮层基础

- [x] `Menu`：Base UI Menu 包装；items、trigger、placement、openOnHover；36px 项、`radius-lg`、`shadow-float`。
- [x] `Drawer`：Base UI Dialog 包装；side、open、onOpenChange；贴边 `out` 200ms。
- [x] `Popover`：Base UI Popover 包装；与 Menu 共用面板 recipe。
- [x] 模板 `UserMenu`、`NavFlyout`、`ChangeSummary` 换成库组件。
- [x] 验收：`pnpm check`、`pnpm shots Menu Drawer Popover`、模板浅深色与 390px 截图。

### E2 Empty

- [x] `Empty`：icon、title、description、action；`TableEmpty` 复用同一 recipe。
- [x] 验收：surowan 的列表空态、错误态、详情占位各接一处。（库侧与模板空行已就绪；surowan 接线随 E6）

### E3 NavMenu

- [x] 按 `docs/spec/components/NavMenu.md` 移植；竖版 Collapsible，横版 flyout。
- [x] 模板删除重复的行样式与 flyout 实现，改用库。
- [x] 验收：键盘、边缘翻转、`aria-current`、折叠 rail、390 / 1440 截图。

### E4 文案注入

- [x] `strings` 支持应用覆盖（provider 或工厂），默认值保持中文。
- [x] 可见文案补 props：`Field` 的 optional 标签、`Button` 的 loading 文案、`Toast` 的关闭与区域名；`Table.empty`、`SelectPanel.emptyText`、`DropZone.title` 已有。
- [x] 验收：surowan en locale 页面无中文；`pnpm check` 与模板回归截图。（Storybook en 覆盖已验证；surowan 接线随 E6）

### E5 模板提取

- [x] `Breadcrumb`（items）进库；模板保留路由适配。
- [x] `PageHeader` 增加 actions 与 info 插槽。
- [x] `Tabs` 窄屏溢出处理。
- [x] 验收：surowan 页面标题、面包屑、详情 tab 在 390px 正常。（模板 390px 与 Storybook 窄屏已验证；surowan 接线随 E6）

### E6 应用层组件（surowan 侧，不阻塞库）

- [ ] Chart：recharts 加 Koi 色阶；双主题截图。
- [ ] JsonView：跟随 `data-theme`。
- [ ] Timeline、CopyButton、KVList、CursorList、TableShell。
- [ ] 验收：surowan e2e（en 与 zh-CN）通过；浅色、深色、rose 截图。

## 顺序与依赖

```text
E1 Menu / Drawer / Popover ─┬─> 模板换用 ─> E5 模板提取
E2 Empty ───────────────────┤
E4 文案注入 ────────────────┘
E3 NavMenu ──> 模板导航替换
E6 应用层 ── 可与上面并行
```

E1 与 E4 是硬前置：不补，surowan 的移动导航、帮助面板、行操作菜单、en 文案都要在应用里再写一套。

## 验证

- 库侧：`pnpm check`、`pnpm shots <组件>`、`KOI_PALETTE=rose pnpm shots`。
- 模板侧：先跑 `pnpm dev:admin:status` 接管或后台启动；1440 / 1024 / 390 三种宽度，浅色与深色截图；导航键盘路径。
- 消费方：surowan 的 `pnpm run admin:build` 与 `pnpm run admin:test:e2e`；en 与 zh-CN 两套 locale。

## 已定

- `Menu` 与 `Popover` 共用 `floatingPanel` slot recipe（positioner、popup、header/body/footer、group、item 槽）；Menu 用行槽，Popover 只画面板。
- `Drawer` 与 Dialog 各自 recipe：遮罩和焦点行为相同，圆角、贴边几何和 200ms 位移不同，共用一个 recipe 会让两边的默认值互相牵制。
- 文案注入同时提供 `createStrings()` 工厂和 web 的 `StringsProvider`；默认值仍是简体中文，provider 必须包在 `ToastProvider` 外面。
- `Breadcrumb` 长期进库，路由适配留在应用（admin 的 `Breadcrumbs.tsx` 只做 `staticData.title` → items 与 `navigate`）。
- `Tabs` 窄屏用横向滚动，不降级为 `SelectPanel`；详情页的多个平级视图保持同一控件。

## 仍未决

- Chart 是否需要 chart series token；当前用色阶，第二个真实消费方出现再议（E6）。
