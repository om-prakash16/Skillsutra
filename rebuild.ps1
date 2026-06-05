$ErrorActionPreference = "Stop"

Write-Host "Teardown existing containers and volumes..."
docker-compose down -v

Write-Host "`nRebuilding images cleanly..."
docker-compose build --no-cache

Write-Host "`nStarting services..."
docker-compose up -d

Write-Host "`nWaiting for database to become healthy (approx 15 seconds)..."
Start-Sleep -Seconds 15

Write-Host "`nApplying database migrations and seeding data..."
powershell.exe -ExecutionPolicy Bypass -File .\apply_migrations.ps1

Write-Host "`nRebuild complete!"
