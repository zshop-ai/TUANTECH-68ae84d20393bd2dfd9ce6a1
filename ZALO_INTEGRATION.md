# Hướng dẫn tích hợp Zalo thực tế với zmp-sdk

## 🎯 Tổng quan
Dự án đã được tích hợp với `zmp-sdk` để sử dụng `getAccessToken()` từ Zalo một cách tự động. Không cần cài đặt Zalo SDK riêng biệt.

## 🚀 Cài đặt nhanh

### 1. Cập nhật Configuration
Chỉnh sửa file `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://zshop-api.crbgroup.live',
  ENDPOINTS: {
    USER_LOGIN: '/auth/user-login',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  // ⚠️ CẬP NHẬT VỚI THÔNG TIN THỰC TẾ
  APP_ID: '4447770839699639655', // App ID thực từ Zalo Developer
  SHOP_ID: '68ad2de1e02ddc5108d2fd0b', // Shop ID thực từ backend
};
```

### 2. Cấu hình Zalo App
1. Vào [Zalo Developer](https://developers.zalo.me/)
2. Tạo app mới hoặc sử dụng app có sẵn
3. Lấy **App ID** và cập nhật vào `API_CONFIG.APP_ID`
4. Cấu hình **Redirect URI** trong Zalo app

## 🔧 Cách hoạt động

### Flow đăng nhập:
1. User click "Đăng nhập với Zalo"
2. `getAccessToken()` từ `zmp-sdk` tự động lấy token từ Zalo
3. Token được gửi lên backend API: `POST /auth/user-login`
4. Backend xác thực và trả về JWT token
5. Frontend lưu token và thông tin user

### Code chính:
```typescript
import { getAccessToken } from 'zmp-sdk';

const handleZaloLogin = async () => {
  try {
    // Lấy access token tự động từ Zalo
    const zaloAccessToken = await getAccessToken();
    
    // Gọi API backend
    const user = await authService.loginWithZalo(zaloAccessToken);
    onLoginSuccess(user);
  } catch (error) {
    onLoginError('Đăng nhập thất bại');
  }
};
```

## 📱 Tính năng

### ✅ Đã hoàn thành:
- **Tự động lấy token** từ Zalo qua `zmp-sdk`
- **API integration** với backend thực tế
- **JWT token management** (access + refresh)
- **User data persistence** trong localStorage
- **Error handling** với Toast notifications
- **Loading states** cho UX tốt hơn
- **Fallback manual input** cho testing

### 🔄 Login method:
- **Auto login**: Sử dụng `getAccessToken()` từ zmp-sdk



## ⚠️ Lưu ý quan trọng

### 1. App ID phải khớp:
- `src/config/api.ts` → `APP_ID`
- Zalo Developer Console → App ID
- Backend configuration

### 2. Backend API:
- Endpoint: `https://zshop-api.crbgroup.live/auth/user-login`
- Method: `POST`
- Body: `{ appId, accessToken, shopId }`

### 3. Zalo permissions:
- App phải có quyền truy cập thông tin user cơ bản
- Redirect URI phải được cấu hình đúng

## 🐛 Troubleshooting

### Lỗi "Không thể lấy access token":
- Kiểm tra Zalo app configuration
- Verify App ID và Redirect URI
- Check Zalo app permissions

### Lỗi API:
- Verify backend endpoint URL
- Check App ID và Shop ID
- Kiểm tra network connection

### Lỗi authentication:
- Clear localStorage và thử lại
- Check token expiration
- Verify backend JWT secret

## 📋 Checklist hoàn thành

- [ ] Cập nhật `APP_ID` thực tế trong `src/config/api.ts`
- [ ] Cập nhật `SHOP_ID` thực tế trong `src/config/api.ts`
- [ ] Cấu hình Zalo app với App ID đúng
- [ ] Test đăng nhập tự động với `getAccessToken()`
- [ ] Test API backend integration
- [ ] Verify JWT token storage và refresh

## 🎉 Kết quả

Sau khi hoàn thành, hệ thống sẽ:
- ✅ Tự động lấy Zalo access token
- ✅ Gửi token lên backend API
- ✅ Nhận JWT token và user data
- ✅ Lưu trữ thông tin đăng nhập
- ✅ Hiển thị thông tin user thực tế
- ✅ Quản lý session và logout

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra console logs
2. Verify Zalo app configuration
3. Test API endpoints riêng biệt
4. Check network requests trong DevTools
