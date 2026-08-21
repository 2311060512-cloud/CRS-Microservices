# THIẾT KẾ BIÊN GIỚI SERVICE

## 1. Tổng quan

Dự án CRS (Course Registration System) là hệ thống đăng ký học phần được xây dựng theo kiến trúc Microservices.

Hệ thống gồm các thành phần:

- `auth-service`: quản lý đăng nhập và xác thực.
- `course-service`: quản lý học phần.
- `registration-service`: quản lý đăng ký học phần.
- `api-gateway`: trung gian kết nối Frontend với các service.
- `crs-frontend`: giao diện React + TypeScript.

Luồng chính:


crs-frontend :5173
|
v
api-gateway :8080
|     |     |
v     v     v
auth  course  registration
:8081  :8082     :8083
2. Biên giới các Service

Mỗi service đảm nhận một chức năng riêng.

auth-service xử lý tài khoản, đăng nhập và JWT.

course-service quản lý thông tin học phần như tên môn, số tín chỉ và số chỗ còn lại.

registration-service xử lý việc đăng ký và hủy đăng ký học phần.

api-gateway nhận request từ Frontend, định tuyến đến đúng service và xử lý CORS, JWT.

Frontend chỉ gọi API thông qua Gateway, không gọi trực tiếp các service phía sau.

3. API Gateway

Gateway chạy tại:

http://localhost:8080

Các route chính:

/api/auth/**          -> :8081
/api/courses/**       -> :8082
/api/registrations/** -> :8083

Ví dụ:

GET /api/courses

Gateway sẽ chuyển request đến:

GET http://localhost:8082/courses
4. Frontend

Frontend sử dụng React, TypeScript, Vite, Axios và React Router.

File .env:

VITE_API_BASE_URL=http://localhost:8080

Axios được cấu hình tại:

src/api/axiosClient.ts

Frontend chỉ sử dụng địa chỉ của Gateway.

5. Kiểm tra hệ thống

Đã kiểm tra:

GET http://localhost:8080/api/courses

Kết quả trả về HTTP 200 OK và lấy được danh sách học phần.

CORS cũng đã được cấu hình cho Frontend:

http://localhost:5173

Như vậy Frontend đã kết nối thành công với course-service thông qua API Gateway.