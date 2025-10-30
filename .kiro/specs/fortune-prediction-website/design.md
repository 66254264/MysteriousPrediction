# 设计文档

## 概述

预测和算命网站采用现代Web技术栈构建，提供多种占卜服务的在线平台。系统采用前后端分离架构，支持响应式设计，确保在各种设备上提供流畅的用户体验。核心设计理念是创建一个既神秘又现代的数字占卜体验。

## 架构

### 系统架构图

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端应用      │    │   后端API       │    │   数据库        │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ - 用户界面      │    │ - 用户认证      │    │ - 用户数据      │
│ - 占卜交互      │    │ - 预测算法      │    │ - 预测历史      │
│ - 响应式设计    │    │ - API路由       │    │ - 算法配置      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 技术栈选择

**前端:**
- React 18 + TypeScript - 现代组件化开发
- Tailwind CSS - 快速样式开发和响应式设计
- Framer Motion - 流畅的动画效果
- React Router - 单页应用路由管理

**后端:**
- Node.js + Express - 轻量级API服务器
- TypeScript - 类型安全的开发体验
- JWT - 用户认证和会话管理
- bcrypt - 密码加密存储

**数据库:**
- MongoDB - 灵活的文档数据库，适合存储多样化的预测数据
- Mongoose - MongoDB对象建模工具

## 组件和接口

### 前端组件架构

```
App
├── Header (导航栏)
├── HomePage (主页)
│   ├── ServiceCard (服务卡片)
│   └── FeaturedPredictions (精选预测)
├── DivinationPages (占卜页面)
│   ├── TarotPage (塔罗牌)
│   ├── AstrologyPage (星座)
│   ├── BaziPage (八字)
│   └── YijingPage (周易)
├── UserPages (用户页面)
│   ├── LoginPage (登录)
│   ├── RegisterPage (注册)
│   └── ProfilePage (个人档案)
├── ResultPage (结果页面)
└── Footer (页脚)
```

### API接口设计

**用户认证接口:**
```
POST /api/auth/register - 用户注册
POST /api/auth/login - 用户登录
POST /api/auth/logout - 用户登出
GET /api/auth/profile - 获取用户信息
```

**占卜服务接口:**
```
POST /api/divination/tarot - 塔罗牌占卜
POST /api/divination/astrology - 星座预测
POST /api/divination/bazi - 八字算命
POST /api/divination/yijing - 周易占卜
GET /api/divination/history - 获取用户历史记录
```

**系统接口:**
```
GET /api/system/services - 获取可用服务列表
GET /api/system/health - 系统健康检查
```

## 数据模型

### 用户模型 (User)
```typescript
interface User {
  _id: ObjectId;
  username: string;
  email: string;
  passwordHash: string;
  profile: {
    birthDate?: Date;
    birthTime?: string;
    birthPlace?: string;
    gender?: 'male' | 'female' | 'other';
  };
  createdAt: Date;
  lastLoginAt: Date;
}
```

### 预测记录模型 (PredictionRecord)
```typescript
interface PredictionRecord {
  _id: ObjectId;
  userId: ObjectId;
  serviceType: 'tarot' | 'astrology' | 'bazi' | 'yijing';
  inputData: Record<string, any>;
  result: {
    title: string;
    content: string;
    summary: string;
    advice: string[];
    imagery?: string;
  };
  createdAt: Date;
}
```

### 占卜服务配置模型 (ServiceConfig)
```typescript
interface ServiceConfig {
  _id: ObjectId;
  serviceType: string;
  name: string;
  description: string;
  requiredFields: string[];
  algorithmConfig: Record<string, any>;
  isActive: boolean;
}
```

## 算法引擎设计

### 塔罗牌算法
- 78张塔罗牌数据库，包含正逆位含义
- 随机抽牌算法（伪随机种子基于用户信息）
- 牌阵解读逻辑（三张牌、凯尔特十字等）

### 星座算法
- 基于出生日期的星座计算
- 行星位置计算（简化版）
- 运势生成基于预设模板和随机元素

### 八字算法
- 天干地支计算
- 五行相生相克分析
- 基于传统八字理论的性格和运势分析

### 周易算法
- 64卦象数据库
- 起卦方法（时间起卦、数字起卦）
- 卦象解读和变卦分析

## 错误处理

### 前端错误处理
- 全局错误边界组件捕获React错误
- API请求错误的统一处理和用户友好提示
- 表单验证错误的实时反馈
- 网络连接错误的重试机制

### 后端错误处理
- 统一的错误响应格式
- 输入验证错误的详细信息
- 数据库连接错误的优雅降级
- 算法计算错误的回退机制

### 错误响应格式
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}
```

## 测试策略

### 单元测试
- 算法引擎的核心计算逻辑测试
- 数据模型验证函数测试
- API路由处理函数测试
- React组件的渲染和交互测试

### 集成测试
- API端点的完整请求-响应流程测试
- 数据库操作的集成测试
- 用户认证流程的端到端测试

### 用户体验测试
- 响应式设计在不同设备上的表现
- 占卜流程的用户体验测试
- 性能测试确保预测结果生成时间在5秒内

### 测试工具
- Jest - JavaScript单元测试框架
- React Testing Library - React组件测试
- Supertest - API集成测试
- Cypress - 端到端测试

## 性能优化

### 前端优化
- 代码分割和懒加载减少初始加载时间
- 图片优化和CDN加速
- 缓存策略优化用户体验
- 预测结果的本地存储

### 后端优化
- 数据库查询优化和索引设计
- 算法结果缓存减少重复计算
- API响应压缩
- 连接池管理优化数据库性能

### 扩展性考虑
- 微服务架构的预留设计
- 负载均衡支持
- 数据库分片策略
- CDN和静态资源分离