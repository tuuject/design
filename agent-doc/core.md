# Core：各平台共享的部分

`@tuuject/koi-core`（`packages/core`）是每个组件与平台无关的部分，让 web 包和 native 包实现的是同一个 Koi，而不是两个逐渐分叉的版本。tokens 通过 `@tuuject/koi-tokens` 共享；core 管 tokens 管不到的东西。

| 放进 `@tuuject/koi-core` | 留在平台包里 |
| --- | --- |
| `<Name>OwnProps`：组件是什么、做什么（`color`、`variant`、`size`、`label`、`open`、`onCheckedChange`…） | DOM / native 属性、`className` / `style`、`ref` 目标 |
| 变体列表（`BUTTON_COLORS`）及其类型（`ButtonColor`） | 平台自己的事件处理（`onClick`、`onPress`）、文本输入的 `value` / `onChange` |
| `ChangeDetails<E>`，`E` 由平台填事件类型 | 表单接线（`name`、`value`、`required`、`form`、`inputRef`） |
| `strings`：组件自己写出的每一段文案 | 渲染、样式、headless 库（[headless.md](headless.md)） |
| 纯逻辑（`pageList`、`initials`）与行为常量（`TOAST_LIMIT`） | 任何需要 React state、context 或 effect 的东西 |

## 规则

1. **Core 是纯 TypeScript。** 只能从 `react` 导入类型（`ReactNode`、`ReactElement`），以及自己的文件。不能有 DOM 类型（`Event`、`HTMLElement`、`MouseEvent`），不能有 React Native 类型（`ViewProps`、`GestureResponderEvent`），不碰样式，不碰 headless 库。
2. **交出平台事件的 callback 用类型参数接收它。** `CheckboxOwnProps<E>` → `onCheckedChange(checked, details: ChangeDetails<E>)`；web 包填 `Event`，native 填它的 press 事件。Tag 的 `onSelectedChange(selected, event: E)` 同理。
3. **每个平台的 `<Name>Props` 都建立在 `<Name>OwnProps` 上。** web 端：

   ```ts
   export interface AlertProps extends AlertOwnProps, Omit<React.HTMLAttributes<HTMLDivElement>, keyof AlertOwnProps> {}
   export interface SwitchProps extends SwitchOwnProps<Event>, Omit<React.ComponentPropsWithRef<'button'>, keyof SwitchOwnProps | …> {
     name?: string; // 表单接线是 web 自己的
   }
   ```

   native 端对应地写成 `<Name>OwnProps<GestureResponderEvent>` 加 Tamagui / RN 的 props（见 [native.md](native.md)）。判断一个 prop 进不进 core：native 版也需要它、而且含义相同，就进 core。拿不准就放 core：以后把 prop 从 core 移出，对某个平台是 breaking change；移进来则不是。
4. **文案来自 `strings`。** 组件里不写中文字符串字面量；把字符串加进 `packages/core/src/strings.ts`（简体中文，不用 emoji），平台组件通过 `useStrings()` 读到它再用 `t.close`。可见文案还要留一个显式 prop（见下），provider 之外的单点覆盖才不会逼消费方包一层。
5. **平台包重新导出它们原来拥有的 core 类型**（`ButtonColor`、`RadioOption`、`SelectOption`…），从组件文件里导出，所以 `@tuuject/koi-react/button` 依旧能导出它们。

`pnpm check` 用 `scripts/check-core.mjs` 强制规则 1–3（`pnpm typecheck` 也会在不带 DOM lib 的情况下编译 core）。确实需要例外的行加 `// koi-allow-core` 和理由。

## 文案注入

默认文案仍然是简体中文，`strings` 的每个值都不变；应用可以整表替换或只替换几个键。

- **core**：`strings` 是默认表，`Strings = typeof strings` 是整表类型，`StringsOverride = { [K in keyof Strings]?: Strings[K] }` 是覆盖类型，`createStrings(overrides)` 做浅合并（函数键如 `page`、`dragPickedUp` 整只替换）。`strings` 故意没有 `as const`，否则 `StringsOverride` 只接受中文字面量。
- **web**：`@tuuject/koi-react` 的 `StringsProvider strings={{ close: 'Close' }}` 用 `useMemo` 把合并结果放进 context；组件里一律 `const t = useStrings()`，没有 provider 时拿到默认 `strings`。导出在包根和 `@tuuject/koi-react/strings`。provider 必须包在 `ToastProvider` 外面（后者在挂载处读 context），并且传稳定的对象（提到组件外或用 `useMemo`），否则每次渲染都会换 context 值。`createStrings` 忽略 `undefined`，不会把默认值抹掉。
- **默认参数要搬进函数体**：`placeholder = strings.selectPlaceholder` 这类写法在模块加载时就求值，读不到 context；改成解构 `placeholder`，函数体里 `placeholder ?? t.selectPlaceholder`。
- **单点覆盖用 props**：`Field.optionalLabel`（默认 `strings.optional`）、`Button.loadingLabel`（默认 `strings.processing`）、`Toast.closeLabel` 与 `ToastProvider.closeLabel`（默认 `strings.close`）、`ToastProvider.label`（区域名，默认 `strings.notifications`）。其余已有 prop（`TableEmpty` 的 children、`SelectPanel.placeholder` / `searchPlaceholder` / `emptyText`、`DropZone.title`、`Pagination.prevLabel` / `nextLabel` / `label`）继续优先于 provider。
- **覆盖范围**：provider 影响所有内置文案，包括分页页码名、Link 的外链说明、两个 editor 的重复错误与拖拽播报、SelectPanel 的搜索与空态、DropZone 的默认标题、Avatar 的回退名、Progress 的值文本、Table 空态、Tag 移除、Dialog / Alert / Toast 关闭、Spinner 加载。
- **native 暂不提供 provider**：context 是 web 包的东西。native 需要时自己包一层 context，或者直接用 `createStrings()` 工厂；core 不依赖 React state。

已知限制：`@types/react` 会全局声明 `Event`、`HTMLElement` 等的空壳类型，所以光靠 tsconfig 不带 DOM lib 拦不住它们，必须靠脚本。规则 3 的检查目前只扫 `packages/react`。
