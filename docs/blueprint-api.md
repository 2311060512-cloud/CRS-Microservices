# BLUEPRINT API

## 1. Tong quan

API cua he thong CRS duoc thiet ke theo kien truc Microservices. Client/Frontend tuong tac qua mot diem duy nhat la API Gateway (`http://localhost:8080`).

- API Gateway: http://localhost:8080
- Frontend App: http://localhost:5173

---

## 2. Auth API (auth-service: 8081)

Quan ly thong tin tai khoan, xac thuc va phan quyen nguoi dung / sinh vien / admin.

### Dang nhap he thong
- Method / Endpoint: `POST /api/auth/login`
- Request Body:
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
- Response: Tra ve thong tin nguoi dung kem JWT Access Token (luu vao `localStorage.crs_token` o Frontend).

---

## 3. Course API (course-service: 8082)

Cung cap danh muc hoc phan, tim kiem, phan trang du lieu va cac thao tac CRUD quan ly mon hoc.

### 3.1. Lay danh sach hoc phan (Search & Pagination - Public)
- Method / Endpoint: `GET /api/courses`
- Query Parameters:
  - `keyword` (optional, string): Tu khoa tim kiem theo ten mon hoc.
  - `page` (optional, number, default: 0): Vi tri trang hien tai (0-indexed).
  - `size` (optional, number, default: 10): So luong ban ghi tren mot trang.
- Vi du Request: `GET /api/courses?keyword=Java&page=0&size=10`
- Response Structure (PagedResponse<Course>):
  ```json
  {
    "content": [
      {
        "id": 1,
        "tenMonHoc": "Lap trinh Java Nang cao",
        "soTinChi": 3,
        "soChoToiDa": 40,
        "soChoConLai": 15
      }
    ],
    "totalPages": 5,
    "totalElements": 48,
    "size": 10,
    "number": 0
  }
  ```

### 3.2. Lay chi tiet hoc phan (Public)
- Method / Endpoint: `GET /api/courses/{id}`
- Response: Thong tin chi tiet cua hoc phan tuong ung.

### 3.3. Them mon hoc moi (Requires ROLE_ADMIN - JWT Bearer Token)
- Method / Endpoint: `POST /api/courses`
- Headers: `Authorization: Bearer <token>`
- Request Body:
  ```json
  {
    "tenMonHoc": "Kien truc Microservices",
    "soTinChi": 3,
    "soChoToiDa": 50
  }
  ```
- Response: Đối tượng `Course` mới được tạo với HTTP 201/200.

### 3.4. Cap nhat mon hoc (Requires ROLE_ADMIN - JWT Bearer Token)
- Method / Endpoint: `PUT /api/courses/{id}`
- Headers: `Authorization: Bearer <token>`
- Request Body:
  ```json
  {
    "tenMonHoc": "Kien truc Microservices Nang Cao",
    "soTinChi": 4,
    "soChoToiDa": 60
  }
  ```
- Response: Đối tượng `Course` đã cập nhật.

### 3.5. Xoa mon hoc (Requires ROLE_ADMIN - JWT Bearer Token)
- Method / Endpoint: `DELETE /api/courses/{id}`
- Headers: `Authorization: Bearer <token>`
- Response: HTTP 204 No Content hoặc 200 OK.

---

## 4. Registration API (registration-service: 8083)

Quan ly viec dang ky, xem va huy dang ky hoc phan.

- `GET /api/registrations`: Lay danh sach hoc phan da dang ky cua sinh vien.
- `POST /api/registrations`: Dang ky hoc phan moi.
- `DELETE /api/registrations/{id}`: Huy dang ky hoc phan.

---

## 5. Luong xu ly Request & Reverse Proxy

```
Frontend (:5173)
       | (kem Authorization: Bearer <token> neu co)
       v
API Gateway (:8080)
  /    |     \
 v     v      v
auth course registration
8081  8082   8083
```

Frontend khong goi truc tiep cac port 8081, 8082, 8083. Toan bo giao tiep deu qua cong 8080.

---

## 6. Xu ly loi API (Error Handling Blueprint)

Format loi thong nhat duoc xu ly qua ham `extractErrorMessage`:

1. **Loi nghiep vu chung (Business Error)**:
   ```json
   {
     "message": "Ten mon hoc da ton tai trong he thong",
     "status": 400
   }
   ```
2. **Loi Validation tung Field (Server Validation)**:
   ```json
   {
     "tenMonHoc": "Ten mon hoc khong duoc de trong",
     "soTinChi": "So tin chi phai lon hon 0"
   }
   ```
3. **Loi Quyen / Xac thuc**:
   - `401 Unauthorized`: Token khong hop le hoac chua dang nhap.
   - `403 Forbidden`: Khong du quyen Admin (`ROLE_ADMIN`).
4. **Mat ket noi**: Bắt ngoại lệ và hiển thị thông báo lỗi thân thiện thay vì crash giao diện.
