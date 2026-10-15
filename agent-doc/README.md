# Agent Documentation

本目录存放面向 AI agent 的项目知识。根目录 [../AGENTS.md](../AGENTS.md) 是统一入口；这里的文档按任务主题拆分，避免每次加载全部内容。

## 使用方式

1. 先读 [../AGENTS.md](../AGENTS.md) 的规则与「Where to Look」。
2. 根据任务只读相关的主题文档。
3. 以当前源码、`tokens.json` 和生成脚本为最终事实；设计规范（`docs/spec/`）说明外观和意图。
4. 行为、命令或规则变化时，同步更新对应主题文档和本索引。

## 快速入口

| 任务 | 文档 |
| --- | --- |
| 了解包怎么分层、值怎么从 token 走到屏幕 | [architecture.md](architecture.md) |
| 加 / 改 token、palette、组件尺寸、对比度 | [tokens.md](tokens.md) |
| 写或改 web 组件；Panda、Base UI 的坑 | [web-components.md](web-components.md) |
| 写 native 组件；Tamagui config；web 写法怎么对应到 Tamagui | [native.md](native.md) |
| 决定一个 prop / 文案 / 逻辑放 core 还是平台包 | [core.md](core.md) |
| recipe 里怎么引用组件状态，不点名 Base UI | [headless.md](headless.md) |
| 验证改动：`pnpm check`、截图、像素和 CSS 比对 | [verification.md](verification.md) |
| 现在做到哪了、下一步、未决事项 | [plan.md](plan.md) |
| 某个组件移植时定下的 API / 行为决定 | [web-port-record.md](web-port-record.md) |
| 查本仓库的术语 | [glossary.md](glossary.md) |

## 文档边界

- `AGENTS.md`：入口、仓库规则、命令、设计不变量、主题索引。
- `agent-doc/` 正文：当前实现的可检索知识与坑。
- `agent-doc/plan.md`：计划与状态，状态只在这里维护。阶段完成后，结论写进对应的主题文档，本页只留一行和日期。
- `agent-doc/web-port-record.md`：Phase 0–1 的逐组件记录，英文原文归档，不再改写；按组件查阅。
- `docs/spec/`：设计规范（品牌手册 + 逐组件 spec），描述组件应该长什么样、怎么交互。和实现冲突时，先确认是哪边错了再改。
- `packages/*/README.md`：给使用这些包的人看的简介。
- 生成的文件（`packages/tokens/dist/`、`packages/react/styled-system/`）不是文档，也不手改。
