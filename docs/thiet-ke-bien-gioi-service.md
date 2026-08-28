# THIET KE BIEN GIOI SERVICE

## 1. Tong quan

Du an CRS (Course Registration System) la he thong dang ky hoc phan duoc xay dung theo kien truc Microservices.

He thong gom cac thanh phan:

- `auth-service`: Quan ly tai khoan, dang nhap va phat hanh JWT token.
- `course-service`: Quan ly thong tin hoc phan, tim kiem, phan trang va so luong cho.
- `registration-service`: Quan ly nghiep vu dang ky va huy dang ky hoc phan.
- `api-gateway`: Trung gian API Gateway, dong vai tro Reverse Proxy dinh tuyen request tu Frontend toi cac service, kiem soat CORS va xu ly token.
- `crs-frontend`: Giao dien nguoi dung viet bang React + TypeScript (Vite).

### So do luong du lieu va kien truc:

```
crs-frontend :5173
       |
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
   - Quan ly tai khoan sinh vien/nguoi dung.
   - Xac thuc danh tinh (Authentication) va cap phat JWT Token.
   - Bien gioi du lieu: Chi quan ly bang nguoi dung, thong tin xac thuc.

2. **course-service (Port 8082)**:
   - Quan ly danh muc hoc phan: ma hoc phan, ten mon hoc, so tin chi, so cho toi da, so cho con lai.
   - Cung cap API tim kiem theo tu khoa (`keyword`) va phan trang (`page`, `size`) dang Spring Data Pageable.
   - Bien gioi du lieu: Chi luu tru va thao tac du lieu lien quan den hoc phan.

3. **registration-service (Port 8083)**:
   - Quan ly viec dang ky, huy dang ky hoc phan cua sinh vien.
   - Xu ly rang buoc nghiep vu (kiem tra trang thai mon hoc, so luong sinh vien dang ky).
   - Bien gioi du lieu: Luu lich su va trang thai dang ky cua tung sinh vien.

4. **api-gateway (Port 8080)**:
   - Diem truy cap duy nhat (Single Entry Point) cho toan bo ung dung Client.
   - Dieu huong (Routing) request den cac Microservice phia sau.
   - Cau hinh CORS tap trung va xu ly loi ket noi chung.

---

## 3. Cau hinh Dinh tuyen tren API Gateway

Gateway chay tai: `http://localhost:8080`

Cac quy tac dinh tuyen (Route mappings):

| Route Path | Dich chuyen tiep (Target) | Muc dich |
| :--- | :--- | :--- |
| `/api/auth/**` | `http://localhost:8081` | Dang nhap, xac thuc va phan quyen |
| `/api/courses/**` | `http://localhost:8082` | Tra cuu danh sach mon hoc, tim kiem, chi tiet mon |
| `/api/registrations/**` | `http://localhost:8083` | Dang ky & quan ly hoc phan sinh vien |

Vi du: Request `GET http://localhost:8080/api/courses?keyword=Java&page=0&size=10` se duoc Gateway chuyen tiep noi bo den `GET http://localhost:8082/courses?keyword=Java&page=0&size=10`.

---

## 4. Kien truc & Thiet ke Frontend (crs-frontend)

Frontend duoc phat trien voi React + TypeScript + Vite, ket noi truc tiep toi API Gateway thong qua cau hinh bien moi truong:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### Cau truc mo-dun hoa:

- **Mo hinh tang API & Custom Hook**:
  - `axiosClient.ts`: Cau hinh instance Axios tro ve API Gateway.
  - `courseApi.ts`: Dinh nghia cac ham goi API mon hoc (`getCourses(keyword, page, size)`).
  - `useCourses.ts`: Custom hook quan ly trang thai API mon hoc, tu dong kich hoat tim kiem, phan trang va quan ly 4 trang thai cot loi:
    - **Loading**: Dang cho phan hoi tu Gateway.
    - **Success**: Nhan du lieu thanh cong (mang co phan tu).
    - **Empty**: Goi thanh cong nhung khong co mon hoc nao khop voi tu khoa tim kiem.
    - **Error**: Loi mang, Gateway hoac Service down (xu ly bat loi qua `ApiErrorResponse` va mat ket noi `!err.response`).

- **Phan ra Component UI**:
  - `SearchBox.tsx`: O tim kiem co tich hop ky thuat Debounce (400ms) de toi uu so luong request gui len Gateway.
  - `Pagination.tsx`: Dieu huong phan trang (Truoc/Sau va danh sach trang), an tu dong khi chi co 1 trang.
  - `CourseList.tsx`: Hien thi bang danh sach mon hoc, xu ly tron ven ca 4 trang thai (Loading, Success, Empty, Error) va canh bao khi mon hoc het cho (`soChoConLai === 0`).
  - `App.tsx`: Rap noi cac component va duy tri trang thai tim kiem, luon reset ve trang 0 khi thay doi tu khoa.

---

## 5. Kiem tra & Van hanh He thong

1. **Ket noi Gateway - Backend**:
   - `GET http://localhost:8080/api/courses` tra ve HTTP 200 OK voi du lieu phan trang (`content`, `totalPages`, `totalElements`).
2. **CORS**:
   - Gateway da kich hoat CORS cho nguon goc Frontend: `http://localhost:5173`.
3. **Frontend UI**:
   - Tim kiem voi Debounce hoat dong muot ma.
   - Phan trang dong bo voi backend Pageable.
   - Xu ly an toan khi mat ket noi toi Backend/Gateway (khong gay crash trang man hinh, co nut Thu lai).