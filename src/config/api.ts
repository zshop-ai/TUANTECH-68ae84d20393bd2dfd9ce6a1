export const API_CONFIG = {
  BASE_URL: "https://zshop-api.crbgroup.live",
  ENDPOINTS: {
    USER_LOGIN: "/auth/user-login",
    REFRESH_TOKEN: "/auth/refresh-token",
    PRODUCTS: "/shops/:shopId/products",
    PRODUCT_DETAIL: "/shops/:shopId/products/:id",
    PRODUCT_FEATURED: "/shops/:shopId/products/featured",
    PRODUCT_NEW: "/shops/:shopId/products/new",
    PRODUCT_BEST_SELLERS: "/shops/:shopId/products/best-sellers",
    PRODUCT_CATEGORY: "/shops/:shopId/products/category/:categoryId",
    PRODUCT_METADATA: "/shops/:shopId/products/metadata",
    CATEGORIES: "/shops/:shopId/categories",
    CATEGORY_DETAIL: "/shops/:shopId/categories/:id",
    CART_BASE: "/cart",
    CART_ITEMS: "/cart/items",
    CART_ITEM: "/cart/items/:productId",
    CART_CLEAR: "/cart/clear",
    CART_CHECKOUT: "/cart/checkout",
    LOCATION_AUTOCOMPLETE: "/location/autocomplete",
    ADDRESS: "/address",
    ADDRESS_SET_DEFAULT: "/address/:addressId/set-default",
    // Orders
    CUSTOMER_ORDERS: "/customer/orders",
    CUSTOMER_ORDER_DETAIL: "/customer/orders/:id",
    CUSTOMER_MY_ORDERS: "/customer/orders/me",
  },
  // CẬP NHẬT VỚI THÔNG TIN THỰC TẾ CỦA BẠN
  APP_ID: import.meta.env.VITE_APP_ID || "4447770839699639655", // Lấy từ env, fallback về default
  SHOP_ID: import.meta.env.VITE_SHOP_ID || "68ad2eaae02ddc5108d2fd1a", // Lấy từ env, fallback về default
};

export const ZALO_CONFIG = {
  GRAPH_API_URL: "https://graph.zalo.me/v2.0/me",
  FIELDS: "id,name,picture,is_follower,is_sensitive,user_id_by_oa,oa_id",
};

export const AUTH_CONFIG = {
  TOKEN_EXPIRY: {
    ACCESS: "7d",
    REFRESH: "30d",
  },
  STORAGE_KEYS: {
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
    USER: "user",
  },
};
