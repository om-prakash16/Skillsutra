$ErrorActionPreference = "Stop"

Write-Host "Resetting skillsutra database..."
# Recreate public schema to ensure clean state
docker exec hiring_tool_db psql -U postgres -d skillsutra -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

$migrationsPath = "e:\Project\Ram\database\migrations"
$files = Get-ChildItem -Path $migrationsPath -Filter "*.sql" | Sort-Object Name

$successCount = 0
$failedFile = $null

foreach ($file in $files) {
    Write-Host -NoNewline "Applying $($file.Name)... "
    
    # Pipe the file into the docker container psql connecting to skillsutra
    $cmd = "Get-Content -Path `"$($file.FullName)`" -Raw | docker exec -i hiring_tool_db psql -U postgres -d skillsutra -v ON_ERROR_STOP=1 -q"
    
    try {
        Invoke-Expression $cmd | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "FAILED!"
            $failedFile = $file.Name
            break
        }
        Write-Host "OK"
        $successCount++
    } catch {
        Write-Host "FAILED!"
        Write-Host $_
        $failedFile = $file.Name
        break
    }
}

if ($failedFile) {
    Write-Host "`nMigration FAILED at file: $failedFile"
    exit 1
} else {
    Write-Host "`nMigration SUCCESS. All $successCount SQL files applied to skillsutra database."
    
    Write-Host "Restarting hiring_tool_server..."
    docker restart hiring_tool_server
    exit 0
}
