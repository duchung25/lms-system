# StudyHub — Learning Management System (LMS)

StudyHub là nền tảng học trực tuyến full-stack, nơi giáo viên tạo khóa học và bài giảng, học viên đăng ký học (miễn phí hoặc trả phí), học tuần tự qua các bài giảng, bình luận real-time, đánh giá khóa học và nhận chứng chỉ khi hoàn thành. Quản trị viên duyệt khóa học và quản lý người dùng, danh mục, chứng chỉ.

## ✨ Tính năng chính

- **Xác thực & phân quyền**: Đăng ký/đăng nhập, JWT authentication, phân quyền theo vai trò (student / teacher / admin)
- **Quản lý khóa học**: CRUD khóa học, vòng đời duyệt (Draft → Pending Review → Approved/Rejected → Published)
- **Bài giảng**: CRUD bài giảng, sắp xếp thứ tự, publish/unpublish
- **Đăng ký học & tiến độ**: Enroll khóa học (free/paid), theo dõi tiến độ, mở khóa bài giảng tuần tự
- **Thanh toán**: Tạo đơn hàng, xác minh thanh toán
- **Bình luận real-time**: Bình luận theo bài giảng qua Socket.IO, hỗ trợ reply lồng nhau
- **Đánh giá khóa học**: Rating 1–5 sao theo học viên
- **Chứng chỉ**: Tự động cấp chứng chỉ khi hoàn thành 100% khóa học, có mã xác minh
- **Thông báo**: Hệ thống notification cho các sự kiện (duyệt khóa học, thanh toán, bài giảng mới...)
- **Quản trị**: Dashboard, quản lý người dùng, thống kê, duyệt khóa học, thu hồi chứng chỉ

## 🏗️ Kiến trúc & Cấu trúc thư mục

Kiến trúc layered monolith: Express REST API + React SPA, tách lớp rõ ràng `routes → controllers → services → models`.

```
studyhub/
├── backend/
│   ├── server.js              # Entry point, khởi tạo Socket.IO
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── app.js             # Express app
│       ├── config/db.js       # Kết nối MongoDB
│       ├── models/            # Mongoose schemas
│       ├── controllers/       # Xử lý request/response
│       ├── services/          # Business logic
│       ├── routes/            # Định nghĩa API routes
│       ├── middlewares/       # Auth, authorization, error handling
│       ├── validators/        # express-validator rules
│       ├── utils/AppError.js  # Custom error class
│       └── socketManager.js   # Socket.IO + JWT handshake
└── frontend/
    ├── package.json
    └── src/
        ├── main.jsx, App.jsx
        ├── api/                # Axios endpoints (*.api.js)
        ├── service/            # Service wrapper layer (*.service.js)
        ├── hook/               # Custom hooks (useCourse, useLesson, useComment...)
        ├── components/         # UI components tái sử dụng
        ├── layouts/
        ├── pages/              # Trang theo route
        ├── auth/               # AuthContext / AuthProvider
        └── socket.js           # Socket.IO client singleton
```

## 🛠️ Công nghệ sử dụng

**Backend**
- Node.js + Express — REST API
- MongoDB + Mongoose — schema linh hoạt cho course/lesson/tracking
- JWT (jsonwebtoken) — xác thực stateless cho API và Socket.IO
- bcryptjs — mã hóa mật khẩu
- express-validator — validate request
- Socket.IO — real-time comment
- mongoose-delete — soft delete & restore
- dotenv, nodemon

**Frontend**
- React + Vite
- axios — HTTP client (kèm interceptor)
- react-router-dom v7 — routing
- socket.io-client — kết nối real-time
- Bootstrap CSS — UI styling
- Recharts, react-icons, lodash

## 🚀 Cài đặt & chạy dự án

### Yêu cầu
- Node.js >= 18
- MongoDB (local hoặc Atlas)

### 1. Clone repository
```bash
git clone <repo-url>
cd studyhub
```

### 2. Cài đặt Backend
```bash
cd backend
npm install
cp .env.example .env
```

Cấu hình file `.env`:
```env
MONGO_URI=mongodb://localhost:27017/studyhub
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Chạy backend (dev mode):
```bash
npm run dev
```

### 3. Cài đặt Frontend
```bash
cd frontend
npm install
```

Cấu hình biến môi trường frontend (`.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

Chạy frontend:
```bash
npm run dev
```

## 📡 API Overview

Base URL: `/api`

| Nhóm | Endpoint chính |
|---|---|
| Auth | `POST /auth/register`, `POST /auth/login`, `GET/PUT /auth/profile`, `PUT /auth/change-password` |
| Courses | `GET/POST /courses`, `GET/PATCH/DELETE /courses/:id`, `PATCH /courses/:id/submit`, `PATCH /courses/:id/review` |
| Lessons | `POST/GET /courses/:courseId/lessons`, `PATCH/DELETE /courses/:courseId/lessons/:lessonId`, `POST .../complete` |
| Enrollment | `POST/DELETE /enrollments/:courseId`, `PATCH /enrollments/:courseId/progress`, `GET /enrollments/enrolled` |
| Orders / Payments | `POST /orders`, `GET /orders/:orderId`, `POST /payments/verify` |
| Comments | `GET/POST/PATCH/DELETE /courses/:courseId/lessons/:lessonId/comments` |
| Ratings | `POST/PUT/GET /courses/:courseId/ratings` |
| Certificates | `POST /certificates/generate`, `GET /certificates/my-certificates`, `GET /certificates/verify/:code` |
| Admin | `/admin/*` — quản lý user, dashboard, thống kê (yêu cầu role admin) |

## 🔐 Bảo mật đã áp dụng

- JWT có thời hạn (expiry), xác thực qua middleware cho cả HTTP và Socket.IO handshake
- Mật khẩu hash bằng bcryptjs, không lưu plaintext
- Phân quyền theo vai trò qua middleware `authorizeMiddleware`
- Validate input bằng express-validator
- Soft-delete giữ lại dữ liệu lịch sử (mongoose-delete)

## 🗺️ Roadmap / Cải tiến trong tương lai

- [ ] Thêm HTTP-only cookie hoặc refresh-token rotation thay vì lưu JWT ở localStorage
- [ ] Bổ sung `helmet` và `express-rate-limit` để tăng bảo mật
- [ ] Tích hợp cổng thanh toán thực tế (VNPAY/MOMO/Stripe)
- [ ] Dùng Redis adapter cho Socket.IO khi scale nhiều instance
- [ ] Viết unit test / integration test cho các luồng quan trọng
- [ ] Thêm CI/CD pipeline

## 📄 License

Dự án cá nhân 