import os
import ffmpeg
import re

def natural_sort_key(s):
    return [int(text) if text.isdigit() else text.lower() for text in re.split('([0-9]+)', s)]

def concat_ts_to_mp4(input_dir, output_file, update_progress=None):
    """Gộp các file TS trong thư mục thành một file MP4, có cập nhật tiến trình"""
    # Tạo thư mục đầu ra nếu chưa tồn tại
    output_dir = os.path.dirname(output_file)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        # Lấy danh sách file TS và sắp xếp theo tên
        ts_files = [f for f in os.listdir(input_dir) if f.endswith('.ts')]
        ts_files = [f for f in ts_files if not f.startswith('concat_list')]
        ts_files.sort(key=natural_sort_key)
        total = len(ts_files)

        if not ts_files:
            print("Không tìm thấy file TS nào trong thư mục")
            if update_progress:
                update_progress(0, "Không tìm thấy file TS nào trong thư mục")
            return False

        # Tạo file tạm thời chứa danh sách file TS
        concat_file = os.path.join(input_dir, "concat_list.txt")
        if os.path.exists(concat_file):
            os.remove(concat_file)
        with open(concat_file, 'w') as f:
            for idx, ts_file in enumerate(ts_files):
                f.write(f"file '{os.path.join(input_dir, ts_file)}'\n")
                if update_progress:
                    percent = int((idx+1)/total*50)
                    update_progress(percent, f"Đang tạo danh sách ({idx+1}/{total})...")

        if update_progress:
            update_progress(60, "Đang gộp các file TS thành MP4...")
        # Gộp các file TS thành MP4
        (
            ffmpeg.input(concat_file, format='concat', safe=0)
            .output(
                output_file,
                vcodec='libx264',
                acodec='aac',  # Mã hóa lại audio để đảm bảo tương thích MP4
                pix_fmt='yuv420p',
                preset='slow',
                crf=0,  # Chất lượng lossless
                f='mp4',
                **{'bsf:v': 'h264_mp4toannexb'}
            )
            .global_args('-hide_banner')
            .global_args('-loglevel', 'error')
            .run(overwrite_output=True)
        )

        # Xóa file tạm thời
        os.remove(concat_file)
        if update_progress:
            update_progress(100, f"Đã gộp {total} file TS thành MP4")
        print(f"Đã gộp các file TS thành {output_file}")

        return True

    except ffmpeg.Error as e:
        print(f"Lỗi FFmpeg: {e.stderr.decode() if e.stderr else str(e)}")
        if update_progress:
            update_progress(0, "Lỗi FFmpeg khi gộp TS")
        return False
    except Exception as e:
        print(f"Lỗi không xác định: {str(e)}")
        if update_progress:
            update_progress(0, f"Lỗi: {str(e)}")
        return False

if __name__ == "__main__":
    input_dir = r"C:\Users\hau\Desktop\profile\code_video\restored_ts"
    output_file = r"C:\Users\hau\Desktop\profile\code_video\output_restored.mp4"

    # Gộp TS thành MP4
    if concat_ts_to_mp4(input_dir, output_file):
        print("Gộp file TS thành MP4 thành công!")
    else:
        print("Gộp file TS thất bại")