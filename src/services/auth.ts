interface ZaloUserInfo {
  id: string;
  name: string;
  picture?: {
    data?: {
      url: string;
    };
  };
  is_follower?: boolean;
  is_sensitive?: boolean;
  user_id_by_oa?: string;
  oa_id?: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    zaloId: string;
    fullName: string;
    avatar?: string;
    role: string;
    isFollower: boolean;
    isSensitive: boolean;
    shopId: string;
  };
}

interface User {
  id: string;
  zaloId: string;
  fullName: string;
  avatar?: string;
  role: string;
  isFollower: boolean;
  isSensitive: boolean;
  shopId: string;
  email?: string;
  joinDate?: string;
  stats?: {
    orders: number;
    favorites: number;
    spent: string;
  };
}

import { API_CONFIG, ZALO_CONFIG, AUTH_CONFIG } from '../config/api';

class AuthService {
  private readonly API_BASE_URL = API_CONFIG.BASE_URL;
  private readonly APP_ID = API_CONFIG.APP_ID;
  private readonly SHOP_ID = API_CONFIG.SHOP_ID;

  // Lưu trữ token trong localStorage
  private setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  private getAccessToken(): string | null {
    return localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
  }

  // Lưu thông tin user
  private setUser(user: User) {
    localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.USER, JSON.stringify(user));
  }

  private getUser(): User | null {
    const userStr = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Xóa thông tin đăng nhập
  private clearAuth() {
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.USER);
  }

  // Kiểm tra trạng thái đăng nhập
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  // Lấy thông tin user hiện tại
  getCurrentUser(): User | null {
    return this.getUser();
  }

    // Đăng nhập với Zalo token
  async loginWithZalo(zaloAccessToken: string): Promise<User> {
    try {
      const response = await fetch(`${this.API_BASE_URL}${API_CONFIG.ENDPOINTS.USER_LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appId: this.APP_ID,
          accessToken: zaloAccessToken,
          shopId: this.SHOP_ID,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng nhập thất bại');
      }

      const data: LoginResponse = await response.json();
      
      // Lưu token và thông tin user
      this.setTokens(data.accessToken, data.refreshToken);
      
      // Chuyển đổi response thành User object
      const user: User = {
        ...data.user,
        email: `${data.user.fullName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        joinDate: `Thành viên từ tháng ${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
        stats: {
          orders: 0,
          favorites: 0,
          spent: '0đ'
        }
      };
      
      this.setUser(user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Đăng xuất
  logout(): void {
    this.clearAuth();
  }

  // Refresh token
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        return false;
      }

      const response = await fetch(`${this.API_BASE_URL}${API_CONFIG.ENDPOINTS.REFRESH_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken,
        }),
      });

      if (!response.ok) {
        this.clearAuth();
        return false;
      }

      const data = await response.json();
      this.setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch (error) {
      console.error('Refresh token error:', error);
      this.clearAuth();
      return false;
    }
  }

  // Lấy header authorization cho các API call khác
  getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();
export type { User, ZaloUserInfo, LoginResponse };
