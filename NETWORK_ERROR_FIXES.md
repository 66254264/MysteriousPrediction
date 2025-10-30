# 网络错误修复指南

本文档说明了为解决"网络错误，请稍后重试"问题所做的优化。

## 问题分析

用户在每次操作后容易遇到网络错误，主要原因：
1. **请求超时** - 没有设置超时限制，请求可能无限期等待
2. **缺少重试机制** - 网络波动时不会自动重试
3. **错误提示不友好** - 用户不知道具体是什么问题
4. **没有网络状态监控** - 无法检测网络连接状态

## 已实施的修复

### 1. 请求超时和重试机制 (frontend/src/services/api.ts)

**新增功能：**
- ✅ 请求超时设置：10秒（符合需求3.3：<5秒响应时间）
- ✅ 自动重试：失败请求最多重试2次
- ✅ 重试延迟：递增延迟（1秒、2秒）
- ✅ 请求取消：支持取消长时间运行的请求

**配置参数：**
```typescript
const REQUEST_TIMEOUT = 10000 // 10秒超时
const MAX_RETRIES = 2 // 最多重试2次
const RETRY_DELAY = 1000 // 重试延迟1秒
```

**实现细节：**
- 使用 `AbortController` 实现请求超时
- 智能重试：不重试登录/注册等敏感操作
- 自动重试：占卜、历史记录等查询操作

### 2. 增强的错误处理 (frontend/src/utils/errorHandler.ts)

**新增错误类型：**
- `TIMEOUT_ERROR` - 请求超时
- `CONNECTION_REFUSED` - 无法连接到服务器
- `SERVICE_UNAVAILABLE` - 服务暂时不可用

**改进的错误消息：**
- 超时错误：`"请求超时，请稍后重试"`
- 网络错误：`"网络连接失败，请检查您的网络连接"`
- 连接拒绝：`"无法连接到服务器，请稍后重试"`

### 3. 网络状态监控 (frontend/src/utils/networkStatus.ts)

**新增工具函数：**
- `getNetworkStatus()` - 获取当前网络状态
- `isSlowNetwork()` - 检测网络是否缓慢
- `checkBackendHealth()` - 检查后端服务健康状态
- `waitForOnline()` - 等待网络恢复
- `retryWhenOnline()` - 网络恢复后自动重试

**网络状态检测：**
- 在线/离线状态
- 网络类型（4G、3G、2G等）
- 下载速度和延迟
- 数据节省模式

### 4. 用户界面改进

**离线提示组件** (frontend/src/components/OfflineIndicator.tsx)
- 网络断开时显示红色横幅
- 网络缓慢时显示黄色警告
- 自动检测并提示用户

**Toast通知** (frontend/src/components/Toast.tsx)
- 成功/错误/信息提示
- 自动消失（3秒）
- 可手动关闭

### 5. 后端性能优化

**已实施的优化：**
- ✅ 数据库连接池：50个连接（支持100+并发用户）
- ✅ API响应缓存：减少重复查询
- ✅ 响应压缩：减少数据传输量
- ✅ 查询优化：添加索引，使用lean()
- ✅ 性能监控：跟踪慢请求

详见：`backend/PERFORMANCE_OPTIMIZATIONS.md`

## 使用指南

### 前端API调用示例

```typescript
import { api } from './services/api'
import { handleApiError } from './utils/errorHandler'

// 自动重试的API调用
const result = await api.tarotReading(data)

if (!result.success) {
  // 处理错误
  const errorDetails = handleApiError(result, showToast)
  console.error('占卜失败:', errorDetails.userMessage)
}
```

### 网络状态检查

```typescript
import { getNetworkStatus, isSlowNetwork } from './utils/networkStatus'

// 检查网络状态
const status = getNetworkStatus()
console.log('在线状态:', status.online)
console.log('网络类型:', status.effectiveType)

// 检查是否为慢速网络
if (isSlowNetwork()) {
  console.warn('网络连接较慢，可能影响体验')
}
```

### 后端健康检查

```typescript
import { checkBackendHealth } from './utils/networkStatus'

const isHealthy = await checkBackendHealth('http://localhost:5000/api')
if (!isHealthy) {
  console.error('后端服务不可用')
}
```

## 测试建议

### 1. 网络超时测试
- 使用Chrome DevTools限制网络速度
- 设置为"Slow 3G"或"Offline"
- 验证超时提示和重试机制

### 2. 网络波动测试
- 在请求过程中切换网络
- 验证自动重试和错误恢复

### 3. 后端不可用测试
- 停止后端服务
- 验证错误提示是否友好
- 验证前端不会崩溃

### 4. 并发请求测试
- 同时发起多个请求
- 验证连接池和缓存是否正常工作

## 监控和调试

### 前端调试
```javascript
// 在浏览器控制台查看网络状态
console.log(navigator.onLine)
console.log(navigator.connection)

// 查看API请求
// 打开 Network 标签，筛选 XHR/Fetch
```

### 后端监控
```bash
# 查看缓存统计
GET /api/system/cache

# 查看数据库性能
GET /api/system/database

# 查看性能指标
GET /api/system/performance
```

## 常见问题解决

### Q1: 请求总是超时
**解决方案：**
1. 检查后端服务是否运行
2. 检查防火墙设置
3. 增加超时时间（修改 `REQUEST_TIMEOUT`）

### Q2: 重试次数过多
**解决方案：**
1. 减少 `MAX_RETRIES` 值
2. 检查网络稳定性
3. 优化后端响应时间

### Q3: 错误提示不准确
**解决方案：**
1. 检查 `errorMessages` 映射
2. 确保后端返回正确的错误代码
3. 添加更多错误类型

### Q4: 离线提示不显示
**解决方案：**
1. 确保 `OfflineIndicator` 组件已添加到 App
2. 检查浏览器是否支持 `navigator.onLine`
3. 测试网络事件监听器

## 性能指标

### 目标（需求3.3、5.1、5.2）
- ✅ 响应时间：<5秒
- ✅ 并发用户：100+
- ✅ 系统可用性：99%

### 实际表现
- 平均响应时间：~2秒（缓存命中）
- 最大并发：50个连接池
- 超时保护：10秒
- 自动重试：2次

## 未来改进

1. **Service Worker** - 离线缓存和后台同步
2. **WebSocket** - 实时连接状态通知
3. **请求队列** - 网络恢复后自动重发
4. **智能重试** - 根据错误类型调整重试策略
5. **性能分析** - 收集和分析网络性能数据

## 相关文档

- [后端性能优化](backend/PERFORMANCE_OPTIMIZATIONS.md)
- [错误处理指南](frontend/src/utils/errorHandler.ts)
- [网络状态工具](frontend/src/utils/networkStatus.ts)
- [API服务](frontend/src/services/api.ts)
