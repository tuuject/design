# Repository Guidelines

本文件是所有 AI agent 的统一入口。**Compatible with**: Claude Code, opencode, OpenAI Codex, Gemini CLI。

> **IMPORTANT**: 优先「检索式」推理，而非「预训练记忆」式推理。项目约定请从 `agent-doc/` 检索阅读，不要凭通用知识臆测本仓库的结构与规则。

Koi 是一个柔和、圆润的设计系统（圆角按钮、pill 形 tab / tag / 开关、毛玻璃、天蓝色操作、琥珀色链接），起源于 tcdw 的 Koi 博客主题。本仓库把它做成可复用的包：一份 tokens，加上 DOM web 组件（Base UI + Panda CSS）和 Expo 组件（Tamagui）。

## Project Goals

- 一个设计系统服务多个应用、多个平台：DOM 网站用 `@koi/react`，Expo 应用（iOS、Android、Expo web）用 `@koi/native`。第一个 native 消费方是 Bilisound。
- 所有数值和颜色只有一个来源：`packages/tokens/src/tokens.json`。各平台读同一份数据，不各自写死。
- 组件的 props、文案、纯逻辑放在平台无关的 `@koi/core`，两个平台实现的是同一套 API。
- headless 库可替换：样式不点名 Base UI，公开 props 不暴露库的类型。
- 不做：某个应用专属的组件（留在应用里）；在 DOM web 上用 Tamagui；修改 `reference/legacy-web/`。

## Project Structure & Module Organization

```text
koi-ui/
├── packages/
│   ├── tokens/      # @koi/tokens：tokens.json → CSS 变量、Panda preset、theme-init、数值、palette 运行时
│   ├── core/        # @koi/core：<Name>OwnProps、文案 strings、纯函数；纯 TS，无 DOM
│   ├── react/       # @koi/react：web 组件，Base UI（行为）+ Panda CSS v2（recipes）
│   └── native/      # @koi/native：Expo 组件，Tamagui；目前只有 config
├── apps/storybook/  # Storybook 10：组件文档 + 视觉测试台（pnpm shots）
├── apps/admin/      # Koi Admin Template：Rsbuild + TanStack Router + Zustand 后台模板（pnpm dev:admin）
├── docs/spec/       # 设计规范：README.md 是品牌手册，components/<Name>.md 是逐组件 spec
├── agent-doc/       # 面向 agent 的主题文档、计划
├── scripts/         # pnpm check 里的静态检查
└── reference/legacy-web/  # 旧实现，冻结，只读参考
```

- 依赖只能向下：`react` / `native` → `core`、`tokens`。`react` 与 `native` 互不依赖。
- 根目录 `panda.config.ts` 扫描 `packages/react/src` 和 `apps/storybook/src`，生成 `packages/react/styled-system/`。

## Architecture Overview

**数据流**：`tokens.json → build.mjs → dist/*（Panda preset / dimensions / palette / native）→ @koi/react（recipes → CSS）| @koi/native（createKoiConfig → Tamagui）`

架构细节参见 **[agent-doc/architecture.md](agent-doc/architecture.md)**。

## Where to Look

| 你想了解…… | 去看…… |
| --- | --- |
| 包分层、数据流、平台分工 | [agent-doc/architecture.md](agent-doc/architecture.md) |
| 加 / 改 token、palette、组件尺寸、对比度 pair | [agent-doc/tokens.md](agent-doc/tokens.md) |
|写或改 web 组件，Panda / Base UI 的坑|[agent-doc/web-components.md](agent-doc/web-components.md)|
|Admin 模板（Rsbuild、TanStack Router、集成示例、组件缺口）|[agent-doc/admin.md](agent-doc/admin.md)、`apps/admin/README.md`|
| 写 native 组件，Tamagui config 与写法对应 | [agent-doc/native.md](agent-doc/native.md) |
| prop / 文案 / 逻辑该放 core 还是平台包 | [agent-doc/core.md](agent-doc/core.md) |
| recipe 里引用组件状态（不点名 Base UI） | [agent-doc/headless.md](agent-doc/headless.md) |
| 验证：`pnpm check`、截图、像素与 CSS 比对 | [agent-doc/verification.md](agent-doc/verification.md) |
| 现在的进度、下一步、未决事项 | [agent-doc/plan.md](agent-doc/plan.md) |
| 某个组件移植时定下的 API / 行为决定 | [agent-doc/web-port-record.md](agent-doc/web-port-record.md) |
| 本仓库术语 | [agent-doc/glossary.md](agent-doc/glossary.md) |
| 组件应该长什么样、怎么交互 | `docs/spec/README.md`、`docs/spec/components/<Name>.md`（改组件前必读） |
| 移植一个组件的步骤 | `.agents/skills/port-component/SKILL.md` |
| 用 Koi 设计 / 调整 / 审查页面与组件的视觉 | `.agents/skills/koi-design/SKILL.md` |
| 各包对外的用法 | `packages/native/README.md` 等各包 README |

