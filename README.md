# AI 你画我猜网页游戏

一个基于Next.js和硅基流动AI的在线你画我猜游戏。玩家可以在画布上作画，AI系统会分析画作并猜测画的是什么内容。

## 功能特点

- 🎨 **增强绘图画布**，支持调节画笔大小和颜色，900×600大尺寸画布
- 🧽 **橡皮擦功能**，一键切换橡皮擦/画笔模式
- ↶ **撤销功能**，支持单步回退操作，最多20步历史记录
- 🤖 **AI智能识别**，使用硅基流动API分析手绘图像
- 🎯 **游戏计分系统**，猜对可获得10分
- 📱 **响应式设计**，完美适配iPad、移动端和桌面端
- 🎮 **简单易用的游戏界面**，现代化UI设计

## 技术栈

- **前端框架**: Next.js 15 + React 19
- **样式**: Tailwind CSS 4
- **AI服务**: 硅基流动 API (Qwen3-VL-30B-A3B-Instruct)
- **语言**: TypeScript
- **构建工具**: Turbopack (Next.js内置)

## 快速开始

### 1. 获取硅基流动API密钥

1. 访问 [硅基流动官网](https://siliconflow.cn/)
2. 注册账号并获取API密钥
3. 复制密钥备用

### 2. 配置项目

```bash
# 克隆项目
git clone https://github.com/LisaPullman/waicai.git
cd waicai

# 安装依赖
npm install

# 配置环境变量
cp env.example .env.local
# 编辑 .env.local 文件，添加你的SILICONFLOW_API_KEY
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
   - 🎨 调节画笔大小和颜色
   - 🧽 使用橡皮擦修正错误
   - ↶ 使用撤销功能回退操作
4. **AI猜测**: 点击"让AI猜测"按钮，等待AI分析
5. **查看结果**: 查看AI的猜测结果和正确答案
6. **继续游戏**: 点击"下一轮"继续游戏

## 绘画工具

- **画笔工具**: 可调节大小(2-25px)和颜色
- **橡皮擦**: 点击🧽按钮切换橡皮擦模式，擦除不需要的部分
- **撤销功能**: 点击↶按钮可回退上一步操作，支持最多20步历史记录
- **清空画布**: 点击🗑️按钮清空整个画布

## 项目结构

```
waicai/
├── src/
│   ├── app/
│   │   ├── api/guess/route.ts    # 硅基流动API调用接口
│   │   ├── page.tsx              # 主游戏页面
│   │   ├── layout.tsx            # 页面布局
│   │   └── globals.css           # 全局样式
│   ├── components/
│   │   ├── DrawingCanvas.tsx     # 绘图画布组件(增强版)
│   │   ├── ErrorBoundary.tsx     # 错误边界组件
│   │   ├── LoadingSpinner.tsx    # 加载动画组件
│   │   └── MobileOptimized.tsx   # 移动端优化组件
│   ├── lib/
│   │   ├── gameLogic.ts          # 游戏逻辑
│   │   └── imageUtils.ts         # 图像处理工具
│   └── types/
│       └── game.ts               # TypeScript类型定义
├── .env.local                    # 环境变量配置
├── env.example                   # 环境变量示例
└── package.json
```

## 环境变量

在 `.env.local` 文件中配置以下变量：

```
SILICONFLOW_API_KEY=your_siliconflow_api_key_here
```

## 部署

### 部署到Vercel

1. 推送代码到GitHub
2. 在Vercel中导入项目
3. 设置环境变量 `SILICONFLOW_API_KEY`
4. 点击部署

### 其他平台

确保在部署环境中设置 `SILICONFLOW_API_KEY` 环境变量，然后运行构建命令：

```bash
npm run build
npm start
```

## 更新日志

### v1.1.0 (2025-10-19)
- ✨ **新增橡皮擦功能**: 支持橡皮擦/画笔模式切换
- ✨ **新增撤销功能**: 支持单步回退操作，最多20步历史记录
- 🎨 **增大画布尺寸**: 从600×400升级到900×600，更好适配iPad
- 🐛 **修复状态循环**: 解决React状态更新循环问题
- 💄 **优化UI设计**: 改进工具栏布局和按钮样式
- 📱 **增强响应式**: 完善移动端和平板设备适配

### v1.0.0 (初始版本)
- 🎨 基础绘图功能
- 🤖 AI智能识别
- 🎯 游戏计分系统
- 📱 响应式设计

## 注意事项

- 需要稳定的网络连接以调用硅基流动API
- API调用可能产生费用，请查看硅基流动的定价政策
- 建议使用现代浏览器以获得最佳体验
- iPad和大屏设备上体验更佳

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 致谢

- [硅基流动](https://siliconflow.cn/) - 提供AI视觉识别服务
- [Next.js](https://nextjs.org/) - React全栈框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架