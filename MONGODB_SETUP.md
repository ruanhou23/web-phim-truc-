# 🍃 MongoDB Setup Guide

## 📋 Cài đặt MongoDB

### **Option 1: MongoDB Community Server (Local)**

#### **Windows:**
1. Tải MongoDB Community Server từ: https://www.mongodb.com/try/download/community
2. Chạy installer và chọn "Complete" installation
3. Chọn "Install MongoDB as a Service"
4. Chọn "Run service as Network Service user"
5. Cài đặt MongoDB Compass (GUI tool)

#### **macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

#### **Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### **Option 2: MongoDB Atlas (Cloud) - Khuyến nghị**

1. Truy cập https://www.mongodb.com/atlas
2. Tạo tài khoản miễn phí
3. Tạo cluster mới (chọn free tier)
4. Chọn region gần nhất (Singapore cho Việt Nam)
5. Tạo database user
6. Whitelist IP address (0.0.0.0/0 cho development)
7. Copy connection string

## 🔧 Cấu hình

### **1. Environment Variables**

Tạo file `.env`:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/nhanphim-platform

# Hoặc sử dụng MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nhanphim-platform?retryWrites=true&w=majority
```

### **2. Test Connection**

```bash
# Test MongoDB connection
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/nhanphim-platform').then(() => console.log('MongoDB OK')).catch(err => console.log('MongoDB Error:', err.message))"
```

### **3. MongoDB Compass (GUI)**

1. Tải MongoDB Compass từ: https://www.mongodb.com/products/compass
2. Kết nối với: `mongodb://localhost:27017`
3. Tạo database: `nhanphim-platform`
4. Tạo collections: `users`, `movies`, `test`

## 🚀 Chạy dự án với cả hai database

### **1. Cài đặt MongoDB (nếu chưa có)**
```bash
# Windows: Tải và cài đặt từ website
# macOS: brew install mongodb-community
# Linux: sudo apt-get install mongodb-org
```

### **2. Khởi động MongoDB**
```bash
# Windows: MongoDB sẽ tự động chạy như service
# macOS: brew services start mongodb/brew/mongodb-community
# Linux: sudo systemctl start mongod
```

### **3. Cấu hình Firebase (tùy chọn)**
```bash
# Tạo Firebase project
# Tải serviceAccountKey.json vào config/
# Cập nhật firebase-config.js
```

### **4. Chạy dự án**
```bash
npm start
```

## 📊 Kiểm tra trạng thái

### **API Endpoints:**
- `GET /api/status` - Kiểm tra trạng thái database
- `GET /api/test/databases` - Test cả hai database

### **Console Output:**
```
✅ MongoDB connected successfully
✅ Firebase Admin SDK initialized successfully

📊 Database Status:
   MongoDB: ✅ Connected
   Firebase: ✅ Connected
   Server ready to handle requests
```

## 🔍 Troubleshooting

### **Lỗi thường gặp:**

#### **1. MongoDB không khởi động**
```bash
# Windows: Kiểm tra MongoDB service
services.msc

# macOS: Kiểm tra process
ps aux | grep mongod

# Linux: Kiểm tra service
sudo systemctl status mongod
```

#### **2. Connection refused**
```bash
# Kiểm tra port 27017
netstat -an | grep 27017

# Khởi động lại MongoDB
sudo systemctl restart mongod
```

#### **3. Authentication failed**
```bash
# Kiểm tra connection string
echo $MONGODB_URI

# Test với mongo shell
mongo mongodb://localhost:27017/nhanphim-platform
```

## 🎯 Lợi ích của việc chạy song song

### **MongoDB:**
- ✅ Complex queries và aggregation
- ✅ Data analytics và reporting
- ✅ Backup và recovery
- ✅ Performance cho dữ liệu lớn

### **Firebase:**
- ✅ Real-time updates
- ✅ Authentication
- ✅ File storage
- ✅ Security rules

### **Kết hợp:**
- ✅ Data redundancy
- ✅ High availability
- ✅ Best of both worlds
- ✅ Scalability
