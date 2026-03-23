# Hướng Dẫn Hệ Thống Quản Lý Cuộc Thi Nghệ Thuật

## 📋 Mục Lục
1. [Tổng Quan Hệ Thống](#tổng-quan-hệ-thống)
2. [Cấu Trúc Thư Mục](#cấu-trúc-thư-mục)
3. [Các Vai Trò Người Dùng](#các-vai-trò-người-dùng)
4. [Components Chính](#components-chính)
5. [Hướng Dẫn Sử Dụng](#hướng-dẫn-sử-dụng)
6. [Dữ Liệu Mẫu](#dữ-liệu-mẫu)

---

## 🎯 Tổng Quan Hệ Thống

Hệ thống quản lý cuộc thi nghệ thuật là một ứng dụng web hoàn chỉnh được xây dựng bằng **React + TypeScript + Tailwind CSS**, cho phép quản lý toàn diện các cuộc thi nghệ thuật, từ việc tạo cuộc thi, nhận bài dự thi, đánh giá, trao giải thưởng, đến tổ chức triển lãm và bán tác phẩm.

### Công Nghệ Sử Dụng
- **React 18** - Framework UI
- **TypeScript** - Type safety
- **React Router** - Routing và navigation
- **Tailwind CSS v4** - Styling
- **Radix UI** - Accessible components
- **Lucide React** - Icons
- **Sonner** - Toast notifications

---

## 📁 Cấu Trúc Thư Mục

```
/src/app/
├── components/          # Tất cả React components
│   ├── ui/             # UI components (Button, Card, Dialog, etc.)
│   ├── dashboards/     # Dashboard cho từng vai trò
│   ├── pages/          # Các trang chức năng
│   ├── HomePage.tsx    # Trang chủ với gallery
│   ├── LoginPage.tsx   # Trang đăng nhập
│   └── DashboardLayout.tsx  # Layout cho dashboard
├── context/
│   └── AuthContext.tsx # Quản lý authentication
├── data/
│   └── mockData.ts     # Dữ liệu mẫu
├── types/
│   └── index.ts        # TypeScript types
└── routes.tsx          # Cấu hình routing

/src/styles/
├── theme.css           # Theme variables
└── fonts.css           # Font imports
```

---

## 👥 Các Vai Trò Người Dùng

### 1. **Manager (Quản Lý)**
- **Username:** `manager` | **Password:** `manager123`
- **Quyền hạn:**
  - Xem tổng quan toàn bộ hệ thống
  - Xem danh sách Staff và Students
  - Xem tất cả Competitions, Submissions, Awards
  - Quản lý Exhibitions
  - Chỉ xem, không có quyền chỉnh sửa

### 2. **Administrator (Quản Trị Viên)**
- **Username:** `admin` | **Password:** `admin123`
- **Quyền hạn:**
  - Quản lý (CRUD) Staff
  - Quản lý (CRUD) Students
  - Không quản lý competitions và submissions

### 3. **Staff/Teacher (Giáo Viên)**
- **Username:** `staff1` | **Password:** `staff123`
- **Quyền hạn:**
  - Quản lý (CRUD) Competitions
  - Xem và đánh giá Submissions
  - Trao Awards cho học sinh
  - Quản lý Exhibitions
  - Quản lý Exhibition Submissions (bán tác phẩm)

### 4. **Student (Học Sinh)**
- **Username:** `student1`, `student2`, `student3`, `student4`, `student5` | **Password:** `student123`
- **Quyền hạn:**
  - Xem danh sách Competitions
  - Nộp bài dự thi (Submissions)
  - Xem bài dự thi của mình
  - Xem Awards của mình

---

## 🧩 Components Chính

### 1. **Core Components**

#### `/src/app/App.tsx`
- Component gốc của ứng dụng
- Bọc toàn bộ app trong `AuthProvider` để quản lý authentication
- Sử dụng `RouterProvider` từ React Router

#### `/src/app/routes.tsx`
- Định nghĩa tất cả routes của hệ thống
- Sử dụng React Router Data Mode
- Routes chính:
  - `/` - Trang chủ (HomePage)
  - `/login` - Trang đăng nhập
  - `/dashboard` - Dashboard (hiển thị theo vai trò)
  - `/dashboard/*` - Các trang con theo vai trò

#### `/src/app/context/AuthContext.tsx`
- Quản lý state authentication
- Cung cấp `currentUser`, `login`, `logout`
- Lưu trữ user vào localStorage
- Sử dụng React Context API

---

### 2. **Layout Components**

#### `/src/app/components/DashboardLayout.tsx`
**Mục đích:** Layout chung cho tất cả dashboard pages

**Chức năng:**
- Header với logo, tên hệ thống, vai trò người dùng
- Dropdown menu với thông tin user
- Nút **Sign Out** để đăng xuất
- Navigation bar với menu theo vai trò
- Main content area (sử dụng `<Outlet />` của React Router)

**Navigation Items theo vai trò:**
```typescript
Administrator:
  - Dashboard
  - Manage Staff
  - Manage Students

Staff/Teacher:
  - Dashboard
  - Students
  - Competitions
  - Submissions
  - Awards
  - Exhibitions

Student:
  - Dashboard
  - Competitions
  - My Submissions
  - My Awards

Manager:
  - Dashboard
  - Staff & Students
  - Competitions
  - Awards
  - Submissions
  - Exhibitions
```

---

### 3. **Authentication Components**

#### `/src/app/components/LoginPage.tsx`
**Mục đích:** Trang đăng nhập cho người dùng

**Chức năng:**
- Form đăng nhập với username và password
- Kiểm tra credentials với `mockUsers`
- Hiển thị toast notification khi đăng nhập thành công/thất bại
- Redirect đến `/dashboard` sau khi đăng nhập thành công
- Hiển thị danh sách demo accounts để test

**Demo Accounts hiển thị:**
- Manager: `manager / manager123`
- Administrator: `admin / admin123`
- Staff: `staff1 / staff123`
- Student: `student1 / student123`

---

### 4. **Home & Public Components**

#### `/src/app/components/HomePage.tsx`
**Mục đích:** Trang chủ công khai với gallery tác phẩm nghệ thuật

**Sections:**

1. **Hero Section**
   - Tiêu đề và mô tả hệ thống
   - Nút CTA:
     - Nếu chưa đăng nhập: "Get Started"
     - Nếu đã đăng nhập: "Go to Dashboard" + "Sign Out"

2. **Featured Artwork Gallery**
   - Hiển thị 12 tác phẩm nghệ thuật nổi bật
   - Grid layout responsive (1/2/3 columns)
   - Click vào tác phẩm mở modal chi tiết
   - Badge hiển thị rating (Best/Better/Good)

3. **Highlighted Winners Section**
   - Hiển thị 3 tác phẩm đoạt giải cao nhất
   - Card lớn hơn với thông tin chi tiết
   - Badge hiển thị tên giải thưởng

4. **Previous Competition Winners**
   - Hiển thị danh sách học sinh đoạt giải
   - Thông tin: Avatar, tên, giải thưởng, cuộc thi, hình ảnh tác phẩm
   - Responsive grid layout
   - Click để xem chi tiết tác phẩm

5. **Features Section**
   - Showcase các tính năng chính
   - Icons: Trophy, Calendar, Users, Upload, Palette

**Artwork Detail Modal:**
- Hiển thị hình ảnh tác phẩm full size
- Thông tin nghệ sĩ (tên, email, class)
- Tiêu đề và mô tả tác phẩm
- Quote/Poem/Story (nếu có)
- Rating và đánh giá từ giáo viên
- Điểm mạnh, điểm yếu, hướng cải thiện

---

### 5. **Dashboard Components**

#### `/src/app/components/dashboards/ManagerDashboard.tsx`
**Mục đích:** Dashboard tổng quan cho Manager

**Hiển thị:**
- **Statistics Cards:**
  - Total Users (Staff + Students)
  - Active Competitions
  - Total Submissions
  - Evaluation Progress

- **Recent Activity:**
  - 5 bài nộp gần nhất
  - Thông tin: Tác phẩm, học sinh, cuộc thi, rating

- **Competition Overview:**
  - Danh sách tất cả cuộc thi
  - Thống kê số lượng submissions cho mỗi cuộc thi

#### `/src/app/components/dashboards/AdministratorDashboard.tsx`
**Mục đích:** Dashboard cho Administrator

**Hiển thị:**
- **Statistics:**
  - Total Staff
  - Total Students

- **Quick Overview:**
  - Danh sách Staff (tên, email, phone)
  - Danh sách Students (tên, class, roll number)

#### `/src/app/components/dashboards/StaffDashboard.tsx`
**Mục đích:** Dashboard cho Staff/Teacher

**Hiển thị:**
- **Statistics Cards:**
  - Total Students
  - Ongoing Competitions
  - Pending Submissions (chưa đánh giá)
  - Total Exhibitions

- **Pending Submissions:**
  - Danh sách bài nộp chưa được đánh giá
  - Thông tin: Tác phẩm, học sinh, cuộc thi
  - Link đến trang Submissions để đánh giá

- **Active Competitions:**
  - Danh sách cuộc thi đang diễn ra
  - Thông tin: Tên, thời gian, điều kiện

#### `/src/app/components/dashboards/StudentDashboard.tsx`
**Mục đích:** Dashboard cho Student

**Hiển thị:**
- **Welcome Message:** Chào mừng học sinh

- **Statistics Cards:**
  - Total Submissions
  - Total Awards
  - Ongoing Competitions

- **My Recent Submissions:**
  - 3 bài nộp gần nhất
  - Hiển thị hình ảnh, tiêu đề, rating
  - Badge cho rating

- **My Awards:**
  - Danh sách giải thưởng đạt được
  - Thông tin: Tên giải, cuộc thi, ngày trao

---

### 6. **CRUD Management Pages**

#### `/src/app/components/pages/ManageStaff.tsx`
**Vai trò sử dụng:** Administrator

**Chức năng:**
- **View:** Hiển thị danh sách Staff trong table
- **Create:** Thêm Staff mới qua Dialog form
- **Update:** Chỉnh sửa thông tin Staff
- **Delete:** Xóa Staff (với confirmation)

**Thông tin Staff:**
- Name, Email, Phone
- Date Joined
- Class Handled, Subject Handled
- Remarks

#### `/src/app/components/pages/ManageStudents.tsx`
**Vai trò sử dụng:** Administrator, Staff

**Chức năng:**
- **View:** Hiển thị danh sách Students trong table
- **Create:** Thêm Student mới
- **Update:** Chỉnh sửa thông tin Student
- **Delete:** Xóa Student

**Thông tin Student:**
- Name, Email, Phone
- Admission Date
- Class, Roll Number
- Remarks

#### `/src/app/components/pages/ManageCompetitions.tsx`
**Vai trò sử dụng:** Staff

**Chức năng:**
- **View:** Danh sách Competitions với status badges
- **Create:** Tạo cuộc thi mới
- **Update:** Chỉnh sửa thông tin cuộc thi
- **Delete:** Xóa cuộc thi

**Thông tin Competition:**
- Title, Description
- Start Date, End Date
- Conditions, Award Details
- Status: `upcoming` | `ongoing` | `completed`

**Status Badge Colors:**
- Upcoming: Blue
- Ongoing: Green
- Completed: Gray

#### `/src/app/components/pages/ManageSubmissions.tsx`
**Vai trò sử dụng:** Staff

**Chức năng:**
- **View:** Xem tất cả Submissions
- **Evaluate:** Đánh giá bài nộp
  - Rating: Best / Better / Good
  - Remarks
  - Positive Points
  - Negative Points
  - Areas of Improvement

**Hiển thị:**
- Hình ảnh tác phẩm
- Tiêu đề, mô tả
- Tên học sinh, cuộc thi
- Quote/Poem/Story
- Rating badge
- Thông tin đánh giá

**Dialog đánh giá:**
- Select rating (Best/Better/Good)
- Textarea cho mỗi phần đánh giá
- Save button

#### `/src/app/components/pages/ManageAwards.tsx`
**Vai trò sử dụng:** Staff, Manager

**Chức năng:**
- **View:** Danh sách Awards
- **Create:** Trao giải thưởng cho học sinh
  - Chọn Student
  - Chọn Competition (chỉ completed)
  - Chọn Submission của student đó
  - Nhập Award Name, Award Date, Remarks
- **Delete:** Xóa giải thưởng

**Validation:**
- Chỉ có thể trao giải cho cuộc thi đã hoàn thành
- Chỉ có thể chọn submissions của student được chọn

#### `/src/app/components/pages/ManageExhibitions.tsx`
**Vai trò sử dụng:** Staff

**Chức năng:**
- **View:** Danh sách Exhibitions
- **Create:** Tạo triển lãm mới
  - Name, Location
  - Start Date, End Date
  - Description
- **Update:** Chỉnh sửa thông tin triển lãm
- **Delete:** Xóa triển lãm

#### `/src/app/components/pages/ManageExhibitionSubmissions.tsx`
**Vai trò sử dụng:** Staff

**Mục đích:** Quản lý tác phẩm trong triển lãm và theo dõi bán hàng

**Chức năng:**
- **View:** Danh sách tác phẩm trong triển lãm
- **Add:** Thêm tác phẩm vào triển lãm
  - Chọn Submission
  - Chọn Exhibition
  - Nhập Price Quoted
- **Update Sale:** Cập nhật thông tin bán hàng
  - Sold Price
  - Customer Name, Contact
  - Status: `pending` | `sold` | `returned`
  - Payment Status: `not_applicable` | `pending` | `paid_to_student`

**Hiển thị:**
- Hình ảnh tác phẩm
- Thông tin triển lãm
- Giá niêm yết / Giá bán
- Status badges
- Thông tin khách hàng

#### `/src/app/components/pages/ViewCompetitions.tsx`
**Vai trò sử dụng:** Student, Manager

**Mục đích:** Xem danh sách cuộc thi (read-only)

**Hiển thị:**
- Danh sách tất cả cuộc thi
- Thông tin đầy đủ: Title, Description, Dates, Conditions, Awards, Status
- Status badges với màu sắc

#### `/src/app/components/pages/MySubmissions.tsx`
**Vai trò sử dụng:** Student

**Chức năng:**
- **View:** Xem danh sách bài nộp của mình
- **Create:** Nộp bài dự thi mới
  - Upload Image URL
  - Nhập Title, Description
  - Chọn thêm: Quotation, Poem, hoặc Story
  - Chọn Competition
- **Delete:** Xóa bài nộp của mình

**Hiển thị:**
- Hình ảnh tác phẩm
- Thông tin chi tiết
- Rating (nếu đã được đánh giá)
- Feedback từ giáo viên

#### `/src/app/components/pages/MyAwards.tsx`
**Vai trò sử dụng:** Student

**Mục đích:** Xem danh sách giải thưởng của mình

**Hiển thị:**
- Tên giải thưởng
- Cuộc thi
- Ngày trao giải
- Hình ảnh tác phẩm đoạt giải
- Remarks

---

### 7. **UI Components** (`/src/app/components/ui/`)

Các component UI được xây dựng dựa trên **Radix UI** và **Tailwind CSS**, đảm bảo accessibility và responsive.

#### `button.tsx`
- Support multiple variants: default, destructive, outline, secondary, ghost, link
- Multiple sizes: sm, default, lg, icon
- Support `asChild` prop (Radix pattern)
- Forward refs với `React.forwardRef`

#### `card.tsx`
- CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- Sử dụng cho hiển thị thông tin, statistics, forms

#### `dialog.tsx`
- Modal dialogs cho forms, confirmations
- DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
- Overlay với backdrop blur

#### `table.tsx`
- Responsive tables
- Components: Table, TableHeader, TableBody, TableHead, TableRow, TableCell
- Sử dụng cho danh sách dữ liệu

#### `badge.tsx`
- Variants: default, secondary, destructive, outline
- Sử dụng cho status indicators, tags

#### `input.tsx`, `label.tsx`, `textarea.tsx`, `select.tsx`
- Form elements với styling nhất quán
- Support validation states

#### `dropdown-menu.tsx`
- Menu dropdown cho user actions
- Components: DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator

#### `avatar.tsx`
- Hiển thị avatar người dùng
- Fallback với initials

---

## 📊 Dữ Liệu Mẫu

### Users (8 người)
1. **Manager:** John Manager
2. **Administrator:** Sarah Admin
3. **Staff:** Emily Teacher
4. **Students:** Alice Johnson, Bob Smith, Charlie Chen, Diana Martinez, Emma Wilson

### Competitions (4 cuộc thi)
1. **Spring Art Festival 2026** (ongoing)
2. **Abstract Expression Contest** (upcoming)
3. **Winter Wonderland 2025** (completed)
4. **Summer Creativity Challenge 2025** (completed)

### Submissions (20 tác phẩm)
- 5 tác phẩm cho Spring Art Festival 2026
- 5 tác phẩm cho Winter Wonderland 2025
- 10 tác phẩm cho Summer Creativity Challenge 2025

### Awards (8 giải thưởng)
- **Winter Wonderland 2025:** 1st, 2nd, 3rd Prize
- **Summer Challenge 2025:** 1st, 2nd, 3rd Prize, Honorable Mention, Best Use of Color

### Exhibitions (2 triển lãm)
1. **National Youth Art Exhibition** - New York City, NY
2. **Spring Art Showcase** - Los Angeles, CA

---

## 🎓 Hướng Dẫn Sử Dụng

### Đăng Nhập Hệ Thống

1. Truy cập trang chủ
2. Click nút "Get Started" hoặc vào `/login`
3. Nhập username và password theo vai trò:
   - **Manager:** `manager / manager123`
   - **Administrator:** `admin / admin123`
   - **Staff:** `staff1 / staff123`
   - **Student:** `student1 / student123`
4. Click "Sign In"
5. Hệ thống tự động chuyển đến Dashboard tương ứng

### Quy Trình Quản Lý Cuộc Thi (Staff)

1. **Tạo Cuộc Thi**
   - Vào Dashboard > Competitions
   - Click "Add New Competition"
   - Điền thông tin: Title, Description, Dates, Conditions, Awards
   - Chọn Status
   - Save

2. **Nhận Bài Dự Thi**
   - Students tự nộp bài qua "My Submissions"
   - Staff xem danh sách trong Dashboard > Submissions

3. **Đánh Giá Bài Nộp**
   - Vào Dashboard > Submissions
   - Click "Evaluate" trên bài nộp
   - Chọn Rating (Best/Better/Good)
   - Nhập Remarks, Positive Points, Negative Points, Areas of Improvement
   - Save

4. **Trao Giải Thưởng**
   - Đổi status cuộc thi thành "completed"
   - Vào Dashboard > Awards
   - Click "Add New Award"
   - Chọn Student, Competition (completed), Submission
   - Nhập Award Name, Date, Remarks
   - Save

5. **Tổ Chức Triển Lãm**
   - Vào Dashboard > Exhibitions
   - Tạo Exhibition mới
   - Vào Exhibition Submissions
   - Thêm các tác phẩm vào triển lãm
   - Nhập giá niêm yết

6. **Quản Lý Bán Hàng**
   - Khi có khách mua, vào Exhibition Submissions
   - Click "Update" trên tác phẩm
   - Nhập Sold Price, Customer info
   - Đổi Status thành "sold"
   - Đổi Payment Status thành "paid_to_student"

### Quy Trình Nộp Bài (Student)

1. Đăng nhập với tài khoản Student
2. Vào Dashboard > Competitions
3. Xem danh sách cuộc thi đang diễn ra
4. Vào Dashboard > My Submissions
5. Click "Submit New Artwork"
6. Upload ảnh (nhập URL)
7. Điền Title, Description
8. Thêm Quotation, Poem, hoặc Story (tùy chọn)
9. Chọn Competition
10. Submit
11. Đợi giáo viên đánh giá
12. Xem kết quả đánh giá trong "My Submissions"
13. Nếu đoạt giải, xem trong "My Awards"

---

## 🔐 Authentication Flow

```
1. User nhập credentials
   ↓
2. AuthContext.login() kiểm tra với mockUsers
   ↓
3. Nếu hợp lệ:
   - Lưu currentUser vào localStorage
   - Update AuthContext state
   - Redirect đến /dashboard
   ↓
4. DashboardRouter kiểm tra role
   ↓
5. Hiển thị Dashboard tương ứng:
   - manager → ManagerDashboard
   - administrator → AdministratorDashboard
   - staff → StaffDashboard
   - student → StudentDashboard
```

---

## 🎨 Theme & Styling

### Theme Variables (`/src/styles/theme.css`)
- Sử dụng CSS custom properties
- Support dark mode (via `@media (prefers-color-scheme: dark)`)
- Colors: primary, secondary, accent, destructive, muted
- Border radius, spacing constants

### Tailwind CSS v4
- Utility-first CSS framework
- Custom theme tokens
- Responsive breakpoints: sm, md, lg, xl
- Dark mode support

---

## 🚀 Tính Năng Nổi Bật

1. **Role-Based Access Control (RBAC)**
   - Mỗi vai trò có quyền truy cập và chức năng riêng
   - Navigation menu tự động thay đổi theo vai trò

2. **Responsive Design**
   - Hoạt động tốt trên mobile, tablet, desktop
   - Adaptive grid layouts

3. **Real-time Feedback**
   - Toast notifications cho mọi action
   - Form validation

4. **Rich Content Support**
   - Hỗ trợ Quotations, Poems, Stories cho tác phẩm
   - Image galleries

5. **Complete CRUD Operations**
   - Tất cả entities đều có đầy đủ Create, Read, Update, Delete

6. **Art Exhibition & Sales Tracking**
   - Quản lý triển lãm
   - Theo dõi bán tác phẩm nghệ thuật
   - Payment tracking

7. **Comprehensive Evaluation System**
   - Rating system (Best/Better/Good)
   - Detailed feedback (positive, negative, improvement areas)

---

## 📝 TypeScript Types

### Các Type Chính (`/src/app/types/index.ts`)

```typescript
// User & Authentication
type UserRole = 'manager' | 'administrator' | 'staff' | 'student';

interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  email: string;
  name: string;
}

// Staff & Students
interface Staff {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  dateJoined: string;
  classHandled: string;
  subjectHandled: string;
  remarks?: string;
}

interface Student {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  admissionDate: string;
  class: string;
  rollNumber: string;
  remarks?: string;
}

// Competitions
type CompetitionStatus = 'upcoming' | 'ongoing' | 'completed';

interface Competition {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  conditions: string;
  awardDetails: string;
  status: CompetitionStatus;
}

// Submissions
type SubmissionRating = 'best' | 'better' | 'good';

interface Submission {
  id: string;
  studentId: string;
  competitionId: string;
  imageUrl: string;
  title: string;
  description: string;
  quotation?: string;
  poem?: string;
  story?: string;
  submissionDate: string;
  rating?: SubmissionRating;
  remarks?: string;
  positivePoints?: string;
  negativePoints?: string;
  areasOfImprovement?: string;
  staffId?: string;
}

// Awards
interface Award {
  id: string;
  studentId: string;
  competitionId: string;
  submissionId: string;
  awardName: string;
  awardDate: string;
  remarks?: string;
}

// Exhibitions
interface Exhibition {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

// Exhibition Submissions (Sales)
type ExhibitionStatus = 'pending' | 'sold' | 'returned';
type PaymentStatus = 'not_applicable' | 'pending' | 'paid_to_student';

interface ExhibitionSubmission {
  id: string;
  submissionId: string;
  exhibitionId: string;
  priceQuoted: number;
  soldPrice?: number;
  status: ExhibitionStatus;
  customerName?: string;
  customerContact?: string;
  paymentStatus: PaymentStatus;
  remarks?: string;
}
```

---

## 🔧 Development Tips

### Thêm Chức Năng Mới

1. **Thêm Type mới:** Update `/src/app/types/index.ts`
2. **Thêm Mock Data:** Update `/src/app/data/mockData.ts`
3. **Tạo Component:** Tạo file trong `/src/app/components/pages/`
4. **Thêm Route:** Update `/src/app/routes.tsx`
5. **Update Navigation:** Update `DashboardLayout.tsx`

### Testing với Demo Accounts

- Đăng nhập với các tài khoản khác nhau để test quyền truy cập
- Kiểm tra CRUD operations cho mỗi vai trò
- Verify validation và error handling

### Customization

- **Colors:** Update `/src/styles/theme.css`
- **Fonts:** Import trong `/src/styles/fonts.css`
- **Components:** Modify trong `/src/app/components/ui/`

---

## 📞 Liên Hệ & Hỗ Trợ

Hệ thống này là demo hoàn chỉnh cho mục đích học tập và presentation. Để triển khai production:

1. Thay thế mock data bằng real database (Supabase, Firebase, etc.)
2. Implement proper authentication (JWT, OAuth)
3. Add file upload cho images
4. Implement server-side validation
5. Add real-time updates
6. Deploy lên hosting (Vercel, Netlify, etc.)

---

**Cập nhật lần cuối:** 2026-03-11
**Phiên bản:** 1.0.0
