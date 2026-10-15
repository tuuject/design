# 验证

本页记录本仓库特有的验证手段。通用命令见 [AGENTS.md](../AGENTS.md) 的 Commands 一节。仓库没有单元测试；正确性靠静态检查、截图和对比。

## `pnpm check`（提交前必须通过）

依次运行，任一步失败即停：

| 步骤 | 检查什么 | 失败时 |
| --- | --- | --- |
| `pnpm codegen` | tokens 构建 + Panda codegen；构建里还会用运行时 kit 交叉校验内置 palette | 看报错里的 token 名 |
| `pnpm contrast` | 每套内置 palette × 两种主题下的全部 contrast pair | 改 role 引用的色阶档位，或加 pair 时选对档位（[tokens.md](tokens.md)） |
| `check-raw-colors.mjs` | 组件源码里的字面颜色 | 换成 role token |
| `check-raw-sizes.mjs` | 组件源码里的字面尺寸（`Npx`、`size={N}`、`sideOffset={N}`…） | 换成 token；web 专属的加 `// koi-web-only: <原因>` |
| `check-headless.mjs` | recipe 里的 Base UI 选择器 / 变量；公开 props 里的 Base UI 类型 | [headless.md](headless.md) |
| `check-core.mjs` | core 里的平台类型和导入；web 的 `<Name>Props` 是否建立在 `<Name>OwnProps` 上 | [core.md](core.md) |
| `pnpm typecheck` | 全部包的 tsc；tokens 包还会重跑构建和对比度检查 | |

已知盲区：`check-raw-sizes.mjs` 只认 `Npx` 和几种 JSX 数值属性，对象字面量里的裸数字（如 `{ sm: 16 }`）抓不到，review 时要留意。

## 视觉验证

- `pnpm shots [组件…]`：截每个 story 的浅色和深色，存到 `apps/storybook/shots/<组件>-<Story>_<主题>.png`。会自己启动 Storybook（端口 6199），跑完自动关闭。末尾打印 `No console errors.` 才算干净。
- `KOI_PALETTE=rose pnpm shots`、`KOI_FONT=chill pnpm shots`：其它配色 / 字体，文件名带后缀。
- 任何视觉改动之后都要**真的打开 PNG 看**，不能只看命令有没有报错。

### 像素比对（重构必须做）

重构应当不改变外观。做法：

1. 在改动之前，用当前 HEAD 截一套基线，复制到 `.temp/shots-base/`。代码已经改了的话，先 `git stash push -u` 截基线再 `git stash pop`，或用 `git worktree` 在临时目录里截。
2. 改动后重新 `pnpm shots`，逐张比较：`compare -metric AE <基线> <新图> null:`（ImageMagick；输出 0 表示逐像素相同）。
3. 有差异时：`compare … -compose src <diff.png>`，再 `magick <diff.png> -trim info:` 定位差异区域。

**已知会抖动的截图**（同一份代码连截两次也会不同，因为截图时动画还在跑）：`Spinner-*`、`Button-Shape-and-size_*`（里面有 loading spinner）、`Tabs-Example_*`（指示条在滑动）。只有这些出现小差异时视为通过；其它任何一张有差异都要解释清楚。

### CSS 比对

改 recipe 或 tokens、预期 CSS 不变或只有局部变化时：

```sh
npx panda cssgen --outfile .temp/before.css   # 改动前
npx panda cssgen --outfile .temp/after.css    # 改动后
cmp .temp/before.css .temp/after.css
```

有差异时按 `;` 拆行、排序后再 diff，只看真正变化的声明。`packages/tokens/dist/` 不进 git，要比较生成物，同样在改动前后各构建一次。

## Native 验证

目前还没有 Expo 应用，所以只能在 Node 里验证 config：在 `packages/native` 下写个临时脚本，用 `npx tsx <脚本>` 运行，检查 `koiConfig.themes` 的名字和 key 数量、几个颜色和 token 的取值，以及 `koiConfig.getCSS()` 生成的变量。有了 Expo 应用以后（[plan.md](plan.md)）：

- web 版 Storybook（react-native-web）截图，和 `@koi/react` 同名 story 逐像素比对，确认两种渲染一致；
- iOS 模拟器 / Android 真机检查：毛玻璃、阴影、字体、按压反馈这些 web 截图看不出来的东西。

## 结果记录

最终回复要区分三类结果：

- **已通过**：例如“`pnpm check` 全部通过；全量截图逐像素比对，只有已知会抖动的几张有差异”。
- **已执行但被既有问题阻塞**：写出具体错误，并说明它和本次改动无关。
- **未执行**：说明原因，不要写成通过。
