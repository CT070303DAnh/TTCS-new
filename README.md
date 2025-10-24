# 🩺 Diabetes Care - Hệ thống Chẩn đoán Tiểu đường

Dự án web application chẩn đoán nguy cơ tiểu đường sử dụng Machine Learning và Spring Boot + ReactJS.

## 📋 Mô tả dự án

Diabetes Care là một hệ thống chẩn đoán nguy cơ tiểu đường thông minh, sử dụng:
- **AI/Machine Learning** (Python + FastAPI) để dự đoán nguy cơ
- **Backend** (Java Spring Boot) quản lý người dùng, xác thực và lưu trữ lịch sử
- **Frontend** (ReactJS + Tailwind CSS) giao diện người dùng đẹp mắt
- **Database** (MySQL) lưu trữ dữ liệu

## 🏗️ Cấu trúc dự án

```
TTCSCN-nhom-30/
├── AI/                    # Python ML API
│   ├── app.py            # FastAPI server
│   ├── final_model/      # Mô hình đã train
│   └── requirements.txt
├── BE/                    # Java Spring Boot Backend
│   ├── src/
│   └── pom.xml
├── FE/                    # ReactJS Frontend
│   ├── src/
│   └── package.json
└── README.md
```

## ✨ Tính năng

### 🔐 Xác thực người dùng
- Đăng ký/Đăng nhập với JWT
- Bảo mật thông tin người dùng

### 🏥 Chẩn đoán
- Nhập 21 chỉ số sức khỏe (BMI, huyết áp, cholesterol...)
- Dropdown thân thiện với giải thích rõ ràng
- Máy tính BMI tích hợp
- Dự đoán nguy cơ tiểu đường bằng AI
- **Lời khuyên sức khỏe cá nhân hóa** dựa trên kết quả

### 📊 Lịch sử
- Xem lại các lần chẩn đoán
- Chi tiết các chỉ số đã nhập
- Thống kê theo thời gian

### 🎨 Giao diện
- Modern, responsive design với Tailwind CSS
- Animations mượt mà
- Dark mode ready
- Mobile-friendly

## 🚀 Cài đặt và chạy

### 1. Chuẩn bị

- **Python**: 3.11+
- **Java**: JDK 17+
- **Node.js**: 18+
- **MySQL**: 8.0+ (XAMPP)
- **Maven**: 3.8+

### 2. Chạy Python AI API

```bash
cd AI
pip install -r requirements.txt
python -m uvicorn app:app --reload
```

API sẽ chạy tại: `http://localhost:8000`

### 3. Chạy Backend (Spring Boot)

```bash
cd BE
mvn clean install
mvn spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080`

**Hoặc chạy từ IntelliJ IDEA:**
- Mở folder `BE` trong IntelliJ
- Reload Maven project
- Run `DiabetesBackendApplication.java`

### 4. Chạy Frontend (ReactJS)

```bash
cd FE
npm install
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

### 5. Cấu hình Database

1. Mở XAMPP, start MySQL
2. Tạo database `diabetes_db` (hoặc để Spring Boot tự tạo)
3. Cấu hình trong `BE/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/diabetes_db?createDatabaseIfNotExist=true
    username: root
    password: 
```

## 📖 Hướng dẫn sử dụng

1. **Đăng ký tài khoản** tại `/register`
2. **Đăng nhập** tại `/login`
3. **Chẩn đoán** tại `/diagnosis`:
   - Điền các chỉ số sức khỏe
   - Sử dụng máy tính BMI nếu cần
   - Nhấn "Dự đoán ngay"
   - Xem kết quả và lời khuyên
4. **Xem lịch sử** tại `/history`

## 🛠️ Stack công nghệ

### AI/ML
- Python 3.11
- FastAPI
- scikit-learn
- pandas, numpy

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security (JWT)
- Spring Data JPA
- MySQL 8.2
- Lombok
- Maven

### Frontend
- ReactJS 18
- TypeScript
- Vite
- React Router DOM
- Axios
- Tailwind CSS 3
- PostCSS

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

### Diagnosis
- `POST /api/diagnosis` - Chẩn đoán (cần JWT)
- `GET /api/diagnosis/history` - Lịch sử (cần JWT)

### Python AI
- `POST /predict_diabetes` - Dự đoán tiểu đường

## 👥 Nhóm phát triển

**Nhóm 30 - TTCSCN**

## ⚠️ Lưu ý

Kết quả chẩn đoán chỉ mang tính tham khảo và **KHÔNG THAY THẾ** chẩn đoán y tế chuyên nghiệp. Nếu có dấu hiệu bất thường, vui lòng tham khảo bác sĩ.

## 📄 License

MIT License - Dự án học tập

---

Made with ❤️ by Nhóm 30

