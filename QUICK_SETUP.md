# ⚡ Quick Setup - Cài đặt nhanh Firebase & MongoDB

## 🚀 Cách 1: Tự động (Khuyến nghị)

```bash
# Chạy script setup tự động
npm run setup:db

# Hoặc setup và start luôn
npm run setup:all
```

## 🔧 Cách 2: Thủ công

### Bước 1: Cài MongoDB
**Windows:**
```bash
# Tải và cài MongoDB Community Server
# https://www.mongodb.com/try/download/community
# Sau khi cài xong, khởi động service
net start MongoDB
```

**macOS:**
```bash
# Cài qua Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongod

# CentOS/RHEL
sudo yum install mongodb
sudo systemctl start mongod
```

### Bước 2: Cấu hình Firebase
1. Tải `serviceAccountKey.json` từ Firebase Console
2. Đặt vào thư mục `config/`
3. Hoặc tạo file `.env` với Firebase credentials

### Bước 3: Chạy server
```bash
npm start
```

## 🎯 Kết quả mong đợi

### Thành công:
```
✅ MongoDB connected successfully
✅ Firebase initialized with service account
🚀 Server is running on http://localhost:5000
📊 Database Status:
   MongoDB: ✅ Connected
   Firebase: ✅ Connected
```

### Demo mode (nếu chưa cấu hình):
```
⚠️  Firebase initialized without credentials - Limited functionality
❌ MongoDB not connected
🚀 Server is running on http://localhost:5000
📊 Database Status:
   MongoDB: ❌ Not connected
   Firebase: ❌ Demo mode
```

## 🔍 Test ngay

1. **Mở trình duyệt**: `http://localhost:5000/user/auth.html`
2. **Đăng ký tài khoản**: Nhập thông tin và đăng ký
3. **Kiểm tra dữ liệu**:
   - **MongoDB**: `mongosh` → `use nhanphim-platform` → `db.users.find()`
   - **Firebase**: Firebase Console → Firestore Database

## 🆘 Nếu gặp lỗi

### Lỗi MongoDB:
```bash
# Kiểm tra MongoDB có chạy không
mongosh
# Nếu không chạy được, khởi động lại
net start MongoDB  # Windows
brew services start mongodb-community  # macOS
sudo systemctl start mongod  # Linux
```

### Lỗi Firebase:
- Kiểm tra file `config/serviceAccountKey.json`
- Kiểm tra file `.env` có đúng format không
- Kiểm tra Firebase project ID

### Lỗi Port:
- Server sẽ tự động chuyển sang port 5001, 5002, etc.

## 📊 Dữ liệu được lưu ở đâu?

### Khi cấu hình đúng:
- **MongoDB**: User profiles, movie data, categories
- **Firebase**: Authentication, user accounts
- **Client**: Session data (temporary)

### Khi chưa cấu hình (Demo mode):
- **Client**: SessionStorage/LocalStorage only
- **Server**: Mock data (không lưu thật)

## 🎉 Hoàn thành!

Sau khi setup xong, bạn có thể:
- ✅ Đăng ký/đăng nhập thật
- ✅ Lưu dữ liệu vào database
- ✅ Quản lý users và movies
- ✅ Sử dụng tất cả tính năng

**Chúc bạn thành công! 🚀**
