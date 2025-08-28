export const API_CONFIG = {
  BASE_URL: 'https://zshop-api.crbgroup.live',
  ENDPOINTS: {
    USER_LOGIN: '/auth/user-login',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  // CẬP NHẬT VỚI THÔNG TIN THỰC TẾ CỦA BẠN
  APP_ID: '4447770839699639655', // App ID thực từ Zalo Developer
  SHOP_ID: '68ad2de1e02ddc5108d2fd0b', // Shop ID thực từ backend
};

export const ZALO_CONFIG = {
  GRAPH_API_URL: 'https://graph.zalo.me/v2.0/me',
  FIELDS: 'id,name,picture,is_follower,is_sensitive,user_id_by_oa,oa_id',
};

export const AUTH_CONFIG = {
  TOKEN_EXPIRY: {
    ACCESS: '7d',
    REFRESH: '30d',
  },
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER: 'user',
  },
};
