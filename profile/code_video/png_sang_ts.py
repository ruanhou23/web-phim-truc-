import os
from PIL import Image
import numpy as np

def png_to_ts(input_dir, output_dir):
    """Chuyển các file PNG ngược lại thành file TS"""
    # Tạo thư mục đầu ra nếu chưa tồn tại
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        # Lặp qua tất cả file PNG trong input_dir
        for filename in os.listdir(input_dir):
            if filename.endswith('.png'):
                png_path = os.path.join(input_dir, filename)
                ts_path = os.path.join(output_dir, filename.replace('.png', ''))

                # Mở ảnh PNG
                img = Image.open(png_path).convert('L')  # Đảm bảo grayscale
                img_array = np.array(img, dtype=np.uint8)

                # Chuyển mảng 2D về 1D
                data_array = img_array.flatten()

                # Ghi dữ liệu về file TS
                with open(ts_path, 'wb') as f:
                    f.write(data_array.tobytes())
                print(f"Đã chuyển {filename} thành {os.path.basename(ts_path)}")

        return True

    except Exception as e:
        print(f"Lỗi khi chuyển PNG sang TS: {str(e)}")
        return False

if __name__ == "__main__":
    input_png_dir = r"C:\Users\hau\Desktop\profile\code_video\anh_png"
    output_ts_dir = r"C:\Users\hau\Desktop\profile\code_video\restored_ts"

    # Chuyển PNG sang TS
    if png_to_ts(input_png_dir, output_ts_dir):
        print("Chuyển đổi PNG sang TS thành công!")
    else:
        print("Chuyển đổi PNG sang TS thất bại")