import ffmpeg
import os
import math
import json
import time
from datetime import datetime
from threading import Thread
import tkinter as tk
from tkinter import ttk, messagebox, filedialog

def split_mp4_to_ts(input_file, segment_duration=5, output_dir=None, update_progress=None):
    """
    Convert MP4 to TS segments with optimized settings
    Returns: (success, segment_count)
    """
    # Create output directory if needed
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        # Get video info
        probe = ffmpeg.probe(input_file)
        video_stream = next((s for s in probe['streams'] if s['codec_type'] == 'video'), None)
        audio_stream = next((s for s in probe['streams'] if s['codec_type'] == 'audio'), None)
        
        if not video_stream:
            if update_progress:
                update_progress(0, "No video stream found", True)
            return (False, 0)
        
        # Calculate total segments
        duration = float(probe['format']['duration'])
        segment_count = math.ceil(duration / segment_duration)
        segment_durations = [segment_duration] * segment_count
        segment_durations[-1] = duration % segment_duration or segment_duration
        
        # Calculate keyframe interval based on frame rate
        frame_rate_str = video_stream.get('avg_frame_rate', '30/1')  # Fallback to 30fps if not found
        try:
            frame_rate = eval(frame_rate_str)  # Convert fraction (e.g., '30/1') to float
        except (NameError, SyntaxError):
            frame_rate = 30.0  # Fallback to 30fps if eval fails
        keyint = int(segment_duration * frame_rate)  # Keyframe interval (e.g., 150 for 5s at 30fps)
        min_keyint = keyint // 2  # Allow more frequent keyframes if needed
        
        # FFmpeg command with optimized settings
        output_args = {
            'c:v': 'libx264',
            'preset': 'fast',
            'crf': '23',
            'x264opts': f'keyint={keyint}:min-keyint={min_keyint}',  # Use x264opts instead of x264-params
            'f': 'mpegts',
            'reset_timestamps': '1',
            'avoid_negative_ts': 'make_zero',
            'muxdelay': '0',
            'muxpreload': '0',
            'flags': '+global_header',
            'movflags': '+faststart',
        }
        
        if audio_stream:
            output_args['c:a'] = 'aac'
            output_args['b:a'] = '128k'
        
        # Xử lý từng segment và cập nhật tiến trình
        for i in range(segment_count):
            start_time = i * segment_duration
            seg_dur = segment_durations[i]
            output_file = os.path.join(output_dir, f'segment_{i+1:03d}.ts')
            if update_progress:
                percent = int((i / segment_count) * 100)
                update_progress(percent, f"Đang xử lý segment {i+1}/{segment_count}...", False)
            (
                ffmpeg.input(input_file, ss=start_time, t=seg_dur)
                .output(output_file, **output_args)
                .global_args('-hide_banner')
                .global_args('-loglevel', 'error')
                .run(overwrite_output=True)
            )
        
        # Save segment durations
        with open(os.path.join(output_dir, 'segment_durations.json'), 'w') as f:
            json.dump(segment_durations, f)
        
        if update_progress:
            update_progress(100, f"Đã tạo {segment_count} TS segment", True)
        
        return (True, segment_count)
    
    except ffmpeg.Error as e:
        error_msg = f"FFmpeg error: {e.stderr.decode().strip() if e.stderr else str(e)}"
        if update_progress:
            update_progress(0, error_msg, True)
        return (False, 0)
    except Exception as e:
        error_msg = f"Unexpected error: {str(e)}"
        if update_progress:
            update_progress(0, error_msg, True)
        return (False, 0)

class ProgressWindow:
    """GUI progress window for conversion"""
    def __init__(self, root):
        self.root = root
        self.root.title("MP4 to TS Converter")
        self.root.geometry("400x150")
        self.root.resizable(False, False)
        
        self.progress_var = tk.DoubleVar()
        self.status_var = tk.StringVar(value="Preparing conversion...")
        
        ttk.Label(self.root, textvariable=self.status_var).pack(pady=10)
        ttk.Progressbar(self.root, variable=self.progress_var, maximum=100).pack(pady=10, fill=tk.X, padx=20)
        ttk.Button(self.root, text="Cancel", command=self.cancel).pack(pady=5)
        
        self.cancelled = False
    
    def cancel(self):
        self.cancelled = True
        self.status_var.set("Cancelling...")
    
    def update(self, value, message, done):
        self.progress_var.set(value)
        self.status_var.set(message)
        if done:
            self.root.destroy()

def run_conversion(input_file, progress_window, segment_duration=5, output_dir=None):
    """Run conversion in a thread"""
    def update_progress(value, message, done):
        if not progress_window.cancelled:
            progress_window.root.after(0, progress_window.update, value, message, done)
    
    success, segment_count = split_mp4_to_ts(
        input_file, 
        segment_duration, 
        output_dir, 
        update_progress
    )
    
    if not progress_window.cancelled:
        progress_window.root.after(0, lambda: show_result(success, segment_count, progress_window))

def show_result(success, segment_count, progress_window):
    progress_window.root.destroy()
    if success:
        messagebox.showinfo(
            "Success", 
            f"Converted to {segment_count} TS segments successfully!"
        )
    else:
        messagebox.showerror(
            "Error", 
            "Conversion failed. Check console for details."
        )

if __name__ == "__main__":
    root = tk.Tk()
    root.withdraw()
    
    input_file = filedialog.askopenfilename(
        title="Select MP4 file",
        filetypes=[("MP4 files", "*.mp4"), ("All files", "*.*")]
    )
    
    if not input_file:
        root.destroy()
        exit()
    
    output_dir = filedialog.askdirectory(title="Select output directory for TS segments")
    if not output_dir:
        root.destroy()
        exit()
    
    # Create progress window
    progress_root = tk.Toplevel(root)
    progress_window = ProgressWindow(progress_root)
    
    # Run conversion in thread
    Thread(
        target=run_conversion,
        args=(input_file, progress_window, 5, output_dir),
        daemon=True
    ).start()
    
    root.mainloop()