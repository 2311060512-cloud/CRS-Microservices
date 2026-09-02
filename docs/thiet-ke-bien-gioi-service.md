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
   - Cung cap API noi bo (`PUT/PATCH /internal/courses/{id}/reserve-seat` va `release-seat`) de registration-service giu/hoan cho.
   - Bien gioi du lieu: Chi luu tru va thao tac tren bang `course`.

3. **registration-service (Port 8083)**:
   - Quan ly viec dang ky (`POST /api/registrations`), lay danh sach mon da dang ky (`GET /api/registrations/my`) va huy dang ky (`DELETE /api/registrations/{id}`).
   - **Nguyen tac bao mat chong IDOR**: Endpoint `GET /registrations/my` lay `studentId` truc tiep tu token JWT da xac thuc (`Authentication.getCredentials()`), khong tin vao du lieu Client tu gui qua query param hay body.
   - Xu ly giao tiep lien Service (Cross-Service Communication): Goi sang `course-service` qua RestTemplate de kiem tra va giu cho truoc khi luu ban ghi dang ky.
   - Bien gioi du lieu: Luu lich su va trang thai dang ky (`registration`) cua sinh vien.

4. **api-gateway (Port 8080)**:
   - Diem truy cap duy nhat (Single Entry Point) cho toan bo ung dung Client.
   - Dieu huong (Routing) request den cac Microservice phia sau.
   - Cau hinh CORS tap trung va xac thuc/chuyen tiep Header `Authorization: Bearer <token>`, bao ve route doi tac bang `X-API-KEY`.

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
| `GET /api/public/courses` | `http://localhost:8082` | Partner (`X-API-KEY`) | Cung cap du lieu cho he thong doi tac |

---

## 4. Kien truc Frontend & Xu ly giao dien (crs-frontend)

1. **Cau truc Routing**:
   - `/login`: Dang nhap he thong.
   - `/courses`: Tra cuu danh sach mon hoc cong khai.
   - `/admin/courses`: Quan tri CRUD mon hoc (ProtectedRoute `ADMIN`).
   - `/register-course`: Cong dang ky hoc phan (ProtectedRoute `STUDENT`).
   - `/my-registrations`: Xem & huy mon hoc da dang ky (ProtectedRoute `STUDENT`).
2. **Kieu mau API Composition**: Trang `MyRegistrationsPage` tu dong goi song song `GET /api/courses/{id}` de ghep thong tin ten mon hoc vao tung dong dang ky.
3. **Thong bao Toast & Error Handling**: Toast tu dong hien thong bao thanh cong/that bai, tu dong parse thong diep loi nghiep vu tra ve tu backend xuyen service ma khong lam crash giao dien.
4. **Tinh toan chinh xac % cho con lai**: $\text{remainingPercent} = \frac{\text{soChoConLai}}{\text{soChoToiDa}} \times 100\%$, co canh bao mau sac tuong ung.

---

## 5. Kich ban Kiem thu & Van hanh Tong hop (Buoi 10)

### 5.1. Kich ban Dau - Cuoi (End-to-End)
1. Dang nhap `student1/student123` $\rightarrow$ Tra ve token + userId.
2. Vao `/register-course` dang ky 1 mon con cho $\rightarrow$ Toast xanh, so cho tren bang giam 1.
3. Dang ky lai dung mon do $\rightarrow$ Toast do: *"Sinh vien da dang ky mon hoc nay roi"*.
4. Vao `/my-registrations` $\rightarrow$ Hien thi dung mon vua dang ky voi ten mon da duoc ghep.
5. Bam "Huy dang ky" $\rightarrow$ Môn biến mất, so cho ben `/register-course` tang lai 1.
6. Dang xuat $\rightarrow$ Xoa phien, truy cap route bao ve tu dong bi redirect ve `/login`.

### 5.2. Kich ban Kiem thu Loi (Fault Injection: Tat `course-service`)
- **Hanh vi**: Khi `course-service` bi dung, `registration-service` goi qua RestTemplate gap loi `ResourceAccessException` $\rightarrow$ tra ve loi JSON qua Gateway $\rightarrow$ Frontend bat loi va hien Toast do thong bao ro rang, he thong khong bi treo hay crash.
- **Khai niem kien truc**: Minh chung cho *Single point of failure phan tan* va tam quan trong cua viec cau hinh *Timeout* / *Circuit Breaker*.

### 5.3. Ra soat Bao mat Tong hop (7 Kich ban)
| STT | Kich ban | Endpoint | Header | Status |
| :---: | :--- | :--- | :--- | :---: |
| 1 | Khong token | `POST /api/registrations` | *(Khong)* | **401** |
| 2 | Token Student goi API Admin | `POST /api/courses` | `Bearer <Student_Token>` | **403** |
| 3 | Token Admin goi API Admin | `POST /api/courses` | `Bearer <Admin_Token>` | **201** |
| 4 | Token gia mao / chu ky sai | `GET /api/registrations/my` | `Bearer <Fake_Token>` | **401** |
| 5 | Doi tac thieu API Key | `GET /api/public/courses` | *(Khong)* | **403** |
| 6 | Doi tac co API Key dung | `GET /api/public/courses` | `X-API-KEY: crs-partner-key-2026` | **200** |
| 7 | Goi thang noi bo | `PUT/PATCH :8082/internal/courses/1/reserve-seat` | *(Khong)* | **200 / 204** |

---

## 6. Huong dan Tu hoc Docker Compose

File cau hinh mau da duoc tao tai [docker-compose.yml](file:///d:/nam4/huongdv/bai/crs-microservices/docker-compose.yml):
- Quan ly 5 service (`auth-service`, `course-service`, `registration-service`, `api-gateway`, `crs-frontend`) cung 3 database MySQL rieng biet.
- Cac container goi nhau qua **ten service** trong mang noi bo Docker (vi du `http://course-service:8082`) thay vi `localhost`.
- Lenh khoi dong toan bo he thong bang Docker: `docker-compose up --build`.