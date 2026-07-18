# Seen Zone Simulator / 已读不回模拟器

> A useless but painfully accurate simulator for being left on read.  
> 一个专门模拟“已读不回”的社交焦虑网页玩具。

你发送了一条消息。  
对方正在输入。  
对方不输入了。  
对方已读了。  
世界安静了。  
你开始反思人生。

---

## 这是什么？

**Seen Zone Simulator / 已读不回模拟器** 是一个把“已读不回焦虑”具象化的互动网页玩具。

它不提供回复。  
它只精准复现那些让人抓狂的聊天瞬间。

适合：

- 整蛊朋友
- 治疗自己的已读不回焦虑
- 做 vibecoding showcase
- 开源二创
- 收集荒诞社交文案

---

## 核心体验

```txt
你：在吗？

对方正在输入...

3 秒后消失

对方已读

没有任何回复

你开始脑补。
```

偶尔还会发生：

```txt
对方正在输入...
对方撤回了一条消息
世界再次安静。
```

---

## Features

- 自定义对方姓名
- 多种关系模式
  - 暧昧对象
  - 前任
  - 老板
  - 甲方
  - 朋友
- 模拟“正在输入...”
- 模拟“已读不回”
- 随机撤回消息
- 焦虑指数实时增长
- 深夜焦虑加成
- 生成“已读不回报告”
- 一键复制报告文案
- 移动端适配
- GitHub Actions 自动部署到 GitHub Pages

---

## 截图占位

> TODO：部署后可以在这里放项目截图或 GIF。

```txt
┌─────────────────────────────┐
│ Seen Zone Simulator          │
│ 已读不回模拟器               │
├─────────────────────────────┤
│ 你：在吗？                   │
│ 对方正在输入...              │
│ 对方已读                     │
│ 焦虑指数：87%                │
└─────────────────────────────┘
```

---

## 技术栈

- [Vite](https://vite.dev/)
- [React](https://react.dev/)
- TypeScript
- CSS 动效
- GitHub Actions
- GitHub Pages

---

## 本地运行

```bash
npm install
npm run dev
```

然后打开终端输出的本地地址。

---

## 构建

```bash
npm run build
npm run preview
```

---

## 部署到 GitHub Pages

项目已经内置 GitHub Actions：

```txt
.github/workflows/deploy.yml
```

默认部署分支：

```txt
master
```

默认仓库名：

```txt
Seen-Zone-Simulator
```

如果你的仓库名不同，请修改 `vite.config.ts`：

```ts
base: "/你的仓库名/"
```

然后在 GitHub 仓库中开启：

```txt
Settings → Pages → Build and deployment → Source: GitHub Actions
```

推送到 `master` 后即可自动部署。

---

## 项目结构

```txt
seen-zone-simulator/
├─ .github/workflows/deploy.yml
├─ public/
│  └─ favicon.svg
├─ src/
│  ├─ components/
│  │  ├─ AnxietyMeter.tsx
│  │  ├─ MessageBubble.tsx
│  │  ├─ RelationshipSelector.tsx
│  │  ├─ ReportCard.tsx
│  │  └─ TypingIndicator.tsx
│  ├─ data/
│  │  ├─ copy.ts
│  │  └─ relationshipModes.ts
│  ├─ hooks/
│  │  └─ useChatSimulator.ts
│  ├─ lib/
│  │  └─ random.ts
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ styles.css
├─ CHANGELOG.md
├─ CONTRIBUTING.md
├─ LICENSE
├─ PROJECT_LOG.md
├─ ROADMAP.md
├─ package.json
└─ vite.config.ts
```

---

## 文案贡献

这个项目非常适合社区贡献文案。

你可以贡献：

- 新关系模式
- 新撤回消息
- 新破防提示
- 新报告结论
- 新主题皮肤

文案主要在：

```txt
src/data/relationshipModes.ts
src/data/copy.ts
```

---

## 路线图

查看：

```txt
ROADMAP.md
```

近期重点：

- 分享海报导出
- 更多随机事件
- 更多关系模式
- 音效系统
- 主题皮肤

---

## 变更记录

查看：

```txt
CHANGELOG.md
```

---

## 免责声明

这个项目不鼓励真实冷暴力，也不用于严肃心理诊断。

它只是一个荒诞网页玩具：

> 把社交焦虑放进聊天框里，然后让它显得没那么可怕。

如果你真的因为“已读不回”感到难受，建议先放下手机，喝口水，去睡觉，或者找一个真正会回复你的人聊聊。

---

## License

MIT
