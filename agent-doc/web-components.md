# Web 组件（`@koi/react`）

DOM web 应用用的组件。行为和无障碍来自 **Base UI**（`@base-ui/react`），样式来自 **Panda CSS v2** 的 recipe。改组件前先读 `docs/spec/components/<Name>.md`。

## 结构

```text
packages/react/src/
├── <name>/<Name>.tsx   组件：Base UI part + recipe 的 className
├── recipes/<name>.ts   Panda recipe / slot recipe，在 recipes/index.ts 注册
├── recipes/headless.ts 唯一知道 Base UI 的样式文件（state.* / vars.*）
├── recipes/dimensions.ts  toPx()、focusRing
├── icons.tsx           Icon（渲染 Iconify 格式的图标数据）+ 组件用的内置图标（FA Free Solid）
├── shape.tsx           ShapeProvider：容器给按钮默认形状（默认 rounded；页面包 pill；Dialog footer → rounded）
├── global-css.ts       全局样式、reduced-motion 总开关
├── types.ts            web 的 ChangeDetails = ChangeDetails<Event>
└── index.ts            根入口；package.json 另有每个组件的子路径导出
```

生成的代码通过包名导入：`@koi/react/styled-system/css`、`…/recipes`（别名在 `packages/react/tsconfig.json`、`apps/storybook/tsconfig.json` 和 `.storybook/main.ts` 的 `viteFinal` 里）。**不要**用相对路径导入 `styled-system`，否则 Panda 的 `importMap` 看不到。

## 写一个组件要守的规则

