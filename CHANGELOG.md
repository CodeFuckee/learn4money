# Changelog

本项目的所有重要变更记录在此文件。格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。

## [0.5.0] - 2026-11-04

### Added

- **经典主题改由 IBM Carbon 官方组件库 `@carbon/vue` 实现**：CvButton / CvTextInput / CvTile / CvList / CvModal（清空确认），IBM Plex Sans 字体随包内置、离线可用。
- 按主题切换组件树：经典 → Carbon 组件树，其余设计语言 → Vuetify 组件树；状态层（composables 单例）共享，切换无缝。
- 经典强调色改 Carbon 官方蓝（g100 `#4589ff` / blue-60 `#0f62fe`），themes.css 注入 Carbon design tokens（g100/g10 官方值全套，含 secondary/tertiary/danger/disabled 按钮）。

### Changed

- 新增 `vite.config.ts` 的 `carbonPrefixFix` 插件：桥接 `@carbon/vue` 3（渲染 `bx--` 前缀）与新版 `@carbon/styles`（`cds--`）的类前缀错配，token 变量 `--cds-` 不受影响。
- 新增 `src/carbon-vue.d.ts`（`@carbon/vue` 为无类型 UMD 包）。

## [0.4.0] - 2026-11-04

### Added

- 接入 **Vuetify 3.13**（Material Design 3 规范组件库）：Material 风格由组件库原生实现，自绘按钮/卡片/输入框/列表全部替换为 v-card / v-btn / v-text-field / v-btn-toggle / v-list / v-dialog；清空确认改用 v-dialog。
- 全部 8 套主题强调色统一为蓝色系（各设计语言官方蓝）：经典 `#60a5fa`/`#2563eb`、Material `#a5c8ff`/`#0061a4`、Apple `#0a84ff`/`#007aff`、Fluent `#4cc2ff`/`#005fb8`。
- 新增 `src/lib/palette.ts` 作为色板单一事实源；深色主题名补 `-dark` 后缀（`classic-dark` 等 8 名统一）。

### Fixed

- v-card 默认 padding 被 Vuetify 样式覆盖致内容贴边（双类名提权重修复）。
- v-btn 继承 M2 uppercase 遗产致主题按钮全大写；按钮内图标与文字无间距。

## [0.3.0] - 2026-11-04

### Added

- 全部设计语言新增浅色主题：4 设计语言 × 深/浅 = 8 套主题；主题切换器新增深/浅 toggle（Sun/Moon 图标），偏好持久化。
- GitHub Actions 自动部署 Pages（`.github/workflows/deploy.yml`）：push main → `npm ci` + `npm run build` → deploy-pages。

### Changed

- **重构：迁移至 Vue 3.5 + TypeScript（strict）+ Vite 7**：
  - 组件化拆分（ThemeSwitcher / WageSettings / TimerCard / StatsRow / RecordList）；
  - 计时状态机与主题偏好抽为 composables（模块级单例），纯函数抽至 `src/lib/`；
  - 图标从 Lucide UMD 全量包（375KB）改为 lucide-vue-next 官方组件按需引入，构建产物 gzip 31KB；
  - 构建含 `vue-tsc --noEmit` 类型检查门禁。
- 部署方式从「Pages 直接服务 main 分支静态文件」改为「Actions 构建后部署 dist」，站点基路径 `/learn4money/`。

## [0.2.0] - 2026-11-04

### Added

- 多设计语言主题：顶栏主题切换器（经典 / Material / Apple / Fluent），选择持久化到 localStorage，刷新保持。
  - 经典 = 原深色绿光风格（默认），完整保留；
  - Material：Material Design 3（Material You 深色）——surface 层次、24px 大圆角、pill 按钮、Roboto、elevation；
  - Apple：iOS 深色分组样式——纯黑背景、#1C1C1E 分组卡片、systemGreen、胶囊按钮；
  - Fluent：Windows 11 深色——#202020/#2B2B2B + 1px subtle stroke、4px 控件圆角、Segoe UI、accent 蓝。

### Changed

- 样式重构为 CSS design tokens 架构：全部颜色/圆角/字体/阴影收敛为 `styles.css` `:root` 变量；三套新主题经 `themes.css` 按 `body[data-theme]` 覆盖同名 tokens，结构与交互单份维护。

### Fixed

- Fluent 主题下工资输入框溢出卡片：number input 固有宽度随字体回退（Segoe UI→system-ui）变化，撑爆 `.wage-input-wrap` 的 automatic minimum size（flex `min-width:auto`）——补 `min-width: 0` 修复。

## [0.1.1] - 2026-11-04

### Changed

- 页面所有 emoji 图标（📚/⚙️/📋/🚀）替换为第三方图标库 Lucide（v0.548.0，ISC 许可），并同步为控制按钮（播放/暂停/停止）与「清空」按钮补充同风格图标，全站图标风格统一。
- 图标库文件本地内置于 `vendor/lucide.min.js`，不依赖运行时 CDN，离线可用。

## [0.1.0] - 2026-11-04

### Added

- 学习挣钱看板首个版本：
  - 工资设置（月薪 / 时薪双口径，月薪按 21.75 天 × 8 小时折算时薪）；
  - 开始 / 暂停 / 结束计时，实时显示本次已挣金额与已学习时长；
  - 今日收入、今日学习时长、累计收入统计；
  - 学习记录列表与一键清空；
  - localStorage 持久化，刷新/休眠后计时基于时间戳恢复，不丢时长。
