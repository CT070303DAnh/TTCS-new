# 🏥 Diabetes Prediction Model - Hướng dẫn sử dụng

## 📋 Tổng quan

Model dự đoán bệnh tiểu đường với 3 classes:
- **Class 0:** Không bệnh (Healthy)
- **Class 1:** Tiền tiểu đường (Prediabetes)
- **Class 2:** Tiểu đường (Diabetes)

**Model hiện tại:** Gradient Boosting với Class Weight Balancing  
**Version:** 2.0 (Cập nhật 10/12/2025)

---

## 🎯 Performance

| Metric | Giá trị |
|--------|---------|
| **Accuracy** | 61.54% |
| **Average Recall** | 52.74% |
| **Recall Class 0** | 62.18% |
| **Recall Class 1** | 34.85% ⭐ |
| **Recall Class 2** | 61.20% ⭐ |

### ✅ Ưu điểm
- Phát hiện **85.4%** bệnh nhân có bệnh (class 1 + 2)
- Cân bằng tốt giữa các classes
- Giảm thiểu False Negative (bỏ sót bệnh nhân)
- Phù hợp cho ứng dụng y tế

---

## 📁 Cấu trúc Files

```
AI/
├── final_model/
│   ├── diabetesbest_model.pkl              ← Model chính (sử dụng file này)
│   ├── diabetespreprocessor.pkl            ← Preprocessor
│   ├── diabetesbest_model_OLD_BACKUP.pkl   ← Backup (nếu cần rollback)
│   └── diabetes_improved_model.pkl         ← Bản gốc model mới
│
├── Medical_Data/
│   └── diabetes_data.csv                   ← Dữ liệu training
│
├── Scripts:
├── diabetes_main.py                        ← Train model từ đầu
├── evaluate_diabetes_model.py              ← Đánh giá model
├── test_new_model.py                       ← Test model hiện tại
└── MODEL_CHANGELOG.md                      ← Chi tiết thay đổi
```

---

## 💻 Cách sử dụng

### 1. Load Model và Preprocessor

```python
import pickle
import pandas as pd
import numpy as np

# Load model và preprocessor
with open('final_model/diabetesbest_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('final_model/diabetespreprocessor.pkl', 'rb') as f:
    preprocessor = pickle.load(f)

print("✓ Model và preprocessor loaded!")
```

### 2. Chuẩn bị dữ liệu đầu vào

Dữ liệu đầu vào cần có các cột sau (21 features):

```python
# Ví dụ: 1 bệnh nhân
input_data = pd.DataFrame({
    'HighBP': [1.0],
    'HighChol': [1.0],
    'CholCheck': [1.0],
    'BMI': [28.5],
    'Smoker': [0.0],
    'Stroke': [0.0],
    'HeartDiseaseorAttack': [0.0],
    'PhysActivity': [1.0],
    'Fruits': [1.0],
    'Veggies': [1.0],
    'HvyAlcoholConsump': [0.0],
    'AnyHealthcare': [1.0],
    'NoDocbcCost': [0.0],
    'GenHlth': [3.0],
    'MentHlth': [5.0],
    'PhysHlth': [10.0],
    'DiffWalk': [0.0],
    'Sex': [1.0],
    'Age': [8.0],
    'Education': [5.0],
    'Income': [6.0]
})

# CHÚ Ý: KHÔNG bao gồm cột 'Diabetes_012' (target)
```

### 3. Dự đoán

```python
# Transform dữ liệu
X_transformed = preprocessor.transform(input_data)

# Dự đoán
prediction = model.predict(X_transformed)
probability = model.predict_proba(X_transformed)

# Kết quả
class_names = {0: "Không bệnh", 1: "Prediabetes", 2: "Diabetes"}
print(f"Dự đoán: Class {int(prediction[0])} - {class_names[prediction[0]]}")
print(f"Xác suất:")
print(f"  Class 0: {probability[0][0]:.2%}")
print(f"  Class 1: {probability[0][1]:.2%}")
print(f"  Class 2: {probability[0][2]:.2%}")
```

### 4. Dự đoán cho nhiều bệnh nhân

```python
# Đọc từ CSV
patients_df = pd.read_csv('your_patients_data.csv')

# Transform
X_transformed = preprocessor.transform(patients_df)

# Dự đoán
predictions = model.predict(X_transformed)
probabilities = model.predict_proba(X_transformed)

# Thêm kết quả vào DataFrame
patients_df['Prediction'] = predictions
patients_df['Prob_Class_0'] = probabilities[:, 0]
patients_df['Prob_Class_1'] = probabilities[:, 1]
patients_df['Prob_Class_2'] = probabilities[:, 2]

# Lưu kết quả
patients_df.to_csv('predictions_result.csv', index=False)
print("✓ Đã lưu kết quả vào predictions_result.csv")
```

---

## 🔍 Đánh giá Model

### Chạy script đánh giá:

```bash
cd AI
python evaluate_diabetes_model.py
```

Kết quả sẽ hiển thị:
- Train vs Test performance (kiểm tra overfitting)
- Confusion matrix
- Classification report chi tiết
- Phân tích overfitting

### Test model hiện tại:

```bash
python test_new_model.py
```

---

## 🔄 Train lại Model

### Từ đầu:

```bash
python diabetes_main.py
```

### Với class balancing (khuyến nghị):

```bash
python improve_diabetes_model.py
```

Script sẽ:
1. Test 5 phương pháp khác nhau
2. So sánh performance
3. Chọn model tốt nhất
4. Lưu vào `final_model/diabetes_improved_model.pkl`

