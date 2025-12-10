# 🚀 Hướng dẫn Deploy Model Mới

## 📋 Kiến trúc hệ thống

```
┌─────────────┐        ┌──────────────┐        ┌─────────────────┐
│  Frontend   │  HTTP  │  Backend     │  HTTP  │  Python API     │
│  (React)    │───────▶│  (Java)      │───────▶│  (FastAPI)      │
│  Port: 5173 │        │  Port: 8080  │        │  Port: 8000     │
└─────────────┘        └──────────────┘        └─────────────────┘
                                                        │
                                                        ▼
                                                ┌───────────────┐
                                                │  Model Files  │
                                                │  .pkl files   │
                                                └───────────────┘
```

**Flow:**
1. Frontend gửi request đến Backend Java
2. Backend Java gọi Python API: `http://localhost:8000/predict_diabetes`
3. Python API load model và dự đoán
4. Kết quả trả về Frontend

---

## ⚠️ CÂU TRẢ LỜI: CÓ CẦN RESTART KHÔNG?

### ✅ **CÓ - BẠN CẦN RESTART PYTHON API**

**Lý do:**
- Model được load **MỖI LẦN** có request (dòng 100 trong `app.py`)
- Về lý thuyết, model mới sẽ tự động được load ở request tiếp theo
- **NHƯNG** để đảm bảo 100% không có vấn đề về caching, **NÊN RESTART**

**Backend Java:** KHÔNG cần restart (nó chỉ gọi API)  
**Frontend:** KHÔNG cần restart (nó chỉ gọi Backend)  
**Python API:** **CẦN RESTART** ✅

---

## 🔧 CÁCH RESTART PYTHON API

### Bước 1: Tìm Python API đang chạy

#### Cách 1: Tìm trong terminals
```powershell
# Kiểm tra terminal đang chạy
Get-Process | Where-Object {$_.ProcessName -like "*python*"}
```

#### Cách 2: Tìm theo port
```powershell
# Tìm process đang dùng port 8000
netstat -ano | findstr :8000
```

Bạn sẽ thấy output như:
```
TCP    0.0.0.0:8000    0.0.0.0:0    LISTENING    12345
```

Số `12345` là PID (Process ID)

### Bước 2: Stop Python API

#### Option 1: Nếu đang chạy trong terminal
- Nhấn `Ctrl + C` trong terminal đang chạy

#### Option 2: Kill process
```powershell
# Thay 12345 bằng PID thực tế
taskkill /PID 12345 /F
```

### Bước 3: Start lại Python API

```powershell
# Di chuyển vào thư mục AI
cd D:\THUCTAPCOSO\TTCSCN-nhom-30\AI

# Chạy FastAPI
python app.py
```

Hoặc nếu đang dùng uvicorn:
```powershell
uvicorn app:app --host localhost --port 8000 --reload
```

**Lưu ý:** Nếu dùng `--reload`, uvicorn sẽ tự động restart khi code thay đổi, nhưng **KHÔNG tự động reload model file**. Vẫn cần restart thủ công.

---

## ✅ VERIFY MODEL MỚI ĐÃ ĐƯỢC SỬ DỤNG

### Test 1: Gọi trực tiếp Python API

```powershell
# Test bằng curl hoặc PowerShell
Invoke-RestMethod -Uri "http://localhost:8000/predict_diabetes" -Method POST -ContentType "application/json" -Body '{
    "HighBP": 1,
    "HighChol": 1,
    "CholCheck": 1,
    "BMI": 28.5,
    "Smoker": 0,
    "Stroke": 0,
    "HeartDiseaseorAttack": 0,
    "PhysActivity": 1,
    "Fruits": 1,
    "Veggies": 1,
    "HvyAlcoholConsump": 0,
    "AnyHealthcare": 1,
    "NoDocbcCost": 0,
    "GenHlth": 3,
    "MentHlth": 5,
    "PhysHlth": 10,
    "DiffWalk": 0,
    "Sex": 1,
    "Age": 8,
    "Education": 5,
    "Income": 6
}'
```

### Test 2: Kiểm tra log

Sau khi restart, Python API sẽ load model lại. Kiểm tra log trong terminal:
```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Test 3: Test qua Frontend

1. Mở Frontend: `http://localhost:5173`
2. Đăng nhập
3. Thực hiện chẩn đoán với dữ liệu test
4. Kiểm tra kết quả

**Kỳ vọng với Model Mới:**
- Nhiều dự đoán "có nguy cơ" hơn (class 1 hoặc 2)
- Model cũ thường dự đoán "không bệnh" (class 0)

---

## 🔍 TROUBLESHOOTING

### Vấn đề 1: "Model vẫn cho kết quả giống cũ"

**Nguyên nhân:** Model file chưa được load lại

