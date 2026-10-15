# Core：各平台共享的部分

`@koi/core`（`packages/core`）是每个组件与平台无关的部分，让 web 包和 native 包实现的是同一个 Koi，而不是两个逐渐分叉的版本。tokens 通过 `@koi/tokens` 共享；core 管 tokens 管不到的东西。

| 放进 `@koi/core` | 留在平台包里 |
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
4. **文案来自 `strings`。** 组件里不写中文字符串字面量；把字符串加进 `packages/core/src/strings.ts`（简体中文，不用 emoji），然后用 `strings.close`。
5. **平台包重新导出它们原来拥有的 core 类型**（`ButtonColor`、`RadioOption`、`SelectOption`…），从组件文件里导出，所以 `@koi/react/button` 依旧能导出它们。

`pnpm check` 用 `scripts/check-core.mjs` 强制规则 1–3（`pnpm typecheck` 也会在不带 DOM lib 的情况下编译 core）。确实需要例外的行加 `// koi-allow-core` 和理由。

已知限制：`@types/react` 会全局声明 `Event`、`HTMLElement` 等的空壳类型，所以光靠 tsconfig 不带 DOM lib 拦不住它们，必须靠脚本。规则 3 的检查目前只扫 `packages/react`。
