# THIET KE BIEN GIOI SERVICE

## 1. Tong quan

Du an CRS (Course Registration System) la he thong dang ky hoc phan truc tuyen duoc xay dung theo kien truc Microservices.

He thong gom cac thanh phan:

- `auth-service` (Port 8081): Quan ly tai khoan nguoi dung, xac thuc va phat hanh JWT Token (chua `userId`, `username`, `role`).
- `course-service` (Port 8082): Quan ly thong tin hoc phan, tim kiem, phan trang, CRUD mon hoc va xu ly cho ngoi noi bo.
- `registration-service` (Port 8083): Quan ly nghiep vu dang ky, tra cuu danh sach dang ky ca nhan (`/registrations/my`) va huy dang ky hoc phan.
- `api-gateway` (Port 8080): API Gateway trung gian, Reverse Proxy dinh tuyen tat ca request tu Frontend toi cac service, kiem soat CORS va kiem tra/chuyen tiep Header `Authorization`.
- `crs-frontend` (Port 5173): Giao dien nguoi dung viet bang React + TypeScript (Vite) + React Router v7.

### So do luong du lieu va kien truc tong the:

```
crs-frontend :5173 (React Router: /login, /courses, /admin/courses, /register-course, /my-registrations)
       | (Authorization: Bearer <token>)
       v
  api-gateway :8080
  /     |     \
 v      v      v
auth  course  registration
:8081  :8082     :8083
        ^         |
        |_________| (Internal HTTP RestTemplate: reserve-seat / release-seat)
```

---

## 2. Bien gioi va Trach nhiem cua cac Service

Moi service trong he thong tuan theo nguyen tac phan tach trach nhiem (Separation of Concerns) va so huu co so du lieu doc lap:

1. **auth-service (Port 8081)**:
   - Quan ly tai khoan sinh vien/admin (`app_user`).
   - Xac thuc danh tinh (Authentication) va cap phat JWT Token voi Claims: `userId` (Long), `subject` (username) va `role` (`ADMIN`, `STUDENT`).
   - Bien gioi du lieu: Chi quan ly bang nguoi dung (`app_user`), thong tin xac thuc va phan quyen.

2. **course-service (Port 8082)**:
   - Quan ly danh muc hoc phan: ma hoc phan, ten mon hoc, so tin chi, so cho toi da, so cho con lai.
   - Cung cap API cong khai: tra cuu danh sach (`GET /api/courses`), tim kiem (`keyword`), phan trang (`page`, `size`) va chi tiet mon (`GET /api/courses/{id}`).
   - Cung cap API quan tri CRUD (`POST`, `PUT`, `DELETE /api/courses/**`) kem xac thuc `ROLE_ADMIN`.
   - Cung cap API noi bo (`PUT /internal/courses/{id}/reserve-seat` va `release-seat`) de registration-service giu/hoan cho.
   - Bien gioi du lieu: Chi luu tru va thao tac tren bang `course`.

3. **registration-service (Port 8083)**:
   - Quan ly viec dang ky (`POST /api/registrations`), lay danh sach mon da dang ky (`GET /api/registrations/my`) va huy dang ky (`DELETE /api/registrations/{id}`).
   - **Nguyen tac bao mat chong IDOR**: Endpoint `GET /registrations/my` lay `studentId` truc tiep tu token JWT da xac thuc (`Authentication.getCredentials()`), khong tin vao du lieu Client tu gui qua query param hay body.
   - Xu ly giao tiep lien Service (Cross-Service Communication): Goi sang `course-service` qua RestTemplate de kiem tra va giu cho truoc khi luu ban ghi dang ky.
   - Bien gioi du lieu: Luu lich su va trang thai dang ky (`registration`) cua sinh vien.

4. **api-gateway (Port 8080)**:
   - Diem truy cap duy nhat (Single Entry Point) cho toan bo ung dung Client.
   - Dieu huong (Routing) request den cac Microservice phia sau.
   - Cau hinh CORS tap trung va xac thuc/chuyen tiep Header `Authorization: Bearer <token>`.

---

## 3. Cau hinh Dinh tuyen tren API Gateway

Gateway chay tai: `http://localhost:8080`

Cac quy tac dinh tuyen (Route mappings):

| Route Path | Dich chuyen tiep (Target) | Quyen han | Muc dich |
| :--- | :--- | :--- | :--- |
| `/api/auth/**` | `http://localhost:8081` | Public | Dang nhap, xac thuc va phat hanh token |
| `GET /api/courses/**` | `http://localhost:8082` | Public | Tra cuu danh sach mon hoc, tim kiem, chi tiet mon |
| `POST/PUT/DELETE /api/courses/**` | `http://localhost:8082` | `ROLE_ADMIN` | Quan tri CRUD mon hoc |
| `POST /api/registrations` | `http://localhost:8083` | `ROLE_STUDENT` | Dang ky hoc phan moi |
| `GET /api/registrations/my` | `http://localhost:8083` | `ROLE_STUDENT` | Xem danh sach cac mon hoc SV da dang ky |
| `DELETE /api/registrations/{id}` | `http://localhost:8083` | `ROLE_STUDENT` | Huy dang ky hoc phan |