**Giải pháp:**
```powershell
# 1. Stop Python API (Ctrl+C)

# 2. Verify model file đã được cập nhật
dir AI\final_model\diabetesbest_model.pkl

# Kiểm tra LastWriteTime - phải là ngày hôm nay
# Nếu không đúng, chạy lại:
cd AI
cp final_model\diabetes_improved_model.pkl final_model\diabetesbest_model.pkl

# 3. Start lại Python API
python app.py
```

### Vấn đề 2: "Python API không start"

**Lỗi:** `Address already in use`

**Giải pháp:**
```powershell
# Kill process đang dùng port 8000
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F

# Start lại
python app.py
```

### Vấn đề 3: "Backend Java không kết nối được Python API"

**Kiểm tra:**
1. Python API có đang chạy không?
   ```powershell
   netstat -ano | findstr :8000
   ```

2. URL trong Backend Java đúng không?
   - File: `BE\src\main\resources\application.yml`
   - Dòng 29: `baseUrl: "http://localhost:8000"`

3. CORS có được config không?
   - File: `AI\app.py`
   - Dòng 25-33: CORS middleware

---

## 📊 SO SÁNH MODEL CŨ VS MỚI

### Test Case: Người có nguy cơ cao

```json
{
    "HighBP": 1,
    "HighChol": 1,
    "BMI": 32.5,
    "Age": 10,
    "GenHlth": 4,
    "DiffWalk": 1,
    "Smoker": 1,
    ...
}
```

**Model Cũ:** Có thể dự đoán `0` (không bệnh) - BỎ SÓT!  
**Model Mới:** Có khả năng cao dự đoán `1` hoặc `2` - CHÍNH XÁC!

---

## ⚡ SCRIPT TỰ ĐỘNG (Khuyến nghị)

Tạo file `restart_python_api.ps1`:

```powershell
# restart_python_api.ps1
Write-Host "🔄 Restarting Python API..." -ForegroundColor Yellow

# 1. Kill existing Python API
Write-Host "📍 Stopping existing Python API..."
$port = 8000
$connections = netstat -ano | Select-String ":$port.*LISTENING"
if ($connections) {
    $connections | ForEach-Object {
        $pid = $_.Line.Split()[-1]
        Write-Host "  Killing PID: $pid"
        taskkill /PID $pid /F 2>$null
    }
}

# 2. Wait a bit
Start-Sleep -Seconds 2

# 3. Start Python API in background
Write-Host "🚀 Starting Python API..."
cd AI
Start-Process python -ArgumentList "app.py" -WindowStyle Normal

# 4. Wait for startup
Start-Sleep -Seconds 3

# 5. Test API
Write-Host "✅ Testing API..."
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/" -Method GET -TimeoutSec 5
    Write-Host "✅ Python API is running!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to start Python API!" -ForegroundColor Red
}
```

**Chạy:**
```powershell
.\restart_python_api.ps1
```

---

## 📝 CHECKLIST SAU KHI ÁP DỤNG MODEL MỚI

- [x] Model file đã được thay thế (`diabetesbest_model.pkl`)
- [x] Backup model cũ đã tồn tại (`diabetesbest_model_OLD_BACKUP.pkl`)
- [ ] **Python API đã được restart** ✅ QUAN TRỌNG!
- [ ] Test API trực tiếp thành công
- [ ] Test qua Frontend thành công
- [ ] Kiểm tra log không có lỗi
- [ ] Thông báo cho team về việc update model

---

## 🔐 LƯU Ý PRODUCTION

Nếu deploy lên server production:

1. **Sử dụng Process Manager:**
   ```bash
   # PM2 cho Node.js/Python
   pm2 start app.py --name diabetes-api --interpreter python3
   pm2 restart diabetes-api
   ```

2. **Docker:**
   ```dockerfile
   # Rebuild image với model mới
   docker build -t diabetes-api .
   docker stop diabetes-api
   docker rm diabetes-api
   docker run -d -p 8000:8000 --name diabetes-api diabetes-api
   ```

3. **Zero-downtime Deployment:**
   - Deploy instance mới
   - Chuyển traffic sang instance mới
   - Tắt instance cũ

---

## 🎯 TÓM TẮT

### ✅ PHẢI LÀM:
1. **RESTART Python API** (port 8000)
2. Test API hoạt động
3. Verify model mới được sử dụng

### ❌ KHÔNG CẦN:
- Restart Backend Java (port 8080)
- Restart Frontend (port 5173)
- Rebuild bất kỳ service nào

### 🕐 THỜI GIAN:
- Downtime: ~5-10 giây (chỉ trong lúc restart Python API)
- Tổng thời gian: ~2-3 phút (bao gồm test)

---

## 📞 Nếu có vấn đề

1. Kiểm tra logs trong terminal Python API
2. Test trực tiếp endpoint: `http://localhost:8000/docs`
3. Xem file `MODEL_CHANGELOG.md` để hiểu về model mới
4. Rollback nếu cần: `cp final_model\diabetesbest_model_OLD_BACKUP.pkl final_model\diabetesbest_model.pkl`

---

**Ngày tạo:** 10/12/2025  
**Version:** 1.0  
**Status:** ✅ Ready to use

