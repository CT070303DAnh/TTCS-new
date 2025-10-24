# 🤖 AI Module - Diabetes Care

Python Machine Learning API cho dự đoán nguy cơ tiểu đường.

## 📋 Mô tả

Module này cung cấp REST API sử dụng FastAPI để dự đoán nguy cơ tiểu đường dựa trên mô hình Machine Learning đã được huấn luyện trước.

## 🏗️ Cấu trúc

```
AI/
├── app.py                      # FastAPI application
├── requirements.txt            # Python dependencies
├── final_model/               # Trained models
│   ├── diabetesbest_model.pkl
│   └── diabetespreprocessor.pkl
├── Data_Store/                # Training/test data
│   └── diabetes/
│       ├── train.csv
│       └── test.csv
└── Medical_Data/              # Raw datasets
    └── diabetes_data.csv
```

## 🚀 Cài đặt và chạy

### 1. Cài đặt dependencies

```bash
cd AI
pip install -r requirements.txt
```

### 2. Chạy server

```bash
# Cách 1: Uvicorn trực tiếp
uvicorn app:app --reload

# Cách 2: Python module
python -m uvicorn app:app --reload

# Cách 3: Từ folder gốc
cd AI
python app.py
```

Server sẽ chạy tại: `http://localhost:8000`

### 3. Test API

#### Sử dụng curl (PowerShell)

```powershell
$testData = @'
{
  "HighBP": 0,
  "HighChol": 0,
  "CholCheck": 1,
  "BMI": 25,
  "Smoker": 0,
  "Stroke": 0,
  "HeartDiseaseorAttack": 0,
  "PhysActivity": 1,
  "Fruits": 1,
  "Veggies": 1,
  "HvyAlcoholConsump": 0,
  "AnyHealthcare": 1,
  "NoDocbcCost": 0,
  "GenHlth": 2,
  "MentHlth": 0,
  "PhysHlth": 0,
  "DiffWalk": 0,
  "Sex": 1,
  "Age": 5,
  "Education": 4,
  "Income": 5
}
'@

Invoke-RestMethod -Uri "http://localhost:8000/predict_diabetes" -Method POST -Body $testData -ContentType "application/json"
```

## 🔌 API Endpoints

### GET /
**Description**: Root endpoint  
**Response**:
```json
{
  "message": "Diabetes Prediction API"
}
```

### POST /predict_diabetes
**Description**: Dự đoán nguy cơ tiểu đường  
**Request Body**:
```json
{
  "HighBP": 0,
  "HighChol": 0,
  "CholCheck": 1,
  "BMI": 25.5,
  "Smoker": 0,
  "Stroke": 0,
  "HeartDiseaseorAttack": 0,
  "PhysActivity": 1,
  "Fruits": 1,
  "Veggies": 1,
  "HvyAlcoholConsump": 0,
  "AnyHealthcare": 1,
  "NoDocbcCost": 0,
  "GenHlth": 2,
  "MentHlth": 0,
  "PhysHlth": 0,
  "DiffWalk": 0,
  "Sex": 1,
  "Age": 5,
  "Education": 4,
  "Income": 5
}
```

**Response**:
```json
{
  "prediction": 0
}
```

- `prediction = 0`: Không có nguy cơ
- `prediction = 1`: Có nguy cơ tiểu đường

## 📊 Input Features (21 chỉ số)

| Feature | Type | Values | Description |
|---------|------|--------|-------------|
| HighBP | int | 0, 1 | Huyết áp cao |
| HighChol | int | 0, 1 | Cholesterol cao |
| CholCheck | int | 0, 1 | Kiểm tra cholesterol trong 5 năm |
| BMI | float | 10-60 | Chỉ số khối cơ thể |
| Smoker | int | 0, 1 | Hút thuốc (≥100 điếu) |
| Stroke | int | 0, 1 | Đột quỵ |
| HeartDiseaseorAttack | int | 0, 1 | Bệnh tim/Nhồi máu |
| PhysActivity | int | 0, 1 | Hoạt động thể chất |
| Fruits | int | 0, 1 | Ăn hoa quả (≥1 lần/ngày) |
| Veggies | int | 0, 1 | Ăn rau (≥1 lần/ngày) |
| HvyAlcoholConsump | int | 0, 1 | Uống rượu nhiều |
| AnyHealthcare | int | 0, 1 | Có bảo hiểm y tế |
| NoDocbcCost | int | 0, 1 | Bỏ khám vì chi phí |
| GenHlth | int | 1-5 | Sức khỏe tổng quát (1=Tốt, 5=Kém) |
| MentHlth | int | 0-30 | Ngày tinh thần không tốt (tháng) |
| PhysHlth | int | 0-30 | Ngày thể chất không tốt (tháng) |
| DiffWalk | int | 0, 1 | Khó khăn đi lại |
| Sex | int | 0, 1 | Giới tính (0=Nữ, 1=Nam) |
| Age | int | 1-13 | Nhóm tuổi (1=18-24, 13=80+) |
| Education | int | 1-6 | Trình độ học vấn |
| Income | int | 1-8 | Mức thu nhập |

## 🧠 Model Information

### Algorithm
- **Type**: Classification (Binary)
- **Training Data**: ~250,000 samples
- **Features**: 21 input features
- **Output**: 0 (No diabetes) or 1 (Diabetes)

### Files
- `diabetesbest_model.pkl`: Trained model
- `diabetespreprocessor.pkl`: Data preprocessor (scaling, encoding...)

## 📦 Dependencies

```txt
fastapi
uvicorn
pandas
numpy
scikit-learn
pydantic
```

## 🔧 Configuration

### CORS
API cho phép CORS từ:
- `http://localhost:5173` (Vite)
- `http://localhost:3000` (React)
- `http://localhost:8080` (Spring Boot)

### Port
Default: `8000`

Thay đổi port:
```bash
uvicorn app:app --reload --port 8001
```

## 🐛 Troubleshooting

### Lỗi "uvicorn not found"
```bash
pip install uvicorn
# Hoặc
python -m pip install -r requirements.txt
```

### Lỗi "Module not found"
```bash
# Cài đặt lại dependencies
pip install -r requirements.txt
```

### Model file không tìm thấy
Đảm bảo các file model tồn tại:
- `final_model/diabetesbest_model.pkl`
- `final_model/diabetespreprocessor.pkl`

## 📈 Performance

- **Response Time**: < 100ms
- **Accuracy**: ~85% (trên test set)
- **Throughput**: Hàng trăm requests/giây

## 🔒 Security Notes

- API hiện tại không có authentication
- Chỉ dùng cho development/testing
- Production cần thêm API key hoặc OAuth

---

Made with ❤️ by Nhóm 30

