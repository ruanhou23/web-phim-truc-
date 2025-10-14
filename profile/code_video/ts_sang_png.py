import os
from PIL import Image
import numpy as np
import math

def ts_to_png(input_dir, output_dir):
    """Chuyển các file TS thành file PNG"""
    # Tạo thư mục đầu ra nếu chưa tồn tại
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        # Lặp qua tất cả file TS trong input_dir
        for filename in os.listdir(input_dir):
            if filename.endswith('.ts'):
                ts_path = os.path.join(input_dir, filename)
                png_path = os.path.join(output_dir, f"{filename}.png")

                # Đọc dữ liệu TS
                with open(ts_path, 'rb') as f:
                    ts_data = f.read()

                # Chuyển dữ liệu TS thành mảng bytes
                data_array = np.frombuffer(ts_data, dtype=np.uint8)

                # Tính kích thước hình ảnh (giả sử hình vuông để đơn giản)
                size = int(math.ceil(math.sqrt(len(data_array))))
                if size * size > len(data_array):
                    # Đệm dữ liệu nếu cần
                    padded_data = np.pad(data_array, (0, size * size - len(data_array)), 'constant')
                else:
                    padded_data = data_array

                # Reshape thành mảng 2D
                img_array = padded_data.reshape((size, size))

                # Tạo ảnh từ mảng
                img = Image.fromarray(img_array, mode='L')  # 'L' là grayscale
                img.save(png_path, 'PNG')
                print(f"Đã chuyển {filename} thành {os.path.basename(png_path)}")

        return True

    except Exception as e:
        print(f"Lỗi khi chuyển TS sang PNG: {str(e)}")
        return False

if __name__ == "__main__":
    input_dir = r"C:\Users\hau\Desktop\profile\code_video\segments"
    output_png_dir = r"C:\Users\hau\Desktop\profile\code_video\anh_png"

    # Chuyển TS sang PNG
    if ts_to_png(input_dir, output_png_dir):
        print("Chuyển đổi TS sang PNG thành công!")
    else:
        print("Chuyển đổi TS sang PNG thất bại")