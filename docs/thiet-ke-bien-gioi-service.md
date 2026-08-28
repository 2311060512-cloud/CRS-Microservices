# THIET KE BIEN GIOI SERVICE

## 1. Tong quan

Du an CRS (Course Registration System) la he thong dang ky hoc phan duoc xay dung theo kien truc Microservices.

He thong gom cac thanh phan:

- `auth-service`: Quan ly tai khoan, dang nhap va phat hanh JWT token.
- `course-service`: Quan ly thong tin hoc phan, tim kiem, phan trang, them/sua/xoa va so luong cho.
- `registration-service`: Quan ly nghiep vu dang ky va huy dang ky hoc phan.
- `api-gateway`: Trung gian API Gateway, dong vai tro Reverse Proxy dinh tuyen request tu Frontend toi cac service, kiem soat CORS va xu ly/chuyen tiep JWT token.
- `crs-frontend`: Giao dien nguoi dung viet bang React + TypeScript (Vite).

### So do luong du lieu va kien truc:

```
crs-frontend :5173
       | (Authorization: Bearer <token>)
       v
  api-gateway :8080
  /     |     \
 v      v      v
auth  course  registration
:8081  :8082     :8083
```

---

## 2. Bien gioi va Trach nhiem cua cac Service

Moi service trong he thong tuan theo nguyen tac phan tach trach nhiem (Separation of Concerns) va so huu co so du lieu doc lap:

1. **auth-service (Port 8081)**:
   - Quan ly tai khoan sinh vien/admin/nguoi dung.
   - Xac thuc danh tinh (Authentication) va cap phat JWT Token voi Claims & Roles.
   - Bien gioi du lieu: Chi quan ly bang nguoi dung, thong tin xac thuc va phan quyen.

2. **course-service (Port 8082)**:
   - Quan ly danh muc hoc phan: ma hoc phan, ten mon hoc, so tin chi, so cho toi da, so cho con lai.
   - Cung cap API tim kiem theo tu khoa (`keyword`) va phan trang (`page`, `size`) dang Spring Data Pageable.
   - Cung cap API them (`POST`), sua (`PUT`), xoa (`DELETE`) hoc phan kem xac thuc quyen `ROLE_ADMIN` qua token.
   - Validate du lieu server-side (thong qua `@Valid`, `@NotBlank`, `@Min` trong DTO).
   - Bien gioi du lieu: Chi luu tru va thao tac du lieu lien quan den hoc phan.

3. **registration-service (Port 8083)**:
   - Quan ly viec dang ky, huy dang ky hoc phan cua sinh vien.
   - Xu ly rang buoc nghiep vu (kiem tra trang thai mon hoc, so luong sinh vien dang ky).
   - Bien gioi du lieu: Luu lich su va trang thai dang ky cua tung sinh vien.

4. **api-gateway (Port 8080)**:
   - Diem truy cap duy nhat (Single Entry Point) cho toan bo ung dung Client.
   - Dieu huong (Routing) request den cac Microservice phia sau.
   - Cau hinh CORS tap trung va xac thuc/chuyen tiep token Header `Authorization`.

---

## 3. Cau hinh Dinh tuyen tren API Gateway

Gateway chay tai: `http://localhost:8080`

Cac quy tac dinh tuyen (Route mappings):

| Route Path | Dich chuyen tiep (Target) | Quyen han | Muc dich |
| :--- | :--- | :--- | :--- |
| `/api/auth/**` | `http://localhost:8081` | Public | Dang nhap, xac thuc va phan quyen |
| `GET /api/courses/**` | `http://localhost:8082` | Public | Tra cuu danh sach mon hoc, tim kiem, chi tiet mon |
| `POST/PUT/DELETE /api/courses/**` | `http://localhost:8082` | `ROLE_ADMIN` | Quan ly CRUD mon hoc |
| `/api/registrations/**` | `http://localhost:8083` | `ROLE_STUDENT` | Dang ky & quan ly hoc phan sinh vien |

---

## 4. Kien truc & Thiet ke Frontend (crs-frontend)

Frontend duoc phat trien voi React + TypeScript + Vite, ket noi truc tiep toi API Gateway thong qua cau hinh bien moi truong:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### Cau truc mo-dun hoa & Trien khai Buoi 7:

- **Mo hinh tang API & Custom Hook**:
  - `axiosClient.ts`: Cau hinh instance Axios tro ve API Gateway, kem Request Interceptor tu dong chen `Authorization: Bearer ${localStorage.getItem('crs_token')}`.
  - `courseApi.ts`: Dinh nghia cac ham goi API mon hoc: `getCourses`, `createCourse`, `updateCourse`, `deleteCourse`.
  - `useCourses.ts`: Custom hook quan ly trang thai API mon hoc, tu dong kich hoat tim kiem, phan trang va quan ly 4 trang thai cot loi (Loading, Success, Empty, Error) kem ham `refetch()`.

- **Phan ra Component UI & Controlled Components**:
  - `CourseForm.tsx`: Form quan ly dung chung che do Them/Sua (Controlled Component qua React state), validate du lieu phia Client truoc khi submit, do san du lieu khi o che do Sua va hien thi loi server.
  - `SearchBox.tsx`: O tim kiem co tich hop ky thuat Debounce (400ms) de toi uu so luong request gui len Gateway.
  - `Pagination.tsx`: Dieu huong phan trang (Truoc/Sau va danh sach trang), an tu dong khi chi co 1 trang.
  - `CourseList.tsx`: Hien thi bang danh sach mon hoc kem nut Sua/Xoa tren tung dong, xu ly tron ven ca 4 trang thai va canh bao khi mon hoc het cho (`soChoConLai === 0`).
  - `App.tsx`: Rap noi toan bo luong CRUD, quan ly state `editingCourse`, bat va bóc tách ma loi thong nhat (`extractErrorMessage`), tu dong refetch du lieu va hien thi Toast Notification phan hoi.

---

## 5. Kiem tra & Van hanh He thong (CRUD Kich ban day du)

1. **Validate Client**: Form chan submit va hien loi do ngay lap tuc neu de trong ten mon hoac tin chi/so cho $\le 0$.
2. **Them mon moi**: Goi `POST /api/courses` qua Gateway kem Bearer Token, refetch danh sach tu dong.
3. **Trung ten mon hoc**: Server tra ve loi nghiep vu `{"message": "..."}`, giao dien bat va hien thi dung duoi form.
4. **Sua mon hoc**: Nhan nut "Sua" $\rightarrow$ du lieu duoc nap vao form $\rightarrow$ cap nhat `PUT /api/courses/{id}` $\rightarrow$ refetch.
5. **Xoa mon hoc**: Hien thi Confirm dialog $\rightarrow$ goi `DELETE /api/courses/{id}` $\rightarrow$ dong bi xoa tuc thi.
6. **Xac thuc 401/403**: Xu ly an toan khi token het han hoac khong du quyen ma khong lam crash trang.