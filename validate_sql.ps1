$ErrorActionPreference = "Stop"

Write-Host "Creating test database..."
docker exec hiring_tool_db psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS test_validation_db;"
docker exec hiring_tool_db psql -U postgres -d postgres -c "CREATE DATABASE test_validation_db;"

$migrationsPath = "e:\Project\Ram\database\migrations"
$files = Get-ChildItem -Path $migrationsPath -Filter "*.sql" | Sort-Object Name

$successCount = 0
$failedFile = $null

foreach ($file in $files) {
    Write-Host -NoNewline "Validating $($file.Name)... "
    
    # Pipe the file into the docker container psql
    $cmd = "Get-Content -Path `"$($file.FullName)`" -Raw | docker exec -i hiring_tool_db psql -U postgres -d test_validation_db -v ON_ERROR_STOP=1 -q"
    
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

Write-Host "Cleaning up test database..."
docker exec hiring_tool_db psql -U postgres -d postgres -c "DROP DATABASE test_validation_db;"

if ($failedFile) {
    Write-Host "`nValidation FAILED at file: $failedFile"
    exit 1
} else {
    Write-Host "`nValidation SUCCESS. All $successCount SQL files are valid and executed perfectly."
    exit 0
}
