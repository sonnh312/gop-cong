// Máy chủ không cần cài thư viện nào. Chạy: node server.js
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || ""; // đặt để cho phép xóa bản ghi
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "data.json");
const PUBLIC = path.join(__dirname, "public");

fs.mkdirSync(DATA_DIR, { recursive: true });
let rows = [];
try { rows = JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); } catch (e) {}
const save = () => fs.writeFileSync(DATA_FILE, JSON.stringify(rows));

const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript" };
const clean = (s, n) => String(s || "").trim().slice(0, n);
const send = (res, code, obj) => {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
};

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");

  if (url.pathname === "/api/list" && req.method === "GET") {
    // không trả số điện thoại ra công khai
    return send(res, 200, rows.map(({ phone, ...r }) => r));
  }

  if (url.pathname === "/api/add" && req.method === "POST") {
    let body = "";
    req.on("data", c => { body += c; if (body.length > 5000) req.destroy(); });
    req.on("end", () => {
      try {
        const b = JSON.parse(body);
        const hours = Number(b.hours);
        const r = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          name: clean(b.name, 60), phone: clean(b.phone, 20),
          to: clean(b.to, 60), note: clean(b.note, 200),
          hours, at: new Date().toISOString()
        };
        if (!r.name || !r.to || !(hours > 0) || hours > 24)
          return send(res, 400, { error: "Dữ liệu không hợp lệ" });
        rows.push(r); save();
        send(res, 200, { ok: true });
      } catch (e) { send(res, 400, { error: "Yêu cầu lỗi" }); }
    });
    return;
  }

  if (url.pathname.startsWith("/api/delete/") && req.method === "DELETE") {
    if (!ADMIN_KEY || req.headers["x-admin-key"] !== ADMIN_KEY)
      return send(res, 403, { error: "Sai mã quản trị" });
    const id = url.pathname.split("/").pop();
    rows = rows.filter(r => r.id !== id); save();
    return send(res, 200, { ok: true });
  }

  // file tĩnh
  let p = url.pathname === "/" ? "/index.html" : url.pathname;
  const file = path.join(PUBLIC, path.normalize(p));
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404); return res.end("Không tìm thấy"); }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream" });
    res.end(buf);
  });
}).listen(PORT, () => console.log("Góp Công chạy tại http://localhost:" + PORT));
