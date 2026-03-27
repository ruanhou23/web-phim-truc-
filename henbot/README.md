# 🤖 HenBot - Movie Data Processing Tools

## Tổng Quan
HenBot là bộ công cụ xử lý dữ liệu phim, chuyển đổi giữa các format CSV và JSON, và tích hợp vào website NhanPhim.

## 📁 Cấu Trúc Thư Mục
```
henbot/
├── convert.js          # Chuyển đổi CSV sang CSV format mới
├── csv-to-json.js      # Chuyển đổi CSV sang JSON
├── output.csv          # File CSV đã xử lý (2,639 phim)
├── data1/
│   └── hen.csv         # File CSV gốc
├── data2/              # Thư mục dữ liệu phụ
└── package.json        # Cấu hình npm
```

## 🚀 Cách Sử Dụng

### **1. Cài Đặt Dependencies**
```bash
npm install
```

### **2. Chạy Scripts**

#### **Chuyển đổi CSV cơ bản:**
```bash
npm start
# hoặc
npm run convert
# hoặc
node convert.js
```

#### **Chuyển đổi CSV sang JSON:**
```bash
npm run csv-to-json
# hoặc
node csv-to-json.js
```

#### **Xem trợ giúp:**
```bash
npm run help
```

### **3. Sử Dụng Với Tham Số**

#### **Convert với file tùy chỉnh:**
```bash
node convert.js input.csv output.csv
```

#### **Ví dụ:**
```bash
# Chuyển đổi file hen.csv
node convert.js ./data1/hen.csv converted_hen.csv

# Chuyển đổi file khác
node convert.js ../link/all_movies.csv processed_movies.csv
```

## 📊 Dữ Liệu Đã Xử Lý

### **File `output.csv`**
- **2,639 phim 18+** đã được xử lý
- **Format chuẩn**: id, title, originalTitle, category, actor, videoLink, filePath
- **Nguồn video**: e.streamqq.com
- **Nguồn hình**: hentaiz.bot

### **File `adult_movies_data.json`**
- **JSON format** cho website
- **Tích hợp sẵn** vào NhanPhim
- **Bảo mật**: Có xác nhận độ tuổi

## 🔧 Scripts Chi Tiết

### **1. `convert.js`**
```javascript
// Chuyển đổi CSV với các tính năng:
- Làm sạch dữ liệu (cleanText, cleanMultilineNumber)
- Chuẩn hóa URL (normalizeUrl)
- Xử lý lỗi và validation
- Hỗ trợ CLI arguments
```

### **2. `csv-to-json.js`**
```javascript
// Chuyển đổi CSV sang JSON cho website:
- Tạo adult_movies_data.json
- Format phù hợp với movieData.js
- Tích hợp vào hệ thống chính
```

## 📈 Quy Trình Xử Lý Dữ Liệu

### **Bước 1: Chuẩn Bị Dữ Liệu**
1. Đặt file CSV vào `data1/` hoặc chỉ định đường dẫn
2. Đảm bảo format CSV có header: name, view, img, year, info, link

### **Bước 2: Chuyển Đổi**
```bash
# Chuyển đổi cơ bản
node convert.js

# Hoặc với file tùy chỉnh
node convert.js input.csv output.csv
```

### **Bước 3: Tạo JSON cho Website**
```bash
# Tạo file JSON cho website
node csv-to-json.js
```

### **Bước 4: Tích Hợp**
- File JSON tự động được tạo trong `../public/user/`
- Website sẽ tự động load dữ liệu mới
- Refresh trang để xem kết quả

## 🛠️ Tùy Chỉnh

### **Thay Đổi Format Output**
Chỉnh sửa trong `convert.js`:
```javascript
const out = {
  id: idCounter++,
  title: name,
  originalTitle: name,
  category: info || "",
  actor: "",
  videoLink: link,
  filePath: img,
  // Thêm fields khác nếu cần
};
```

### **Thay Đổi Đường Dẫn Output**
Chỉnh sửa trong `csv-to-json.js`:
```javascript
const outputFile = '../public/user/your_custom_file.json';
```

## 🐛 Troubleshooting

### **Lỗi "Missing script: start"**
```bash
# Cài đặt dependencies
npm install

# Hoặc chạy trực tiếp
node convert.js
```

### **Lỗi "Cannot find module"**
```bash
# Cài đặt dependencies
npm install csv-parser csv-writer
```

### **Lỗi "ENOENT: no such file"**
- Kiểm tra đường dẫn file input
- Đảm bảo file tồn tại
- Sử dụng đường dẫn tuyệt đối nếu cần

### **Lỗi "Permission denied"**
- Chạy với quyền admin (Windows)
- Hoặc sử dụng `sudo` (Linux/Mac)

## 📋 Checklist

- [ ] Dependencies đã cài đặt (`npm install`)
- [ ] File input CSV tồn tại
- [ ] Quyền ghi file output
- [ ] Format CSV đúng chuẩn
- [ ] Kiểm tra kết quả output

## 🔄 Workflow Hoàn Chỉnh

```bash
# 1. Cài đặt
npm install

# 2. Chuyển đổi CSV
node convert.js ./data1/hen.csv output.csv

# 3. Tạo JSON cho website
node csv-to-json.js

# 4. Kiểm tra kết quả
ls -la ../public/user/adult_movies_data.json

# 5. Test website
# Mở index.html và kiểm tra phần phim 18+
```

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra console logs
2. Xem file README này
3. Kiểm tra format dữ liệu input
4. Đảm bảo dependencies đã cài đặt

---

**Lưu ý**: Các script này xử lý dữ liệu phim 18+, hãy sử dụng có trách nhiệm và tuân thủ pháp luật.
