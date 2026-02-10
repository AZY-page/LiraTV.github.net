# 使用Python内置服务器，添加代理功能
import http.server
import socketserver
import os
import urllib.request
import urllib.error
import urllib.parse
import json

# 设置服务器端口
PORT = 8085

# 设置服务器目录
SERVER_DIR = r"D:\demo"

# 切换到服务器目录
os.chdir(SERVER_DIR)

# 自定义请求处理器，添加代理功能
class ProxyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    # 处理GET请求
    def do_GET(self):
        # 检查是否是代理请求
        if self.path.startswith('/proxy/'):
            self.handle_proxy_request()
        else:
            # 处理普通文件请求
            super().do_GET()
    
    # 处理代理请求
    def handle_proxy_request(self):
        try:
            # 解析目标URL
            proxy_path = self.path[7:]  # 移除 '/proxy/' 前缀
            target_url = urllib.parse.unquote(proxy_path)
            
            # 打印代理请求信息
            print(f"Proxying request to: {target_url}")
            
            # 检查是否为完整URL
            if not (target_url.startswith('http://') or target_url.startswith('https://')):
                # 不是完整URL，返回400错误
                self.send_response(400)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(f"Bad Request: Invalid URL format - {target_url}".encode())
                return
            
            # 添加适当的请求头
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': '*/*'
            }
            
            # 创建请求对象
            req = urllib.request.Request(target_url, headers=headers)
            
            # 发送请求
            with urllib.request.urlopen(req, timeout=10) as response:
                # 获取响应状态码和头
                status_code = response.getcode()
                response_headers = response.getheaders()
                
                # 设置响应头，允许跨域
                self.send_response(status_code)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept')
                
                # 传递原始响应头
                for header_name, header_value in response_headers:
                    if header_name.lower() not in ['content-length', 'transfer-encoding', 'connection']:
                        self.send_header(header_name, header_value)
                self.end_headers()
                
                # 发送响应内容
                self.wfile.write(response.read())
                
        except urllib.error.HTTPError as e:
            # 处理HTTP错误
            self.send_response(e.code)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(f"HTTP Error: {e.code} {e.reason}".encode())
            print(f"HTTP Error: {e.code} {e.reason}")
        except urllib.error.URLError as e:
            # 处理URL错误
            self.send_response(502)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(f"Proxy Error: {e.reason}".encode())
            print(f"Proxy Error: {e.reason}")
        except Exception as e:
            # 处理其他错误
            self.send_response(500)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(f"Internal Server Error: {str(e)}".encode())
            print(f"Internal Server Error: {str(e)}")
    
    # 处理OPTIONS请求（CORS预检）
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept')
        self.end_headers()

# 创建服务器
Handler = ProxyHTTPRequestHandler
httpd = socketserver.TCPServer(("", PORT), Handler)

print(f"Serving HTTP on port {PORT} from directory {SERVER_DIR}")
print(f"访问地址: http://localhost:{PORT}")

# 启动服务器
httpd.serve_forever()