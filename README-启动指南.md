# 命运预测网站 - 启动指南

## 🚀 快速启动

### 方法1：使用启动脚本（推荐）

双击运行 `启动服务.bat`

脚本会自动：
1. ✅ 检查并启动MongoDB
2. ✅ 启动后端服务（端口5000）
3. ✅ 启动前端服务（端口3000）
4. ✅ 打开浏览器

### 方法2：手动启动

#### 1. 启动MongoDB
```bash
net start MongoDB
```

#### 2. 启动后端
```bash
cd backend
npm run dev
```

#### 3. 启动前端（新终端）
```bash
cd frontend
npm run dev
```

#### 4. 打开浏览器
访问：http://localhost:3000

---

## 🛑 停止服务

### 方法1：使用停止脚本
双击运行 `停止服务.bat`

### 方法2：手动停止
在各个终端窗口按 `Ctrl + C`

---

## 🔍 故障排查

### 问题：点击按钮后报错 "Failed to fetch"

**原因：** 后端服务未运行或无法连接

**解决步骤：**

1. **检查后端是否运行**
   - 打开浏览器访问：http://localhost:5000/api/system/health
   - 应该看到 JSON 响应，包含 `"status": "healthy"`

2. **检查MongoDB是否运行**
   ```bash
   sc query MongoDB
   ```
   应该显示 `STATE: 4 RUNNING`

3. **使用诊断工具**
   - 在浏览器中打开 `test-connection.html`
   - 查看所有测试结果

4. **查看详细排查指南**
   - 打开 `故障排查指南.md`
   - 按照步骤逐一排查

### 问题：端口被占用

**错误信息：** `EADDRINUSE: address already in use`

**解决：**
```bash
# 查找占用端口的进程
netstat -ano | findstr :5000

# 结束进程（替换<PID>为实际进程ID）
taskkill /PID <PID> /F
```

### 问题：CORS错误

**错误信息：** `CORS policy: No 'Access-Control-Allow-Origin'`

**解决：**
1. 检查 `backend/.env` 文件
2. 确保 `CORS_ORIGIN=http://localhost:3000`
3. 重启后端服务

---

## 📁 项目结构

```
fortune-prediction-website/
├── backend/              # 后端服务
│   ├── src/             # 源代码
│   ├── .env             # 环境配置
│   └── package.json     # 依赖配置
├── frontend/            # 前端应用
│   ├── src/             # 源代码
│   ├── .env             # 环境配置
│   └── package.json     # 依赖配置
├── 启动服务.bat          # 一键启动脚本
├── 停止服务.bat          # 停止服务脚本
├── test-connection.html # 连接诊断工具
└── 故障排查指南.md       # 详细排查步骤
```

---

## 🔧 配置说明

### 后端配置 (backend/.env)
```env
PORT=5000                                          # 后端端口
NODE_ENV=development                               # 开发环境
MONGODB_URI=mongodb://localhost:27017/fortune-prediction  # 数据库连接
JWT_SECRET=your-secret-key                         # JWT密钥
CORS_ORIGIN=http://localhost:3000                  # 允许的前端地址
```

### 前端配置 (frontend/.env)
```env
VITE_API_URL=http://localhost:5000/api            # 后端API地址
```

---

## 📊 服务地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端应用 | http://localhost:3000 | 用户界面 |
| 后端API | http://localhost:5000/api | API服务 |
| 健康检查 | http://localhost:5000/api/system/health | 服务状态 |
| 缓存统计 | http://localhost:5000/api/system/cache | 缓存信息 |
| 性能指标 | http://localhost:5000/api/system/performance | 性能数据 |

---

## 🧪 测试工具

### 1. 连接诊断工具
打开 `test-connection.html` 在浏览器中

**测试项目：**
- ✅ 后端健康检查
- ✅ API连接测试
- ✅ CORS配置测试
- ✅ 网络状态检查

### 2. 浏览器开发者工具
按 `F12` 打开，查看：
- **Console** - 错误日志
- **Network** - 网络请求
- **Application** - 本地存储

### 3. 后端日志
查看后端终端窗口的输出

---

## 📚 相关文档

- **NETWORK_ERROR_FIXES.md** - 网络错误修复详解
- **故障排查指南.md** - 完整的故障排查步骤
- **快速修复参考.md** - 常见问题快速参考
- **网络错误修复总结.md** - 修复方案总结
- **backend/PERFORMANCE_OPTIMIZATIONS.md** - 后端性能优化
- **部署前检查清单.md** - 部署前检查项

---

## 💡 开发提示

### 1. 热重载
- 前端和后端都支持热重载
- 修改代码后自动刷新
- 无需手动重启服务

### 2. 查看日志
- 后端日志在后端终端窗口
- 前端日志在浏览器控制台
- 网络请求在Network标签

### 3. 调试技巧
```javascript
// 在浏览器控制台测试API
fetch('http://localhost:5000/api/system/health')
  .then(r => r.json())
  .then(d => console.log(d))

// 检查网络状态
console.log('在线:', navigator.onLine)
```

---

## ⚠️ 注意事项

1. **MongoDB必须先启动**
   - 后端依赖MongoDB
   - 确保MongoDB服务正在运行

2. **端口不能被占用**
   - 前端：3000
   - 后端：5000
   - MongoDB：27017

3. **CORS配置要正确**
   - 后端CORS_ORIGIN必须匹配前端地址
   - 修改后需要重启后端

4. **环境变量要配置**
   - 检查 backend/.env
   - 检查 frontend/.env

---

## 🎉 成功标志

当一切正常时：

1. ✅ 后端终端显示：
   ```
   ✅ MongoDB connected successfully
   Server running on port 5000
   ```

2. ✅ 前端终端显示：
   ```
   VITE ready in xxx ms
   ➜  Local: http://localhost:3000/
   ```

3. ✅ 浏览器可以：
   - 访问 http://localhost:3000
   - 点击占卜按钮正常工作
   - 无错误提示

4. ✅ 健康检查返回：
   ```json
   {
     "success": true,
     "data": {
       "status": "healthy"
     }
   }
   ```

---

## 📞 需要帮助？

1. 查看 `故障排查指南.md`
2. 使用 `test-connection.html` 诊断
3. 检查后端和前端日志
4. 确认所有配置正确

**祝你使用愉快！** 🚀
