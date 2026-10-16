# Koi 架构

Koi 是一个设计系统，不是应用：没有服务进程，没有运行时数据。它的产物是 tokens 和组件包，被其它应用（DOM 网站、Expo 应用，如 Bilisound）消费。

## 包依赖

```text
                 packages/tokens  (@koi/tokens)
                 src/tokens.json ── 唯一事实来源
                        │ scripts/build.mjs
        ┌───────────────┼──────────────────────────┐
        ▼               ▼                          ▼
  panda-preset.js   dimensions.ts / palette.ts   native.ts
  tokens.css        (纯数字、运行时 palette)       (hex 颜色、数字)
  theme-init.js          │                          │
        │                │                          │
        ▼                ▼                          ▼
  packages/react  ◄── packages/core ──►  packages/native
  (@koi/react)        (@koi/core)        (@koi/native)
  Base UI + Panda     props 契约、文案、    Tamagui
  DOM web 应用         纯函数，无 DOM       iOS / Android / Expo web
        │
        ▼
  apps/storybook（文档 + 视觉测试台，pnpm shots）
  apps/admin（Admin 模板：Rsbuild + TanStack Router + Zustand，pnpm dev:admin）
```

- 依赖只能向下：`react` / `native` → `core`、`tokens`；`core` 不依赖任何包（只用 `react` 的类型）；`tokens` 不依赖任何包。
- `react` 和 `native` 互不依赖，也不共享渲染代码。它们共享的是 tokens（数值和颜色）和 core（props、文案、逻辑）。
- 根目录的 `panda.config.ts` 统一扫描 `packages/react/src` 和 `apps/storybook/src`，生成 `packages/react/styled-system/`（gitignore）。

## 主数据流：一个值从 token 到屏幕

```text
tokens.json ──build.mjs──► dist/*
  │
  ├─ web:  panda-preset.js ──panda codegen──► styled-system/ ──► recipe(className) ──► CSS 变量
  │        theme-init.js 在 <html> 上设 data-theme / data-font / data-palette
  │
  └─ native: dimensions.ts + palette.ts(createColors) ──► createKoiConfig() ──► Tamagui tokens / themes / font
```

同一个值（比如 Switch 轨道宽 36）在 web 端经 `toPx(c.switch.trackWidth)` 变成 CSS，在 native 端经 `components.switch.trackWidth` 变成数字。两端都不写字面量（`scripts/check-raw-sizes.mjs` 检查）。

## 模块职责

| 模块 | 职责 |
| --- | --- |
| `packages/tokens/src/tokens.json` | 颜色 role、palette、字体、间距、圆角、尺寸、阴影、模糊、层级、组件尺寸。详见 [tokens.md](tokens.md) |
| `packages/tokens/src/contrast-pairs.json` | 必须达标的前景 / 背景对 |
| `packages/tokens/src/palette-kit.ts` | 运行时 palette 逻辑（`createColors`、`checkPalette`），无依赖 |
| `packages/tokens/scripts/` | `build.mjs` 生成全部输出；`contrast.mjs` 检查对比度；`motion.mjs` 暂存 motion 值 |
| `packages/core/src/<name>.ts` | 组件的 `<Name>OwnProps`、变体列表、纯函数。规则见 [core.md](core.md) |
| `packages/core/src/strings.ts` | 组件自带的全部中文文案 |
| `packages/react/src/recipes/` | Panda recipe，每个组件一个；`headless.ts` 是唯一知道 Base UI 的样式文件；`dimensions.ts` 提供 `toPx` 和 `focusRing` |
| `packages/react/src/<name>/` | web 组件，行为来自 Base UI。详见 [web-components.md](web-components.md) |
| `packages/native/src/config.ts` | `createKoiConfig()`：tokens → Tamagui config。详见 [native.md](native.md) |
| `apps/storybook/` | Storybook 10；`scripts/shots.mjs` 截图 |
| `apps/admin/` | Admin 模板（Rsbuild + TanStack Router + Zustand）；接线和取舍见 [admin.md](admin.md) |
| `scripts/check-*.mjs` | `pnpm check` 里的静态检查（raw 颜色、raw 尺寸、headless 泄漏、core 边界） |
| `docs/spec/` | 设计规范：品牌手册 + 逐组件 spec |
| `reference/legacy-web/` | 旧实现（React 18 + 手写 CSS），冻结，只读参考 |

## 平台分工

| 消费方 | 用哪个包 | 主题 / 配色怎么切换 |
| --- | --- | --- |
| DOM web 应用（Vite、Next…） | `@koi/react` + `@koi/tokens/panda` | `<html data-theme / data-palette>`，`theme-init.js` 的 `koiSetTheme` / `koiSetPalette` |
| Expo 应用（iOS、Android、Expo web） | `@koi/native` | Tamagui 的 `<Theme name="dark">`、`light_rose` 子主题 |
| 不用 Panda 的网页 | `@koi/tokens/tokens.css` | 同 DOM web |

Expo web 由 Tamagui 渲染，不用 `@koi/react`。所以 web 上会有两种渲染，像素一致性靠截图比对保证（[verification.md](verification.md)）。

## 外部依赖

| 依赖 | 用途 |
| --- | --- |
| `@base-ui/react` | web 组件的行为与无障碍 |
| `@pandacss/dev`、`@pandacss/preset-base` | web 样式（recipe、codegen） |
| `@tamagui/core` | native 样式与主题 |
| Storybook（`@storybook/react-vite`）、Playwright | 文档、截图 |
| `wrangler` | 把静态 Storybook 部署到 Cloudflare Workers |

版本以各 `package.json` 和 `pnpm-lock.yaml` 为准。
