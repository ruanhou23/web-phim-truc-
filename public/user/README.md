# 🎬 NhanPhim - Trang Web Xem Phim

## 📋 Tổng Quan
NhanPhim là một trang web xem phim trực tuyến được xây dựng với HTML, CSS, JavaScript và tích hợp dữ liệu từ CSV/JSON.

## 🚀 Tính Năng Chính

### 🏠 Trang Chủ (index.html)
- **Hero Section**: Hiển thị phim nổi bật với thông tin động
- **Danh Mục Phim**: 
  - 🎬 Phim Châu Tinh Trì
  - 🔥 Phim Thành Long  
  - ✨ Phim Mới Cập Nhật
  - 💪 Phim Lý Liên Kiệt
- **Bộ Lọc Nhanh**: Lọc phim theo diễn viên/thể loại
- **Sidebar Trending**: Top phim theo ngày/tuần/tháng
- **Tìm Kiếm**: Tìm kiếm phim theo tên, diễn viên, thể loại

### 🎥 Trang Chi Tiết Phim (movie-detail.html)
- **Thông Tin Phim**: Tên, năm, lượt xem, đánh giá
- **Video Player**: Phát video với điều khiển chất lượng
- **Danh Sách Tập**: Hiển thị các tập phim (nếu có)
- **Phim Liên Quan**: Gợi ý phim cùng thể loại/diễn viên
- **Bảng Xếp Hạng**: Top phim bên sidebar

## 📊 Nguồn Dữ Liệu

### 📁 Thư Mục `../link/`
Chứa dữ liệu phim được trích xuất từ thư mục `phimle-master`:

- **`movies_data.json`**: File JSON chứa tất cả 194 phim
- **`all_movies.csv`**: File CSV tổng hợp
- **Files theo thể loại**: 
  - `chautinhtri_movies.csv` (51 phim)
  - `thanhlong_movies.csv` (22 phim)
  - `lylienkiet_movies.csv` (19 phim)
  - `capba_movies.csv` (29 phim)
  - `daohaitac_movies.csv` (9 phim)
  - `Phim_18_movies.csv` (29 phim)
  - `One_Piece_Live_Action_movies.csv` (9 phim)
  - `Lm_Chnh_Anh_movies.csv` (11 phim)
  - `Chn_T_an_movies.csv` (14 phim)
  - `Tng_Hp_movies.csv` (39 phim)

### 📋 Cấu Trúc Dữ Liệu
Mỗi phim chứa:
- `id`: Mã định danh
- `title`: Tên phim (tiếng Việt)
- `originalTitle`: Tên gốc
- `category`: Thể loại
- `actor`: Diễn viên chính
- `videoLink`: Link xem phim
- `filePath`: Đường dẫn file HTML gốc

## 🛠️ Công Nghệ Sử Dụng

### Frontend
- **HTML5**: Cấu trúc trang web
- **CSS3**: Styling với dark theme, responsive design
- **JavaScript ES6+**: Logic xử lý dữ liệu và tương tác
- **Font Awesome**: Icons
- **Firebase**: Authentication (tùy chọn)

### Data Processing
- **CSV Parser**: Xử lý dữ liệu từ file CSV
- **JSON**: Lưu trữ dữ liệu phim
- **Image Mapping**: Ánh xạ ảnh phim

## 📱 Responsive Design
- **Desktop**: Layout 2 cột với sidebar
- **Tablet**: Layout 1 cột, sidebar ở trên
- **Mobile**: Tối ưu cho màn hình nhỏ

## 🎨 Giao Diện
- **Dark Theme**: Nền đen với accent màu đỏ (#e50914)
- **Modern UI**: Card-based design với hover effects
- **Smooth Animations**: Transition mượt mà
- **Loading States**: Hiển thị trạng thái tải

## 🔧 Cài Đặt & Chạy

1. **Clone repository**:
   ```bash
   git clone <repository-url>
   cd web-phim-truc-
   ```

2. **Mở trang web**:
   - Mở `public/user/index.html` trong trình duyệt
   - Hoặc sử dụng local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx http-server
   ```

3. **Test dữ liệu**:
   - Mở `public/user/test-data.html` để kiểm tra việc load dữ liệu

## 📁 Cấu Trúc File

```
public/user/
├── index.html              # Trang chủ
├── movie-detail.html       # Trang chi tiết phim
├── test-data.html          # Trang test dữ liệu
├── auth.html              # Trang đăng nhập/đăng ký
├── css/
│   ├── styles.css         # CSS chính
│   └── auth.css           # CSS cho auth
├── js/
│   ├── scripts.js         # JavaScript chính
│   ├── movieData.js       # Quản lý dữ liệu phim
│   └── imageMapping.js    # Ánh xạ ảnh
├── img/                   # Thư mục ảnh phim
└── data/
    └── movies.csv         # Dữ liệu phim (backup)
```

## 🚀 Tính Năng Nâng Cao

### 🔍 Tìm Kiếm Thông Minh
- Tìm theo tên phim
- Tìm theo diễn viên
- Tìm theo thể loại
- Gợi ý tìm kiếm

### 🎯 Bộ Lọc
- Lọc theo diễn viên
- Lọc theo thể loại
- Lọc theo năm
- Lọc theo lượt xem

### 📊 Thống Kê
- Top phim trending
- Phim mới nhất
- Phim được xem nhiều nhất
- Phân loại theo diễn viên

## 🐛 Troubleshooting

### Lỗi thường gặp:

1. **Không load được dữ liệu**:
   - Kiểm tra đường dẫn file JSON/CSV
   - Mở Developer Tools để xem lỗi console
   - Chạy `test-data.html` để debug

2. **Ảnh không hiển thị**:
   - Kiểm tra file `imageMapping.js`
   - Đảm bảo thư mục `img/` có ảnh tương ứng

3. **Video không phát**:
   - Kiểm tra link video trong CSV
   - Một số link có thể đã hết hạn

## 📈 Cải Tiến Tương Lai

- [ ] Thêm tính năng đánh giá phim
- [ ] Lưu lịch sử xem
- [ ] Danh sách yêu thích
- [ ] Chia sẻ phim
- [ ] Tối ưu SEO
- [ ] PWA support
- [ ] Offline mode

## 📞 Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console trong Developer Tools
2. Chạy `test-data.html` để debug dữ liệu
3. Tạo issue trên repository

---

**NhanPhim** - Nền tảng xem phim trực tuyến hàng đầu Việt Nam! 🎬✨
