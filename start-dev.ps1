$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
Set-Location "C:\Users\user\Downloads\F1\adiyogi-ai"

# Kill existing processes on port 3000
$conns = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -eq 3000 }
foreach ($c in $conns) {
    Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
}
Start-Sleep -Seconds 2

# Start the dev server
Start-Process -FilePath "C:\Program Files\nodejs\node.exe" -ArgumentList "node_modules\next\dist\bin\next", "dev", "-p", "3000" -WorkingDirectory "C:\Users\user\Downloads\F1\adiyogi-ai" -WindowStyle Hidden

Start-Sleep -Seconds 12

# Test if server is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
    Write-Output "Server running! Status: $($response.StatusCode)"
} catch {
    Write-Output "Error: $($_.Exception.Message)"
}
