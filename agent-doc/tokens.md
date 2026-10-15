# Tokens

`packages/tokens/src/tokens.json` 是 Koi 所有数值和颜色的唯一来源。改它，然后 `pnpm tokens`（或 `pnpm codegen`，会先跑 tokens）。`packages/tokens/dist/` 是生成物，永远不手改。

## tokens.json 结构

| 顶层 key | 内容 | 输出到 |
| --- | --- | --- |
| `color.tokens` | 色阶（`primary-50`…`950`、`accent-*`、`secondary-*`、`warning-*`、`error-*`）、`white` / `black`，以及 role token（`surface`、`text-muted`、`action`…，各带 `light` / `dark` 值） | 全部输出 |
| `color.palettes` | 可切换的 palette：`default`（`koi`）和 `list`（`rose` 等）。一套 palette 只换 `primary-*` 和 `accent-*` | Panda 条件、tokens.css、palette.ts |
| `type` | 字体栈（`families.sans` / `chill`）和文字样式（`body` 14/20、`heading-1`…） | Panda textStyles、native.ts |
| `spacing` / `radius` / `size` / `shadow` / `blur` | 共享尺寸（`space-3`、`radius-panel`、`control-md`、`icon`…） | Panda tokens、tokens.css、dimensions.ts |
| `layer` | 浮层的 z-index（`dialog`、`popup`、`toast`、`tooltip`） | Panda `zIndex`、dimensions.ts `layers` |
| `component` | 每个组件自己的尺寸，按组件分组（`switch.track-width`…），带用途说明 | 只到 dimensions.ts `components`，**不**做成 CSS 变量 |

每个 token 都有 `usage` 说明。新加 token 时必须写，它是 agent 判断“该用哪个”的依据。

## 输出

| 文件 | 包入口 | 谁用 |
| --- | --- | --- |
| `dist/panda-preset.js` | `@koi/tokens/panda` | 根目录 `panda.config.ts` |
| `dist/tokens.css` | `@koi/tokens/tokens.css` | 不用 Panda 的网页（变量名同 legacy：`--surface`、`--radius-panel`） |
| `dist/theme-init.js` | `@koi/tokens/theme-init.js` | 内联进 `<head>`；`koiSetTheme` / `koiSetFont` / `koiSetPalette` |
| `dist/dimensions.ts` | `@koi/tokens/dimensions` | recipes（`toPx`）、web 组件 TSX、`@koi/native`。全是数字（px），图标笔画是 24 网格单位 |
| `dist/native.ts` | `@koi/tokens/native` | native：每个主题的 hex / rgba 颜色、`type`、`blur`、`fontStacks`；尺寸从 dimensions 转出 |
| `dist/palette.ts` | `@koi/tokens/palette` | 任何平台：`palettes`、`createColors(palette, theme)`、`checkPalette(palette)` |
| `fonts/fonts.css` | `@koi/tokens/fonts.css` | ChillRoundF 的 121 个 woff2 子集 |

## 加一个 token

1. 在 `tokens.json` 对应的组里加，写 `usage`。组件内部尺寸进 `component` 组的对应组件下；几个组件共用的进共享组（`size`、`spacing`…）。
2. 颜色 role 要跟随 palette 时，引用色阶（`{primary-700}`），带透明度写 `{primary-950 / 0.8}`。**不要**写字面颜色，否则换 palette 时它不会变。
3. 组件把这个 role 放到新背景上时，在 `src/contrast-pairs.json` 加一对：`text` 组要求 4.5:1，`ui` 组要求 3:1；第三项可选，是半透明颜色合成用的底色，默认 `page-bg`。
4. `pnpm tokens && pnpm contrast`，然后 `pnpm check`。

## Palettes

- **web**：在 `<html>` 上设 `data-palette="rose"`，或调用 `koiSetPalette('rose')`。自定义 palette 用 `koiSetPalette({ primary, accent })`，会写成 `<html>` 上的内联 CSS 变量。选择会存进 localStorage `koi-palette`；storage 不可用时只在内存里生效。
- **Panda**：`primary.*` 和 `accent.*` 是 semantic token，带 `_palette<Id>` 条件（如 `_paletteRose`）。
- **任何平台**：`createColors(palette, theme)` 返回每个 role 的颜色（hex / rgba）；`@koi/native` 用它生成 Tamagui 主题。
- **对比度**：`pnpm contrast` 检查每套内置 palette 在两种主题下的全部 pair。用户自定义的 palette 必须先过 `checkPalette()`（返回不达标的 pair，空数组表示安全）。目前还没有自动修正，只能由应用拒绝不达标的 palette（见 [plan.md](plan.md)）。
- **accent 选亮色**：`accent-solid` 是 400 档配 950 档文字，按琥珀这种亮色设计。暗色 accent（比如紫罗兰）对比度能过，但视觉上会变味。

坑：

- Panda 的 `globalCss` 输出在 `@layer base`，而 token 变量在 `@layer tokens`，不论选择器多具体都会输。所以 palette 必须做成 semantic token 上的 condition，不能写在 global CSS 里。
- palette 必须设在 `<html>` 上，因为 role 变量就声明在那里。自定义属性在声明处计算，`--colors-action: var(--colors-primary-700)` 在 `<html>` 上已经算好，嵌套元素上再设 `data-palette` 改不到它。
- `build.mjs` 会用 Node 的 `stripTypeScriptTypes` 加载 `src/palette-kit.ts`，拿运行时实现把内置 palette 重新算一遍，和构建期的解析逐个比对。所以 kit 必须保持无 import、只用可擦除的 TypeScript（不能用 enum、namespace）。

## Component 组

`component` 组是每个组件自己的尺寸：Switch 的轨道 36×20、Checkbox 的 16px 方框、Dialog 的三档宽度、浮层偏移、图标笔画 2.25…

- 生成成 `dimensions.ts` 里的 `components`，key 是 camelCase：`components.switch.trackWidth`、`components.closeButton.size`。
- web 的 recipe 写 `toPx(c.switch.trackWidth)`（输出 `'[36px]'`）；TSX 写 `components.tooltip.offset`；native 直接用数字。
- **不是** CSS 变量，也不是 Panda token：它们不分主题，也不打算给应用写样式用。
- 能从别的值算出来的，就在用的地方算，不另存 token。比如 Switch 滑块的移动距离 = 轨道宽 − 滑块 − 2 × 内边距。

## 其它

- **motion**：时长和缓动曲线现在在 `packages/tokens/scripts/motion.mjs`，还没进 `tokens.json`（Phase 2 待办）。`native.ts` 里的 `motion` 是写死的临时值。
- **字体**：组件永远写 `fontFamily: 'sans'`，不写字体名。`<html data-font="chill">` 让 `sans` 变成 ChillRoundF。
- **React Native 读不了 `oklch()`**：`native.ts` 和 `palette.ts` 已经把所有颜色转成 hex / rgba。