| 用户提到…… | 去看…… |
| --- | --- |
| 颜色、尺寸、主题、配色、字体 | `packages/tokens` |
| web 组件、Storybook 里的组件 | `packages/react`、`apps/storybook` |
| React Native、Expo、Tamagui、Bilisound 接入 | `packages/native`、[agent-doc/native.md](agent-doc/native.md) |
| props、文案 | `packages/core` |

## Build, Test, and Development Commands

前置：Node 版本见 `.nvmrc`（Panda v2 至少要 Node 22）；pnpm 版本见根 `package.json` 的 `packageManager`。像素比对要用 ImageMagick（`compare`、`magick`）。

- `pnpm install`：安装依赖。
- `pnpm tokens`：改完 `tokens.json` 后重建 token 输出。
- `pnpm contrast`：检查每套 palette、两种主题下的对比度。
- `pnpm codegen`：tokens + Panda codegen；改了 tokens、recipe 或 `panda.config.ts` 之后跑。
- `pnpm check`：codegen + 对比度 + raw 颜色 / raw 尺寸 / headless / core 检查 + 全部 typecheck。**提交前必须通过。**
- `pnpm lint`：Biome lint + 格式检查（只读，不写文件）。**提交前必须通过。**
- `pnpm lint:fix`：Biome 自动修复 + 格式化。含 `--unsafe`，会改语义（例如删 hook 依赖），跑完必须 review diff。
- `pnpm shots [组件…]`：截每个 story 的浅色和深色到 `apps/storybook/shots/`。`KOI_PALETTE=rose` / `KOI_FONT=chill` 截其它配色 / 字体。任何视觉改动后都要打开 PNG 看。
- `pnpm dev`：tokens + codegen + Storybook（端口 6006），输出同时写进 `.temp/dev-storybook.log`。长期进程。
- `pnpm dev:status`：Storybook dev server 在跑时退出码 0，并打印地址和日志路径。
- `pnpm dev:admin`：tokens + codegen + Admin 模板 dev server（端口 3000），输出同时写进 `.temp/dev-admin.log`。长期进程。
- `pnpm dev:admin:status`：Admin dev server 在跑时退出码 0，并打印地址和日志路径。
- `pnpm build:storybook` / `pnpm deploy:storybook`：静态 Storybook 构建 / 部署到 Cloudflare Workers。

## Long-Running Process Rules

`pnpm dev`、`pnpm --filter storybook dev`，以及将来的 `expo start`，都不会自行退出，**禁止直接裸跑**。必须使用以下任一方式：

1. 后台运行，等就绪后验证，最后 kill。
2. 用 `timeout` 包裹。
3. 调用工具时设置超时参数。

**dev server 先接管再启动**：用户常常自己开着 `pnpm dev`（Storybook）或 `pnpm dev:admin`。需要时先跑对应的 `pnpm dev:status` / `pnpm dev:admin:status`：

- 在跑：直接用 `http://localhost:6006` / `http://localhost:3000`，编译错误、HMR 状态看 `.temp/dev-storybook.log` / `.temp/dev-admin.log`。改源码会热更新，不用重启。**这个进程是用户的，不准 kill 或重启**；改了 `.storybook/`、`rsbuild.config.ts`、`panda.config.ts`、tokens 这类要重启或重新 codegen 的东西时，停下来请用户重启。
- 不在跑：按上面的方式自己后台启动，用完 kill。

两个命令都由 `scripts/dev-server.mjs` 启动（纯 Node，Windows 也能跑）。端口被占时直接失败（admin 的 `strictPort`、Storybook 的 `--exact-port`），不会换端口再起第二个。

**判断标准**：正常情况下不会自行退出的命令，就属于长期进程。`pnpm shots` 会自己启动并关闭 Storybook，`pnpm check`、构建都会正常结束，不受此限制。

## Agent Temporary Files

agent 运行中产生的临时文件（截图基线、生成的 CSS、比对图、日志、临时脚本）统一放在仓库根目录的 `.temp/`（已 gitignore），不要写到仓库外或混进源码目录。

## Design Invariants

视觉规则的完整说明在 `docs/spec/README.md`。以下几条是硬性规定：

