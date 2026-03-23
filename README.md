# Institute of Fine Art System (IoFA)

Hệ thống quản lý cuộc thi, triển lãm và bán tác phẩm nghệ thuật.

## Yêu cầu cài đặt

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js v18+](https://nodejs.org)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (LocalDB, Express hoặc Developer)
- [SQL Server Management Studio - SSMS](https://aka.ms/ssmsfullsetup) _(tùy chọn, để chạy script)_

---

## Các bước cài đặt

### 1. Clone repo

```bash
git clone https://github.com/stephen161803/InstituteofFineArtSystem.git
cd InstituteofFineArtSystem
```

### 2. Tạo Database

Mở SSMS (hoặc Azure Data Studio), kết nối vào SQL Server, sau đó mở và chạy file:

```
InstituteofFineArtSystem/backend/IoFAApi/Data/scriptDB_IoFA-23032026.sql
```

Script này sẽ tự động:
- Tạo database `FineArtsInstitute_Final`
- Tạo toàn bộ bảng, view, trigger
- Insert dữ liệu mẫu

### 3. Cấu hình Backend

Mở file `InstituteofFineArtSystem/backend/IoFAApi/appsettings.json`, kiểm tra connection string:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=FineArtsInstitute_Final;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

> Nếu SQL Server của bạn dùng instance name khác (ví dụ `localhost\SQLEXPRESS`), hãy sửa lại `Server=` cho phù hợp.

### 4. Chạy nhanh (Windows)

Nếu dùng Windows, có thể chạy cả backend lẫn frontend chỉ bằng một lệnh — double-click vào file `start-dev.bat` ở thư mục gốc, hoặc chạy:

```bash
start-dev.bat
```

Script sẽ tự mở 2 cửa sổ terminal riêng cho backend và frontend.

> Yêu cầu đã chạy `npm install` trong thư mục `frontend` ít nhất một lần trước.

---

### 4. Chạy Backend (thủ công)

```bash
cd InstituteofFineArtSystem/backend/IoFAApi
dotnet restore
dotnet run
```

Backend chạy tại: `http://localhost:5117`

> **Lưu ý port:** Nếu backend chạy ở port khác (xem terminal sau khi `dotnet run`), hãy cập nhật lại file `InstituteofFineArtSystem/frontend/.env`:
> ```
> VITE_API_URL=http://localhost:{PORT_THỰC_TẾ}/api
> ```
> Sau đó restart frontend (`npm run dev`) để áp dụng.

### 5. Chạy Frontend (thủ công)

```bash
cd InstituteofFineArtSystem/frontend
npm install
npm run dev
```

Frontend chạy tại: `http://localhost:5173`

---

## Tài khoản mặc định

Mật khẩu tất cả tài khoản: `password123`

| Username   | Role     |
|------------|----------|
| admin      | Admin    |
| manager    | Manager  |
| staff      | Staff    |
| alice      | Student  |
| bob        | Student  |
| carol      | Student  |
| customer1  | Customer |
| customer2  | Customer |

---

## Cấu trúc dự án

```
InstituteofFineArtSystem/
├── backend/
│   └── IoFAApi/              # ASP.NET Core 10 Web API
│       ├── Controllers/
│       ├── Models/
│       ├── DTOs/
│       ├── Data/
│       │   └── scriptDB_IoFA-23032026.sql  # Script tạo DB + data
│       └── appsettings.json
└── frontend/                 # React + Vite + TailwindCSS
    ├── src/
    └── .env                  # VITE_API_URL=http://localhost:5117/api
```
