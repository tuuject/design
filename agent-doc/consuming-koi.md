# 在另一个仓库里用 Koi

适用场景：消费方仓库只安装 npm 包（`@tuuject/koi-*`），没有 koi-ui 源码。分两部分：普通 Vite / Panda 应用怎么接；怎么把 `apps/admin` 模板搬到消费方。发布侧（scope、`panda lib`、peer 版本）见 [publishing.md](publishing.md)。

## 安装

已发布后：

```sh
pnpm add @tuuject/koi-react @tuuject/koi-tokens react react-dom
pnpm add -D @pandacss/dev
```

`@tuuject/koi-core` 由 `@tuuject/koi-react` 带进来；只有自己写平台包时才直接装它。

还没发布、或要联调本地改动时，在 koi-ui 里跑：

```sh
pnpm pack:packages   # 输出 .temp/packs/tuuject-koi-{tokens,core,react}-<version>.tgz
```

消费方把 `@tuuject/koi-react` / `@tuuject/koi-tokens` 指向 tarball：

```json
{
  "dependencies": {
    "@tuuject/koi-react": "file:../koi-ui/.temp/packs/tuuject-koi-react-<version>.tgz",
    "@tuuject/koi-tokens": "file:../koi-ui/.temp/packs/tuuject-koi-tokens-<version>.tgz"
  }
}
```

并在 `pnpm-workspace.yaml` 里 override `@tuuject/koi-core` / `@tuuject/koi-tokens` 到同一批 tarball。否则 pnpm 会按 `koi-react` 的依赖声明去 registry 找还没发布的包：

```yaml
# 消费方仓库根目录 pnpm-workspace.yaml
overrides:
  '@tuuject/koi-core': file:../koi-ui/.temp/packs/tuuject-koi-core-<version>.tgz
  '@tuuject/koi-tokens': file:../koi-ui/.temp/packs/tuuject-koi-tokens-<version>.tgz
```

## Panda 配置

```ts
// panda.config.ts（消费方自己的）
import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  preflight: true,
  designSystem: '@tuuject/koi-react',
  include: ['./src/**/*.{ts,tsx}'],
});
```

- 不要再加 `presets: ['@tuuject/koi-tokens/panda']`、`theme.extend.recipes` 或 `staticCss`：`designSystem` 已经带了 preset 和 buildinfo，重复会重复 tokens。
- 不要把 `node_modules/@tuuject/koi-react` 加进 `include`：buildinfo 已经覆盖组件会产生的所有 class。
- CSS 入口要有 layer 顺序：

```css
@layer reset, base, tokens, recipes, utilities;
```

- PostCSS 用 Panda 插件。如果配置和启动目录可能不同，`configPath` / `cwd` 用 `__dirname` 绝对路径：

```js
// postcss.config.cjs
const path = require('node:path');

module.exports = {
  plugins: {
    '@pandacss/dev/postcss': { configPath: path.join(__dirname, 'panda.config.ts'), cwd: __dirname },
  },
};
```

- 主题：在 CSS 之前 `import '@tuuject/koi-tokens/theme-init.js'`，或像模板一样在构建时内联进 `<head>`。它设置 `<html data-theme="light|dark">`，palette 用 `data-palette="rose"`。

## 从 apps/admin 搬模板

模板是 Vite 应用，不是能塞进任意 bundler 的组件包。先拿一份源码：

```sh
git clone --depth 1 https://github.com/tuuject/design /tmp/koi-ui
cp -R /tmp/koi-ui/apps/admin/. apps/admin-koi/
```

要搬的是这四类文件，不是整个 `apps/admin` 的 workspace 接线：

