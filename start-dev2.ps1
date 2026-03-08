$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
Set-Location "C:\Users\user\Downloads\F1\adiyogi-ai"

# Kill existing processes on ports 3000 and 3001
$conns = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -ge 3000 -and $_.LocalPort -le 3005 }
foreach ($c in $conns) {
    Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
}
Start-Sleep -Seconds 3

# Start server on explicit hostname 127.0.0.1
$proc = Start-Process -FilePath "C:\Program Files\nodejs\node.exe" -ArgumentList "node_modules\next\dist\bin\next", "dev", "-p", "3000", "-H", "0.0.0.0" -WorkingDirectory "C:\Users\user\Downloads\F1\adiyogi-ai" -PassThru
Write-Output "Started PID: $($proc.Id)"

Start-Sleep -Seconds 15

# Check binding
Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -eq 3000 } | Select-Object LocalAddress, LocalPort, OwningProcess | Format-Table

# Test both IPv4 and IPv6
try {
    $r = Invoke-WebRequest -Uri "http://127.0.0.1:3000" -UseBasicParsing -TimeoutSec 10
    Write-Output "IPv4 127.0.0.1: Status $($r.StatusCode)"
} catch {
    Write-Output "IPv4 127.0.0.1: FAILED - $($_.Exception.Message)"
}

try {
    $r = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
    Write-Output "localhost: Status $($r.StatusCode)"
} catch {
    Write-Output "localhost: FAILED - $($_.Exception.Message)"
}
