# 预测和算命网站 (Fortune Prediction Website)

一个提供多种占卜和预测服务的在线平台，包括塔罗牌占卜、星座运势、生辰八字算命、周易占卜等。

## 项目结构

```
fortune-prediction-website/
├── frontend/          # React前端应用
│   ├── src/          # 源代码
│   ├── public/       # 静态资源
│   └── package.json  # 前端依赖
├── backend/          # Node.js后端API
│   ├── src/          # 源代码
│   └── package.json  # 后端依赖
└── README.md         # 项目文档
```

## 技术栈

### 前端
- React 18 + TypeScript
- Vite (构建工具)
- Tailwind CSS (样式框架)
- React Router (路由管理)
- Framer Motion (动画效果)

### 后端
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT (用户认证)
- bcrypt (密码加密)

## 快速开始

### 前置要求
- Node.js 18+ 
- MongoDB 6+
- npm 或 yarn

### 安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

### 配置环境变量

在 `backend` 目录下创建 `.env` 文件：

```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件，配置你的环境变量。

### 启动开发服务器

```bash
# 启动后端服务器 (端口 5000)
cd backend
npm run dev

# 在新终端启动前端开发服务器 (端口 3000)
cd frontend
npm run dev
```

访问 http://localhost:3000 查看应用。

## 开发指南

### 前端开发
- 前端代码位于 `frontend/src/`
- 使用 Vite 进行热重载开发
- Tailwind CSS 用于样式开发
- 遵循 React + TypeScript 最佳实践

### 后端开发
- 后端代码位于 `backend/src/`
- 使用 tsx watch 进行热重载开发
- API 路由位于 `backend/src/routes/`
- 数据模型位于 `backend/src/models/`

### 构建生产版本

```bash
# 构建前端
cd frontend
npm run build

# 构建后端
cd backend
npm run build
```

## API 端点

- `GET /api/health` - 健康检查
- `GET /api/` - API 信息

更多端点将在后续任务中实现。

## 许可证

MIT
