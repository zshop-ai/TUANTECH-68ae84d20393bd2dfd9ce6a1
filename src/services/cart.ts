import { API_CONFIG } from "../config/api";
import { apiDelete, apiGet, apiPost } from "../utils/api";
import { authService } from "./auth";

const GUEST_USER_ID = "68b00ed59cf44607992bf4c7";

function getEffectiveUserId(): string {
  const user = authService.getCurrentUser?.();
  return user?.id || GUEST_USER_ID;
}

function withUserId(url: string): string {
  const userId = getEffectiveUserId();
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}userId=${encodeURIComponent(userId)}`;
}

export type CartItemAttributes = Record<string, any>;

export interface AddToCartPayload {
  productId: string;
  quantity: number;
  attributes?: CartItemAttributes;
}

export interface UpdateQuantityPayload {
  productId: string;
  quantity: number;
}

export interface CheckoutPayload {
  customerName: string;
  customerPhone: string;
  address?: string;
  notes?: string;
}

export const cartService = {
  async getCart() {
    const url = withUserId(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART_BASE}`
    );
    return apiGet(url);
  },

  async addItem(payload: AddToCartPayload) {
    const url = withUserId(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART_ITEMS}`
    );
    return apiPost(url, payload);
  },

  async updateQuantity(payload: UpdateQuantityPayload) {
    const base = `${
      API_CONFIG.BASE_URL
    }${API_CONFIG.ENDPOINTS.CART_ITEM.replace(
      ":productId",
      payload.productId
    )}`;
    const url = withUserId(base);
    return apiPost(url, { quantity: payload.quantity, _method: "PATCH" });
  },

  async removeItem(productId: string) {
    const base = `${
      API_CONFIG.BASE_URL
    }${API_CONFIG.ENDPOINTS.CART_ITEM.replace(":productId", productId)}`;
    const url = withUserId(base);
    return apiDelete(url);
  },

  async clear() {
    const url = withUserId(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART_CLEAR}`
    );
    return apiDelete(url);
  },

  async checkout(payload: CheckoutPayload) {
    const url = withUserId(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART_CHECKOUT}`
    );
    return apiPost(url, payload);
  },
};