1. **直接复制**：`src/`、`index.html`、`vite.config.ts`、`src/index.css`。`vite.config.ts` 里的 theme-init 读取和 `transformIndexHtml` 对外部包同样有效。
2. **重写**：`panda.config.ts`（上面那份自己的）、`postcss.config.cjs`（指向自己的 config）、`tsconfig.json`（不要 `extends: "../../tsconfig.base.json"`，也不要 `paths` 指向 `packages/react/styled-system`；如果应用代码要 import 自己生成的 `styled-system`，把 `styled-system` 加进 `include`）。
3. **改 package.json**：改包名，`workspace:*` 换成 npm 版本或 tarball；加 `@pandacss/dev`；Vite / TanStack Router / react-hook-form / zustand 等依赖按模板版本装。
4. **换业务层**：`src/mock/api.ts`、登录账号、演示订单和文案是模板的演示数据，接消费方自己的 API；保留 `routes/`、`components/`、`nav.ts`、`stores/` 的分层。

`src/routeTree.gen.ts` 是运行时代码，可以保留，Vite 插件会在 dev / build 时重新生成。`src/shared.ts` 里的 `focusRing` 是模板对库内 helper 的镜像（库还没导出它），外部照抄即可。

模板里的 `css` / `cx` 从 `@tuuject/koi-react/styled-system/css` 导入，这是已发布的公开 subpath，不是 workspace 路径，外部不需要额外 alias。

## 不要做

- 不要把模板复制过去后继续引用 koi-ui 根目录的 `panda.config.ts`、`tsconfig.base.json` 或 `packages/react/styled-system`；外部没有这些文件。
- 不要在一个页面里同时让 Tailwind 和 Panda 管 reset / layers。要迁就整个 shell 迁，或把 Koi 页面放独立 app / route，只加载 Panda。
- 不要 `import '@tuuject/koi-react/src/...'`；只用 `@tuuject/koi-react`、`@tuuject/koi-react/button` 这类公开 subpath。
- 不要把 `.dark` class 和 Koi 的 `data-theme` 混用；主题开关走 `koiSetTheme`。
- 不要在消费方找 `pnpm shots`、`pnpm dev:admin`、`pnpm check`；这些是 koi-ui 仓库自己的命令，消费方跑自己的 dev / build / e2e。

## 从 Rsbuild + Tailwind + i18n 迁移

`apps/admin` 模板是 Vite + Panda，和 Rsbuild + Tailwind + shadcn 不是同一套样式层。推荐分两步：

1. 新建一个 Vite app（例如 `apps/admin-koi`），照上面的清单复制模板，接真实 API，先跑到和旧 admin 的 parity。
2. 旧 app 保留到迁移完成，再把入口切过去；不要在同一棵路由树里一半 Tailwind 一半 Panda。

需要从旧配置带过去的东西：Vite 的 `server.proxy`（API 目标、Origin 改写）、TanStack Router 的路由约定、e2e 的登录/主题用例。i18n 产品要注意：Koi 组件内置文案默认是简体中文，用 `@tuuject/koi-react/strings` 的 `StringsProvider` 整表或按 key 覆盖（必须包在 `ToastProvider` 外面）；单点覆盖还有 `Field.optionalLabel`、`Button.loadingLabel`、`Toast.closeLabel` 等 props。见 [core.md](core.md#文案注入)。

## 验收

- 消费方自己的 `tsc` / build / e2e 通过；Panda codegen 没有 `design_system_buildinfo_stale` warning（版本不匹配的 fallback 见 [publishing.md](publishing.md)）。
- 打开浅色、深色、`data-palette="rose"`；桌面和手机宽度。
- 关键路径：登录、路由守卫、列表筛选、表单校验、弹窗、toast。
- 不要把 koi-ui 的 `pnpm check` 当成消费方检查的替代。

## 已验证（2026-11-01）

把 `apps/admin` 复制到临时目录，只改 `panda.config.ts`、`postcss.config.cjs`、`tsconfig.json`、`package.json`，用 tarball 安装；Panda 2.1.2 + Vite 8 构建通过，Playwright 跑通登录 → dashboard，浅色主题、Koi class、无 console error。期间发现并修了 `FormField` 在 react-hook-form 7.91 下的 `message` 类型问题（模板的 `^7.90.0` 会装到 7.91）。
