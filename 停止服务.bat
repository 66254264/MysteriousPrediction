@echo off
chcp 65001 >nul
echo ========================================
echo   命运预测网站 - 停止服务
echo ========================================
echo.

echo 正在检查运行中的服务...
echo.

REM 检查并停止占用3000端口的进程（前端）
echo [1/3] 检查前端服务 (端口 3000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo 发现前端进程 PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    if !errorlevel! equ 0 (
        echo ✅ 前端服务已停止
    )
)

REM 检查并停止占用5000端口的进程（后端）
echo [2/3] 检查后端服务 (端口 5000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000 ^| findstr LISTENING') do (
    echo 发现后端进程 PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    if !errorlevel! equ 0 (
        echo ✅ 后端服务已停止
    )
)

REM 停止所有node.exe进程（兜底方案）
echo [3/3] 停止所有Node.js进程...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 所有Node.js进程已停止
) else (
    echo ℹ️  没有其他运行中的Node.js进程
)

REM 额外清理：停止可能的npm进程
taskkill /F /IM npm.cmd >nul 2>&1
taskkill /F /IM npm >nul 2>&1

echo.
echo ========================================
echo   服务已完全停止
echo ========================================
echo.
echo 提示：如果服务仍在运行，请以管理员身份运行此脚本
echo.
echo 按任意键关闭此窗口...
pause >nul