- **只用 role token**：`bg: 'surface'`、`color: 'text-muted'`，不用色阶（`primary.500`），不写字面颜色。
- **不写字面尺寸**：共享尺寸按 token 名引用，组件自己的尺寸来自 `@koi/tokens/dimensions` 的 `components`；只属于 web 的标 `// koi-web-only: <原因>`（[tokens.md](agent-doc/tokens.md)）。
- **对比度**：文字 ≥ 4.5:1，控件边缘 / 焦点环 / 图标 ≥ 3:1，两种主题、每套内置 palette 都要达标。组件把 token 放到新背景上时，在 `contrast-pairs.json` 里加一对。
- **尺寸**：基准 14px（`body`）。控件三档 `control-sm` 28 / `control-md` 36 / `control-lg` 44，同一行的组件用同一档。`prose`（16px）只用于长文阅读。
- **形状**：按钮（Button、IconButton、Pagination 页码）默认 rounded（`radius-lg`，8px），`shape="pill"` 或 pill 的 `ShapeProvider` 改成 pill（`radius-full`）；tab、tag、badge、Switch 永远是 pill。Dialog footer 和表格单元格（`TableCell`）自己包了 rounded 的 `ShapeProvider`，外层是 pill 也保持 rounded；rounded 的 sm 档左右内边距 8px（密集形状）；Dialog 的 32px 圆角 = 8px + 24px padding（同心圆角）。Card 和 Toast 用 `radius-panel` 24px，输入框和 Alert 用 `radius-xl` 12px。
- **深度**：按钮永远不加阴影（按压波纹不算）。`shadow-raised` 只用于当前 tab 和 Switch 滑块；`shadow-float` 只用于浮在页面上的东西（Dialog、Toast）。
- **动效**：颜色变化 150ms；会移动的东西用 `spring` 缓动，但贴着视口边缘滑入的（抽屉、侧边面板）用 `out` 200ms，否则回弹会露出边缘后面的空隙。一切都尊重 `prefers-reduced-motion`。
- **文案**：组件里的文案（label、aria-label）用简体中文，来自 `@koi/core` 的 `strings`，不用 emoji。全仓库（含注释）不拿间隔号（`U+00B7`、`U+30FB` 及形近字符）当分隔符：并列的元信息拆成多个元素、用 gap 隔开，句子里用「，」「、」。内容自带的（外国人名译名、作品名）照原样写，那一行标 `koi-allow-dot: <原因>`（`check-dots.mjs` 检查）。
- **主题 / 配色 / 字体**：web 上分别是 `<html>` 的 `data-theme`、`data-palette`、`data-font`（`theme-init.js` 设置）；组件永远写 `fontFamily: 'sans'`。字体平滑保持 `auto`。
- **props 兼容 legacy**：公开 props 与 `reference/legacy-web/components/index.d.ts` 保持兼容，除非 spec 另有规定；不兼容之处记进 [plan.md](agent-doc/plan.md)。

## Coding Style & Naming Conventions

- 代码注释、commit message、`docs/spec/` 用英文；`agent-doc/` 用中文正文 + 英文术语；组件里的 UI 文案用简体中文。
- 注释解释“为什么”，不复述代码。
- 组件目录 kebab-case、组件文件 PascalCase（`radio-group/RadioGroup.tsx`）；recipe 文件 kebab-case，在 `recipes/index.ts` 注册。recipe 的 key 避开 preset-base 的 pattern 名和 JS 保留字（[web-components.md](agent-doc/web-components.md)）。
- 生成的代码通过包名导入（`@koi/react/styled-system/...`），不用相对路径。
- **生成的文件永远不手改**：`packages/tokens/dist/`、`packages/react/styled-system/`。改源头再重建。

## Testing Guidelines

没有单元测试，也没有 CI 测试。正确性靠 `pnpm check`（静态检查 + typecheck）、`pnpm shots` 截图人工检查，以及重构时的像素 / CSS 比对。具体做法和结果怎么汇报见 [agent-doc/verification.md](agent-doc/verification.md)。新增静态规则时，写成 `scripts/check-*.mjs` 并接进 `pnpm check`。

## Commit & Pull Request Guidelines

- 标题是简短的英文祈使句（`Port Tag`、`Move component dimensions into tokens`），不用 Conventional Commits 前缀。正文说明改了什么、为什么改，以及怎么验证的。
- 提交前 `pnpm check` 必须通过；有视觉改动的要看过截图。
- 移植组件时一个组件一个 commit。

## Security & Configuration Tips

- 仓库里没有密钥。Storybook 通过 Cloudflare Workers Builds 部署（`apps/storybook/wrangler.jsonc`）；凭据在 Cloudflare 后台，`.wrangler/` 已 gitignore，不要提交。
- `reference/legacy-web/` 冻结：只读，不 import，不修改。
