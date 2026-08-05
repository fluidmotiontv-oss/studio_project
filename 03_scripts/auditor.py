import os
import http.server
import socketserver
import webbrowser
from pathlib import Path

# Set root directory to top-level studio_project folder
SCRIPT_DIR = Path(__file__).resolve().parent    # 03_scripts/
BASE_DIR = SCRIPT_DIR.parent                    # studio_project/

PORT = int(os.environ.get("PORT", 8000))

# Ensure server always serves from the main project root
class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

# Allow immediate port reuse on restart
socketserver.TCPServer.allow_reuse_address = True

with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print(f"=== Dragon 9 Server active on http://localhost:{PORT} ===")
    print(f"=== Serving files from: {BASE_DIR} ===")
    webbrowser.open(f"http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
