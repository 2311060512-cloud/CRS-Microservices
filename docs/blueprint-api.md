
# BLUEPRINT API

## 1. Tổng quan

API của hệ thống CRS được thiết kế theo kiến trúc Microservices. Frontend chỉ gọi API thông qua `api-gateway`.

Gateway:
http://localhost:8080
Frontend:
http://localhost:5173
## 2. Auth API
Dùng cho đăng nhập và xác thực người dùng.
POST /api/auth/login
Request:
{
  "username": "student",
  "password": "123456"
}
Response trả về thông tin đăng nhập và JWT.
## 3. Course API
Dùng để lấy thông tin học phần.
GET /api/courses
GET /api/courses/{id}
Ví dụ:
GET /api/courses
Kết quả gồm danh sách học phần:
{
  "content": [
    {
      "id": 1,
      "tenMonHoc": "Cơ sở dữ liệu",
      "soTinChi": 3,
      "soChoToiDa": 40,
      "soChoConLai": 0
    }
  ]
}
## 4. Registration API
Dùng để quản lý đăng ký học phần.
GET /api/registrations
GET /api/registrations/{id}
POST /api/registrations
Các API này được sử dụng để xem, tạo và quản lý đăng ký học phần của sinh viên.
## 5. Luồng API
Request từ Frontend được gửi theo luồng:
Frontend
   ↓
API Gateway :8080
   ↓
Service tương ứng
   ↓
Database
Frontend không gọi trực tiếp đến các port `8081`, `8082`, `8083`.
## 6. Kiểm tra API
API Course đã được kiểm tra bằng:
GET http://localhost:8080/api/courses
Kết quả trả về `HTTP 200 OK`, cho thấy Gateway và `course-service` đang hoạt động và kết nối được với nhau.

