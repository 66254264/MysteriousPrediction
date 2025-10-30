# API 测试指南

## 修复的问题

### 1. 塔罗牌 (Tarot)
**问题**: 前端发送 `spread: "three-card"`，后端期望 `spreadType: "threeCard"`
**修复**: 前端现在会将 `three-card` 转换为 `threeCard`

**测试数据**:
```json
{
  "spreadType": "threeCard",
  "question": "我的未来会怎样？"
}
```

### 2. 八字 (Bazi)
**问题**: 前端发送 `birthTime: "14:30"`（字符串），后端期望 `birthTime: { hour: 14, minute: 30 }`
**修复**: 前端现在会将时间字符串转换为对象格式

**测试数据**:
```json
{
  "birthDate": "1990-01-01",
  "birthTime": {
    "hour": 14,
    "minute": 30
  },
  "gender": "male",
  "name": "张三"
}
```

### 3. 易经 (Yijing)
**问题**: 前端发送 `method: "number"`，后端期望 `method: "numbers"`
**修复**: 前端现在会将 `number` 转换为 `numbers`

**测试数据（时间起卦）**:
```json
{
  "method": "time",
  "question": "今天运势如何？"
}
```

**测试数据（数字起卦）**:
```json
{
  "method": "numbers",
  "question": "今天运势如何？",
  "numbers": [123, 456, 789]
}
```

### 4. 星座 (Astrology)
**状态**: 应该正常工作

**测试数据**:
```json
{
  "birthDate": "1990-03-21",
  "name": "李四"
}
```

## 使用 curl 测试

### 测试塔罗牌
```bash
curl -X POST http://localhost:5000/api/divination/tarot \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "spreadType": "threeCard",
    "question": "我的未来会怎样？"
  }'
```

### 测试八字
```bash
curl -X POST http://localhost:5000/api/divination/bazi \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "birthDate": "1990-01-01",
    "birthTime": {"hour": 14, "minute": 30},
    "gender": "male"
  }'
```

### 测试易经
```bash
curl -X POST http://localhost:5000/api/divination/yijing \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "method": "time",
    "question": "今天运势如何？"
  }'
```

### 测试星座
```bash
curl -X POST http://localhost:5000/api/divination/astrology \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "birthDate": "1990-03-21"
  }'
```

## 注意事项

1. 所有占卜接口都使用 `optionalAuth` 中间件，可以不登录使用
2. 如果登录了，预测记录会被保存到数据库
3. 确保 MongoDB 正在运行
4. 确保后端服务器在 5000 端口运行
5. 确保前端服务器在 3000 端口运行
