# Kết Quả Trích Xuất Dữ Liệu Phim

## Tổng Quan
Đã trích xuất thành công thông tin từ **194 phim** từ thư mục `phimle-master` và tạo các file CSV theo thể loại và diễn viên.

## Các File Được Tạo

### 1. File Tổng Hợp
- **`all_movies.csv`** - File CSV chứa tất cả 194 phim với đầy đủ thông tin
- **`movies_data.json`** - File JSON chứa dữ liệu gốc

### 2. File Theo Thể Loại
- **`chautinhtri_movies.csv`** - 51 phim của Châu Tinh Trì
- **`lylienkiet_movies.csv`** - 19 phim của Lý Liên Kiệt  
- **`thanhlong_movies.csv`** - 22 phim của Thành Long
- **`chungtudon_movies.csv`** - 14 phim của Chân Tử Đan
- **`lamchanhanh_movies.csv`** - 11 phim của Lâm Chánh Anh
- **`daohaitac_movies.csv`** - 9 phim One Piece Live Action
- **`capba_movies.csv`** - 29 phim 18+
- **`tonghop_movies.csv`** - 39 phim tổng hợp

### 3. File Theo Diễn Viên
- **`Chu_Tinh_Tr_movies.csv`** - 51 phim của Châu Tinh Trì
- **`L_Lin_Kit_movies.csv`** - 19 phim của Lý Liên Kiệt
- **`Thnh_Long_movies.csv`** - 22 phim của Thành Long
- **`Chn_T_an_movies.csv`** - 14 phim của Chân Tử Đan
- **`Lm_Chnh_Anh_movies.csv`** - 11 phim của Lâm Chánh Anh
- **`One_Piece_Live_Action_movies.csv`** - 9 phim One Piece Live Action
- **`Phim_18_movies.csv`** - 29 phim 18+
- **`Tng_Hp_movies.csv`** - 39 phim tổng hợp

## Cấu Trúc Dữ Liệu

Mỗi file CSV chứa các cột sau:
- **id**: Mã định danh phim (tên file HTML)
- **title**: Tên phim (tiếng Việt)
- **originalTitle**: Tên gốc của phim
- **category**: Thể loại phim
- **actor**: Tên diễn viên chính
- **videoLink**: Link xem phim
- **filePath**: Đường dẫn file HTML gốc

## Thống Kê

| Diễn Viên/Thể Loại | Số Lượng Phim |
|-------------------|---------------|
| Châu Tinh Trì | 51 |
| Lý Liên Kiệt | 19 |
| Thành Long | 22 |
| Chân Tử Đan | 14 |
| Lâm Chánh Anh | 11 |
| One Piece Live Action | 9 |
| Phim 18+ | 29 |
| Tổng Hợp | 39 |
| **TỔNG CỘNG** | **194** |

## Ghi Chú
- Dữ liệu được trích xuất từ các file HTML trong thư mục `phimle-master`
- Các link video được lấy từ iframe src trong file HTML
- Tên phim được lấy từ thẻ h2 hoặc h5 trong HTML
- File được tạo vào: `C:\Users\PC\Desktop\THU_MUC_CHIA_SE_DU_DU_AN\du_an_phim\web-phim-truc-\link`
