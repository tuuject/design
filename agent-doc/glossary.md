# 术语表

只收本仓库特有的术语。Panda、Base UI、Tamagui 自身的概念看它们的文档。

## 设计术语

| 术语 | 说明 |
| --- | --- |
| role token | 按用途命名的颜色（`surface`、`text-muted`、`action`、`border-control`），各带 light / dark 值。组件只用它 |
| 色阶 / scale step | `primary-50`…`primary-950` 这类调色板档位。组件不直接用，只给 role token 引用 |
| palette | 一组可替换的 `primary-*` + `accent-*` 色阶。内置 `koi`（默认，天蓝 + 琥珀）和 `rose` |
| control 尺寸 | 控件三档高度：`control-sm` 28 / `control-md` 36 / `control-lg` 44；同一行的组件用同一档 |
| pill / rounded | 按钮默认 rounded（`radius-lg`，8px），`shape="pill"` 是 `radius-full`；tab、tag、Switch 永远是 pill |
| 同心圆角 | 外框圆角 = 内部元素圆角 + 间距。Dialog 32 = footer 按钮 8 + padding 24 |
| glass / 毛玻璃 | `surface-glass` / `surface-glass-tint` 加 `blur-panel` / `blur-float`；深色模式的颜色跟随 palette |
| press ripple | Button 按下时的 box-shadow 波纹，最后淡到消失；不算“阴影”，按钮规则仍是不用阴影 |
| spring | Koi 的弹性缓动曲线（会稍微冲过头），用于会移动的东西；贴视口边缘滑入的抽屉改用 `out` |
| legacy | `reference/legacy-web/` 里的旧实现（React 18 + 手写 CSS），冻结，只读参考 |

## 代码术语

| 术语 | 说明 |
| --- | --- |
| recipe / slot recipe | Panda 的组件样式定义；slot recipe 一次给多个部件出 class（`root`、`control`…） |
| headless adapter | `packages/react/src/recipes/headless.ts`，唯一知道 Base UI 的样式文件，提供 `state.*` / `vars.*`（[headless.md](headless.md)） |
| `<Name>OwnProps` | `@koi/core` 里与平台无关的组件 props；平台包的 `<Name>Props` 建立在它上面（[core.md](core.md)） |
| `ChangeDetails<E>` | Koi 的 change callback 第二参数：`reason`、`event`、`cancel()`；`E` 是平台事件类型 |
| `strings` | `@koi/core` 里组件自带的全部中文文案 |
| component 组 / `components` | `tokens.json` 里每个组件自己的尺寸；生成到 `@koi/tokens/dimensions` 的 `components`（[tokens.md](tokens.md)） |
| `toPx()` | recipe 里把尺寸数字写成 Panda 任意值：`toPx(16)` → `'[16px]'` |
| `koi-web-only` | 行尾注释标记：只属于 web 的字面尺寸，允许留在源码里 |
| `koi-allow-headless` / `koi-allow-core` | 对应检查的例外标记，必须写理由 |
| `ShapeProvider` | 容器给内部按钮指定默认形状（整页包 pill → 博客风格；Dialog footer、TableCell → rounded） |
| shots | `pnpm shots` 产出的 story 截图，用于视觉检查和像素比对（[verification.md](verification.md)） |
| `createKoiConfig()` | `@koi/native` 从 tokens 生成 Tamagui config 的函数（[native.md](native.md)） |

## 消费方

| 名字 | 说明 |
| --- | --- |
| Bilisound | tcdw 的 Expo 音视频客户端，Koi native 版的第一个消费方。下一个大版本 `apps/mobile-next` 用 Tamagui；接入 Koi 暂缓，记录在 Bilisound 仓库的 `agent-doc/v3-plan/koi-design-system.md` |
| Koi blog | Koi 的起源：tcdw 的 Astro 博客主题（GitHub `tcdw/koi`），`tokens.json` 的 `meta` 记录了同步来源 |
