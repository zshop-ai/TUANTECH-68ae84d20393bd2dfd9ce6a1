# Theme Configuration Guide

## 🎨 Cách sử dụng Theme System

Theme system cho phép bạn customize giao diện ứng dụng thông qua file `.env` mà không cần chỉnh sửa code.

### 📝 Các biến theme có sẵn

Thêm các biến sau vào file `.env`:

```env
# Theme Configuration
VITE_PROJECT_NAME=My Shop Name
VITE_PRIMARY_COLOR=#ff6b6b
VITE_BACKGROUND_COLOR=#f8f9fa
VITE_TEXT_COLOR=#333333
VITE_FONT_FAMILY=Inter, system-ui, sans-serif
VITE_LOGO_URL=/path/to/logo.png
VITE_BANNER_URL=https://example.com/banner.jpg
```

### 🔧 Cách thay đổi theme

1. **Mở file `.env`** trong thư mục root của project
2. **Chỉnh sửa các giá trị** theme theo ý muốn
3. **Restart ứng dụng** để áp dụng theme mới

### 📋 Danh sách biến theme

| Biến | Mô tả | Ví dụ |
|------|-------|-------|
| `VITE_PROJECT_NAME` | Tên dự án/shop | `My Shop Name` |
| `VITE_PRIMARY_COLOR` | Màu chủ đạo | `#ff6b6b` |
| `VITE_BACKGROUND_COLOR` | Màu nền | `#f8f9fa` |
| `VITE_TEXT_COLOR` | Màu chữ | `#333333` |
| `VITE_FONT_FAMILY` | Font chữ | `Inter, system-ui, sans-serif` |
| `VITE_LOGO_URL` | Đường dẫn logo | `/path/to/logo.png` |
| `VITE_BANNER_URL` | Đường dẫn banner | `https://example.com/banner.jpg` |

### 🎯 Demo Theme

Truy cập `/theme-demo` để xem và test theme configuration hiện tại.

### 🐛 Debug

Nếu theme không hoạt động, kiểm tra console để xem logs debug:
- `=== ENV THEME LOADER DEBUG ===` - Kiểm tra env variables
- `=== THEME CONTEXT UPDATE CSS ===` - Kiểm tra CSS variables
- `=== UPDATE CSS VARIABLES FROM ENV ===` - Kiểm tra CSS update

### ⚠️ Lưu ý

- Tất cả biến theme phải bắt đầu với `VITE_`
- Màu sắc sử dụng format hex (ví dụ: `#ff6b6b`)
- Font family có thể sử dụng nhiều font fallback
- URL có thể là đường dẫn tương đối hoặc tuyệt đối
- Restart app sau khi thay đổi `.env` để áp dụng theme mới