---

## 4. Kien truc & Thiet ke Frontend (crs-frontend) - Buoi 9

Frontend duoc hoan thien day du voi he thong Toast thong bao, API Composition va quan ly dang ky xuyen suot:

### 4.1. Cau truc Dinh tuyen (Routing)
- `/login`: Trang dang nhap (`LoginPage.tsx`) goi `POST /api/auth/login`.
- `/courses`: Trang xem danh sach mon hoc cong khai (`CoursesPage.tsx`) cho tat ca nguoi dung.
- `/admin/courses`: Trang quan tri CRUD mon hoc (`AdminCoursesPage.tsx`), duoc bao ve boi `ProtectedRoute` (yeu cau role `ADMIN`).
- `/register-course`: Trang dang ky hoc phan (`RegisterCoursePage.tsx`), duoc bao ve boi `ProtectedRoute` (yeu cau role `STUDENT`).
- `/my-registrations`: Trang xem va huy cac mon da dang ky (`MyRegistrationsPage.tsx`), duoc bao ve boi `ProtectedRoute` (yeu cau role `STUDENT`).

### 4.2. AuthContext & Quan ly User Identity
- `AuthContext.tsx`: Quan ly state dang nhap toan cuc (`user` gom `id`, `username`, `role`).
- Key luu tru tren `localStorage`: `crs_token` (luu JWT) va `crs_user` (JSON chua `id`, `username`, `role`).
- Khoi tao state dong bo ngay lap tuc tu `localStorage` giup tranh giat lag hoac bi redirect sai khi F5 trang.

### 4.3. He thong Toast thong bao dung chung
- `Toast.tsx`: Component thong bao noi dep mat (success/error), tu dong bien mat sau 3.5s kem nut tat nhanh.
- `useToast.ts`: Hook tuy bien giup goi Toast don gian tu bat ky page nao.

### 4.4. Kieu mau API Composition o Frontend (MyRegistrationsPage)
- Do `Registration` o backend chi luu `courseId` dang so, Frontend tu ghep thong tin ten mon hoc bang cach goi song song `GET /api/courses/{id}` thong qua `Promise.all`.
- Xu ly fallback an toan: Neu mon hoc da bi Admin xoa, he thong van hien thi dong thong tin voi ten mac dinh ma khong gay loi vo trang.

### 4.5. Xu ly loi xuyen Service thong nhat
- Khi xay ra loi (nhu "Mon hoc da het cho" tu course-service hoac "Sinh vien da dang ky mon hoc nay roi" tu registration-service), Frontend chi can trich xuat `err.response.data.message` de hien thi thong bao chinh xac cho nguoi dung.

### 4.6. Tinh toan chinh xac % cho con lai
- Tinh toan ty le cho con lai: `Math.round((soChoConLai / soChoToiDa) * 100)`.
- Hien thi badge trang thai truc quan: `Hết chỗ` (do), `Còn <= 20%` (cam canh bao), `Còn > 20%` (xanh la).

---

## 5. Kiem tra & Kich ban Van hanh Buoi 9

| STT | Thao tac | Ky vong |
| :--- | :--- | :--- |
| 1 | Vao `/register-course`, bam **"Dang ky"** mot mon con cho | Toast xanh *"Dang ky thanh cong..."*, so cho con lai tren bang giam 1 ngay lap tuc |
| 2 | Bam **"Dang ky"** lai dung mon vua dang ky | Toast do bao loi: *"Sinh vien da dang ky mon hoc nay roi"* (Loi tu registration-service) |
| 3 | Dang ky mon hoc da het cho (hoac tao mon 1 cho roi dang ky truoc) | Nut hien san *"Het cho"* va bi disable; neu goi API thi Toast do hien: *"Mon hoc da het cho"* (Loi tu course-service) |
| 4 | Vao `/my-registrations` | Thay danh sach cac mon hoc da dang ky, ten mon duoc ghep chinh xac |
| 5 | Bam **"Huy dang ky"** mot mon | Hop thoai xac nhan xuat hien, Toast xanh thong bao thanh cong, dong bien mat khoi bang |
| 6 | Quay lai `/register-course` | Mon vua huy da duoc tang lai 1 cho, nut Dang ky san sang hoat dong lai |
| 7 | Dang nhap bang `admin`, go tay vao `/register-course` hoac `/my-registrations` | Tu dong redirect ve `/courses` (theo `ProtectedRoute requiredRole="STUDENT"`) |