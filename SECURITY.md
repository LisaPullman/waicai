# 🔒 API 密钥安全指南

## ⚠️ 重要安全提醒

### 🚨 API 密钥保护
- **永远不要**将 API 密钥提交到 Git 仓库
- **永远不要**在代码中硬编码 API 密钥
- **永远不要**在文档中包含真实的 API 密钥

### ✅ 正确的做法

#### 1. 环境变量
```bash
# .env.local (已被 .gitignore 忽略)
SILICONFLOW_API_KEY=your_actual_api_key_here
```

#### 2. Vercel 部署
在 Vercel 控制台的 Environment Variables 中设置：
- Key: `SILICONFLOW_API_KEY`
- Value: `你的真实API密钥`

#### 3. 本地开发
```bash
# 复制示例文件
cp env.example .env.local

# 编辑 .env.local 添加真实密钥
# 注意：.env.local 不会被提交到 Git
```

### 🔄 如果密钥已泄漏

1. **立即更换密钥**
   - 登录硅基流动控制台
   - 删除旧密钥
   - 生成新密钥

2. **清理 Git 历史**
   ```bash
   # 如果需要清理 Git 历史中的敏感信息
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch DEPLOY.md DEPLOYMENT_READY.md' \
   --prune-empty --tag-name-filter cat -- --all
   ```

3. **更新所有部署环境**
   - Vercel 环境变量
   - 本地 .env.local 文件

### 📋 安全检查清单

- [ ] API 密钥仅存在于环境变量中
- [ ] .env.local 在 .gitignore 中
- [ ] 文档中使用占位符而非真实密钥
- [ ] 定期轮换 API 密钥
- [ ] 监控 API 使用情况

### 🛡️ 最佳实践

1. **使用环境变量管理工具**
2. **定期审查代码和文档**
3. **设置 API 使用限制和监控**
4. **使用不同环境的不同密钥**
