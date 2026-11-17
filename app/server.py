import os
from http.server import BaseHTTPRequestHandler, HTTPServer

WEBTEXT = os.getenv("WEBTEXT") or "Hello World!"


class Handler(BaseHTTPRequestHandler):

    def do_GET(self):
        response = WEBTEXT.encode("utf-8")

        self.send_response(200)
        self.send_header(
            "Content-Type",
            "text/plain; charset=utf-8"
        )
        self.send_header(
            "Content-Length",
            str(len(response))
        )
        self.end_headers()

        self.wfile.write(response)


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", 80), Handler)

    print("webtext-app started on port 80")

    server.serve_forever()