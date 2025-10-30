@echo off
echo 启动后端服务器...
start cmd /k "cd backend && npm run dev"

timeout /t 2 >nul

echo 启动前端服务器...
start cmd /k "cd frontend && npm run dev"

echo.
echo 两个窗口已打开：
echo 1. 后端服务器 (端口 5000)
echo 2. 前端服务器 (端口 3000)
echo.
pause
