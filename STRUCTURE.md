# Cấu Trúc Dự Án NhanPhim

## 📁 Cấu Trúc Thư Mục

```
nhanphim-platform/
├── public/
│   ├── index.html              # Trang chủ chính (chọn user/admin)
│   ├── admin/                  # Thư mục Admin
│   │   ├── login.html          # Trang đăng nhập admin
│   │   ├── dashboard.html      # Dashboard admin
│   │   ├── css/
│   │   │   └── styles.css      # CSS cho admin
│   │   ├── js/
│   │   │   └── scripts.js      # JavaScript cho admin
│   │   └── images/             # Hình ảnh admin
│   └── user/                   # Thư mục User
│       ├── index.html          # Trang xem phim user
│       ├── css/
│       │   └── styles.css      # CSS cho user
│       ├── js/
│       │   └── scripts.js      # JavaScript cho user
│       └── images/             # Hình ảnh user
├── apps/
│   ├── api/                    # Backend API
│   └── client/                 # Client components
├── packages/
│   ├── config/                 # Cấu hình database
│   └── utils/                  # Utilities
├── videos/                     # Video files
├── server.js                   # Server chính
└── package.json
```

## 🚀 Cách Sử Dụng

### 1. Trang Chủ Chính
- **URL:** `http://localhost:5000/`
- **Mô tả:** Trang chọn giữa User và Admin

### 2. Trang User (Xem Phim)
- **URL:** `http://localhost:5000/user`
- **Mô tả:** Trang xem phim cho người dùng thông thường
- **Tính năng:**
  - Xem danh sách phim
  - Tìm kiếm phim
  - Lọc theo thể loại/quốc gia
  - Thanh điều hướng

### 3. Trang Admin (Quản Trị)
- **URL:** `http://localhost:5000/admin`
- **Mô tả:** Trang đăng nhập admin
- **Thông tin đăng nhập:**
  - Username: `admin`
  - Password: `admin123`

### 4. Dashboard Admin
- **URL:** `http://localhost:5000/admin/dashboard`
- **Mô tả:** Dashboard quản trị hệ thống
- **Tính năng:**
  - Thống kê tổng quan
  - Quản lý phim
  - Quản lý người dùng
  - Cài đặt hệ thống

## 🔧 API Endpoints

### User API
- `GET /api/movies` - Lấy danh sách phim

### Admin API
- `POST /api/admin/login` - Đăng nhập admin
- `GET /api/admin/stats` - Lấy thống kê admin

## 📱 Responsive Design

- ✅ Desktop (1024px+)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (< 768px)

## 🎨 UI/UX Features

### User Interface
- Dark theme với Netflix-style
- Thanh điều hướng với dropdown
- Movie carousels
- Search và filter
- Responsive design

### Admin Interface
- Modern dashboard design
- Sidebar navigation
- Stats cards với animation
- Data tables với actions
- Notification system

## 🛠️ Development

### Chạy Server
```bash
npm start
```

### Chạy Development
```bash
npm run dev
```

## 📝 Ghi Chú

- Tất cả file CSS và JS đã được tách riêng cho admin và user
- Cấu trúc thư mục rõ ràng, dễ bảo trì
- Responsive design cho tất cả thiết bị
- API endpoints riêng biệt cho user và admin
