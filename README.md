# AI 你画我猜网页游戏

一个基于Next.js和Gemini AI的在线你画我猜游戏。玩家可以在画布上作画，AI系统会分析画作并猜测画的是什么内容。

## 功能特点

- 🎨 在线绘图画布，支持调节画笔大小和颜色
- 🤖 AI智能识别，使用Gemini API分析手绘图像
- 🎯 游戏计分系统，猜对可获得10分
- 📱 响应式设计，支持移动端访问
- 🎮 简单易用的游戏界面

## 技术栈

- **前端框架**: Next.js 15 + React 18
- **样式**: Tailwind CSS
- **AI服务**: Google Gemini API
- **语言**: TypeScript

## 快速开始

### 1. 获取Gemini API密钥

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 创建新的API密钥
3. 复制密钥备用

### 2. 配置项目

```bash
# 克隆项目
git clone [项目地址]
cd ai-drawing-game

# 安装依赖
npm install

# 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 文件，添加你的GEMINI_API_KEY
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用

## 游戏玩法

1. **开始游戏**: 点击"开始游戏"按钮
2. **查看词汇**: 记住显示的词汇（3秒后自动隐藏）
3. **开始绘画**: 在画布上画出该词汇对应的物品
4. **AI猜测**: 点击"让AI猜测"按钮，等待AI分析
5. **查看结果**: 查看AI的猜测结果和正确答案
6. **继续游戏**: 点击"下一轮"继续游戏

## 项目结构

```
ai-drawing-game/
├── src/
│   ├── app/
│   │   ├── api/guess/route.ts    # Gemini API调用接口
│   │   ├── page.tsx              # 主游戏页面
│   │   └── layout.tsx            # 页面布局
│   ├── components/
│   │   └── DrawingCanvas.tsx     # 绘图画布组件
│   ├── lib/
│   │   └── gameLogic.ts          # 游戏逻辑
│   └── types/
│       └── game.ts               # TypeScript类型定义
├── .env.local                    # 环境变量配置
└── package.json
```

## 环境变量

在 `.env.local` 文件中配置以下变量：

```
GEMINI_API_KEY=your_gemini_api_key_here
```

## 部署

### 部署到Vercel

1. 推送代码到GitHub
2. 在Vercel中导入项目
3. 设置环境变量 `GEMINI_API_KEY`
4. 点击部署

### 其他平台

确保在部署环境中设置 `GEMINI_API_KEY` 环境变量，然后运行构建命令：

```bash
npm run build
npm start
```

## 注意事项

- 需要稳定的网络连接以调用Gemini API
- API调用可能产生费用，请查看Google的定价政策
- 建议使用现代浏览器以获得最佳体验

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！