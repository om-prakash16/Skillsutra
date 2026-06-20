# Docker Hard Reset Script
# Use this when moving to Oracle Cloud or whenever you need a completely fresh start.

Write-Host "Stopping all SkillSutra Docker containers..." -ForegroundColor Cyan
docker-compose down -v

Write-Host "Clearing dangling images..." -ForegroundColor Yellow
docker image prune -f

Write-Host "Rebuilding containers from scratch..." -ForegroundColor Green
docker-compose up --build -d

Write-Host "Reset complete. Your Super Admin account will be automatically restored by the backend initialization script." -ForegroundColor Cyan
