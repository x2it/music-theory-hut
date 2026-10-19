# 乐理小屋 · Music Theory Hut

> 一个免费、开源的在线音乐理论学习平台。让每个人都有机会学习乐理知识。
>
> 当前版本：**v1.0.0**（站点版本号，代码内无独立版本常量）

**Music Theory Hut** is a free, open-source online platform for learning music theory: interval / chord / scale calculators, tutorials, and an AI Q&A assistant — all running client-side in the browser, zero backend, installable PWA.

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/language-HTML%2FCSS%2FJS-orange.svg" alt="HTML/CSS/JS">
  <img src="https://img.shields.io/badge/platform-Web-green.svg" alt="Web">
  <img src="https://img.shields.io/badge/中文-支持-brightgreen.svg" alt="中文">
  <img src="https://img.shields.io/badge/version-v1.0.0-blue.svg" alt="version v1.0.0">
</p>

<img src="https://raw.githubusercontent.com/x2it/music-theory-hut/main/banner.png" alt="乐理小屋 · Music Theory Hut" width="100%">

---

## 项目简介

**乐理小屋**是一个面向音乐爱好者和学习者的免费在线工具平台，提供乐理计算、知识问答、教程学习等一站式服务。

无论你是音乐初学者、艺考生、编曲爱好者，还是音乐教师，都可以在这里找到需要的工具和资源。

> 本项目**完全免费、开源**，欢迎任何人使用、修改和贡献。

---

## 在线体验

