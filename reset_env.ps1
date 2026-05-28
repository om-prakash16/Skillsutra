# reset_env.ps1
# Complete Environment Cleanup and Reset Script
# This will terminate all running Dev servers, clear caches, and prep for a clean start.

Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "  SKILLSUTRA ENVIRONMENT RESET SCRIPT" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# 1. Kill Ports
$ports = @(3000, 3001, 8000, 8001, 6379)
Write-Host "`n[*] Terminating stale processes on ports: $($ports -join ', ')..." -ForegroundColor Yellow

foreach ($port in $ports) {
    # Find process ID holding the port
    $processIds = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    
    foreach ($pid_ in $processIds) {
        if ($pid_ -ne 0) {
            $process = Get-Process -Id $pid_ -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "    Killing process $($process.ProcessName) (PID: $pid_) on port $port" -ForegroundColor Red
                Stop-Process -Id $pid_ -Force -ErrorAction SilentlyContinue
            }
        }
    }
}

# 2. Clear Next.js Cache
Write-Host "`n[*] Clearing Next.js caches..." -ForegroundColor Yellow
$nextCachePath = Join-Path "web" ".next"
if (Test-Path $nextCachePath) {
    Remove-Item -Path $nextCachePath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "    Removed .next folder." -ForegroundColor Green
} else {
    Write-Host "    .next folder not found. Skipping." -ForegroundColor DarkGray
}

# 3. Clear Python Cache
Write-Host "`n[*] Clearing Python __pycache__ folders..." -ForegroundColor Yellow
$pycacheFolders = Get-ChildItem -Path "server" -Filter "__pycache__" -Recurse -Directory -ErrorAction SilentlyContinue
$pycacheCount = 0
foreach ($folder in $pycacheFolders) {
    Remove-Item -Path $folder.FullName -Recurse -Force -ErrorAction SilentlyContinue
    $pycacheCount++
}
Write-Host "    Removed $pycacheCount __pycache__ folders." -ForegroundColor Green

Write-Host "`n=================================================" -ForegroundColor Cyan
Write-Host "  CLEANUP COMPLETE!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. In your browser: Open DevTools -> Application -> Clear Site Data (LocalStorage, Cookies)."
Write-Host "2. Start your Redis/PostgreSQL if not running via Docker."
Write-Host "3. Start Backend: cd server && uvicorn main:app --reload"
Write-Host "4. Start Frontend: cd web && npm run dev"
Write-Host "=================================================`n" -ForegroundColor Cyan
