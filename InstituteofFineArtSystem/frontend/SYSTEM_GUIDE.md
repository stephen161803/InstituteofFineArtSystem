# Institute of Fine Arts — System Guide

## Table of Contents
1. [System Overview](#system-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [User Roles & Permissions](#user-roles--permissions)
5. [Getting Started](#getting-started)
6. [Key Features](#key-features)

---

## System Overview

The Institute of Fine Arts System is a full-stack web application for managing art competitions, student submissions, evaluations, awards, and exhibitions. It supports multiple user roles with role-based access control.

**Backend:** ASP.NET Core 10 Web API + SQL Server  
**Frontend:** React 18 + TypeScript + Tailwind CSS

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| React Router | Client-side routing |
| Tailwind CSS v4 | Styling |
| shadcn/ui + Radix UI | Component library |
| Lucide React | Icons |
| Sonner | Toast notifications |
| Recharts | Charts & statistics |

### Backend
| Technology | Purpose |
|---|---|
| ASP.NET Core 10 | Web API |
| Entity Framework Core | ORM |
| SQL Server | Database |
| JWT | Authentication |
| BCrypt.Net | Password hashing |

---

## Project Structure

```
InstituteofFineArtSystem/
├── backend/
│   └── IoFAApi/
│       ├── Controllers/     # API endpoints
│       ├── Models/          # Entity models
│       ├── DTOs/            # Data transfer objects
│       ├── Data/            # DbContext + seed SQL
│       └── appsettings.json # Configuration
└── frontend/
    └── src/app/
        ├── api/             # API client functions
        ├── components/
        │   ├── ui/          # Reusable UI components
        │   ├── dashboards/  # Role-specific dashboards
        │   └── pages/       # Feature pages
        ├── context/         # Auth context
        ├── types/           # TypeScript types
        └── routes.tsx       # Route definitions
```

---

## User Roles & Permissions

### Admin
- Manage Staff (CRUD)
- Manage Students (CRUD)
- Manage Customers (CRUD)
- Manage Admin/Manager accounts

### Manager
- View-only access to: Competitions, Submissions, Awards, Exhibitions
- View statistics & reports

### Staff
- Manage Competitions (CRUD)
- Review & grade Submissions
- Grant and revoke Awards
- Manage Exhibitions and Artworks
- View Students

### Student
- View Competitions
- Submit artworks to ongoing competitions
- View own submissions and reviews
- View own awards and exhibition status

### Customer
- Browse public exhibitions
- Purchase available artworks

---

## Getting Started

### Backend
```bash
cd backend/IoFAApi
dotnet run
# API runs on http://localhost:5117
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

### Database
1. Create a SQL Server database
2. Run `Data/IoFA_DB_20260403.sql` to create schema and seed data
3. Update connection string in `appsettings.json`

### Demo Accounts
| Role | Username | Password |
|---|---|---|
| Admin | admin | admin123 |
| Manager | manager1 | manager123 |
| Staff | staff1 | staff123 |
| Student | student1 | student123 |
| Customer | customer1 | customer123 |

---

## Key Features

### Competition Management
- Create competitions with scoring criteria and awards
- Automatic status calculation (Upcoming / Ongoing / Completed) based on dates
- Staff can only edit/delete Upcoming competitions

### Submission & Review
- Students submit artworks to ongoing competitions
- Staff review with criteria-based scoring (weighted scores)
- Auto-calculated rating: Best (≥90) / Better (≥80) / Good (≥70) / Moderate (≥60) / Normal (<60)
- Submissions locked from re-review once awarded or exhibited

### Awards
- Awards can only be granted after all submissions in a competition are reviewed
- Each award can only be granted to one submission
- Manager has view-only access; cannot grant or revoke

### Exhibitions
- Only "Best"-rated artworks can be added to exhibitions
- Completed exhibitions cannot receive new artworks
- Sold artworks cannot be added to another exhibition
- Track sales with customer info and sold price

### Role-Based UI
- Navigation menus adapt per role
- Action buttons (Add/Edit/Delete/Grant) hidden for Manager
- Purchase button only visible to Customer role
- Submit Artwork button only visible to Student role on public pages