**Demo 地址**：[https://app-e3liw7mkzu9t.miaoda.online](https://app-e3liw7mkzu9t.miaoda.online)

> 提示：本项目为纯前端应用，下载后双击 `index.html` 即可在浏览器中运行，无需服务器。

---

## 功能特性

### 1. 乐理工具箱

| 工具 | 功能 | 状态 |
|------|------|------|
| **音程计算器** | 输入两个音符，即时显示音程名称、缩写、半音数与协和度分析 | ✅ 已实现 |
| **和弦查询器** | 选择根音与和弦类型，查看构成音、转位与性质说明 | ✅ 已实现 |
| **调式生成器** | 12种调式任选，生成完整音阶与级数名称 | ✅ 已实现 |

### 2. 教程中心

- 乐理基础教程（识谱、音程、和弦）
- 编曲制作教程（Cubase、混音、母带）
- 声乐训练教程（发声、视唱练耳）
- 支持分类筛选与搜索

### 3. AI 音乐问答助手

- 内置 20+ 音乐知识问答库
- 支持自然语言提问
- 可扩展接入大模型 API（OpenAI / Claude / 文心一言等）

### 4. 支持页面

- 多种付费支持方案（请喝咖啡 / 月度支持 / 年度赞助）
- 可接入爱发电、微信支付等平台
- 支持者名单展示

---

## 技术架构

```
纯前端单页应用 (SPA)
├── HTML5          页面结构
├── CSS3           响应式样式 (Flexbox + Grid)
├── JavaScript     业务逻辑与交互
└── 无后端依赖    零服务器成本
```

**核心特点**：
- 零依赖、零构建、零配置
- 响应式设计，适配手机/平板/桌面
- 所有计算在浏览器本地完成，无需联网
- 支持 PWA（渐进式 Web 应用），可安装到桌面

---

## 快速开始

### 方法一：直接打开（最简单）

1. 下载本项目的 ZIP 文件
2. 解压到任意文件夹
3. 双击 `index.html` 文件
4. 浏览器自动打开，即可使用

### 方法二：本地服务器（推荐开发时）

```bash
# 使用 Python 内置服务器
cd music-theory-hut
python3 -m http.server 8080

# 或使用 Node.js
npx serve .

# 然后访问 http://localhost:8080
```

### 方法三：部署到免费托管平台

| 平台 | 部署方式 | 费用 |
|------|---------|------|
| **GitHub Pages** | 推送代码到 GitHub，开启 Pages | 免费 |
| **Vercel** | 连接 GitHub 仓库自动部署 | 免费 |
| **Netlify** | 拖拽上传或连接 GitHub | 免费 |
| **Cloudflare Pages** | 连接 GitHub 自动部署 | 免费 |

---

## 项目结构

```
music-theory-hut/
├── index.html              # 主入口页面
├── style.css               # 全局样式（现代简洁风格）
├── app.js                  # 核心交互逻辑
├── README.md               # 本文件
├── LICENSE                 # MIT 许可证
└── images/                 # 图标与截图（可选）
    ├── screenshot-home.png
    ├── screenshot-tools.png
    └── screenshot-chat.png
```

---

## 截图预览

> 提示：添加截图后替换以下占位符

| 首页 | 工具箱 | AI助手 |
|------|--------|--------|
| [截图占位] | [截图占位] | [截图占位] |

---

## 扩展与定制

### 接入真实 AI 问答

当前 AI 助手基于内置知识库（关键词匹配）。要接入大模型 API：

1. 注册 OpenAI / Claude / 文心一言 / 通义千问等 API
2. 在 `app.js` 中替换 `findBestAnswer()` 函数：

```javascript
async function queryAI(question) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '你是一个专业的音乐理论老师。' },
        { role: 'user', content: question }
      ]
    })
  });
  return response.json();
}
```

> ⚠️ **安全提示**：API Key 不要硬编码在代码中，应通过环境变量或后端代理处理。

### 接入支付

本项目预留了支付页面框架，支持以下方式：

| 平台 | 难度 | 适用场景 |
|------|------|---------|
| **爱发电** | 低 | 中文用户，"请喝咖啡"模式 |
| **Ko-fi** | 低 | 国际用户 |
| **微信支付** | 高 | 需要企业资质 |
| **Stripe** | 中 | 国际信用卡支付 |

### 添加新工具

在 `app.js` 的 `TOOLS` 对象中添加新的乐理工具：

```javascript
const TOOLS = {
  interval: { /* 现有音程计算器 */ },
  chord: { /* 现有和弦查询器 */ },
  scale: { /* 现有调式生成器 */ },
  // 添加新工具
  rhythm: {
    name: '节奏计算器',
    calculate: () => { /* 你的逻辑 */ }
  }
};
```

---

## 贡献指南

### 如何贡献

我们欢迎任何形式的贡献！

- **报告 Bug**：在 Issues 中描述问题，附上复现步骤
- **提出建议**：在 Issues 中分享你的想法
- **提交代码**：Fork → 修改 → Pull Request
- **翻译内容**：帮助将教程翻译成其他语言
- **分享推广**：把乐理小屋推荐给需要的人

### 贡献者名单

感谢以下朋友的贡献：

> 提示：首次贡献后，你的名字会出现在这里

---

## 开源协议

本项目采用 [MIT License](./LICENSE) 开源。

这意味着你可以：
- ✅ 自由使用（个人/商业均可）
- ✅ 自由修改
- ✅ 自由分发
- ✅ 闭源二次开发

唯一要求：在代码或文档中保留版权声明。

---

## 鸣谢

- 灵感来源：[Musicca](https://www.musicca.com)、[musictheory.net](https://www.musictheory.net)
- 图标：[Noto Emoji](https://fonts.google.com/noto/specimen/Noto+Emoji)
- 字体：[Noto Sans SC](https://fonts.google.com/noto/specimen/Noto+Sans+SC)

---

## 联系与反馈

| 渠道 | 链接 |
|------|------|
| GitHub Issues | [提交 Issue](https://github.com/x2it/music-theory-hut/issues) |
| 邮件 | support@w3b.pub |

---

<p align="center">
  <b>让音乐学习，触手可及。</b>
</p>

---

[MIT](LICENSE) © 2026 知行工作室 · [https://w3b.pub/](https://w3b.pub/) · support@w3b.pub
