# THIET KE BIEN GIOI SERVICE

## 1. Tong quan

Du an CRS (Course Registration System) la he thong dang ky hoc phan duoc xay dung theo kien truc Microservices.

He thong gom cac thanh phan:

- `auth-service`: Quan ly tai khoan, dang nhap va phat hanh JWT token.
- `course-service`: Quan ly thong tin hoc phan, tim kiem, phan trang, them/sua/xoa va so luong cho.
- `registration-service`: Quan ly nghiep vu dang ky va huy dang ky hoc phan.
- `api-gateway`: Trung gian API Gateway, dong vai tro Reverse Proxy dinh tuyen request tu Frontend toi cac service, kiem soat CORS va xu ly/chuyen tiep JWT token.
- `crs-frontend`: Giao dien nguoi dung viet bang React + TypeScript (Vite) + React Router v7.

### So do luong du lieu va kien truc:

```
crs-frontend :5173 (React Router: /login, /courses, /admin/courses, /register-course)
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
   - Xac thuc danh tinh (Authentication) va cap phat JWT Token voi Claims & Roles (`ADMIN`, `STUDENT`).
   - Bien gioi du lieu: Chi quan ly bang nguoi dung (`app_user`), thong tin xac thuc va phan quyen.

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

## 4. Kien truc & Thiet ke Frontend (crs-frontend) - Buoi 8

Frontend duoc tai cau truc toan dien theo Route, AuthContext va Interceptors:

### 4.1. Cau truc Dinh tuyen (Routing)
- `/login`: Trang dang nhap (`LoginPage.tsx`) goi `POST /api/auth/login`.
- `/courses`: Trang xem danh sach mon hoc cong khai (`CoursesPage.tsx`) cho ca Sinh vien va Khach.
- `/admin/courses`: Trang quan tri CRUD mon hoc (`AdminCoursesPage.tsx`), duoc bao ve boi `ProtectedRoute` (yeu cau role `ADMIN`).
- `/register-course`: Trang dang ky hoc phan (`RegisterCoursePage.tsx`), duoc bao ve boi `ProtectedRoute` (yeu cau role `STUDENT`).

### 4.2. AuthContext & Luu tru phien (Session Persistence)
- `AuthContext.tsx`: Quan ly state dang nhap toan cuc (`user`, `isAuthenticated`, `login`, `logout`).
- Key luu tru tren `localStorage`: `crs_token` (luu JWT) va `crs_user` (luu username + role).
- `useEffect` tu dong doc lai `localStorage` khi nguoi dung F5 trang, giu nguyen phien dang nhap.

### 4.3. Axios Interceptors 2 chieu
- **Request Interceptor**: Tu dong doc `crs_token` tu `localStorage` va them `Authorization: Bearer <token>` vao moi request.
- **Response Interceptor**: Bat ma loi `401 Unauthorized` (token het han / khong hop le) $\rightarrow$ tu dong xoa token va chuyen huong ve `/login`.

### 4.4. Role-Based UI & Navigation
- `Navbar.tsx`: Hien thi menu tuy bien theo vai tro (`ADMIN` thi co menu Quan tri, `STUDENT` co menu Dang ky, hien thi badge ten user va nut Dang xuat).
- `CourseList.tsx`: Cac prop `onEdit` va `onDelete` tro thanh optional. Khi o trang cong khai `/courses`, cot "Thao tac" se tu dong an di.

---

## 5. Kiem tra & Kich ban Van hanh Buoi 8

1. **Chua dang nhap**: Truy cap `/admin/courses` $\rightarrow$ ProtectedRoute tu dong chuyen huong ve `/login`.
2. **Dang nhap sai**: Nhap sai username/password $\rightarrow$ Hien thi loi: *"Sai username hoac password"*.
3. **Dang nhap Student** (`student1` / `student123`): Chuyen den `/courses`, Navbar hien menu *"Dang ky hoc phan"*. Neu co tinh vao `/admin/courses` $\rightarrow$ tu redirect ve `/courses`.
4. **Dang nhap Admin** (`admin` / `admin123`): Navbar hien menu *"Quan tri mon hoc"*, truy cap `/admin/courses` thuc hien day du quyen CRUD.
5. **F5 Trang**: Trang thai dang nhap van duoc giu nguyen nho AuthContext session restore.
6. **Token bi loi / gia mao**: Khi API tra ve `401`, Response Interceptor tu dong xoa `localStorage` va day ve `/login`.
7. **Trang cong khai `/courses`**: Khong hien cot Thao tac (Sua / Xoa).