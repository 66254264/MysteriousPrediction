@echo off
setlocal enabledelayedexpansion

echo ========================================
echo 算命预测网站 - 启动脚本
echo ========================================
echo.

REM 获取当前脚本所在目录
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo 当前目录: %CD%
echo.

echo [1/3] 检查 MongoDB...
net start MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo 警告: MongoDB 未运行
    echo 请确保 MongoDB 已安装并运行
    echo.
)

echo [2/3] 启动后端服务器...
if exist "%SCRIPT_DIR%backend" (
    start "后端服务器" cmd /k "cd /d "%SCRIPT_DIR%backend" && npm run dev"
    echo 后端服务器启动中...
    timeout /t 3 >nul
) else (
    echo 错误: 找不到 backend 目录
    echo 路径: %SCRIPT_DIR%backend
    pause
    exit /b 1
)

echo [3/3] 启动前端服务器...
if exist "%SCRIPT_DIR%frontend" (
    start "前端服务器" cmd /k "cd /d "%SCRIPT_DIR%frontend" && npm run dev"
    echo 前端服务器启动中...
) else (
    echo 错误: 找不到 frontend 目录
    echo 路径: %SCRIPT_DIR%frontend
    pause
    exit /b 1
)

echo.
echo ========================================
echo 启动完成！
echo ========================================
echo 后端地址: http://localhost:5000
echo 前端地址: http://localhost:3000 (或 Vite 分配的端口)
echo.
echo 提示: 两个新窗口已打开
echo - 后端服务器窗口
echo - 前端服务器窗口
echo.
echo 按任意键关闭此窗口...
pause >nul
