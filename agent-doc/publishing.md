# npm 发布

2026-11-01 定下的发布方式。结论：用 Panda CSS v2 自带的 design-system library 流程，不发布源码，也不发预构建 CSS。

## 为什么

Panda v2 有两条库发布路径：

| 方式 | 问题 |
| --- | --- |
| 发源码 + preset，消费方把库加进 `include` | 消费方要扫描 `node_modules` 里的 TS；组件里的 `recipe({ variant })` 是运行时值，扫不到所有变体，CSS 会缺 |
| 发预构建 CSS | 消费方不再需要 Panda，但也拿不到 token 供自己的 `css()` 使用，主题 / palette 条件也难接入 |

选中的是第三条：`panda lib` 产出 design-system manifest，消费方写 `designSystem: '@tuuject/koi-react'`。Panda 读取 manifest，加载 preset（tokens、recipes、globalCss）和 buildinfo（每个 atom、每个 recipe 变体），并把 DS 的 `css` / `recipes` 重导出到消费方的 `styled-system`。消费方不需要 `presets`、不需要 `staticCss`、不需要扫描 `node_modules`。

## 包

| 包 | 发布 | 内容 |
| --- | --- | --- |
| `@tuuject/koi-tokens` | 是 | `dist/`（JS + d.ts、`tokens.css`、`theme-init.js`、`panda-preset.js`）、`fonts/`、`src/tokens.json` |
| `@tuuject/koi-core` | 是 | `dist/`（props 契约、文案、纯函数） |
| `@tuuject/koi-react` | 是 | `dist/`（编译后的组件）、`styled-system/`（组件自己的 Panda runtime）、`dist/panda/{lib.json,buildinfo.json,preset.mjs}` |
| `@tuuject/koi-native` | 否 | 组件还没开始，`private: true` |

scope 是 `@tuuject`。`@koi` 已被 npm 用户 `koi` 占用，`@koi-ui` 也不可用。许可证 MIT（根目录 `LICENSE`，各包有副本，npm 只打包包目录里的那份）。

## 构建

```text
pnpm build:packages            # = pnpm --filter @tuuject/koi-react... build，pnpm 按依赖拓扑排序
├─ @tuuject/koi-tokens
│   scripts/build.mjs  →  .temp/tokens-build/{dimensions,native,palette,palette-kit}.ts
│   tsc                →  dist/*.js + dist/*.d.ts
│                          （tokens.css / panda-preset.js / theme-init.js 仍由 build.mjs 直接写 dist）
├─ @tuuject/koi-core
│   tsc                →  dist/
└─ @tuuject/koi-react
    panda codegen       →  packages/react/styled-system/（library-only config）
    tsc                 →  dist/（不含 recipes/ 与 global-css.ts，它们是 Panda 配置输入）
    panda lib           →  dist/panda/{lib.json,buildinfo.json,preset.mjs}，并同步 package.json exports
    sync-publish-exports→  publishConfig.exports（把 ./src/*.ts 换成 ./dist/*.js + .d.ts）
```

### 为什么工作区还用源码

工作区里的 `exports` 指向 `src/*.ts`，Storybook / admin 的 HMR 不需要先 build；`pnpm check` 也不用把包全构建一遍。真正打 tarball 时，pnpm/npm 会把 `publishConfig` 合并到 manifest（`publishConfig.exports`、`publishConfig.access`），所以发布出去的是 JS + d.ts。

`panda lib` 只管理 `./panda/*`、`./css`、`./recipes` 这些条目；组件子路径由 `scripts/sync-publish-exports.mjs` 统一映射。

### 对源码的要求

`packages/*/src` 的相对 import 一律带 `.js`（`./button.js`）。这样 tsc 输出的 ESM 在 Node 里也能直接解析；Vite / Rolldown / Panda 的 config bundler 都会把 `.js` 映射回 `.ts` / `.tsx`。

## Panda 版本

- `@tuuject/koi-react` 的 peer 是 `@pandacss/dev ~2.1.2`，`panda lib` 把这个 range 写进 manifest 的 `panda` 字段。
- buildinfo 有 schemaVersion：2.1 是 7，2.4 是 8。消费方版本对不上时会读 manifest 的 `files`（`dist/**/*.js`）重新抽取，能继续工作但会有 warning。已用 Panda 2.4 + 2.1 的产物验证过这条 fallback。
- 升级仓库里的 Panda 后必须重跑 `pnpm build:packages`（`panda lib`），并把 peer range 一起改；不要只放宽 peer 不重建 artifact。

## 消费方

```ts
// panda.config.ts
import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  preflight: true,
  designSystem: '@tuuject/koi-react',
  include: ['./src/**/*.{ts,tsx}'],
});
```

CSS 入口要有 layer 顺序，并接 Panda 的 PostCSS 插件：

```css
@layer reset, base, tokens, recipes, utilities;
```

```js
// postcss.config.cjs
module.exports = { plugins: { '@pandacss/dev/postcss': {} } };
```

主题用 `@tuuject/koi-tokens/theme-init.js`（在 CSS 之前导入或内联到 `<head>`）。组件从 `@tuuject/koi-react` 导入；应用自己的样式用应用生成的 `styled-system`，它已经重导出 Koi 的 runtime。复制 Admin 模板、tarball 本地联调和 Tailwind / Rsbuild 迁移见 [consuming-koi.md](consuming-koi.md)。

## 发布

```sh
pnpm check
pnpm build:packages
pnpm pack:packages      # 可选：把 tarball 打到 .temp/packs 检查
pnpm publish:packages   # build + pnpm -r publish（private 包自动跳过）
```

`pnpm publish` 会把 `workspace:*` 改写成版本号，并应用 `publishConfig`。首次发布需要 npm 账号能向 `@tuuject` scope 发布。

## 验证记录（2026-11-01）

- `pnpm check` 通过（对比度、raw color / size、headless、core、middle dot、全部 typecheck）。
- `pnpm build:packages` 从空 dist 构建通过；`panda lib` 写出 63 个文件。
- tarball 检查：`exports` 指向 `dist`、类型齐全；`workspace:*` 已改写；`@tuuject/koi-react` 含 182 个 `styled-system` 文件与 `dist/panda`。
- 消费方 fixture（`.temp/consumer`，未入库）：从 tarball 安装 → `designSystem` → Panda 2.1.2 codegen / cssgen → Vite build → Playwright 截图。浅色、`data-theme="dark"`、`data-palette="rose"` 都生效，按钮 36px / 8px 圆角、Card 24px、Switch pill，无 console error。

## 未做

- npm 首次发布 / scope 创建（需要账号）。
- 版本策略：三个包都从 `0.1.0` 开始；以后按 minor 一起升，依赖用 `workspace:*`。
- `@tuuject/koi-native` 发布（等首批组件）。
