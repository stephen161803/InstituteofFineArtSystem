# Institute of Fine Art System (IoFA)

Hệ thống quản lý cuộc thi, triển lãm và bán tác phẩm nghệ thuật.

## Yêu cầu cài đặt

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js v18+](https://nodejs.org)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (LocalDB, Express hoặc Developer)
- [SQL Server Management Studio - SSMS](https://aka.ms/ssmsfullsetup) _(tùy chọn, để chạy script)_

---

## Cài đặt và chạy (Development)

### 1. Clone repo

```bash
git clone https://github.com/stephen161803/InstituteofFineArtSystem.git
cd InstituteofFineArtSystem
```

### 2. Tạo Database

Mở SSMS, kết nối vào SQL Server, sau đó mở và chạy file:

```
InstituteofFineArtSystem/backend/IoFAApi/Data/scriptDB_IoFA-23032026.sql
```

Script sẽ tự động tạo database `FineArtsInstitute_Final`, toàn bộ bảng, view, trigger và dữ liệu mẫu.

### 3. Cấu hình Backend

Mở `InstituteofFineArtSystem/backend/IoFAApi/appsettings.json`, kiểm tra connection string:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=FineArtsInstitute_Final;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

> Nếu SQL Server dùng instance name khác (ví dụ `localhost\SQLEXPRESS`), sửa lại `Server=` cho phù hợp.

### 4. Chạy nhanh (Windows)

Double-click `start-dev.bat` ở thư mục gốc — script tự mở 2 terminal riêng cho backend và frontend.

> Cần chạy `npm install` trong thư mục `frontend` ít nhất một lần trước.

### 4. Chạy thủ công

**Backend:**
```bash
cd InstituteofFineArtSystem/backend/IoFAApi
dotnet restore
dotnet run
```

**Frontend:**
```bash
cd InstituteofFineArtSystem/frontend
npm install
npm run dev
```

Frontend mặc định tại `http://localhost:5173`. Backend tự chọn port khi khởi động (xem terminal).

---

## Deploy (Production)

### Build và publish

Chạy `publish.bat` ở thư mục gốc:

```bash
publish.bat
```

Script sẽ:
1. Build frontend (`npm run build`)
2. Copy `dist/` vào `backend/wwwroot/`
3. Publish backend ra `D:\Publish_Web`

> Nếu app đang chạy từ `D:\Publish_Web`, cần dừng process trước khi publish lại.

### Chạy sau khi publish

```bash
cd D:\Publish_Web
dotnet IoFAApi.dll
```

Truy cập tại địa chỉ hiển thị trong terminal (ví dụ `http://localhost:5000`).

### Lưu ý về file ảnh (uploads)

Ảnh upload (artwork, avatar) được lưu tại `D:\Publish_Web\uploads\`.

Khi publish lại, folder `D:\Publish_Web` bị xóa và tạo mới — **ảnh sẽ bị mất**. Để tránh mất ảnh, đổi đường dẫn lưu sang thư mục cố định trong `appsettings.json`:

```json
"Upload": {
  "StoragePath": "D:\\IoFA_Uploads"
}
```

---

## Tài khoản mặc định

Mật khẩu tất cả tài khoản: `password123`

| Username  | Role     |
|-----------|----------|
| admin     | Admin    |
| manager   | Manager  |
| staff     | Staff    |
| alice     | Student  |
| bob       | Student  |
| carol     | Student  |
| customer1 | Customer |
| customer2 | Customer |

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
    └── src/
```
