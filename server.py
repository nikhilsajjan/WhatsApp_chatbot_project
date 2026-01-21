#!/usr/bin/env python3
import http.server
import socketserver
import socket

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Disable caching
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def get_local_ip():
    """Get the local network IP address"""
    try:
        # Create a socket to determine the local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        return "127.0.0.1"

if __name__ == "__main__":
    PORT = 8000
    local_ip = get_local_ip()

    with socketserver.TCPServer(("0.0.0.0", PORT), NoCacheHTTPRequestHandler) as httpd:
        print(f"\n{'='*60}")
        print(f"Server is running!")
        print(f"{'='*60}")
        print(f"\nLocal access:")
        print(f"  http://localhost:{PORT}")
        print(f"\nNetwork access (share this with others on your network):")
        print(f"  http://{local_ip}:{PORT}")
        print(f"\n{'='*60}")
        print(f"Press Ctrl+C to stop the server\n")

        httpd.serve_forever()
