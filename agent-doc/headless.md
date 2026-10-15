# Headless 层

Koi 自己画组件；headless 库提供行为和无障碍：web 端是 Base UI，native 端是 Tamagui 的 headless 包（如 `@tamagui/switch-headless`）。下面的规则让这个库保持可替换：将来换成 Kobalte 做 Solid 版，或 Base UI 升级大版本，都能复用 recipes 和 props API，而不必 fork。

## 三层

| 层 | 位置 | 能知道 headless 库吗？ |
| --- | --- | --- |
| Recipes 与全局样式 | `packages/react/src/recipes/*.ts`、`global-css.ts` | **不能**，只能经过 adapter |
| Adapter | `packages/react/src/recipes/headless.ts` | **能**，唯一知道的样式文件 |
| 组件 | `packages/react/src/<name>/*.tsx` | 能，用于行为；但公开 props 不能（规则 5） |

## 规则

1. **Recipe 不点名库的 DOM 约定。** 不写 `[data-…]` 选择器，不用库的 CSS 变量（`--anchor-width`、`--toast-index`…），也不用会顺带匹配 `data-*` 的 preset-base 条件：`_active` 既是 `:active` 又是 `[data-active]`，而 Base UI 把 `data-active` 加在当前 tab 上；`_selected`、`_open`、`_checked`、`_invalid`… 同理。改写 `headless.ts` 里的 `state.*` 和 `vars.*`：

   ```ts
   [`&${state.checked}` as const]: { bg: 'control-checked' },
   [`${state.popupOpen} > &` as const]: { transform: 'rotate(180deg)' },
   [`&${state.entering}, &${state.exiting}` as const]: { opacity: '0' },
   maxHeight: `min(${c.selectPanel.maxHeight}px, ${vars.availableHeight})`,
   ```

   可以原样写的：HTML 伪类（`:disabled`、`:focus-within`、原生 input 上的 `:checked`）；被样式化元素自身的 ARIA 属性（`[aria-invalid=true]`、`[aria-current=page]`、`[aria-pressed]`、`[aria-busy=true]`）；Koi 自己的属性和变量（`data-theme`、`data-font`、`data-palette`、`--koi-*`、Panda token 变量如 `--blurs-panel`）；以及用在原生元素上、只取其原生那一半含义的 `_hover`、`_focusVisible`、`_disabled`、`_placeholder`、`_empty`。

2. **状态按含义命名，不按属性命名。** Base UI 把当前 tab 标为 `data-active`，adapter 里叫 `state.selected`。含义相同就复用已有名字；不同就新加一个，并写 doc comment。

3. **记下 recipes 在属性之外依赖的东西。** 挂载时机（`entering` / `exiting` 与 transition）、永不重叠的状态（disabled 的控件不会被标 invalid）、tab 指示条在测量完成前保持隐藏。这些写在 `headless.ts` 顶部的清单里，新 adapter 才知道要提供什么。

4. **换库只改 `headless.ts`，不改 recipes。** 放宽选择器（`checked: ':is([data-checked], [data-kb-checked])'`），给变量串 fallback（`'var(--anchor-width, var(--kb-popper-anchor-width))'`）。如果新库根本给不出某个状态（Kobalte 没有 "entering" 标记），就由那个组件的 adapter 自己算出来、设一个 Koi 自有的属性（`data-koi-entering`），`headless.ts` 去选它。

5. **公开 props 是 Koi 的，不是库的。** 导出的 `…Props` 里，prop 类型、callback 参数、ref 目标都不能是库的类型（`BaseSwitch.Root.ChangeEventDetails`、`BaseTabs.Root.Props`；native 端同理不能是 Tamagui 的类型）。用 Koi 自己的：change callback 收 `ChangeDetails`（`reason`、`event`、`cancel()`；`@koi/core` 里是 `ChangeDetails<E>`，web 端是 `ChangeDetails<Event>`；Base UI 的对象本身就满足它，直接透传），props 用普通类型写出来，不写 `Pick<BaseSwitch.Root.Props, …>`。prop **名字**和 Base UI 一样（`inputRef`、`uncheckedValue`）没关系；组件函数体内部 cast 成库类型也没关系，那不是公开的。

`pnpm check` 用 `scripts/check-headless.mjs` 强制规则 1 和 5（规则 5 的判定：文件顶层的 `type` / `interface` 里不出现从 `@base-ui/react` 导入的名字）。确实需要例外的行加 `// koi-allow-headless` 和理由。规则 2–4 靠 review。

目前这个检查只扫 `packages/react/src`。`@koi/native` 有组件之后，规则 5 对 Tamagui 同样适用，届时把检查扩展过去。
