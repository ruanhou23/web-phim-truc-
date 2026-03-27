import os
from flask import Flask, send_from_directory, abort, Response, jsonify
from flask_cors import CORS
import json
import re
import time
from threading import Lock
import glob
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
TS_DIR = r"C:\Users\hau\Desktop\profile\code_video\png_ts"
M3U8_FILE = os.path.join(TS_DIR, "playlist.m3u8")
INDEX_FILE = os.path.join(os.path.dirname(__file__), "index.html")
PLAYLIST_REFRESH_INTERVAL = 2  # Refresh playlist every 2 seconds
SEGMENT_DURATION = 5  # Duration of each segment in seconds
MAX_SEGMENTS_IN_PLAYLIST = 100  # Maximum segments to keep in playlist

# Thread-safe management
playlist_lock = Lock()
last_playlist_update = 0

def natural_sort_key(s):
    """Natural sorting for filenames with numbers"""
    return [int(text) if text.isdigit() else text.lower() 
            for text in re.split('([0-9]+)', s)]

def get_latest_ts_files(max_files=None):
    """Get TS files sorted by modification time"""
    ts_files = glob.glob(os.path.join(TS_DIR, '*.ts'))
    ts_files.sort(key=lambda x: os.path.getmtime(x))
    if max_files:
        ts_files = ts_files[-max_files:]  # Get most recent files
    return ts_files

def should_refresh_playlist():
    """Check if playlist needs refreshing"""
    global last_playlist_update
    return time.time() - last_playlist_update > PLAYLIST_REFRESH_INTERVAL

def create_m3u8_playlist(force=False):
    """Create or update HLS playlist file"""
    global last_playlist_update
    
    if not force and not should_refresh_playlist():
        return True
        
    with playlist_lock:
        try:
            ts_files = get_latest_ts_files(MAX_SEGMENTS_IN_PLAYLIST)
            if not ts_files:
                print(f"[{datetime.now().strftime('%H:%M:%S')}] No TS files found in {TS_DIR}")
                return False
            
            ts_filenames = [os.path.basename(f) for f in ts_files]
            ts_filenames.sort(key=natural_sort_key)
            
            m3u8_content = [
                "#EXTM3U",
                "#EXT-X-VERSION:3",
                f"#EXT-X-TARGETDURATION:{SEGMENT_DURATION + 1}",
                f"#EXT-X-MEDIA-SEQUENCE:{max(0, len(ts_filenames) - MAX_SEGMENTS_IN_PLAYLIST)}",
            ]

            for ts_file in ts_filenames:
                m3u8_content.append(f"#EXTINF:{SEGMENT_DURATION:.3f},")
                m3u8_content.append(ts_file)

            m3u8_content.append("#EXT-X-ENDLIST")

            # Atomic file write
            temp_file = M3U8_FILE + '.tmp'
            with open(temp_file, 'w', encoding='utf-8') as f:
                f.write('\n'.join(m3u8_content))
            
            if os.path.exists(M3U8_FILE):
                os.remove(M3U8_FILE)
            os.rename(temp_file, M3U8_FILE)
            
            last_playlist_update = time.time()
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Playlist updated with {len(ts_filenames)} segments")
            return True

        except Exception as e:
            print(f"[{datetime.now().strftime('%H:%M:%S')}] Error creating playlist: {str(e)}")
            return False

@app.route('/')
def serve_player():
    """Serve the HTML player"""
    try:
        return send_from_directory(os.path.dirname(INDEX_FILE), 'index.html')
    except FileNotFoundError:
        abort(404, description="Player page not found")

@app.route('/playlist.m3u8')
def serve_m3u8():
    """Serve the HLS playlist"""
    try:
        if not os.path.exists(M3U8_FILE) or should_refresh_playlist():
            create_m3u8_playlist()
        
        response = send_from_directory(
            os.path.dirname(M3U8_FILE),
            os.path.basename(M3U8_FILE),
            mimetype='application/vnd.apple.mpegurl'
        )
        
        # Important HLS headers
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        response.headers['Access-Control-Allow-Origin'] = '*'
        
        return response
    except Exception as e:
        abort(500, description=f"Error serving playlist: {str(e)}")

@app.route('/segments/<path:filename>')
def serve_ts(filename):
    """Serve TS segments"""
    try:
        if not filename.endswith('.ts'):
            abort(400, description="Invalid file type")
            
        response = send_from_directory(
            TS_DIR,
            filename,
            mimetype='video/MP2T'
        )
        
        # Cache segments briefly
        response.headers['Cache-Control'] = 'public, max-age=60'
        response.headers['Access-Control-Allow-Origin'] = '*'
        
        return response
    except FileNotFoundError:
        abort(404, description="Segment not found")
    except Exception as e:
        abort(500, description=f"Error serving segment: {str(e)}")

@app.route('/status')
def server_status():
    """Server status endpoint"""
    ts_files = get_latest_ts_files()
    return jsonify({
        'status': 'running',
        'segments_available': len(ts_files),
        'last_playlist_update': last_playlist_update,
        'playlist_path': M3U8_FILE,
        'segment_duration': SEGMENT_DURATION,
        'server_time': datetime.now().isoformat()
    })

if __name__ == '__main__':
    # Ensure output directory exists
    os.makedirs(TS_DIR, exist_ok=True)
    
    # Initial playlist creation
    if create_m3u8_playlist(force=True):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Starting HLS server on http://localhost:5000")
        app.run(
            host='0.0.0.0',
            port=5000,
            threaded=True,
            debug=False
        )
    else:
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Failed to start server: Could not create initial playlist")