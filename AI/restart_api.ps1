# restart_api.ps1 - Script restart Python API

Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "   RESTART PYTHON API - AP DUNG MODEL MOI" -ForegroundColor Cyan
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Stop existing Python API
Write-Host "[1/4] Dang dung Python API hien tai..." -ForegroundColor Yellow

$port = 8000
$connections = netstat -ano | Select-String ":$port.*LISTENING"

if ($connections) {
    $connections | ForEach-Object {
        $line = $_.Line
        $parts = $line -split '\s+' | Where-Object { $_ -ne '' }
        $processId = $parts[-1]
        
        if ($processId -match '^\d+$') {
            Write-Host "  Tim thay process PID: $processId" -ForegroundColor Gray
            try {
                Stop-Process -Id $processId -Force -ErrorAction Stop
                Write-Host "  Da dung PID: $processId" -ForegroundColor Green
            } catch {
                Write-Host "  Khong the dung PID: $processId" -ForegroundColor Red
            }
        }
    }
    Start-Sleep -Seconds 3
} else {
    Write-Host "  Python API khong dang chay" -ForegroundColor Gray
}

Write-Host ""

# 2. Start Python API
Write-Host "[2/4] Dang khoi dong Python API..." -ForegroundColor Yellow

if (-not (Test-Path "app.py")) {
    Write-Host "  Loi: Khong tim thay app.py!" -ForegroundColor Red
    exit 1
}

try {
    $process = Start-Process python -ArgumentList "app.py" -PassThru -WindowStyle Normal
    Write-Host "  Da khoi dong (PID: $($process.Id))" -ForegroundColor Green
    Write-Host "  Doi 5 giay de API khoi dong..." -ForegroundColor Gray
    Start-Sleep -Seconds 5
} catch {
    Write-Host "  Loi khoi dong: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 3. Test API
Write-Host "[3/4] Kiem tra API hoat dong..." -ForegroundColor Yellow

$maxRetries = 3
$retryCount = 0
$apiOk = $false

while (($retryCount -lt $maxRetries) -and (-not $apiOk)) {
    try {
        $null = Invoke-RestMethod -Uri "http://localhost:8000/" -Method GET -TimeoutSec 5
        Write-Host "  API dang chay!" -ForegroundColor Green
        $apiOk = $true
    } catch {
        $retryCount++
        if ($retryCount -lt $maxRetries) {
            Write-Host "  Thu lai ($retryCount/$maxRetries)..." -ForegroundColor Gray
            Start-Sleep -Seconds 2
        }
    }
}

if (-not $apiOk) {
    Write-Host "  Khong the ket noi sau $maxRetries lan thu" -ForegroundColor Red
    Write-Host "  Kiem tra thu cong tai: http://localhost:8000/docs" -ForegroundColor Yellow
}

Write-Host ""

# 4. Test prediction
if ($apiOk) {
    Write-Host "[4/4] Test du doan voi model moi..." -ForegroundColor Yellow
    
    $testData = @{
        HighBP = 1
        HighChol = 1
        CholCheck = 1
        BMI = 28.5
        Smoker = 0
        Stroke = 0
        HeartDiseaseorAttack = 0
        PhysActivity = 1
        Fruits = 1
        Veggies = 1
        HvyAlcoholConsump = 0
        AnyHealthcare = 1
        NoDocbcCost = 0
        GenHlth = 3
        MentHlth = 5
        PhysHlth = 10
        DiffWalk = 0
        Sex = 1
        Age = 8
        Education = 5
        Income = 6
    }
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8000/predict_diabetes" `
            -Method POST `
            -ContentType "application/json" `
            -Body ($testData | ConvertTo-Json) `
            -TimeoutSec 10
        
        $prediction = $response.prediction
        Write-Host "  Du doan thanh cong: Class $prediction" -ForegroundColor Green
        
        if ($prediction -eq 0) {
            Write-Host "    Ket qua: Khong benh" -ForegroundColor Cyan
        } elseif ($prediction -eq 1) {
            Write-Host "    Ket qua: Prediabetes" -ForegroundColor Cyan
        } else {
            Write-Host "    Ket qua: Diabetes" -ForegroundColor Cyan
        }
        
    } catch {
        Write-Host "  Khong the test du doan" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host "                        HOAN TAT!" -ForegroundColor Green
Write-Host "===================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Thong tin:" -ForegroundColor White
Write-Host "  Python API: http://localhost:8000" -ForegroundColor Gray
Write-Host "  API Docs: http://localhost:8000/docs" -ForegroundColor Gray
Write-Host "  Model: final_model/diabetesbest_model.pkl" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Test qua Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host "  2. Doc DEPLOYMENT_GUIDE.md de biet them" -ForegroundColor Gray
Write-Host ""
