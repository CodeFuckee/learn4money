# learn4money · 学习挣钱看板

一个把学习时间换算成「挣到多少钱」的激励看板：设置工资 → 点击开始 → 金额随时间实时增长 → 点击结束停止记录。

## 功能

- **工资设置**：支持 月薪 / 时薪 两种口径；月薪按中国劳动法计薪口径折算（21.75 天/月 × 8 小时/天），页面实时显示折算时薪与每秒收入。
- **开始 / 暂停 / 结束**：
  - 开始后实时显示「本次已挣金额」与「已学习时长」；
  - 暂停可中途休息，金额与时长同步冻结；
  - 结束停止计时，并把本次会话写入学习记录。
- **统计**：今日收入、今日学习时长、累计收入（含进行中的会话）。
- **学习记录**：最近的会话列表（时间、时长、金额），可一键清空。
- **刷新不丢**：设置、进行中的会话、历史记录均存 localStorage；计时基于时间戳重算，页面刷新或电脑休眠后金额依然准确。
- **八套主题**（4 设计语言 × 深/浅，顶栏切换、偏好持久化），**强调色统一为蓝色系**（各语言官方蓝）：
  - **经典**——由 **IBM Carbon** 官方组件库（`@carbon/vue`）实现：深色 g100 / 浅色 g10 色板、IBM Plex Sans 字体、Carbon 按钮与模态（默认）；
  - **Material**——由 **Vuetify 3**（Material Design 3 规范组件库）原生实现：深 `#141218` / 浅 `#fef7ff`，pill 按钮、elevation；
  - **Apple**——iOS 分组样式：深纯黑 / 浅 `#f2f2f7`，systemGreen、胶囊按钮；
  - **Fluent**——Windows 11：深 `#202020` / 浅 `#f3f3f3`，1px subtle stroke、4px 控件圆角、Segoe UI、accent 蓝。
- 不足 1 秒的会话视为瞬时双击，不入记录（会给出「未计入」提示）。

## 运行

**在线访问**（GitHub Pages，push main 自动部署）：https://codefuckee.github.io/learn4money/

本地开发：

```bash
npm install
npm run dev        # 开发服务器（0.0.0.0:5173）
npm run build      # 类型检查（vue-tsc）+ 构建到 dist/
npm run preview    # 预览构建产物（0.0.0.0:4173）
```

## 技术栈与架构

- **Vue 3.5**（`<script setup lang="ts">` 组合式 API）+ **TypeScript strict** + **Vite 7** + **双设计系统组件库**：**Vuetify 3**（Material Design，v-card/v-btn/v-text-field/v-btn-toggle/v-list/v-dialog）+ **@carbon/vue**（IBM Carbon，经典主题 CvButton/CvTextInput/CvTile/CvList/CvModal）。
- **按主题切换组件树**：经典 → Carbon 树，其余 → Vuetify 树；计时/主题状态在 composables 单例中，两棵树无缝共享。
- 主题色板单一事实源 `src/lib/palette.ts`：8 套主题（`classic-dark` 等 8 名）同步驱动 Vuetify 命名主题与 `body[data-theme]` CSS 层。
- **@carbon/vue 前缀桥接**：`@carbon/vue` 3 渲染旧类前缀 `bx--`，新版 `@carbon/styles` 为 `cds--`——`vite.config.ts` 的 `carbonPrefixFix` 插件在构建时统一 CSS 类前缀；Carbon design tokens（g100/g10 官方值）在 `themes.css` 经典块注入。
- 组件：`src/components/`（ThemeSwitcher / WageSettings / TimerCard / StatsRow / RecordList）。
- 核心逻辑：`src/composables/useTimer.ts`（计时状态机模块级单例）、`useTheme.ts`（主题偏好）；纯函数在 `src/lib/`（types / storage / format / wage）。
- **主题架构**：全部颜色/圆角/字体/阴影收敛为 CSS design tokens（`src/styles/base.css` 的 `:root` = 经典深色）；其余 7 套主题经 `src/styles/themes.css` 按 `body[data-theme]` 覆盖同名 tokens——结构与交互只有一份，换肤纯声明式。
- 图标：[lucide-vue-next](https://lucide.dev)（ISC 许可）官方 Vue 组件，按需 tree-shake；库加载失败不影响功能。
- GitHub Pages 经 `.github/workflows/deploy.yml` 自动构建部署（`npm ci` → `npm run build` → deploy-pages），站点基路径 `/learn4money/`（`vite.config.ts` 的 `base`）。

## 数据说明

| localStorage key | 内容 |
| --- | --- |
| `l4m.settings` | `{mode: 'monthly'\|'hourly', monthly, hourly}` |
| `l4m.session` | 进行中会话 `{running, paused, startTs, pausedAccum, pausedAt}`，结束即删除 |
| `l4m.records` | 记录数组（新的在前）`{id, date, startIso, endIso, seconds, earned}` |
| `l4m.themeLang` / `l4m.themeMode` | 主题偏好：设计语言与深/浅模式 |
