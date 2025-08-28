# Hướng dẫn tích hợp Authentication API

## Tổng quan
Dự án đã được tích hợp với API authentication backend tại `https://zshop-api.crbgroup.live/`. Hệ thống sử dụng `zmp-sdk` để lấy Zalo access token tự động và xác thực người dùng.

## Cấu trúc files

### 1. Service Layer (`src/services/auth.ts`)
- `AuthService`: Class chính xử lý authentication
- Quản lý token (access & refresh)
- Lưu trữ thông tin user trong localStorage
- Xử lý login/logout

### 2. Configuration (`src/config/api.ts`)
- Cấu hình API endpoints
- App ID và Shop ID
- Các thông số authentication

### 3. Component (`src/components/ZaloLogin.tsx`)
- UI component cho đăng nhập
- Hỗ trợ demo login và manual token input
- Modal đăng nhập

### 4. Profile Page (`src/pages/profile.tsx`)
- Tích hợp authentication service
- Hiển thị thông tin user
- Quản lý trạng thái đăng nhập

## Cài đặt

### 1. Cập nhật Configuration
Chỉnh sửa file `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://zshop-api.crbgroup.live',
  ENDPOINTS: {
    USER_LOGIN: '/auth/user-login',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  // Cập nhật với thông tin thực tế
  APP_ID: 'your-actual-app-id',
  SHOP_ID: 'your-actual-shop-id',
  JWT_SECRET: 'your-jwt-secret', // Chỉ dùng ở backend
};
```

### 2. Tích hợp với zmp-sdk
Hệ thống đã sử dụng `zmp-sdk` để lấy Zalo access token tự động:

```typescript
// Trong ZaloLogin component
import { getAccessToken } from 'zmp-sdk';

const handleZaloLogin = async () => {
  try {
    const zaloToken = await getAccessToken();
    const user = await authService.loginWithZalo(zaloToken);
    onLoginSuccess(user);
  } catch (error) {
    onLoginError('Đăng nhập Zalo thất bại');
  }
};
```

## API Endpoints

### POST `/auth/user-login`
**Request Body:**
```json
{
  "appId": "string",
  "accessToken": "string", // Zalo access token
  "shopId": "string"
}
```

**Response:**
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "id": "string",
    "zaloId": "string",
    "fullName": "string",
    "avatar": "string",
    "role": "string",
    "isFollower": "boolean",
    "isSensitive": "boolean",
    "shopId": "string"
  }
}
```

### POST `/auth/refresh-token`
**Request Body:**
```json
{
  "refreshToken": "string"
}
```

## Tính năng

### 1. Authentication Flow
- User click "Đăng nhập với Zalo"
- Hệ thống gọi API với Zalo token
- Backend xác thực và trả về JWT token
- Frontend lưu token và thông tin user

### 2. Token Management
- Access token: 7 ngày
- Refresh token: 30 ngày
- Tự động refresh khi cần

### 3. User Data
- Thông tin từ Zalo (tên, avatar, follow status)
- Thống kê đơn hàng, yêu thích, chi tiêu
- Lưu trữ local để offline access

### 4. Security
- JWT token validation
- Secure token storage
- Automatic logout khi token hết hạn

## Demo Mode

Hệ thống có sẵn chế độ demo để test:
- Click "Demo Đăng nhập" để test flow
- Hoặc nhập Zalo token thủ công
- Dữ liệu mock được tạo tự động

## Troubleshooting

### 1. API Error
- Kiểm tra network connection
- Verify API endpoint URL
- Check App ID và Shop ID

### 2. Token Issues
- Clear localStorage và login lại
- Check token expiration
- Verify JWT secret

### 3. Zalo Integration
- Ensure Zalo app configuration
- Check OAuth permissions
- Verify redirect URIs

## Development Notes

- Sử dụng TypeScript interfaces cho type safety
- Error handling với Toast notifications
- Loading states cho UX tốt hơn
- Responsive design cho mobile
- Local storage fallback cho offline

## Next Steps

1. **Production Setup**
   - Update real App ID và Shop ID
   - Configure Zalo OAuth app
   - Set up proper error monitoring

2. **Enhanced Features**
   - Social login (Google, Facebook)
   - Two-factor authentication
   - Password reset functionality
   - User profile editing

3. **Security Enhancements**
   - HTTPS enforcement
   - Token encryption
   - Rate limiting
   - Audit logging