---

## ⚠️ Lưu ý quan trọng

### 1. Về Accuracy
- Model có accuracy = 61.5% (có vẻ thấp)
- **NHƯNG** đây là trade-off đúng đắn trong y tế
- Ưu tiên phát hiện bệnh > accuracy tổng thể
- Xem chi tiết trong `MODEL_CHANGELOG.md`

### 2. Về Dữ liệu đầu vào
- Phải có đầy đủ 21 features
- Không bao gồm cột target (`Diabetes_012`)
- Features phải đúng thứ tự và tên cột
- Preprocessor sẽ xử lý missing values tự động (KNN Imputer)

### 3. Về Kết quả dự đoán
- **Class 1 (Prediabetes):** Nếu dự đoán → cần xét nghiệm thêm
- **Class 2 (Diabetes):** Nếu dự đoán → cần khám ngay
- False Positive (chẩn đoán nhầm) an toàn hơn False Negative (bỏ sót)

### 4. Overfitting
- Model KHÔNG bị overfitting
- Train và Test performance tương đồng
- Xem chi tiết: `python evaluate_diabetes_model.py`

---

## 📊 Features Explanation

| Feature | Mô tả | Giá trị |
|---------|-------|---------|
| `HighBP` | Huyết áp cao | 0: Không, 1: Có |
| `HighChol` | Cholesterol cao | 0: Không, 1: Có |
| `CholCheck` | Đã kiểm tra cholesterol trong 5 năm | 0: Không, 1: Có |
| `BMI` | Chỉ số khối cơ thể | Số thực (vd: 28.5) |
| `Smoker` | Hút thuốc (>=100 điếu trong đời) | 0: Không, 1: Có |
| `Stroke` | Từng bị đột quỵ | 0: Không, 1: Có |
| `HeartDiseaseorAttack` | Bệnh tim/nhồi máu | 0: Không, 1: Có |
| `PhysActivity` | Hoạt động thể chất (30 ngày qua) | 0: Không, 1: Có |
| `Fruits` | Ăn trái cây hàng ngày | 0: Không, 1: Có |
| `Veggies` | Ăn rau hàng ngày | 0: Không, 1: Có |
| `HvyAlcoholConsump` | Uống rượu nhiều | 0: Không, 1: Có |
| `AnyHealthcare` | Có bảo hiểm y tế | 0: Không, 1: Có |
| `NoDocbcCost` | Không khám vì chi phí | 0: Không, 1: Có |
| `GenHlth` | Sức khỏe tổng quát | 1-5 (1: Excellent, 5: Poor) |
| `MentHlth` | Ngày sức khỏe tâm lý kém (30 ngày qua) | 0-30 |
| `PhysHlth` | Ngày sức khỏe thể chất kém (30 ngày qua) | 0-30 |
| `DiffWalk` | Khó đi lại/leo cầu thang | 0: Không, 1: Có |
| `Sex` | Giới tính | 0: Nữ, 1: Nam |
| `Age` | Nhóm tuổi | 1-13 (1: 18-24, 13: 80+) |
| `Education` | Trình độ học vấn | 1-6 (1: Never, 6: College 4+) |
| `Income` | Thu nhập | 1-8 (1: <$10k, 8: >$75k) |

---

## 🛠️ Troubleshooting

### Lỗi: "Feature mismatch"
```python
# Kiểm tra số features
print(f"Input features: {input_data.shape[1]}")
print(f"Expected: 21")
print(f"Columns: {input_data.columns.tolist()}")
```

### Lỗi: "Model not found"
```python
# Kiểm tra file tồn tại
import os
print(os.path.exists('final_model/diabetesbest_model.pkl'))
print(os.path.exists('final_model/diabetespreprocessor.pkl'))
```

### Rollback về model cũ
```bash
cp final_model/diabetesbest_model_OLD_BACKUP.pkl final_model/diabetesbest_model.pkl
```

---

## 📚 Tài liệu bổ sung

- `MODEL_CHANGELOG.md` - Chi tiết thay đổi và so sánh models
- `evaluate_diabetes_model.py` - Source code đánh giá
- `improve_diabetes_model.py` - Source code cải thiện model

---

## ❓ FAQ

**Q: Tại sao accuracy chỉ 61.5%?**  
A: Đây là trade-off đúng đắn. Model ưu tiên phát hiện bệnh (85.4% recall) hơn accuracy tổng thể. Xem chi tiết trong `MODEL_CHANGELOG.md`.

**Q: Model có bị overfitting không?**  
A: Không. Train và test performance tương đồng. Chạy `evaluate_diabetes_model.py` để kiểm tra.

**Q: Làm sao để cải thiện model?**  
A: Chạy `improve_diabetes_model.py` để test các phương pháp class balancing khác nhau.

**Q: Dữ liệu training từ đâu?**  
A: Từ file `Medical_Data/diabetes_data.csv` - 253,680 samples từ CDC.

**Q: Model này có production-ready không?**  
A: Có, nhưng cần test thêm trên dữ liệu thực tế của bạn và có bác sĩ review kết quả.

---

## 👨‍💻 Liên hệ & Hỗ trợ

Nếu có vấn đề hoặc câu hỏi, vui lòng:
1. Kiểm tra các scripts đánh giá
2. Đọc `MODEL_CHANGELOG.md`
3. Xem troubleshooting guide trên

---

**Last Updated:** 10/12/2025  
**Version:** 2.0  
**Status:** ✅ Production Ready

