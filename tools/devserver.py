# Geliştirme sunucusu: python -m http.server gibi, ama tarayıcı önbelleğini kapatır (değişen JS hemen yüklensin).
# Kullanım: python tools/devserver.py  ->  http://localhost:8123  (bilgisayarın yerel ağ adresiyle telefondan da açılır)
import functools, http.server, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))   # depo kökü

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

http.server.ThreadingHTTPServer(('', 8123), functools.partial(NoCache, directory=ROOT)).serve_forever()
