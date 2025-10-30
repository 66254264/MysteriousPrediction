# 算命预测网站 - PowerShell 启动脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "算命预测网站 - 启动脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 获取脚本所在目录
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "当前目录: $scriptPath" -ForegroundColor Yellow
Write-Host ""

# 检查 MongoDB
Write-Host "[1/3] 检查 MongoDB..." -ForegroundColor Green
try {
    $mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
    if ($mongoService -and $mongoService.Status -eq 'Running') {
        Write-Host "MongoDB 正在运行" -ForegroundColor Green
    } else {
        Write-Host "警告: MongoDB 未运行" -ForegroundColor Yellow
        Write-Host "请确保 MongoDB 已安装并运行" -ForegroundColor Yellow
    }
} catch {
    Write-Host "警告: 无法检查 MongoDB 状态" -ForegroundColor Yellow
}
Write-Host ""

# 启动后端
Write-Host "[2/3] 启动后端服务器..." -ForegroundColor Green
if (Test-Path "$scriptPath\backend") {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath\backend'; npm run dev" -WindowStyle Normal
    Write-Host "后端服务器启动中..." -ForegroundColor Green
    Start-Sleep -Seconds 3
} else {
    Write-Host "错误: 找不到 backend 目录" -ForegroundColor Red
    Write-Host "路径: $scriptPath\backend" -ForegroundColor Red
    Read-Host "按 Enter 键退出"
    exit 1
}

# 启动前端
Write-Host "[3/3] 启动前端服务器..." -ForegroundColor Green
if (Test-Path "$scriptPath\frontend") {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptPath\frontend'; npm run dev" -WindowStyle Normal
    Write-Host "前端服务器启动中..." -ForegroundColor Green
} else {
    Write-Host "错误: 找不到 frontend 目录" -ForegroundColor Red
    Write-Host "路径: $scriptPath\frontend" -ForegroundColor Red
    Read-Host "按 Enter 键退出"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "启动完成！" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "后端地址: http://localhost:5000" -ForegroundColor Yellow
Write-Host "前端地址: http://localhost:3000 (或 Vite 分配的端口)" -ForegroundColor Yellow
Write-Host ""
Write-Host "提示: 两个新窗口已打开" -ForegroundColor Green
Write-Host "- 后端服务器窗口" -ForegroundColor Green
Write-Host "- 前端服务器窗口" -ForegroundColor Green
Write-Host ""
Read-Host "按 Enter 键关闭此窗口"
