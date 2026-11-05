# Admin Electron：Windows 版 handoff

> 状态：未开始，进度只在 [../plan.md](../plan.md) 维护。
> 创建：2026-11-05
> 分支：从 `feature/admin-panel-electron` 继续（macOS 版在 `5275d6b`）
> 关联：[../admin.md](../admin.md) 的「安全区」「Electron 壳」两条（已实现的部分以那里和源码为准）

本页写给在 Windows 机器上接手的 agent。macOS 版已经实现、实测过；Windows 版一行代码都还没写，下面标「待实测」的内容都是推断，动手前先在真机上确认。

## 已经有的（不用重做）

- **安全区变量**：`apps/admin/src/index.css` 把 `env(titlebar-area-*)` 映射成 `--app-titlebar-height`、`--app-titlebar-inset-left`、`--app-titlebar-inset-right`，`shared.ts` 导出对应常量。Windows 的标题栏按钮在右边，overlay 报出的区域是 x = 0、width = 视口宽 − 按钮宽，所以 `inset-right` 会是按钮宽、`inset-left` 是 0。
- **右侧避让已经写好**：`TOP_ROW_CLEAR_RIGHT` = `max(右安全区, inset-right + 8px)`，顶栏第一行右侧（主题切换、布局切换、用户菜单）会让开按钮；登录页右上角的主题切换也读同一组变量。导航行、正文、侧边栏不受右侧控件影响（`SIDEBAR_TITLEBAR_STRIP` 只看 `inset-left`，在 Windows 上是 0）。这些在 macOS 上没被真实 overlay 走过，只在浏览器里用 `--app-titlebar-inset-right: 138px` 模拟验证过。
- **拖拽区**：`[data-app-region="drag"]` 标在 sticky 头部块、侧边栏顶部条带（Windows 上高 0）、登录页顶部条带上；控件和 portal 出去的浮层全局 `no-drag`；md 以下抽屉打开时头部不拖。这套规则与平台无关。
- **`main.ts` 里与平台无关的部分**：`app://admin/` 协议（含 SPA fallback、越界防护）、外链交给系统浏览器、`show: false` + `ready-to-show`、`backgroundColor` 取 tokens 的 `page-bg`、dev 模式连不上时的提示。
- **命令**：`pnpm dev:admin:electron`、`pnpm --filter admin electron:preview` 在 Windows 上应当照样能用（`scripts/dev-server.mjs` 是纯 Node；`electron electron/main.ts` 靠 Electron 自带 Node 的 type stripping），第一次跑时确认一下。

## 要做的

1. **`main.ts` 加 win32 分支**。现在是 `...(mac && { … })`，其它平台保留系统边框。Windows 用 `titleBarStyle: 'hidden'` + `titleBarOverlay: { color, symbolColor, height: HEADER_HEIGHT }`。文件头注释、`index.css` 和 `shared.ts` 里「Other platforms keep the system frame」之类的说法跟着改。Linux 仍不动（平铺 WM 如 Hyprland 下怎么处理还没定）。
2. **按钮颜色跟页面主题走**。macOS 的红绿灯不用管颜色，Windows 的 `color` / `symbolColor` 要自己给，而且页面可以手动切主题（`koiSetTheme`，写 `<html data-theme>` 和 localStorage `koi-theme`），所以要在运行时调 `win.setTitleBarOverlay()`。
   - **建议**：`color` 用透明（Electron 文档说 `#RRGGBBAA` / `rgba()` 支持透明），让下面的头部 `surface`（登录页是 `page-bg`）透出来，只同步 `symbolColor`（取 `@tuuject/koi-tokens/native` 的 `colors[theme].text`）。透明底下 hover / 按下的底色是否还看得见、关闭按钮的红色 hover 是否正常，**待实测**；不行就退回 `color` = `surface`，那就要连底色一起同步。
   - **主题从哪来**：建议加一个 preload，在 preload 里用 `MutationObserver` 盯 `<html data-theme>`（和 `hooks/use-theme.ts` 同一个思路，任何写入方都能看到），变化时经 `ipcRenderer` 发给主进程；主进程收到后 `setTitleBarOverlay({ symbolColor })`，顺手 `win.setBackgroundColor(page-bg)`。这样页面代码不知道自己在 Electron 里，也顺带修掉 macOS 上「手动主题和系统主题相反时，resize 露底是系统色」的问题。不要用页面主题去改 `nativeTheme.themeSource`：页面跟随系统时读的就是它，会互相影响。
   - **preload 的格式**：Electron 默认 sandbox 渲染进程，sandbox 下的 preload 不经过 Node 的模块加载，`.ts` 的 type stripping 大概率不生效（**待实测**）。稳妥的做法是写成 `electron/preload.cjs`，`webPreferences.preload` 指过去；需要 `contextBridge` 时也只暴露最小接口。
3. **高度**：先沿用 `HEADER_HEIGHT`（52），按钮会和头部第一行等高。Windows 的按钮宽度固定、高度跟 overlay 走，52 高的按钮看起来会不会太大，截图后再定；要改的话，`titleBarOverlay.height` 小于 52 时，顶栏第一行仍按 `inset-right` 整行让位，布局不用动。
4. **菜单栏**：Electron 在 Windows 上默认有一条应用菜单。标题栏隐藏后按 Alt 会不会冒出菜单栏，**待实测**；会的话用 `autoHideMenuBar` 或只在 win32 上 `Menu.setApplicationMenu(null)`（后者会连 Ctrl+R、Ctrl+Shift+I 等快捷键一起去掉，dev 模式下要留着）。
5. **侧边栏顶部**：Windows 上侧边栏从窗口顶边开始，品牌行不是拖拽区，用户只能拖右边的头部。Windows 用户习惯整条顶边都能拖，考虑给侧边栏品牌行（`Brand` 是 `div`，不是链接）所在的那一行也标 `data-app-region="drag"`。macOS 上它在顶部条带下面，加不加都不影响。

