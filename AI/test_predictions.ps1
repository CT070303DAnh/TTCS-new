# test_predictions.ps1 - Script test predictions với các mẫu dữ liệu

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "         TEST MODEL DỰ ĐOÁN BỆNH TIỂU ĐƯỜNG" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Function để test prediction
function Test-Prediction {
    param(
        [string]$Name,
        [string]$Description,
        [hashtable]$Data
    )
    
    Write-Host "📋 $Name" -ForegroundColor White
    Write-Host "   Mô tả: $Description" -ForegroundColor Gray
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8000/predict_diabetes" `
            -Method POST `
            -ContentType "application/json" `
            -Body ($Data | ConvertTo-Json) `
            -TimeoutSec 10
        
        $prediction = $response.prediction
        
        if ($prediction -eq 0) {
            Write-Host "   ✅ Kết quả: Class $prediction - KHÔNG BỆNH (Healthy)" -ForegroundColor Green
        } elseif ($prediction -eq 1) {
            Write-Host "   ⚠️  Kết quả: Class $prediction - TIỀN TIỂU ĐƯỜNG (Prediabetes)" -ForegroundColor Yellow
        } else {
            Write-Host "   ❌ Kết quả: Class $prediction - TIỂU ĐƯỜNG (Diabetes)" -ForegroundColor Red
        }
        
    } catch {
        Write-Host "   ❌ Lỗi: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Test samples

Write-Host "🔬 PREDIABETES SAMPLES (Tiền tiểu đường)" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host ""

# Sample 1: Prediabetes
Test-Prediction -Name "Trường hợp 1: Người trung niên, thừa cân nhẹ" `
    -Description "Người 50 tuổi, thừa cân, huyết áp cao nhẹ, cholesterol cao" `
    -Data @{
        HighBP=1; HighChol=1; CholCheck=1; BMI=27.5; Smoker=0; Stroke=0;
        HeartDiseaseorAttack=0; PhysActivity=0; Fruits=1; Veggies=1;
        HvyAlcoholConsump=0; AnyHealthcare=1; NoDocbcCost=0; GenHlth=3;
        MentHlth=5; PhysHlth=5; DiffWalk=0; Sex=1; Age=9; Education=5; Income=6
    }

# Sample 2: Prediabetes
Test-Prediction -Name "Trường hợp 2: Người có BMI cao, ít vận động" `
    -Description "Tuổi 45, BMI 29, không tập thể dục, sức khỏe trung bình" `
    -Data @{
        HighBP=1; HighChol=1; CholCheck=1; BMI=29.0; Smoker=0; Stroke=0;
        HeartDiseaseorAttack=0; PhysActivity=0; Fruits=0; Veggies=0;
        HvyAlcoholConsump=0; AnyHealthcare=1; NoDocbcCost=0; GenHlth=3;
        MentHlth=3; PhysHlth=3; DiffWalk=0; Sex=0; Age=8; Education=6; Income=7
    }

# Sample 3: Prediabetes
Test-Prediction -Name "Trường hợp 3: Người có tiền sử gia đình" `
    -Description "55 tuổi, huyết áp cao, cholesterol cao, hút thuốc, sức khỏe kém" `
    -Data @{
        HighBP=1; HighChol=1; CholCheck=1; BMI=28.0; Smoker=1; Stroke=0;
        HeartDiseaseorAttack=0; PhysActivity=0; Fruits=0; Veggies=1;
        HvyAlcoholConsump=0; AnyHealthcare=1; NoDocbcCost=0; GenHlth=4;
        MentHlth=10; PhysHlth=10; DiffWalk=1; Sex=1; Age=10; Education=4; Income=5
    }

Write-Host ""
Write-Host "🚨 DIABETES SAMPLE (Tiểu đường)" -ForegroundColor Red
Write-Host "============================================================" -ForegroundColor Red
Write-Host ""

# Sample 4: Diabetes
Test-Prediction -Name "Trường hợp 4: Bệnh tiểu đường rõ ràng" `
    -Description "60 tuổi, béo phì (BMI 35), huyết áp cao, bệnh tim" `
    -Data @{
        HighBP=1; HighChol=1; CholCheck=1; BMI=35.0; Smoker=1; Stroke=0;
        HeartDiseaseorAttack=1; PhysActivity=0; Fruits=0; Veggies=0;
        HvyAlcoholConsump=0; AnyHealthcare=1; NoDocbcCost=1; GenHlth=5;
        MentHlth=15; PhysHlth=20; DiffWalk=1; Sex=1; Age=11; Education=3; Income=3
    }

Write-Host ""
Write-Host "✅ HEALTHY SAMPLE (Khỏe mạnh)" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""

# Sample 5: Healthy
Test-Prediction -Name "Trường hợp 5: Người khỏe mạnh" `
    -Description "35 tuổi, BMI bình thường, tập thể dục đều đặn" `
    -Data @{
        HighBP=0; HighChol=0; CholCheck=1; BMI=22.5; Smoker=0; Stroke=0;
        HeartDiseaseorAttack=0; PhysActivity=1; Fruits=1; Veggies=1;
        HvyAlcoholConsump=0; AnyHealthcare=1; NoDocbcCost=0; GenHlth=1;
        MentHlth=0; PhysHlth=0; DiffWalk=0; Sex=1; Age=6; Education=6; Income=8
    }

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "                    HOÀN TẤT!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Để sử dụng data này cho Frontend/Backend:" -ForegroundColor White
Write-Host "   Xem file: test_data_samples.json" -ForegroundColor Gray
Write-Host ""

