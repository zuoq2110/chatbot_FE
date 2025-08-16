# KMA Chatbot Frontend

Giao diện người dùng cho hệ thống chatbot KMA được xây dựng bằng React.js.

## Tính năng

- 🤖 Giao diện chat thời gian thực
- 🎤 Nhập liệu bằng giọng nói
- 📱 Thiết kế responsive
- 🎨 UI/UX hiện đại với Tailwind CSS
- 📝 Hỗ trợ Markdown trong tin nhắn
- 💾 Lưu trữ lịch sử chat
- ⚡ Hiệu ứng animation mượt mà

## Cài đặt

### Yêu cầu hệ thống
- Node.js 16+ 
- npm hoặc yarn

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Cấu hình environment
```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với các thông số phù hợp:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
REACT_APP_ENABLE_VOICE_INPUT=true
REACT_APP_ENABLE_FILE_UPLOAD=true
REACT_APP_DEBUG=true
```

### Bước 3: Chạy ứng dụng
```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## Cấu trúc dự án

```
src/
├── components/           # Các React components
│   ├── ChatHeader.js    # Header của chat
│   ├── ChatMessages.js  # Danh sách tin nhắn  
│   ├── ChatInput.js     # Input gửi tin nhắn
│   ├── MessageBubble.js # Bubble tin nhắn
│   ├── TypingIndicator.js # Hiệu ứng đang gõ
│   └── WelcomeScreen.js # Màn hình chào mừng
├── services/            # API services
│   └── chatService.js   # Service gọi API chat
├── App.js              # Component chính
├── index.js            # Entry point
└── index.css           # Global styles
```

## Scripts

- `npm start` - Chạy ứng dụng ở chế độ development
- `npm run build` - Build ứng dụng cho production
- `npm test` - Chạy tests
- `npm run eject` - Eject từ Create React App

## API Integration

Ứng dụng kết nối với backend API qua các endpoint:

- `POST /chat` - Gửi tin nhắn chat
- `GET /chat/history/{session_id}` - Lấy lịch sử chat
- `DELETE /chat/history/{session_id}` - Xóa lịch sử chat
- `GET /health` - Kiểm tra trạng thái API
- `POST /feedback` - Gửi feedback

## Tính năng chính

### 1. Giao diện Chat
- Tin nhắn real-time với animation
- Hỗ trợ Markdown formatting
- Hiển thị thời gian và metadata
- Indicator khi bot đang gõ

### 2. Nhập liệu thông minh
- Gõ tin nhắn với hỗ trợ multi-line
- Nhập bằng giọng nói (Speech Recognition)
- Gợi ý câu hỏi nhanh
- Upload file (đang phát triển)

### 3. Quản lý phiên chat
- Session ID tự động
- Lưu lịch sử chat
- Xóa cuộc trò chuyện
- Bắt đầu chat mới

### 4. Responsive Design
- Tối ưu cho desktop và mobile
- Dark/Light mode (đang phát triển)
- Accessibility support

## Tùy chỉnh

### Thay đổi theme
Chỉnh sửa `tailwind.config.js` để thay đổi màu sắc và styling:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Tùy chỉnh màu chính
      }
    }
  }
}
```

### Thêm tính năng mới
1. Tạo component mới trong `src/components/`
2. Thêm service API trong `src/services/`
3. Import và sử dụng trong `App.js`

## Troubleshooting

### Lỗi kết nối API
- Kiểm tra backend server đã chạy chưa
- Xác nhận `REACT_APP_API_URL` đúng
- Kiểm tra CORS settings

### Lỗi Voice Input
- Đảm bảo trình duyệt hỗ trợ Web Speech API
- Cấp quyền microphone cho website
- Chỉ hoạt động trên HTTPS (production)

## Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Support

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trên GitHub repository.
