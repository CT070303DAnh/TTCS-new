# 🎨 Frontend - Diabetes Care

Frontend ReactJS + Tailwind CSS cho hệ thống chẩn đoán tiểu đường.

## 🏗️ Cấu trúc dự án

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Main component với routes
├── index.css             # Tailwind CSS + custom styles
├── components/           # React components
│   ├── ProtectedRoute.tsx
│   └── BMICalculator.tsx
├── context/              # React Context
│   └── AuthContext.tsx
├── lib/                  # Libraries
│   └── api.ts           # Axios API calls
└── utils/                # Utilities
    ├── diagnosisFields.ts    # Định nghĩa form fields
    └── healthAdvice.ts       # Hệ thống lời khuyên
```

## ✨ Tính năng

### 🔐 Authentication
- Đăng ký/Đăng nhập với JWT
- Auth Context cho global state
- Protected Routes
- Auto-save token to localStorage

### 🏥 Diagnosis Page
- **21 trường chỉ số** với dropdown + number input
- **Hints** giải thích rõ ràng cho từng trường
- **BMI Calculator** tích hợp
- **Scroll position management** - không bị jump khi chọn dropdown
- **Lời khuyên cá nhân hóa** sau khi có kết quả

### 📊 History Page
- Xem lại các lần chẩn đoán
- Expandable details
- Color-coded theo kết quả

### 🎨 UI/UX
- **Tailwind CSS v3** với custom theme
- **Animations**: fadeIn, slideUp, bounce
- **Responsive** design (mobile-first)
- **Custom scrollbar**
- **Gradient backgrounds**
- **Micro-interactions**: hover effects, transitions

## 🚀 Cài đặt và chạy

### Cài đặt dependencies

```bash
npm install
```

### Chạy dev server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

### Build production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## 🔧 Cấu hình

### API Base URL

File: `src/lib/api.ts`

```typescript
const API_URL = 'http://localhost:8080/api';
```

### Tailwind Theme

File: `tailwind.config.js`

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#f0f9ff',
        500: '#0ea5e9',
        900: '#0c4a6e',
      },
    },
    animation: {
      'fade-in': 'fadeIn 0.5s ease-in-out',
      'slide-up': 'slideUp 0.5s ease-out',
    },
  },
}
```

## 📦 Dependencies

### Production
- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **react-router-dom**: ^6.20.0 (routing)
- **axios**: ^1.6.2 (HTTP client)

### Development
- **typescript**: ^5.2.2
- **vite**: ^5.0.8 (build tool)
- **tailwindcss**: ^3.3.6
- **postcss**: ^8.4.32
- **autoprefixer**: ^10.4.16

## 🎨 Custom CSS Classes

### Buttons
```css
.btn-primary     /* Gradient primary button */
.btn-secondary   /* Outline secondary button */
```

### Components
```css
.card            /* White card với shadow */
.input-field     /* Styled input/select */
.feature-card    /* Card cho features */
.gradient-bg     /* Gradient background */
```

## 🧩 Components

### AuthContext
Quản lý authentication state globally:
- `token`: JWT token
- `userEmail`: Email của user (decoded từ JWT)
- `login()`: Lưu token
- `logout()`: Xóa token
- `isAuthenticated`: Boolean

### ProtectedRoute
Wrapper component bảo vệ routes cần auth:
```tsx
<ProtectedRoute>
  <Diagnosis />
</ProtectedRoute>
```

### BMICalculator
Component tính BMI:
- Input: height (cm), weight (kg)
- Output: BMI + category (Gầy/Bình thường/Thừa cân/Béo phì)
- Auto-fill vào form chính

## 📋 Diagnosis Fields

File: `src/utils/diagnosisFields.ts`

21 trường chẩn đoán:
- **Select**: HighBP, HighChol, Smoker, Sex, Age, Education, Income...
- **Number**: BMI, MentHlth, PhysHlth

Mỗi field có:
- `name`: Tên field
- `label`: Nhãn hiển thị
- `hint`: Giải thích cho user
- `type`: 'select' | 'number'
- `options`: Các lựa chọn (nếu select)

## 💡 Health Advice System

File: `src/utils/healthAdvice.ts`

Hệ thống tạo lời khuyên thông minh dựa trên:
- Kết quả dự đoán (0 hoặc 1)
- Các chỉ số người dùng nhập

### Priority Levels
- **High** (đỏ): Khám bác sĩ, Giảm cân, Bỏ thuốc...
- **Medium** (vàng): Kiểm soát cân nặng, Giảm rượu...
- **Low** (xanh): Bảo hiểm y tế, Duy trì lối sống...

## 🐛 Troubleshooting

### Tailwind không hoạt động
```bash
# Kiểm tra postcss.config.js
# Rebuild
npm run dev
```

### API calls bị CORS
- Kiểm tra Backend CORS config
- Đảm bảo Backend đang chạy

### Token hết hạn
- Logout và login lại
- Token expires sau 7 ngày

## 📱 Responsive Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## 🎯 Best Practices

1. **State Management**: Dùng Context cho global state
2. **API Calls**: Centralize trong `lib/api.ts`
3. **Styling**: Tailwind classes + custom CSS components
4. **Type Safety**: TypeScript cho tất cả components
5. **Error Handling**: Try-catch cho mọi API call

---

Made with ❤️ by Nhóm 30

