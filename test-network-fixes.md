# 网络错误修复测试清单

## 测试环境准备

### 1. 启动后端服务
```bash
cd backend
npm install
npm run dev
```

### 2. 启动前端服务
```bash
cd frontend
npm install
npm run dev
```

## 测试场景

### ✅ 场景1：正常网络请求
**步骤：**
1. 打开浏览器访问 http://localhost:5173
2. 进行塔罗牌占卜
3. 查看历史记录

**预期结果：**
- 请求成功完成
- 响应时间 <5秒
- 无错误提示

### ✅ 场景2：网络超时
**步骤：**
1. 打开Chrome DevTools (F12)
2. 切换到 Network 标签
3. 选择 "Slow 3G" 网络限速
4. 尝试进行占卜

**预期结果：**
- 显示加载状态
- 10秒后显示超时错误
- 错误提示："请求超时，请稍后重试"
- 自动重试2次

### ✅ 场景3：网络断开
**步骤：**
1. 打开应用
2. 在Chrome DevTools中选择 "Offline"
3. 尝试进行操作

**预期结果：**
- 顶部显示红色横幅："网络连接已断开"
- 请求失败，显示错误提示
- 错误消息："网络连接失败，请检查您的网络连接"

### ✅ 场景4：网络恢复
**步骤：**
1. 在离线状态下尝试操作
2. 恢复网络连接（取消 "Offline"）
3. 再次尝试操作

**预期结果：**
- 红色横幅消失
- 请求成功完成
- 显示成功结果

### ✅ 场景5：慢速网络
**步骤：**
1. 选择 "Slow 3G" 或 "Fast 3G"
2. 进行占卜操作

**预期结果：**
- 顶部显示黄色警告："网络连接较慢"
- 请求仍能完成（可能较慢）
- 自动重试机制生效

### ✅ 场景6：后端服务不可用
**步骤：**
1. 停止后端服务 (Ctrl+C)
2. 在前端尝试操作

**预期结果：**
- 显示错误提示："无法连接到服务器，请稍后重试"
- 前端不崩溃
- 可以继续浏览其他页面

### ✅ 场景7：并发请求
**步骤：**
1. 快速连续发起多个请求
2. 观察网络标签

**预期结果：**
- 所有请求都能正常处理
- 没有请求被阻塞
- 缓存机制生效（相同请求返回缓存）

### ✅ 场景8：请求取消
**步骤：**
1. 发起一个请求
2. 在请求完成前离开页面或刷新

**预期结果：**
- 请求被正确取消
- 没有内存泄漏
- 没有未处理的Promise错误

## 性能测试

### 测试1：响应时间
```bash
# 使用curl测试API响应时间
time curl http://localhost:5000/api/system/health
```

**预期：** <1秒

### 测试2：缓存效果
```bash
# 第一次请求（无缓存）
curl -w "@curl-format.txt" http://localhost:5000/api/divination/history \
  -H "Authorization: Bearer YOUR_TOKEN"

# 第二次请求（有缓存）
curl -w "@curl-format.txt" http://localhost:5000/api/divination/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**预期：** 第二次请求明显更快，响应头包含 `X-Cache: HIT`

### 测试3：并发性能
```bash
# 使用Apache Bench测试并发
ab -n 100 -c 10 http://localhost:5000/api/system/health
```

**预期：**
- 成功率 100%
- 平均响应时间 <500ms
- 无错误

## 监控检查

### 1. 查看缓存统计
```bash
curl http://localhost:5000/api/system/cache \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**检查项：**
- 缓存命中率 >50%
- 内存使用合理

### 2. 查看性能指标
```bash
curl http://localhost:5000/api/system/performance \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**检查项：**
- 平均响应时间 <2秒
- 慢请求数量较少

### 3. 查看数据库性能
```bash
curl http://localhost:5000/api/system/database \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**检查项：**
- 连接池使用正常
- 数据库响应快速

## 浏览器控制台检查

### 检查网络状态
```javascript
// 在浏览器控制台执行
console.log('在线状态:', navigator.onLine)
console.log('网络信息:', navigator.connection)
```

### 检查错误日志
```javascript
// 查看是否有未捕获的错误
// 打开 Console 标签，筛选 Errors
```

### 检查性能
```javascript
// 查看性能指标
performance.getEntriesByType('navigation')
performance.getEntriesByType('resource')
```

## 问题排查

### 如果请求仍然失败：

1. **检查后端是否运行**
   ```bash
   curl http://localhost:5000/api/system/health
   ```

2. **检查CORS配置**
   - 确保后端允许前端域名
   - 检查 `backend/src/config/env.ts` 中的 `CORS_ORIGIN`

3. **检查环境变量**
   ```bash
   # 前端
   cat frontend/.env
   # 应该包含: VITE_API_URL=http://localhost:5000/api
   
   # 后端
   cat backend/.env
   # 应该包含: PORT=5000, MONGODB_URI等
   ```

4. **检查防火墙**
   - 确保端口5000和5173未被阻止

5. **清除缓存**
   ```bash
   # 清除浏览器缓存
   # Chrome: Ctrl+Shift+Delete
   
   # 清除后端缓存
   # 重启后端服务
   ```

## 测试通过标准

- ✅ 所有8个场景测试通过
- ✅ 响应时间 <5秒
- ✅ 缓存命中率 >50%
- ✅ 并发测试成功率 100%
- ✅ 无未捕获的错误
- ✅ 用户体验流畅

## 测试报告模板

```
测试日期: ____________________
测试人员: ____________________

场景1 (正常请求): ☐ 通过 ☐ 失败
场景2 (网络超时): ☐ 通过 ☐ 失败
场景3 (网络断开): ☐ 通过 ☐ 失败
场景4 (网络恢复): ☐ 通过 ☐ 失败
场景5 (慢速网络): ☐ 通过 ☐ 失败
场景6 (后端不可用): ☐ 通过 ☐ 失败
场景7 (并发请求): ☐ 通过 ☐ 失败
场景8 (请求取消): ☐ 通过 ☐ 失败

性能测试:
- 平均响应时间: _______ ms
- 缓存命中率: _______ %
- 并发成功率: _______ %

问题记录:
_________________________________
_________________________________
_________________________________

总体评价: ☐ 优秀 ☐ 良好 ☐ 需改进
```
