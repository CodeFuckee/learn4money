# Changelog

本项目的所有重要变更记录在此文件。格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。

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
