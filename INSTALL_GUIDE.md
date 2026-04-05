# Installation Guide — Institute of Fine Arts System

## Prerequisites

Before running the project, make sure the following are installed on your machine.

---

### 1. .NET 10 SDK

Download: https://dotnet.microsoft.com/download/dotnet/10.0

Verify installation:
```bash
dotnet --version
# Expected: 10.x.x
```

---

### 2. Node.js v18 or higher

Download: https://nodejs.org (choose the LTS version)

Verify installation:
```bash
node --version
# Expected: v18.x.x or higher

npm --version
```

---

### 3. SQL Server

Download SQL Server **Express** (free): https://www.microsoft.com/en-us/sql-server/sql-server-downloads

> Developer Edition also works. Make sure the SQL Server service is running before starting the backend.

---

### 4. SQL Server Management Studio (SSMS) *(recommended)*

Download: https://aka.ms/ssmsfullsetup

Used to run the database setup script.

---

## Setup Steps

### Step 1 — Create the Database

1. Open SSMS and connect to your SQL Server instance
2. Open the file:
   ```
   InstituteofFineArtSystem/backend/IoFAApi/Data/IoFA_DB_20260403.sql
   ```
3. Click **Execute** (or press `F5`)

This will create the `FineArtsInstitute_Final` database with all tables, views, triggers, and seed data.

---

### Step 2 — Configure the Backend

Open `InstituteofFineArtSystem/backend/IoFAApi/appsettings.json` and check the connection string:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=FineArtsInstitute_Final;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

**Common adjustments:**

| SQL Server instance | Server value |
|---|---|
| Default instance | `localhost` |
| Named instance (Express) | `localhost\SQLEXPRESS` |
| Custom port | `localhost,1433` |

---

### Step 3 — Run the Project

#### Option A — Quick Start (Windows only)

Double-click `start-dev.bat` in the root directory.

> This automatically checks for port conflicts, kills any blocking processes, and starts both servers in separate terminal windows.

#### Option B — Manual Start

**Backend:**
```bash
cd InstituteofFineArtSystem/backend/IoFAApi
dotnet restore
dotnet run
```

**Frontend** (in a separate terminal):
```bash
cd InstituteofFineArtSystem/frontend
npm install
npm run dev
```

---

### Step 4 — Open the App

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5117 |
| Swagger UI | http://localhost:5117/swagger |

---

## Default Login Accounts

All accounts use the password: `password123`

| Username | Role |
|---|---|
| admin | Admin |
| manager1 | Manager |
| staff1 | Staff |
| alice | Student |
| bob | Student |
| carol | Student |
| customer1 | Customer |
| customer2 | Customer |

---

## Troubleshooting

**Port already in use**
- Run `start-dev.bat` — it automatically kills processes on ports 5117 and 5173
- Or manually: `netstat -aon | findstr :5117` then `taskkill /PID <pid> /F`

**Cannot connect to SQL Server**
- Make sure SQL Server service is running (check Windows Services or SQL Server Configuration Manager)
- Verify the `Server=` value in `appsettings.json` matches your instance name

**`dotnet` command not found**
- Restart your terminal after installing .NET SDK
- Or add `C:\Program Files\dotnet` to your system PATH

**`npm` command not found**
- Restart your terminal after installing Node.js
- Verify with `node --version`

**Frontend shows blank page or API errors**
- Make sure the backend is running before opening the frontend
- Check the browser console for CORS or network errors
- Verify the API base URL in `frontend/src/app/api/client.ts`
