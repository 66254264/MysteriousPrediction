# 命运预测网站 - 停止服务 (PowerShell版本)
# 使用方法：右键点击 -> 使用PowerShell运行

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  命运预测网站 - 停止服务" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$stopped = $false

# 函数：停止占用指定端口的进程
function Stop-PortProcess {
    param(
        [int]$Port,
        [string]$ServiceName
    )
    
    Write-Host "[$ServiceName] 检查端口 $Port..." -ForegroundColor Yellow
    
    try {
        $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
        
        if ($connections) {
            foreach ($conn in $connections) {
                $process = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Host "  发现进程: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Gray
                    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
                    Write-Host "  ✅ 已停止 $ServiceName" -ForegroundColor Green
                    $script:stopped = $true
                }
            }
        } else {
            Write-Host "  ℹ️  $ServiceName 未运行" -ForegroundColor Gray
        }
    } catch {
        Write-Host "  ⚠️  检查 $ServiceName 时出错: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# 停止前端服务（端口3000）
Stop-PortProcess -Port 3000 -ServiceName "前端服务"

# 停止后端服务（端口5000）
Stop-PortProcess -Port 5000 -ServiceName "后端服务"

# 停止所有Node.js进程（兜底方案）
Write-Host "[清理] 停止所有Node.js进程..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue

if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        Write-Host "  停止进程: node.exe (PID: $($_.Id))" -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Write-Host "  ✅ 所有Node.js进程已停止" -ForegroundColor Green
    $stopped = $true
} else {
    Write-Host "  ℹ️  没有其他运行中的Node.js进程" -ForegroundColor Gray
}

Write-Host ""

# 停止npm进程
$npmProcesses = Get-Process -Name npm* -ErrorAction SilentlyContinue
if ($npmProcesses) {
    $npmProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "  ✅ npm进程已停止" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($stopped) {
    Write-Host "  服务已完全停止" -ForegroundColor Green
} else {
    Write-Host "  没有发现运行中的服务" -ForegroundColor Yellow
}
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 验证端口是否已释放
Write-Host "验证端口状态..." -ForegroundColor Yellow
$port3000 = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
$port5000 = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue

if (-not $port3000) {
    Write-Host "  ✅ 端口 3000 已释放" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  端口 3000 仍被占用" -ForegroundColor Red
}

if (-not $port5000) {
    Write-Host "  ✅ 端口 5000 已释放" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  端口 5000 仍被占用" -ForegroundColor Red
}

Write-Host ""
Write-Host "按任意键关闭此窗口..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