| 规则 | 详见 |
| --- | --- |
| props 是 `<Name>OwnProps`（来自 `@koi/core`）加 DOM 属性；文案用 `strings` | [core.md](core.md) |
| `className` 落在根元素上；consumer 要改内部元素时，用 `classNames?: SlotClassNames<<Name>Slot>`（`src/types.ts`，key 是 slot recipe 的 slot 名，不含 `root`；`className` 落在别的 slot 上时也排除它，如 Dialog 的 `popup`）。目前有：Card、Alert、Toast（单独渲染时）、Dialog、Field。原子组件（Badge、Tag…）和组合式组件（Table）不加 | `card/Card.tsx`、`dialog/Dialog.tsx` |
| recipe 不写 `data-*` 选择器和 Base UI 的 CSS 变量，用 `state.*` / `vars.*` | [headless.md](headless.md) |
| 颜色只用 role token（`bg: 'surface'`），不用色阶（`primary.500`），不写字面颜色 | [tokens.md](tokens.md) |
| 尺寸不写字面量：共享的按 token 名（`'control-md'`、`'3'`、`'icon'`），组件自己的用 `toPx(c.<组件>.<部件>)` | [tokens.md](tokens.md#component-组) |
| 外观规则（形状、深度、动效、尺寸档位） | `docs/spec/README.md`，AGENTS.md 的 Design Invariants |

## 移植流程

用 `/port-component <Name>`（`.agents/skills/port-component/SKILL.md`）。简述：

1. 读 `docs/spec/components/<Name>.md`、legacy 的 CSS / JS 和 `reference/legacy-web/components/index.d.ts` 里的 props。
2. 在 `packages/core/src/<name>.ts` 写 `<Name>OwnProps`。
3. 写 `packages/react/src/recipes/<name>.ts` 并在 `recipes/index.ts` 注册；在对应的 Base UI part 上写组件。
4. 加 `apps/storybook/src/components/<Name>.stories.tsx`，并在 `Introduction.mdx` 的组件列表里加一行。
5. `pnpm codegen && pnpm shots <Name>`，对照 legacy 检查浅色和深色。
6. `pnpm check`，然后更新 [plan.md](plan.md)。

公开 props 要和 legacy（`reference/legacy-web/components/index.d.ts`）兼容，除非 spec 另有规定；任何不兼容都记进 plan。已移植组件的 API 决定见 [web-port-record.md](web-port-record.md)。

## Panda 的坑

- Panda v2 只支持 ESM，需要 Node 22+。preset 不再自动加载（所以根 `devDependencies` 里有 `@pandacss/preset-base`；缺了它 codegen 会报 `preset_resolution_failed`）。升级后跑 `pnpm codegen`（带 `--clean`），以免旧的 `.mjs` 遮住新的 `.js`。
- 所有 recipe 的 variant 都输出到同一个 `@layer recipes.variants`，**按 variant 名字母序**排列，而不是声明顺序。两个 variant 设同一属性（`iconOnly` 和 `size` 都设 padding）时，字母序靠后的赢。覆盖写进 `compoundVariants`（更后的 layer），即使只有一个条件：`{ iconOnly: true, css: {...} }`。
- `base` 里的条件选择器也不按书写顺序输出（`_disabled` 排在了 `&[aria-busy=true]` 后面）。靠特异性取胜（`&[aria-busy=true]:disabled`），别靠顺序。
- 改变某个 variant 填充色的 hover / 状态规则，要写在那个 variant 里面，不能写在 `base`：variant 在更后的 layer，即使 `base` 的 hover 更具体也会输给 variant 的普通 `bg`。
- 用模板字符串拼出的计算 key（`` [`&${state.checked}`] ``）要加 `as const`，否则 TypeScript 会把它放宽成 `string`，和 Panda 的模板字面量索引签名冲突，typecheck 失败。
- 根配置 `jsxStyleProps: 'none'`：不支持 `<Box p="4">` 式的 JSX style props，样式只走 `css()` 和 recipe。否则组件 prop 只要跟 CSS 属性同名（`columns`、`content`、`page`…）就会被当样式抽取，生成垃圾规则或报 `nested_property`。
- `'full'` 不是这个 preset 的尺寸 token：`width: 'full'` 会静默输出非法的 `width: full`。写 `'100%'`。
- recipe 的 key 和 preset-base 的 pattern 共用命名空间（`divider`、`stack`、`grid`、`circle`、`float`…），冲突只给警告（`config_artifact_name_conflict`），所以要换个 key（Divider 的 recipe 叫 `separator`），`className` 保持不变。
- recipe 的 key 也不能是 JS 保留字：Panda 会生成 `export const switch`。Switch 的 recipe 叫 `switchRecipe`（class 仍是 `koi-switch`）。
- Panda 不从 `.mdx` 里提取 `css()`。docs 页面上的样式块写在 `.tsx`（`Showcase.tsx`）里，并包在 `<Unstyled>` 里，否则 Storybook 的 docs 样式会渗进去。
- `pnpm cssgen` 不是脚本。要看完整生成的 CSS：`npx panda cssgen --outfile .temp/<name>.css`。
- 主题条件 `dark`（`[data-theme=dark] &`）对 semantic token 输出为 `[data-theme=dark] { --colors-… }`，符合预期。

## Base UI 的坑

- `Tabs.Indicator` 在测量完 tab 之前用 `hidden` 属性隐藏自己（这样首帧不会滑入），所以它的 recipe 永远不能设 `display`。
- Toast：在 provider 内部调用 `Toast.useToastManager()`，不要用 `createToastManager()` 实例。实例只有在 provider 的 effect 订阅之后才收得到调用，所以子组件 mount effect 里发出的 toast 会丢。

## 全局样式的坑

- **字体平滑保持 `auto`。** 永远不要设 `-webkit-font-smoothing: antialiased` / `-moz-osx-font-smoothing: grayscale`：在 macOS 上它会关掉笔画加粗，让 ChillRoundF 又细又弱。Panda 的 preflight 会在 `html` 上设这两个属性，所以 `global-css.ts` 把它们改回 `auto`；`apps/storybook/src/index.css` 对 Storybook 的 docs 样式做了同样处理。
- reduced-motion 总开关在 `global-css.ts` 里，是 `@layer base` 中的 `!important`。带 `!important` 时 layer 顺序反转（越早的 layer 越赢），所以 recipe 无法覆盖它，连自己加 `!important` 也不行。必须保持动画的组件要从那条规则的选择器里排除（如 `.koi-spinner__svg`）。
- docs 页面通过 `.storybook/preview.tsx` 的 `KoiDocsContainer` 跟随工具栏主题；`src/index.css` 把 Koi 的 `page-bg` 铺在 docs 和 story 预览背后。
