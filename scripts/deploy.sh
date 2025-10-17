#!/bin/bash

# Vercel 部署脚本
# 使用方法: ./scripts/deploy.sh

set -e

echo "🚀 开始 Vercel 部署准备..."

# 检查是否安装了必要的工具
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm，请先安装 Node.js"
    exit 1
fi

# 检查环境变量文件
if [ ! -f ".env.local" ]; then
    echo "⚠️  警告: 未找到 .env.local 文件"
    echo "请创建 .env.local 文件并添加以下内容:"
    echo "SILICONFLOW_API_KEY=your_api_key_here"
    read -p "是否继续部署? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 清理和安装依赖
echo "📦 安装依赖..."
npm ci

# 运行代码检查
echo "🔍 运行代码检查..."
npm run lint || echo "⚠️  Lint 检查有警告，继续部署..."

# 测试构建
echo "🏗️  测试生产构建..."
npm run build

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📥 安装 Vercel CLI..."
    npm install -g vercel
fi

# 部署到 Vercel
echo "🚀 部署到 Vercel..."
vercel --prod

echo "✅ 部署完成!"
echo ""
echo "📋 部署后检查清单:"
echo "  1. 检查网站是否正常加载"
echo "  2. 测试绘画功能"
echo "  3. 测试 AI 识别功能"
echo "  4. 检查移动端适配"
echo "  5. 监控 API 调用次数"
echo ""
echo "🔗 有用的链接:"
echo "  - Vercel 控制台: https://vercel.com/dashboard"
echo "  - 硅基流动控制台: https://siliconflow.cn/"
