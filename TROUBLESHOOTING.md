# 🔧 Troubleshooting Guide

## ❌ Lỗi thường gặp và cách khắc phục

### 1. **MongoDB Connection Error**
```
MongoDB connection error: connect ECONNREFUSED ::1:27017
```

**Nguyên nhân:** MongoDB chưa được cài đặt hoặc chưa chạy

**Giải pháp:**
```bash
# Cách 1: Cài đặt MongoDB
# Windows: Tải từ https://www.mongodb.com/try/download/community
# Sau khi cài đặt, chạy MongoDB service

# Cách 2: Sử dụng MongoDB Atlas (Cloud)
# Tạo tài khoản tại https://www.mongodb.com/atlas
# Tạo cluster miễn phí
# Copy connection string và thêm vào .env

# Cách 3: Bỏ qua MongoDB (khuyến nghị)
# Dự án đã được cấu hình để chạy chỉ với Firebase
# MongoDB là optional, không bắt buộc
```

### 2. **Firebase Configuration Error**
```
Firebase not properly configured. Using demo mode.
```

**Nguyên nhân:** Firebase chưa được cấu hình đúng

**Giải pháp:**
1. Tạo Firebase project tại https://console.firebase.google.com/
2. Bật Authentication và Firestore
3. Tải serviceAccountKey.json và đặt vào `config/`
4. Cập nhật `public/user/js/firebase-config.js` với config thực tế

### 3. **NPM Vulnerabilities**
```
13 vulnerabilities (10 moderate, 3 high)
```

**Giải pháp:**
```bash
# Cập nhật packages
npm audit fix

# Hoặc cập nhật từng package
npm update
```

### 4. **Module Import Error**
```
Cannot resolve module 'firebase/app'
```

**Nguyên nhân:** Firebase packages chưa được cài đặt đúng

**Giải pháp:**
```bash
# Cài đặt lại Firebase
npm uninstall firebase firebase-admin
npm install firebase@latest firebase-admin@latest
```

## 🚀 **Cách chạy dự án nhanh nhất**

### **Option 1: Chạy với Firebase (Khuyến nghị)**
```bash
# 1. Cài đặt dependencies
npm install

# 2. Cấu hình Firebase (tùy chọn)
# - Tạo Firebase project
# - Cập nhật firebase-config.js

# 3. Chạy dự án
npm start

# 4. Truy cập http://localhost:5000
```

### **Option 2: Chạy Demo Mode**
```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy ngay (không cần cấu hình)
npm start

# 3. Truy cập http://localhost:5000
# - Giao diện sẽ hoạt động bình thường
# - Authentication sẽ ở chế độ demo
```

## 🔍 **Debug Commands**

### **Kiểm tra MongoDB:**
```bash
# Kiểm tra MongoDB có chạy không
netstat -an | findstr :27017

# Hoặc
mongo --version
```

### **Kiểm tra Firebase:**
```bash
# Kiểm tra Firebase config
node -e "console.log(require('./config/firebase.js'))"
```

### **Kiểm tra Dependencies:**
```bash
# Kiểm tra packages
npm list firebase firebase-admin

# Kiểm tra vulnerabilities
npm audit
```

## 📋 **Checklist khắc phục lỗi**

- [ ] MongoDB đã được cài đặt và chạy (hoặc bỏ qua)
- [ ] Firebase đã được cấu hình (hoặc chạy demo mode)
- [ ] Dependencies đã được cài đặt đúng
- [ ] Port 5000 không bị sử dụng bởi ứng dụng khác
- [ ] Firewall không chặn port 5000

## 🆘 **Nếu vẫn gặp lỗi**

1. **Xóa node_modules và cài lại:**
```bash
rm -rf node_modules package-lock.json
npm install
```

2. **Kiểm tra Node.js version:**
```bash
node --version
# Cần Node.js >= 14.0.0
```

3. **Chạy với debug mode:**
```bash
DEBUG=* npm start
```

4. **Kiểm tra logs chi tiết:**
```bash
npm start 2>&1 | tee server.log
```

## 📞 **Liên hệ hỗ trợ**

Nếu vẫn gặp vấn đề, hãy:
1. Copy toàn bộ error message
2. Kiểm tra Node.js version
3. Kiểm tra OS (Windows/Mac/Linux)
4. Gửi thông tin để được hỗ trợ
