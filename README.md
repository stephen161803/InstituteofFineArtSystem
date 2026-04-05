# Institute of Fine Arts System (IoFA)

A full-stack web application for managing art competitions, student submissions, evaluations, awards, and exhibitions.

## Requirements

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js v18+](https://nodejs.org)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (LocalDB, Express, or Developer edition)
- [SQL Server Management Studio (SSMS)](https://aka.ms/ssmsfullsetup) *(optional, for running the SQL script)*

---

## Setup & Run (Development)

### 1. Clone the repository

```bash
git clone https://github.com/stephen161803/InstituteofFineArtSystem.git
cd InstituteofFineArtSystem
```

### 2. Create the Database

Open SSMS, connect to your SQL Server instance, then open and execute:

```
InstituteofFineArtSystem/backend/IoFAApi/Data/IoFA_DB_20260403.sql
```

This script will automatically create the `FineArtsInstitute_Final` database, all tables, views, triggers, and seed data.

### 3. Configure the Backend

Open `InstituteofFineArtSystem/backend/IoFAApi/appsettings.json` and verify the connection string:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=FineArtsInstitute_Final;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

> If your SQL Server uses a named instance (e.g. `localhost\SQLEXPRESS`), update the `Server=` value accordingly.

### 4. Quick Start (Windows)

Double-click `start-dev.bat` in the root directory — it will open two separate terminals for the backend and frontend.

> Make sure to run `npm install` inside the `frontend` folder at least once beforehand.

### 4. Manual Start

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

Frontend runs at `http://localhost:5173` by default. The backend port is shown in the terminal on startup.

---

## Deploy (Production)

### Build and publish

Run `publish.bat` from the root directory:

```bash
publish.bat
```

This script will:
1. Build the frontend (`npm run build`)
2. Copy `dist/` into `backend/wwwroot/`
3. Publish the backend to `D:\Publish_Web`

> If the app is already running from `D:\Publish_Web`, stop the process before publishing again.

### Run after publishing

```bash
cd D:\Publish_Web
dotnet IoFAApi.dll
```

Access the app at the address shown in the terminal (e.g. `http://localhost:5000`).

### Note on uploaded files

Uploaded images (artworks, avatars) are stored in `D:\Publish_Web\uploads\`.

When publishing again, the `D:\Publish_Web` folder is deleted and recreated — **uploaded files will be lost**. To avoid this, change the storage path to a fixed directory in `appsettings.json`:

```json
"Upload": {
  "StoragePath": "D:\\IoFA_Uploads"
}
```

---

## Default Accounts

All accounts use the password: `password123`

| Username  | Role     |
|-----------|----------|
| admin     | Admin    |
| manager1  | Manager  |
| staff1    | Staff    |
| alice     | Student  |
| bob       | Student  |
| carol     | Student  |
| customer1 | Customer |
| customer2 | Customer |

---

## User Roles

| Role | Permissions |
|---|---|
| **Admin** | Manage Staff, Students, Customers, Admin/Manager accounts |
| **Manager** | View-only: Competitions, Submissions, Awards, Exhibitions, Statistics |
| **Staff** | Manage Competitions, review Submissions, grant Awards, manage Exhibitions |
| **Student** | View Competitions, submit artworks, view own reviews and awards |
| **Customer** | Browse exhibitions, purchase available artworks |

---

## Project Structure

```
InstituteofFineArtSystem/
├── backend/
│   └── IoFAApi/                  # ASP.NET Core 10 Web API
│       ├── Controllers/          # API endpoints
│       ├── Models/               # Entity models
│       ├── DTOs/                 # Data transfer objects
│       ├── Data/
│       │   └── IoFA_DB_20260403.sql  # Database schema + seed data
│       └── appsettings.json
└── frontend/                     # React + Vite + Tailwind CSS
    └── src/
        └── app/
            ├── api/              # API client functions
            ├── components/       # UI components, pages, dashboards
            ├── context/          # Auth context
            └── routes.tsx        # Route definitions
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS v4, shadcn/ui |
| Backend | ASP.NET Core 10, Entity Framework Core |
| Database | SQL Server |
| Auth | JWT + BCrypt |
