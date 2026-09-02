# BLUEPRINT API

## 1. Tong quan

API cua he thong CRS (Course Registration System) duoc thiet ke theo kien truc Microservices. Client/Frontend tuong tac qua mot diem duy nhat la API Gateway (`http://localhost:8080`).

- API Gateway: `http://localhost:8080`
- Frontend App: `http://localhost:5173`
- Auth Service: `http://localhost:8081`
- Course Service: `http://localhost:8082`
- Registration Service: `http://localhost:8083`

---

## 2. Auth API (auth-service: 8081)

Quan ly thong tin tai khoan, xac thuc va phat hanh JWT Token mang thong tin danh tinh (`userId`, `username`, `role`).

### Dang nhap he thong
- Method / Endpoint: `POST /api/auth/login`
- Request Body:
  ```json
  {
    "username": "student1",
    "password": "student123"
  }
  ```
- Response Body (200 OK):
  ```json
  {
    "userId": 2,
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "username": "student1",
    "role": "STUDENT"
  }
  ```
- JWT Claims Payload:
  ```json
  {
    "sub": "student1",
    "userId": 2,
    "role": "STUDENT",
    "iat": 1741000000,
    "exp": 1741086400
  }
  ```

---

## 3. Course API (course-service: 8082)

Cung cap danh muc hoc phan, tim kiem, phan trang du lieu, quan ly CRUD mon hoc va API noi bo quan ly cho ngoi.

### 3.1. Lay danh sach hoc phan (Search & Pagination - Public)
- Method / Endpoint: `GET /api/courses`
- Query Parameters:
  - `keyword` (optional, string): Tu khoa tim kiem theo ten mon hoc.
  - `page` (optional, number, default: 0): Vi tri trang hien tai (0-indexed).
  - `size` (optional, number, default: 10): So luong ban ghi tren mot trang.
- Vi du Request: `GET /api/courses?keyword=Java&page=0&size=10`
- Response Structure (`PagedResponse<Course>`):
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
- Response: Thong tin chi tiet cua hoc phan tuong ung (dung de Frontend ghep ten mon hoc - API Composition).
  ```json
  {
    "id": 1,
    "tenMonHoc": "Lap trinh Java Nang cao",
    "soTinChi": 3,
    "soChoToiDa": 40,
    "soChoConLai": 15
  }
  ```

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
- Response: Doi tuong `Course` moi duoc tao voi HTTP 201 Created.

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
- Response: Doi tuong `Course` da cap nhat.

### 3.5. Xoa mon hoc (Requires ROLE_ADMIN - JWT Bearer Token)
- Method / Endpoint: `DELETE /api/courses/{id}`
- Headers: `Authorization: Bearer <token>`
- Response: HTTP 204 No Content / 200 OK.

### 3.6. API Noi bo (Internal Communication giua cac Service)
- `PUT /internal/courses/{id}/reserve-seat`: Tru 1 cho con lai khi co SV dang ky. Tra ve 400 Bad Request neu mon da het cho.
- `PUT /internal/courses/{id}/release-seat`: Hoan lai 1 cho khi SV huy dang ky.

---

## 4. Registration API (registration-service: 8083)

Quan ly nghiep vu dang ky, tra cuu danh sach da dang ky va huy dang ky hoc phan.

### 4.1. Lay danh sach hoc phan da dang ky cua toi (Requires Authentication)
- Method / Endpoint: `GET /api/registrations/my`
- Headers: `Authorization: Bearer <token>`
- **Bao mat (Anti-IDOR)**: `studentId` duoc doc truc tiep tu `Authentication.getCredentials()` trong JWT, khong nhan tu Client param/body.
- Response Body (200 OK):
  ```json
  [
    {
      "id": 10,
      "studentId": 2,
      "courseId": 1,
      "trangThai": "DA_DANG_KY",
      "ngayDangKy": "2026-09-02T08:30:00"
    }
  ]
  ```

### 4.2. Dang ky hoc phan (Requires Authentication / ROLE_STUDENT)
- Method / Endpoint: `POST /api/registrations`
- Headers: `Authorization: Bearer <token>`
- Request Body:
  ```json
  {
    "studentId": 2,
    "courseId": 1
  }
  ```
- Luong xu ly:
  1. Kiem tra sinh vien da dang ky mon nay chua (`existsByStudentIdAndCourseIdAndTrangThai`).
  2. Goi sang `course-service` qua endpoint `PUT /internal/courses/{id}/reserve-seat`.
  3. Neu tru cho thanh cong, tao ban ghi `Registration` voi trang thai `DA_DANG_KY`.
- Response Body (201 Created):
  ```json
  {
    "id": 10,
    "studentId": 2,
    "courseId": 1,
    "trangThai": "DA_DANG_KY",
    "ngayDangKy": "2026-09-02T08:30:00"
  }
  ```

### 4.3. Huy dang ky hoc phan (Requires Authentication)
- Method / Endpoint: `DELETE /api/registrations/{id}`
- Headers: `Authorization: Bearer <token>`
- Luong xu ly:
  1. Kiem tra ton tai ban ghi va trang thai khong phai `DA_HUY`.
  2. Goi sang `course-service` qua endpoint `PUT /internal/courses/{id}/release-seat` de hoan lai cho.
  3. Cap nhat trang thai dang ky thanh `DA_HUY`.
- Response: HTTP 200 OK / 204 No Content.

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
        ^     |
        |_____| (Internal RestTemplate / HTTP)
```

Frontend khong goi truc tiep cac port 8081, 8082, 8083. Toan bo giao tiep Client deu thuc hien qua cong 8080.

---

## 6. Xu ly loi API (Error Handling Blueprint)

Format loi thong nhat duoc xu ly qua ham `extractErrorMessage` tren Frontend va Global Exception Handler o Backend:

1. **Loi nghiep vu chung (Business Error)**:
   ```json
   {
     "message": "Sinh vien da dang ky mon hoc nay roi",
     "status": 400
   }
   ```
2. **Loi lan truyen tu Course Service (Cross-Service Propagation)**:
   ```json
   {
     "message": "Mon hoc da het cho",
     "status": 400
   }
   ```
   *Frontend khong can phan biet loi sinh ra tu registration-service hay lan truyen tu course-service, chi can doc truong `err.response.data.message` de hien thi Toast.*

3. **Loi Validation tung Field (Server Validation)**:
   ```json
   {
     "tenMonHoc": "Ten mon hoc khong duoc de trong",
     "soTinChi": "So tin chi phai lon hon 0"
   }
   ```
4. **Loi Quyen / Xac thuc**:
   - `401 Unauthorized`: Token khong hop le hoac chua dang nhap.
   - `403 Forbidden`: Khong du quyen han (vi du khong phai `ROLE_ADMIN`).
5. **Mat ket noi / Network Error**: Bat ngoai le va hien thi thong bao loi than thien tren Toast/Alert.
