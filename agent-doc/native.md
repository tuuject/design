# Native 组件（`@koi/native`）

Expo 应用用的 Koi：iOS、Android 和 Expo web，基于 **Tamagui**（版本线见 `packages/native/package.json`）。DOM web 应用用 `@koi/react`；两者共享 `@koi/tokens`（数值、颜色）和 `@koi/core`（props、文案、逻辑），**不共享渲染代码**。

当前状态：Tamagui config 已完成；组件和展示用的 Expo 应用还没开始（[plan.md](plan.md#phase-3react-native)）。第一个消费方是 Bilisound 的 `apps/mobile-next`（接入暂缓，见 Bilisound 仓库的 `agent-doc/v3-plan/koi-design-system.md`）。

## 包结构

```text
packages/native/
├── src/config.ts   createKoiConfig()、createKoiThemes()、createKoiTheme()、createKoiFont()、tokens
├── src/index.ts    入口
└── src/<name>/<Name>.tsx   （计划中）组件，结构对齐 packages/react
```

tsconfig 不带 DOM lib。`scripts/check-raw-sizes.mjs` 已经覆盖 `packages/native/src`。

## Tamagui config

`createKoiConfig({ palettes?, fontFamily?, animations? })`，所有值都来自 tokens，**不要在 `config.ts` 里手调**，改 `tokens.json`。

| 内容 | 写法 | 来源 |
| --- | --- | --- |
| 尺寸 | `$control-md`、`$icon`、`$icon-sm`（`true` = `control-md`） | `dimensions.ts` 的 `sizes` |
| 间距 | `$1`…`$16`（`true` = `$4`），负值 `-$1` | `space` |
| 圆角 | `$sm`、`$lg`、`$xl`、`$panel`、`$dialog`、`$full`（`true` = `$lg`） | `radii` |
| 层级 | `$dialog`、`$popup`、`$toast`、`$tooltip` | `layers` |
| 颜色 | 只在主题里，没有颜色 token：组件永远不用色阶 | `createColors()` |
| 主题 key | role 名转 camelCase：`text-muted` → `$textMuted`，`on-primary-solid` → `$onPrimarySolid` | |
| 主题别名 | `background`（page-bg）、`color`（text）、`borderColor`（border）、`placeholderColor`（text-muted）、`outlineColor`（focus-ring） | 给 Tamagui 自带的 primitive 用 |
| 主题名 | `light`、`dark`（默认 palette），`light_rose`、`dark_rose`，以及 `palettes` 选项里每一套 `light_<id>` / `dark_<id>` | |
| 字体 | 一套 font，key 是 Koi 文字样式名：`fontSize="$body"`，`lineHeight` / `fontWeight` 用同一个 key | `type` |
| 组件尺寸 | 不在 config 里：直接 `import { components } from '@koi/tokens/dimensions'` | `components` |

- 字体：web（Expo web）用 Koi 的系统字体栈，iOS / Android 用系统字体。`fontFamily` 可以指定已加载的字体（ChillRoundF 在 native 上需要完整字体文件，见 plan 的「未决事项」）。
- 动画驱动不由 Koi 选择，应用通过 `animations` 传入。
- 应用声明一次类型：`declare module '@tamagui/core' { interface TamaguiCustomConfig extends KoiConfig {} }`。如果应用自己也有 config，两个声明会冲突，接入时要处理。
- 用户自定义的 palette 先过 `checkPalette()`，再通过 `palettes: { user }` 传入。

## 写一个 native 组件

1. **读**：`docs/spec/components/<Name>.md`（外观和行为）、[web-port-record.md](web-port-record.md) 里该组件那一行（已定的 API / 行为决定）、web 实现（`packages/react/src/recipes/<name>.ts` 是最精确的数值和状态清单）。
2. **props**：`<Name>Props` = `<Name>OwnProps<GestureResponderEvent>`（来自 `@koi/core`）+ Tamagui / RN 的 props。表单接线等 web 专属 props 不搬。导出的 props 里不能出现 Tamagui 的类型（[headless.md](headless.md) 规则 5）。规则见 [core.md](core.md)。
3. **值**：颜色用主题 key（`$surface`、`$textMuted`）；共享尺寸用 token（`$control-md`、`$3`）；组件尺寸用 `components.<组件>.<部件>`；文案用 `strings`；逻辑用 core 的纯函数。**不写字面量。**
4. **行为**：优先用 Tamagui 的 headless 包（下表），自己只负责样式。
5. **验证**：Storybook 截图和 `@koi/react` 对比，加上真机检查（[verification.md](verification.md)）。

### web recipe → Tamagui

| web（Panda + Base UI） | Tamagui |
| --- | --- |
| `defineRecipe` / `defineSlotRecipe` | `styled(View / Text, { variants })`，每个 slot 一个 styled 组件 |
| `variants` / `defaultVariants` | 同名 `variants` / `defaultVariants` |
| `compoundVariants` | **没有**。用 variant 函数 `(val, { props }) => ({…})` 读其它 props |
| `_hover` | `hoverStyle`（只在 web 和有指针的设备上生效） |
| `&:active`（按压） | `pressStyle`。web 的按压波纹是 box-shadow，标为 web-only；native 用平台自己的按压反馈 |
| `_focusVisible` + `focusRing` | `focusVisibleStyle`，`outlineWidth` / `outlineOffset` 用 `components.focusRing` |
| `_disabled` / `state.disabled` | `disabledStyle`，或 `disabled` variant |
| `state.checked` / `state.selected` 等 | 由 props 驱动的 variant（`checked: { true: {…} }`） |
| `state.entering` / `state.exiting` + transition | `enterStyle` / `exitStyle`，配合 `AnimatePresence` 和应用传入的动画驱动 |
| `vars.anchorWidth` 等测量值 | Popover / Sheet 自己处理定位 |
| `textStyle: 'body'` | `fontSize="$body" lineHeight="$body" fontWeight="$body"` |
| `Icon`（`IconData` 的 `body` 写进 `<svg>`） | 同一份 `IconData`，用 `react-native-svg` 的 `SvgXml` 拼成 `<svg viewBox=…>${body}</svg>` 渲染，`color` 给 currentColor |

### 组件 → 行为来源

以下包在 Koi 使用的 Tamagui 版本线上都有发布；实际用前读一下它的 API。

| Koi 组件 | web 行为来源 | native 候选 | 备注 |
| --- | --- | --- | --- |
| Button / IconButton | `<button>` / `<a>` | `styled(View)` + 按压状态，或 `@tamagui/button` | `href` 是 web 专属 |
| Switch | Base UI Switch | `@tamagui/switch-headless` | |
| Checkbox | Base UI Checkbox | `@tamagui/checkbox-headless` | |
| RadioGroup | Base UI RadioGroup | `@tamagui/radio-headless` | |
| Tabs | Base UI Tabs | `@tamagui/tabs` | 滑动的 pill 指示条要自己测量 |
| Dialog（含 alertdialog） | Base UI Dialog / AlertDialog | `@tamagui/dialog`、`@tamagui/alert-dialog` | 小屏可考虑 `@tamagui/sheet` |
| SelectPanel | Base UI Select / Combobox | `@tamagui/select`，或 `@tamagui/popover` / `@tamagui/sheet` + 列表 | |
| Select（原生 `<select>`） | `<select>` | 无直接对应 | native 上可能并入 SelectPanel，需决定 |
| Tooltip | Base UI Tooltip | `@tamagui/tooltip` | 触屏没有 hover；native 上可能长按或不提供 |
| Toast | Base UI Toast | `@tamagui/toast` | 上限和时长用 core 的 `TOAST_LIMIT` / `TOAST_DURATION` |
| Progress | Base UI Progress | `@tamagui/progress` | |
| Avatar | Base UI Avatar | `@tamagui/avatar` | 首字母用 core 的 `initials` |
| Divider | Base UI Separator | `@tamagui/separator` | |
| Pagination | 纯组件 | 纯组件 | 页码列表用 core 的 `pageList` |
| Field / Input / Textarea | Base UI Field / Input | RN `TextInput` | 文本的 value / onChange 是平台自己的 API |
| Alert、Badge、Card、Tag、Link、Spinner、Skeleton | 纯组件 | 纯组件 | 见下方平台差异 |

### web 有、native 要另找办法的

| web | native |
| --- | --- |
| `backdrop-filter` 毛玻璃（`surface-glass`、Dialog 背景） | `expo-blur` 的 `BlurView`，上面再铺半透明的 role 颜色 |
| Skeleton 全页同步的 shimmer（`background-attachment: fixed`） | 做不到原样。每个占位一个 Reanimated + 线性渐变，或用一个共享的动画值驱动全部 |
| ChillRoundF 的 121 个 `unicode-range` woff2 子集 | native 需要完整 TTF/OTF（CJK 很大），或用系统字体（苹方 / Noto Sans CJK）。和 web 的字体决定一起定 |
| 横版 NavMenu 的 hover flyout | 触屏没有 hover：用原生 tabs / drawer |
| `shadow-float` 等 CSS 阴影 | iOS 用 `shadow*` props，Android 用 `elevation`，按平台分别写 |
| `prefers-color-scheme` / `data-theme` | `useColorScheme()` 选 `light` / `dark` 主题 |
| 按压波纹（box-shadow，标 `koi-web-only`） | 平台自己的按压反馈 |
| Link 箭头的基线微调、Tag 的伪元素点击区（标 `koi-web-only`） | 用 RN 的 `hitSlop` 等对应手段 |

## 边界

- Koi 不放某个应用专属的组件。Bilisound 的 PageShell、DualScrollView、ActionMenu、播放器 UI 留在 Bilisound 里，用 Koi 的 tokens 和主题重做。
- Koi 不 import 任何应用代码。
- `@koi/native` 不依赖 `@koi/react`。web 实现只作为参考来读，不 import。
