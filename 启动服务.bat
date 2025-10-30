@echo off
chcp 65001 >nul
echo ========================================
echo   命运预测网站 - 启动脚本
echo ========================================
echo.

REM 检查MongoDB是否运行
echo [1/4] 检查MongoDB服务...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB未运行，正在启动...
    net start MongoDB
    if %errorlevel% neq 0 (
        echo ❌ MongoDB启动失败！请手动启动MongoDB服务
        echo    运行: net start MongoDB
        pause
        exit /b 1
    )
    echo ✅ MongoDB已启动
) else (
    echo ✅ MongoDB正在运行
)
echo.

REM 启动后端服务
echo [2/4] 启动后端服务...
start "后端服务 - 端口5000" cmd /k "cd /d %~dp0backend && echo 正在启动后端服务... && npm run dev"
echo ✅ 后端服务启动中...
echo    等待5秒让后端完全启动...
timeout /t 5 /nobreak >nul
echo.

REM 启动前端服务
echo [3/4] 启动前端服务...
start "前端服务 - 端口3000" cmd /k "cd /d %~dp0frontend && echo 正在启动前端服务... && npm run dev"
echo ✅ 前端服务启动中...
echo    等待3秒让前端完全启动...
timeout /t 3 /nobreak >nul
echo.

REM 打开浏览器
echo [4/4] 打开浏览器...
timeout /t 2 /nobreak >nul
start http://localhost:3000
echo ✅ 浏览器已打开
echo.

echo ========================================
echo   🎉 所有服务已启动！
echo ========================================
echo.
echo 服务地址:
echo   前端: http://localhost:3000
echo   后端: http://localhost:5000
echo   健康检查: http://localhost:5000/api/system/health
echo.
echo 诊断工具:
echo   打开 test-connection.html 进行连接测试
echo.
echo 按任意键关闭此窗口...
pause >nul
