# 🔙 Backend - Diabetes Care

Backend Java Spring Boot cho hệ thống chẩn đoán tiểu đường.

## 🏗️ Kiến trúc

### Hybrid MVC Pattern

```
src/main/java/com/medic/
├── DiabetesBackendApplication.java    # Main class
├── common/                             # Shared components
│   ├── config/                         # Configurations
│   │   ├── SecurityConfig.java        # Spring Security + CORS
│   │   ├── ApplicationConfig.java     # Auth providers
│   │   ├── ObjectMapperConfig.java    # JSON mapper
│   │   └── RestTemplateConfig.java    # HTTP client
│   ├── exception/                      # Exception handling
│   │   ├── GlobalExceptionHandler.java
│   │   └── ResourceNotFoundException.java
│   └── dto/                            # Common DTOs
│       └── ApiResponse.java
├── auth/                               # Authentication module
│   ├── controller/
│   │   └── AuthController.java
│   ├── service/
│   │   ├── AuthService.java
│   │   └── JwtService.java
│   ├── filter/
│   │   └── JwtAuthFilter.java
│   └── dto/
│       ├── LoginRequest.java
│       ├── RegisterRequest.java
│       └── TokenResponse.java
├── user/                               # User module
│   ├── entity/
│   │   └── User.java
│   └── repository/
│       └── UserRepository.java
└── diagnosis/                          # Diagnosis module
    ├── entity/
    │   └── Diagnosis.java
    ├── repository/
    │   └── DiagnosisRepository.java
    ├── controller/
    │   └── DiagnosisController.java
    ├── service/
    │   └── DiagnosisService.java
    └── dto/
        ├── DiagnosisResponse.java
        └── DiagnosisHistoryDTO.java
```

## 🔧 Cấu hình

### application.yml

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/diabetes_db?createDatabaseIfNotExist=true
    username: root
    password: 
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

server:
  port: 8080

app:
  jwt:
    secret: "bXlzZWNyZXRrZXloZXJlZm9yZGlhYmV0ZXNjYXJlYXBwMjAyNQ=="
    expirationMs: 604800000  # 7 days
  pythonApi:
    baseUrl: "http://localhost:8000"
```

## 🚀 Chạy ứng dụng

### Từ Maven

```bash
mvn clean install
mvn spring-boot:run
```

### Từ IntelliJ IDEA

1. Mở folder `BE` trong IntelliJ
2. **Reload Maven Project**: Right-click `pom.xml` → Maven → Reload Project
3. **Enable Annotation Processing**: 
   - `File → Settings → Build, Execution, Deployment → Compiler → Annotation Processors`
   - Check ✅ "Enable annotation processing"
4. Install Lombok Plugin (nếu chưa có)
5. Run `DiabetesBackendApplication.java`

### Troubleshooting

#### Lỗi "Could not find or load main class"
```bash
# Clean và rebuild
mvn clean compile
# Hoặc trong IntelliJ: Build → Rebuild Project
```

#### Lỗi "package lombok does not exist"
- Enable Annotation Processing (xem bước 3 trên)
- Install Lombok Plugin

#### Lỗi Spring package not found
```bash
# Reload Maven với force update
mvn clean install -U
```

#### Circular Dependency
- Đã fix bằng cách tách `PasswordEncoder` ra `ApplicationConfig`

## 🔐 Security

### JWT Authentication

- **Algorithm**: HS256
- **Secret**: 256-bit key (base64 encoded)
- **Expiration**: 7 days
- **Header**: `Authorization: Bearer <token>`

### Endpoints

- **Public**: `/api/auth/**`
- **Protected**: Tất cả endpoints khác (cần JWT)

### CORS

Cho phép từ:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)

## 📊 Database Schema

### Table: users

| Column     | Type         | Description |
|------------|-------------|-------------|
| id         | BIGINT (PK) | Auto increment |
| email      | VARCHAR     | Unique, not null |
| password   | VARCHAR     | BCrypt hashed |
| full_name  | VARCHAR     | - |
| created_at | DATETIME    | Auto timestamp |

### Table: diagnoses

| Column      | Type         | Description |
|-------------|-------------|-------------|
| id          | BIGINT (PK) | Auto increment |
| user_id     | BIGINT (FK) | → users.id |
| prediction  | INT         | 0 or 1 |
| input_json  | TEXT        | JSON chỉ số |
| created_at  | DATETIME    | Auto timestamp |

## 🔌 API Endpoints

### POST /api/auth/register
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com"
}
```

### POST /api/auth/login
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com"
}
```

### POST /api/diagnosis
**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "HighBP": 0,
  "HighChol": 0,
  "BMI": 25.5,
  ...
}
```

**Response:**
```json
{
  "prediction": 0,
  "message": "Không có nguy cơ tiểu đường..."
}
```

### GET /api/diagnosis/history
**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "prediction": 0,
    "inputData": { ... },
    "createdAt": "2025-01-15T10:30:00"
  }
]
```

## 📦 Dependencies

- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- MySQL Connector/J
- JJWT (JWT library)
- Lombok
- Jackson Datatype JSR310

## 🧪 Testing

```bash
mvn test
```

---

Made with ❤️ by Nhóm 30