## 待实测的风险

- **经典滚动条和 `100vw`**：Windows 默认是占宽度的经典滚动条。`--app-titlebar-inset-right` 用 `100vw − x − width` 算，`100vw` 包含滚动条，而头部的 padding 是从内容区右边（滚动条左边）量的，所以右侧可能多让出一个滚动条宽（约 15 到 17px）。量一下顶栏最后一个控件右边缘到按钮左边缘的实际距离，应该是 8px。如果多了，改成用 `document.documentElement.clientWidth` 的等价写法，或者在 CSS 里减掉滚动条宽。
- **滚动条顶端被按钮盖住**：文档滚动条的上端 52px 在按钮下面（admin.md「已知未覆盖」里记过）。可选：接受；把 `main` 改成内部滚动容器（影响 sticky、`--app-header-offset`、SectionedForm 的 scrollspy 和跳转，改动面大）；或者试 Chromium 的 Fluent overlay 滚动条（`app.commandLine.appendSwitch('enable-features', …)`，特性名和在 Electron 45 / Chrome 156 里是否可用都要查）。先截图看严重程度，再和用户商量。
- **DPI 缩放**：在 100%、125%、150% 下看 overlay 报的 CSS 像素、按钮的视觉对齐、`setTitleBarOverlay` 的 `height` 是否按 DIP 解释。
- **系统行为**：拖拽区双击最大化、右键出系统菜单、Win11 悬停最大化按钮出 Snap Layouts、Aero Snap 拖到屏幕边、最大化后窗口顶边没有被裁掉一截。
- **全屏 / 最大化**：macOS 全屏时 overlay 不可见、变量回落到 0。Windows 的 `setFullScreen(true)` 下按钮是否隐藏、变量是否归零，最大化时 overlay 尺寸有没有变化。
- **协议在 Windows 路径下**：`join(DIST, path)` 会把 `/` 换成 `\`，`startsWith(DIST + sep)` 仍应成立。补测 `%5C`（反斜杠）形式的越界：`/..%5Cpackage.json` 应该 404。

## 验证方法

macOS 版的验证脚本放在 `.temp/`（不进仓库），这里给要点，Windows 上照着重写一份放进 `.temp/electron/`：

- 用 storybook 那份 playwright：`createRequire('<repo>/apps/storybook/package.json')('playwright')._electron`。
- Electron 可执行文件别写死路径：`createRequire('<repo>/apps/admin/package.json')('electron')` 返回的就是当前平台的二进制路径。`launch({ executablePath, args: ['electron/main.ts', '--dev'], cwd: '<repo>/apps/admin' })`。
- dev 模式先 `pnpm dev:admin:status`；用户自己开着的 dev server 不准 kill 或重启（AGENTS.md）。prod 模式先 `pnpm --filter admin build`。
- 用 localStorage 设状态再跳路由：`koi-admin-auth`（`{ state: { user: { name, email, role: 'admin' } }, version: 0 }`）、`koi-admin-ui`（`{ state: { sidebarCollapsed, navLayout }, version: 0 }`）、`koi-theme`（`light` / `dark`）。
- 主进程里 `BrowserWindow.getAllWindows()[0].setContentSize(w, h)` 切宽度；页面里 `navigator.windowControlsOverlay.getTitlebarAreaRect()` 读真实 overlay，加载后要等几百毫秒才有值。
- macOS 跑过的场景：竖版 1440、折叠栏 1280、横版 1280 / 1600、700 宽、700 宽开抽屉、登录页 1280，外加全屏开关。每个场景量 overlay、`aside`、头部块的 rect 和 `-webkit-app-region`、顶栏第一行的 padding、最后一个可见控件的 rect、`body` 下除 `#root` 外的子元素（应只有 0 高的 toast viewport）、是否有横向滚动。
- 截图：`page.screenshot()` 只截网页内容，看不到标题栏按钮。macOS 用 `screencapture -l<窗口 id>`；Windows 上**待选**，比如用 `win.getBounds()` 拿窗口位置，再用 PowerShell 的 `System.Drawing.Graphics.CopyFromScreen` 截那块屏幕（窗口要在最前、没被挡住）。截图必须人工看过。
- 收尾：`pnpm check`，`./node_modules/.bin/biome lint .` 和 `biome format .`（`pnpm lint` 在某些环境下会报找不到 eslint，直接调 biome）。

## 验收

- 浅色、深色下，Windows 的标题栏按钮与头部第一行垂直对齐，图标颜色和背景的对比度 ≥ 3:1；页面里切主题，按钮颜色立即跟着变，不用重启窗口。
- 上面列的场景里，顶栏右侧控件离按钮 8px，不被盖住；没有横向滚动；拖拽、双击最大化、Snap 正常；页面没有报错。
- 100% 和 150% 缩放各截一轮图。
- `agent-doc/admin.md` 的「Electron 壳」一条补上 Windows 的做法、实测数字和放弃的方案；`apps/admin/README.md` 和 `main.ts` 文件头去掉「Windows 保留系统边框」；本页状态改为完成，结论搬进 admin.md 后这里只留一行。

## 不在范围

- Linux（含平铺 WM）。
- 打包与签名（electron-builder / Forge）、自动更新。
- 库里 Toast 读安全区（另起一项）。
