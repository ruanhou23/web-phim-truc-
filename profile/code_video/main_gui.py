import tkinter as tk
from tkinter import filedialog, messagebox, ttk
from threading import Thread
import os
from PIL import Image
import numpy as np
import math

# Import conversion functions
from mp4_sang_ts import split_mp4_to_ts, ProgressWindow, run_conversion
from ts_sang_png import ts_to_png
from png_sang_ts import png_to_ts
from ts_sang_mp4 import concat_ts_to_mp4

class VideoConverterApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Video Converter Pro")
        self.root.geometry("500x450")
        self.root.resizable(False, False)
        
        # Dark mode colors
        self.bg_color = "#2d2d2d"
        self.fg_color = "#ffffff"
        self.button_color = "#3c3f41"
        self.hover_color = "#4e5254"
        
        # Style configuration
        self.style = ttk.Style()
        self.style.configure('TButton', font=('Arial', 10), padding=6)
        self.style.configure('TLabel', font=('Arial', 12))
        self.style.configure('Title.TLabel', font=('Arial', 16, 'bold'))
        
        self.apply_dark_theme()
        self.setup_ui()
    
    def apply_dark_theme(self):
        self.root.configure(bg=self.bg_color)
        self.style.configure('.', background=self.bg_color, foreground=self.fg_color)
        self.style.configure('TButton', background=self.button_color, foreground=self.fg_color)
        self.style.map('TButton',
                      background=[('active', self.hover_color)],
                      foreground=[('active', self.fg_color)])
    
    def setup_ui(self):
        # Header
        header_frame = tk.Frame(self.root, bg=self.bg_color)
        header_frame.pack(fill=tk.X, padx=10, pady=10)
        
        title_label = ttk.Label(
            header_frame,
            text="VIDEO CONVERTER PRO",
            style='Title.TLabel',
            background=self.bg_color,
            foreground="#4fc3f7"
        )
        title_label.pack(pady=(0, 10))
        
        # Main content
        content_frame = tk.Frame(self.root, bg=self.bg_color)
        content_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)
        
        # Buttons
        buttons = [
            ("MP4 → TS Segments", self.mp4_to_ts_gui, "#2196F3"),
            ("TS Segments → PNG", self.ts_to_png_gui, "#4CAF50"),
            ("PNG → TS Segments", self.png_to_ts_gui, "#FF9800"),
            ("TS Segments → MP4", self.ts_to_mp4_gui, "#F44336"),
            ("Exit", self.exit_app, "#9E9E9E")
        ]
        
        for text, command, color in buttons:
            btn = tk.Button(
                content_frame,
                text=text,
                command=command,
                bg=color,
                fg="white",
                activebackground=color,
                activeforeground="white",
                font=('Arial', 11, 'bold'),
                width=25,
                height=2,
                bd=0,
                relief=tk.FLAT,
                cursor="hand2"
            )
            btn.pack(pady=8, ipadx=5, ipady=3)
            btn.bind("<Enter>", lambda e, b=btn: b.config(bg=self.hover_color))
            btn.bind("<Leave>", lambda e, b=btn, c=color: b.config(bg=c))
    
    def mp4_to_ts_gui(self):
        input_video = filedialog.askopenfilename(
            title="Chọn file MP4",
            filetypes=[("MP4 files", "*.mp4"), ("All files", "*.*")]
        )
        if not input_video:
            return
        
        output_dir = filedialog.askdirectory(title="Chọn thư mục lưu các file TS")
        if not output_dir:
            return
        
        # Create progress window
        progress_root = tk.Toplevel(self.root)
        progress_window = ProgressWindow(progress_root)
        
        # Run conversion in a separate thread
        Thread(
            target=run_conversion,
            args=(input_video, progress_window, 5, output_dir),
            daemon=True
        ).start()
    
    def ts_to_png_gui(self):
        input_dir = filedialog.askdirectory(title="Chọn thư mục chứa các file TS")
        if not input_dir:
            return
        
        output_dir = filedialog.askdirectory(title="Chọn thư mục lưu các file PNG")
        if not output_dir:
            return
        
        # Show progress
        progress_window = self.create_simple_progress("Đang chuyển TS sang PNG...")
        self.root.update()
        
        def conversion_thread():
            success = ts_to_png(input_dir, output_dir)
            progress_window.destroy()
            if success:
                messagebox.showinfo("Thành công", "Chuyển đổi TS sang PNG thành công!")
            else:
                messagebox.showerror("Thất bại", "Chuyển đổi TS sang PNG thất bại")
        
        Thread(target=conversion_thread, daemon=True).start()
    
    def png_to_ts_gui(self):
        input_dir = filedialog.askdirectory(title="Chọn thư mục chứa các file PNG")
        if not input_dir:
            return
        
        output_dir = filedialog.askdirectory(title="Chọn thư mục lưu các file TS")
        if not output_dir:
            return
        
        # Show progress
        progress_window = self.create_simple_progress("Đang chuyển PNG sang TS...")
        self.root.update()
        
        def conversion_thread():
            success = png_to_ts(input_dir, output_dir)
            progress_window.destroy()
            if success:
                messagebox.showinfo("Thành công", "Chuyển đổi PNG sang TS thành công!")
            else:
                messagebox.showerror("Thất bại", "Chuyển đổi PNG sang TS thất bại")
        
        Thread(target=conversion_thread, daemon=True).start()
    
    def ts_to_mp4_gui(self):
        input_dir = filedialog.askdirectory(title="Chọn thư mục chứa các file TS")
        if not input_dir:
            return
        
        output_file = filedialog.asksaveasfilename(
            title="Chọn nơi lưu file MP4",
            defaultextension=".mp4",
            filetypes=[("MP4 files", "*.mp4"), ("All files", "*.*")]
        )
        if not output_file:
            return
        
        # Show progress
        progress_root = tk.Toplevel(self.root)
        progress_root.title("Đang gộp TS thành MP4...")
        progress_root.geometry("400x150")
        progress_var = tk.DoubleVar()
        status_var = tk.StringVar(value="Đang chuẩn bị...")
        ttk.Label(progress_root, textvariable=status_var).pack(pady=10)
        ttk.Progressbar(progress_root, variable=progress_var, maximum=100).pack(pady=10, fill=tk.X, padx=20)
        
        def conversion_thread():
            def update_progress(percent, message):
                progress_var.set(percent)
                status_var.set(message)
                progress_root.update()
            success = concat_ts_to_mp4(input_dir, output_file, update_progress)
            progress_root.destroy()
            if success:
                messagebox.showinfo("Thành công", "Gộp file TS thành MP4 thành công!")
            else:
                messagebox.showerror("Thất bại", "Gộp file TS thất bại")
        Thread(target=conversion_thread, daemon=True).start()
    
    def create_simple_progress(self, message):
        progress_window = tk.Toplevel(self.root)
        progress_window.title("Đang xử lý...")
        progress_window.geometry("300x100")
        progress_window.resizable(False, False)
        progress_window.configure(bg=self.bg_color)
        
        label = tk.Label(
            progress_window,
            text=message,
            bg=self.bg_color,
            fg=self.fg_color,
            font=('Arial', 11)
        )
        label.pack(pady=20)
        
        progress_bar = ttk.Progressbar(
            progress_window,
            orient="horizontal",
            length=250,
            mode="indeterminate"
        )
        progress_bar.pack()
        progress_bar.start()
        
        return progress_window
    
    def exit_app(self):
        if messagebox.askyesno("Thoát", "Bạn có chắc chắn muốn thoát chương trình?"):
            self.root.destroy()

def main():
    root = tk.Tk()
    app = VideoConverterApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()