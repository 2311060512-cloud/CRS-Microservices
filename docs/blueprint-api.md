# BLUEPRINT API

## 1. Tong quan

API cua he thong CRS duoc thiet ke theo kien truc Microservices. Client/Frontend tuong tac qua mot diem duy nhat la API Gateway (`http://localhost:8080`).

- API Gateway: http://localhost:8080
- Frontend App: http://localhost:5173

---

## 2. Auth API (auth-service: 8081)

Quan ly thong tin tai khoan, xac thuc va phan quyen sinh vien.

### Dang nhap he thong
- Method / Endpoint: `POST /api/auth/login`
- Request Body:
  ```json
  {
    "username": "student",
    "password": "password123"
  }
  ```
- Response: Tra ve thong tin sinh vien kem JWT Access Token.

---

## 3. Course API (course-service: 8082)

Cung cap danh muc hoc phan, tim kiem va phan trang du lieu.

### 3.1. Lay danh sach hoc phan (Search & Pagination)
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

### 3.2. Lay chi tiet hoc phan
- Method / Endpoint: `GET /api/courses/{id}`
- Response: Thong tin chi tiet cua hoc phan tuong ung.

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
       |
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

Cau truc loi chuan (`ApiErrorResponse`) tra ve khi co ngoai le:

```json
{
  "message": "Thong tin loi mo ta chi tiet tu Backend",
  "status": 400
}
```

Truong hop API Gateway / Microservice bi gian doan (mat ket noi hoan toan, khong co response), Frontend se bat ngoai le va tra thong bao loi ket noi toi nguoi dung.
