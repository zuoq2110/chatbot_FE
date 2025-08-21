# KMA ChatBot Admin Dashboard

Admin dashboard cho hệ thống KMA ChatBot Frontend, cung cấp các tính năng quản trị và giám sát.

## Tính năng chính

1. **Bảng điều khiển tổng quan (Dashboard)**
   - Hiển thị số liệu thống kê sử dụng hệ thống
   - Biểu đồ theo dõi hoạt động theo thời gian

2. **Quản lý người dùng (User Management)**
   - Xem danh sách người dùng
   - Thêm, sửa, xóa tài khoản người dùng
   - Phân quyền người dùng

3. **Giới hạn tốc độ (Rate Limiting)**
   - Cấu hình giới hạn request/ngày cho từng nhóm người dùng
   - Đặt limit token sử dụng cho mỗi người dùng
   - Quản lý ngoại lệ cho người dùng cụ thể

4. **Theo dõi thống kê sử dụng (Usage Statistics)**
   - Theo dõi số request/ngày
   - Thống kê token đã sử dụng
   - Thời gian phản hồi trung bình
   - Truy vấn lỗi và nguyên nhân

5. **Xem log hội thoại (Conversation Logs)**
   - Lọc và tìm kiếm hội thoại theo người dùng, thời gian
   - Xem chi tiết hội thoại và phản hồi từ hệ thống

6. **Quản lý mô hình LLM (LLM Model Management)**
   - Bật/tắt/chuyển đổi mô hình LLM
   - Tải mô hình LLM mới từ thư mục
   - Điều chỉnh tham số mô hình

## Cài đặt và Chạy trên Windows

### Yêu cầu hệ thống
- Node.js (phiên bản 14 hoặc cao hơn)
- npm (đi kèm với Node.js)

### Các bước cài đặt

1. **Clone repository**

2. **Cài đặt các thư viện phụ thuộc**
   Mở Command Prompt hoặc PowerShell, điều hướng đến thư mục dự án và chạy:
   ```
   cd path\to\chatbot_FE
   npm install
   ```

3. **Chạy ứng dụng ở chế độ phát triển**
   ```
   npm start
   ```
   Ứng dụng sẽ chạy tại địa chỉ [http://localhost:3000](http://localhost:3000)

4. **Truy cập trang Admin Dashboard**
   - Truy cập đường dẫn [http://localhost:3000/admin](http://localhost:3000/admin)
   - Đăng nhập với tài khoản quản trị (mặc định: admin / admin123)

### Cách sử dụng start.bat (Tùy chọn)

Dự án cung cấp file `start.bat` để khởi động nhanh ứng dụng trên Windows:

1. Mở File Explorer, điều hướng đến thư mục dự án
2. Double-click vào file `start.bat`
3. Trình duyệt sẽ tự động mở tại địa chỉ [http://localhost:3000](http://localhost:3000)

### Tạo bản build cho production

Để tạo phiên bản tối ưu cho môi trường sản xuất:

```
cd path\to\chatbot_FE
npm run build
```

Các file được tạo trong thư mục `build` có thể được triển khai lên máy chủ web.

## Tích hợp với Backend

Dashboard Admin kết nối với các API backend tại địa chỉ mặc định `http://localhost:8000`. Để thay đổi địa chỉ API, hãy tạo file `.env.local` trong thư mục gốc của dự án với nội dung:

```
REACT_APP_API_BASE_URL=http://your-api-address:port
```

## Thông tin đăng nhập mặc định

- Username: `admin`
- Password: `admin123`

*Lưu ý: Đây là thông tin đăng nhập mặc định cho môi trường phát triển. Cần thay đổi trong môi trường sản xuất.*

## Ghi chú dành cho nhà phát triển

- Dashboard Admin sử dụng React và Tailwind CSS
- Các component quản trị được đặt trong thư mục `src/components/admin`
- Các service API được đặt trong thư mục `src/services`
- Constants và endpoint API được định nghĩa trong `src/utils/constants.js`
