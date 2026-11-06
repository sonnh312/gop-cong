# Góp Công Online

Trang web thật để mọi người cùng góp giờ công giúp người khác. Dữ liệu dùng chung cho tất cả người truy cập, không cần đăng nhập.

## Chạy thử trên máy
Cần Node.js 18 trở lên (không cần cài thêm thư viện).

    ADMIN_KEY=matkhau123 node server.js

Mở http://localhost:3000

## Đưa lên mạng
Dùng bất kỳ dịch vụ hosting Node nào (Render, Railway, Fly.io, VPS...):
- Lệnh chạy: `node server.js`
- Biến môi trường: `ADMIN_KEY` (mã để xóa bản ghi), `PORT` (thường host tự cấp)
- `DATA_DIR`: thư mục lưu `data.json`. Hãy trỏ vào ổ đĩa bền vững (persistent disk),
  nếu không dữ liệu có thể mất khi host khởi động lại.

## Ghi chú
- Số điện thoại được lưu trong data.json nhưng không hiển thị công khai.
- Muốn xóa bản ghi: bấm "Xóa" và nhập ADMIN_KEY.
